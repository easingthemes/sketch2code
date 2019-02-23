var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Presentation' });
});

router.get('/camera', function(req, res, next) {
  res.render('camera', { title: 'Camera' });
});

router.get('/stream', function(req, res, next) {
  res.render('stream', { title: 'Stream' });
});

module.exports = router;
