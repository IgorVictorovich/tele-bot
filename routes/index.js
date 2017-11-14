var express = require('express');
var router = express.Router();
require('../public/javascripts/bot');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
  bot.startPolling();
});

module.exports = router;
