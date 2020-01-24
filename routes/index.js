var express = require('express');
var router = express.Router();

var twitter = require('../scripts/twitter');

/* GET home page. */
router.get('/', function(req, res, next)
{
  console.log(req.connection.remoteAddress + " has connected");
  res.render('index', { title: 'Athenant' , error: 0});
});

module.exports = router;