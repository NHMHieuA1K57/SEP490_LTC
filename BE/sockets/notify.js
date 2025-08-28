const jwt = require('jsonwebtoken');

function attachNotifyNamespace(io) {
  const nsp = io.of('/notify');

  nsp.use((socket, next) => {
    const token = socket.handshake.auth?.token || socket.handshake.query?.token;
    if (!token) return next(new Error('unauthorized'));
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = { id: payload.id, role: payload.role };
      next();
    } catch (e) { next(new Error('unauthorized')); }
  });

  nsp.on('connection', (socket) => {
    const { id, role } = socket.user;
    socket.join(`user:${id}`);
    socket.join(`role:${role}`);
    socket.join('broadcast:all');
    socket.emit('notify:hello', { ok: true });
  });
}

module.exports = { attachNotifyNamespace };
