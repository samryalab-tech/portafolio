const { getIo } = require('../utils/socket');

const receiveMessage = (req, res) => {
  const { whatsapp_id, mensaje } = req.body;

  console.log('Mensaje recibido de:', whatsapp_id, 'Texto:', mensaje);

  const io = getIo();
  io.emit('new_message', { whatsapp_id, mensaje });

  res.sendStatus(200);
};

module.exports = { receiveMessage };
