try {
  const app = require('../server/index.js');
  module.exports = app;
} catch (e) {
  module.exports = (req, res) => res.status(500).json({ error: e.message, stack: e.stack });
}
