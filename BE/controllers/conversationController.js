const svc = require('../services/conversationService');

exports.getMyConversations = async (req, res, next) => {
  try {
    const data = await svc.listMy(req.user._id);
    res.json(data);
  } catch (e) { next(e); }
};

exports.getConversation = async (req, res, next) => {
  try {
    const data = await svc.getDetailWithMessages(req.params.id, req.user._id);
    res.json(data);
  } catch (e) { next(e); }
};

exports.sendMessage = async (req, res, next) => {
  try {
    // nếu có gắn socket vào app: req.app.get('io')
    const msg = await svc.sendMessage(req.params.id, req.user._id, req.body, req.app.get('io'));
    res.status(201).json(msg);
  } catch (e) { next(e); }
};

exports.openByBooking = async (req, res, next) => {
  try {
    const conv = await svc.openByBooking(req.user._id, req.body);
    res.json(conv);
  } catch (e) { next(e); }
};
