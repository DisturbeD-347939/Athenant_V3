var express = require('express');
var router = express.Router();

var twitter = require('../scripts/twitter');
var main = require('../scripts/main');
var fs = require ('fs');

router.post('/', function(req, res, next)
{
    //var times = JSON.parse(fs.readFileSync('./users/' + res.req.body.twitterid + "/times.json"));
    twitter.getData(res.req.body.twitterid, function(percentile, times, error)
    {
        if(error)
        {
            res.render('index',
            {
                error: 1
            });
        }
        else
        {
            res.render('result', 
            {
                percentile: percentile, 
                times: times,
                twitterid: res.req.body.twitterid
            });
        }
    });

});

router.get('/', function(req,res,next)
{
    console.log("here");
    if(req.query.getImages)
    {
        var id = req.query.getImages;
        var images = [];

        images.push(main.base64('./users/' + id + '/originalProfilePic.jpg'));
        images.push(main.base64('./users/' + id + '/miniProfilePic.jpg'));
        images.push(main.base64('./users/' + id + '/smallProfilePic.jpg'));
        images.push(main.base64('./users/' + id + '/biggerProfilePic.jpg'));

        if(images.length == 4)
        {
            res.send(images);
        }
    }
})

module.exports = router;