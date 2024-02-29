const {User} = require('../models')
const path = require('path')

const rootController = {
  download: (req, res) => {
    const { url } = req.params;
    if (url) {
      res.download(path.join(__dirname, "..", "storage", `${url}`));
    } else {
      res.status(404).send({ success: false });
    }
  },
}

module.exports = rootController