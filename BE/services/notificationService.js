const Notification = require('../models/Notification');
const Delivery = require('../models/NotificationDelivery');
const User = require('../models/User');

async function createAndFanout(payload, io) {
  // payload: { scope, roles?, targetUserIds?, type, title, body, meta?, expiresAt?, createdBy? }
  const session = await Notification.startSession();
  session.startTransaction();
  try {
    const notif = await Notification.create([payload], { session }).then(r => r[0]);

    // xác định audience
    let users = [];
    if (payload.scope === 'all') {
      users = await User.find({}, { _id: 1 }).lean().session(session);
    } else if (payload.scope === 'role') {
      users = await User.find({ role: { $in: payload.roles || [] } }, { _id: 1 }).lean().session(session);
    } else if (payload.scope === 'user') {
      users = (payload.targetUserIds || []).map(_id => ({ _id }));
    }

    // fan-out delivery
    if (users.length) {
      const ops = users.map(u => ({
        updateOne: {
          filter: { notificationId: notif._id, userId: u._id },
          update: { $setOnInsert: { notificationId: notif._id, userId: u._id, status: 'unread' } },
          upsert: true
        }
      }));
      await Delivery.bulkWrite(ops, { session });
    }

    await session.commitTransaction();

    // realtime sau khi commit
    if (io) {
      if (payload.scope === 'user') {
        (payload.targetUserIds || []).forEach(uid => io.of('/notify').to(`user:${uid}`).emit('notify:new', { notificationId: notif._id }));
      } else if (payload.scope === 'role') {
        (payload.roles || []).forEach(role => io.of('/notify').to(`role:${role}`).emit('notify:new', { notificationId: notif._id }));
      } else {
        io.of('/notify').to('broadcast:all').emit('notify:new', { notificationId: notif._id });
      }
    }

    return notif;
  } catch (e) {
    await session.abortTransaction();
    throw e;
  } finally {
    session.endSession();
  }
}

async function listForUser(userId, { page = 1, limit = 20 } = {}) {
  const skip = (page - 1) * limit;
  const deliveries = await Delivery.find({ userId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('notificationId')
    .lean();

  return deliveries.map(d => ({
    deliveryId: d._id,
    status: d.status,
    readAt: d.readAt,
    createdAt: d.createdAt,
    notification: d.notificationId && {
      id: d.notificationId._id,
      type: d.notificationId.type,
      title: d.notificationId.title,
      body: d.notificationId.body,
      meta: d.notificationId.meta,
      expiresAt: d.notificationId.expiresAt,
      createdAt: d.notificationId.createdAt
    }
  }));
}

async function unreadCount(userId) {
  return Delivery.countDocuments({ userId, status: 'unread' });
}

async function markRead(userId, deliveryId) {
  const ok = await Delivery.findOneAndUpdate(
    { _id: deliveryId, userId },
    { $set: { status: 'read', readAt: new Date() } },
    { new: true }
  );
  return !!ok;
}

async function markAllRead(userId) {
  await Delivery.updateMany(
    { userId, status: 'unread' },
    { $set: { status: 'read', readAt: new Date() } }
  );
  return true;
}

module.exports = { createAndFanout, listForUser, unreadCount, markRead, markAllRead };
