var express = require('express');
const { config } = require('../config');
var router = express.Router();
console.log(config.aemUrl);
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'Presentation',
    aemUrl: config.aemUrl,
    api: config.api
  });
});

module.exports = router;
