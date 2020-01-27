var express = require('express');
var router = express.Router();
var twitter = require('../scripts/twitter');
var main = require('../scripts/main');
var fs = require ('fs');

//Get search request
router.post('/', function(req, res, next)
{
    //Remove the @ if it exists
    if(res.req.body.twitterid[0] == "@")
    {
        res.req.body.twitterid = res.req.body.twitterid.substring(1, res.req.body.twitterid.length);
    }
    console.log("Requesting for " + res.req.body.twitterid);
    //Run the program
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
            console.log("Returning results from " + res.req.body.twitterid);
            res.render('result', 
            {
                percentile: percentile, 
                times: times,
                twitterid: res.req.body.twitterid
            });
        }
    });

});

//Get requests for images, info and tags
router.get('/', function(req,res,next)
{
    //Requesting images
    if(req.query.getImages)
    {
        var id = req.query.getImages;
        var images = [];

        //parse the images into base64
        images.push(main.base64('./users/' + id + '/originalProfilePic.jpg'));
        images.push(main.base64('./users/' + id + '/miniProfilePic.jpg'));
        images.push(main.base64('./users/' + id + '/smallProfilePic.jpg'));
        images.push(main.base64('./users/' + id + '/biggerProfilePic.jpg'));
        images.push(main.base64('./users/' + id + '/bannerPic.jpg'));
            
        if(images.length == 5)
        {
            //send them
            res.send(images);
        }
    }

    //Requesting info
    if(req.query.getInfo)
    {
        //Send info as json
        var id = req.query.getInfo;
        res.send(JSON.parse(fs.readFileSync('./users/' + id + '/info.json')));
    }

    //Request image tags
    if(req.query.imageTags)
    {
        var id = req.query.imageTags;
        if(fs.existsSync('./users/' + id + '/tags.json'))
        {
            //Send tags
            res.send(JSON.parse(fs.readFileSync('./users/' + id + '/tags.json')));
        }
        else
        {
            res.send("0");
        }
    }
})

module.exports = router;