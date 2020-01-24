var express = require('express');
var router = express.Router();

var twitter = require('../scripts/twitter');

/* GET home page. */
router.get('/', function(req, res, next)
{
  console.log(req.connection.remoteAddress + " has connected");
  res.render('index', { title: 'Athenant' , error: 0});
});

/*router.post('/result', function(req, res, next)
{
    console.log(res.body);
    twitter.getData(req.body, function(percentile, times)
    {
        res.render('results', {percentile: percentile, times: times});
    });
});*/

module.exports = router;