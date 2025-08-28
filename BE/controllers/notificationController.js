const svc = require('../services/notificationService');

exports.broadcast = async (req, res, next) => {
  try {
    const notif = await svc.createAndFanout({ ...req.body, createdBy: req.user._id }, req.app.get('io'));
    res.status(201).json({ ok: true, id: notif._id });
  } catch (e) { next(e); }
};

exports.listForMe = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const data = await svc.listForUser(req.user._id, { page: Number(page), limit: Number(limit) });
    res.json({ ok: true, data });
  } catch (e) { next(e); }
};

exports.unreadCount = async (req, res, next) => {
  try {
    const count = await svc.unreadCount(req.user._id);
    res.json({ ok: true, count });
  } catch (e) { next(e); }
};

exports.markRead = async (req, res, next) => {
  try {
    const ok = await svc.markRead(req.user._id, req.params.deliveryId);
    res.json({ ok });
  } catch (e) { next(e); }
};

exports.markAllRead = async (req, res, next) => {
  try {
    const ok = await svc.markAllRead(req.user._id);
    res.json({ ok });
  } catch (e) { next(e); }
};
