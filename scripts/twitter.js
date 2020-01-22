var twitter = require("./createProfile");
var fs = require('fs');

module.exports =
{
    //Collects tweets and builds profile
    getData: function (id, callback)
    {
        getTwitter(id, function(data)
        {
            if(data)
            {
                var profile = JSON.parse(fs.readFileSync('./users/' + id + "/watsonOutputRaw.json"));
                var times = JSON.parse(fs.readFileSync('./users/' + id + "/times.json"));
                var percentile = [];
                for(var i = 0; i < 5; i++)
                {
                    percentile.push(profile.personality[i].percentile);
                }
                callback(percentile, times, 0);
            }
            else
            {
                callback(0, 0, 1);
            }
        })
    }
}

function getTwitter(id, callback)
{
    //If there's a valid id
    if(id)
    {
        twitter.add(id, function(status, err)
        {
            if(!status)
            {
                console.log(err);
                callback(0);
    
            }
            else
            {
                console.log("Got twitter info");
                callback(1);
            }
        });
    }
    else
    {
        console.log("Sorry, wrong ID");
        callback(0)
    }
}