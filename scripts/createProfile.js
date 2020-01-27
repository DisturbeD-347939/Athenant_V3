var PersonalityInsightsV3 = require('watson-developer-cloud/personality-insights/v3');
var Twitter = require('twitter');
var fs = require('fs');
var request = require('request');
var IR = require('../scripts/imageRecognition');
var commonWords = require('../scripts/mostCommonWords');
var main = require('../scripts/main');
var path = require('path');
var zipper = require('zip-local');

//Variables
var text = "";
var ID = "default";
var info = {};
var imagesDownloaded = 0;

//Keys for authentication
var Credentials = fs.readFileSync('./Keys.json', 'utf-8');
var ParsedCredentials = JSON.parse(Credentials);

//Authentication into Twitter
var client = new Twitter
({
    consumer_key: ParsedCredentials.twitter[0].consumer_key,
    consumer_secret: ParsedCredentials.twitter[0].consumer_secret,
    access_token_key: ParsedCredentials.twitter[0].access_token_key,
    access_token_secret: ParsedCredentials.twitter[0].access_token_secret
});

//Authentication into the Personality Insight API
var personalityInsights = new PersonalityInsightsV3
({
    version: ParsedCredentials.ibm[1].version,
    iam_apikey: ParsedCredentials.ibm[1].iam_apikey,
    url: ParsedCredentials.ibm[1].url,
});

module.exports = 
{
    //Add new user
    add: function(input, callback)
    {
        //USERNAME
        ID = input;

        //If there isn't a folder for this user yet then create one
        if (!fs.existsSync('./users/' + ID))
        {
            fs.mkdirSync('./users/' + ID);
        }

        //Empty the /images folder in the user or create one
        if (!fs.existsSync('./users/' + ID + '/images'))
        {
            fs.mkdirSync('./users/' + ID + '/images');
        }
        else
        {
            fs.readdir('./users/' + ID + '/images', (err, files) => 
            {
                if (err) throw err;
            
                for (const file of files) 
                {
                    fs.unlink(path.join('./users/' + ID + '/images', file), err => 
                    {
                        if (err) throw err;
                    });
                }
            });
        }

        console.log("Getting images from " + ID);
        getImages(function()
        {
            console.log("Getting info from " + ID);
            getInfo(function(data)
            {
                info = data;
                console.log("Getting tweets from " + ID);
                getTweets(function()
                {
                    console.log("Getting common words from " + ID);
                    getCommonWords(ID);
                    console.log("Getting big5 words from " + ID);
                    getBig5(function(data)
                    {
                        if(data)
                        {
                            //SAVE API CALLS
                            setTimeout(function()
                            {
                                console.log("Zipping images");
                                zipper.sync.zip("./users/" + ID + "/images/").compress().save("./users/" + ID + "/images.zip");
                                setTimeout(function()
                                {
                                    console.log("Analyzing images from " + ID);
                                    analyzeImages(function()
                                    {
                                        console.log("Parsing images");
                                        parseImageTags();
                                    });
                                }, 1000)
                            },2000);
                            fs.writeFileSync('./users/' + ID + '/info.json', JSON.stringify(info));
                            callback(1);
                        }
                        else
                        {
                            callback(0);
                        }
                    })
                })
            });
        });   
    }
}

//Get tags from images
function parseImageTags()
{
    info.imageTags = info.imageTags.split(",");
    commonWords.get(info.imageTags, 50, function(data)
    {
        info.imageTags = data;
        fs.writeFileSync('./users/' + ID + '/tags.json', JSON.stringify(info.imageTags));
    });
}

//Create tags for the images
function analyzeImages(callback)
{
    info.imageTags = "";
    if(fs.existsSync('./users/' + ID + '/images.zip'))
    {
        IR.classify('./users/' + ID + '/images.zip', function(imageInfo)
        {
            IR.getTags(imageInfo, function(response)
            {
                for(var i = 0; i < response.length; i++)
                {
                    info.imageTags += response[i] + ",";
                    if(i+1 >= response.length)
                    {
                        console.log(info.imageTags);
                        callback();
                    }
                }
            })
        })
    }
}

//Get the most common words in the text
function getCommonWords(ID)
{
    commonWords.getMostCommonWords(ID, function(data)
    {
        info.commonWords = data;
    });
}

//Get all the basic info
function getInfo(callback)
{
    client.get('users/show', {screen_name: ID}, function(error, response)
    {
        var info = {};

        info.name = response["name"];
        info.location = response["location"];
        info.following = main.formatNumber(response["friends_count"]);
        info.followers = main.formatNumber(response["followers_count"]);
        info.likes = main.formatNumber(response["favourites_count"]);
        info.posts = main.formatNumber(response["statuses_count"]);

        callback(info);
    });
}

//Get all the profile/banner images
function getImages(callback)
{
    var downloadStatus = [0,0,0,0];

    client.get('users/show', {screen_name: ID}, function(error, response)
    {
        var banner = "";
        if(response["profile_banner_url"] != undefined)
        {
            banner = response["profile_banner_url"];
        }
        var smallSize = response["profile_image_url"];
        var originalSize = smallSize.slice(0,smallSize.length-11) + ".jpg";
        var biggerSize = smallSize.slice(0,smallSize.length-11) + "_bigger.jpg";
        var miniSize = smallSize.slice(0,smallSize.length-11) + "_mini.jpg";

        download(originalSize, './users/' + ID + '/originalProfilePic.jpg', function()
        {
            downloadStatus[0] = 1;
        })
        download(smallSize, './users/' + ID + '/smallProfilePic.jpg', function()
        {
            downloadStatus[1] = 1;
        })
        download(biggerSize, './users/' + ID + '/biggerProfilePic.jpg', function()
        {
            downloadStatus[2] = 1;
        })
        download(miniSize, './users/' + ID + '/miniProfilePic.jpg', function()
        {
            downloadStatus[3] = 1;
        })
        if(banner != "")
        {
            download(banner, './users/' + ID + '/bannerPic.jpg', function(){})
        }
        else
        {
            fs.createReadStream('./images/bannerPic.jpg').pipe(fs.createWriteStream('./users/' + ID + '/bannerPic.jpg'));
        }
        

        setTimeout(function()
        {
            if(downloadStatus[0] == 1 && downloadStatus[1] == 1 && downloadStatus[2] == 1 && downloadStatus[3] == 1)
            {
                callback();
            }
            else
            {
                callback();
            }
        },1000)
    });
}

function getTweets(callback)
{
    var id = 0;
    var allTweets = [];
    var outputText = "";

    //Getting the last 1000 tweets from an user
    client.get('statuses/user_timeline', {screen_name: ID, count: '1000', include_rts: 'false'}, function(error, response)
    {   
        //Make them json
        var data = JSON.stringify(response, null, 2);
        //Clean them
        var profileText = JSON.parse(data);
        allTweets.push(profileText);
        id = profileText[profileText.length-1].id;
        client.get('statuses/user_timeline', {screen_name: ID, count: '200', include_rts: 'false', max_id: id}, function(error, response)
        {   
            var data = JSON.stringify(response, null, 2);
            var profileText = JSON.parse(data);
            id = profileText[profileText.length-1].id;
            allTweets.push(profileText);

            client.get('statuses/user_timeline', {screen_name: ID, count: '200', include_rts: 'false', max_id: id}, function(error, response)
            {   
                var data = JSON.stringify(response, null, 2);
                var profileText = JSON.parse(data);
                allTweets.push(profileText);
                id = profileText[profileText.length-1].id;

                client.get('statuses/user_timeline', {screen_name: ID, count: '200', include_rts: 'false', max_id: id}, function(error, response)
                {   
                    var data = JSON.stringify(response, null, 2);
                    var profileText = JSON.parse(data);
                    allTweets.push(profileText);
                    id = profileText[profileText.length-1].id;

                    client.get('statuses/user_timeline', {screen_name: ID, count: '200', include_rts: 'false', max_id: id}, function(error, response)
                    {   
                        var data = JSON.stringify(response, null, 2);
                        var profileText = JSON.parse(data);
                        allTweets.push(profileText);
                        id = profileText[profileText.length-1].id;

                        profileText = allTweets;

                        outputText += "{ \"contentItems\" : [\n\n";

                        var times = [];
                        var temp = [];
                        var birthday = [];

                        console.log("Getting coordinates/images from " + ID);

                        for(var j = 0; j < profileText.length; j++)
                        {
                            for(var i = 0; i < profileText[j].length;   i++)
                            {
                                //GET BIRTHDAY
                                if(profileText[j][i]["text"].includes("happy birthday") || profileText[j][i]["text"].includes("hb!") || profileText[j][i]["text"].includes("hb") || profileText[j][i]["text"].includes("happy birthday!") || profileText[j][i]["text"].includes("happy bday") || profileText[j][i]["text"].includes("happy bday!"))
                                {
                                    if(profileText[j][i]["text"].includes('@' + ID))
                                    {
                                        birthday.push(profileText[j][i]["created_at"]);   
                                    }
                                }

                                //GET TIMES
                                times.push(profileText[j][i].created_at.split(" "));
                            
                                text =  profileText[j][i].text;
                                text = text.replace(/(\r\n|\n|\r)/gm," ");
                                text = text.replace(/"/g, '');

                                var parsedUnixTime = new Date(profileText[j][i].created_at).getUnixTime();
                                outputText += "{\n\t\"content\":\"" + text + "\",\n\t\"contenttype\": \"text/plain\",\n\t\"created\":" + parsedUnixTime + ",\n\t\"id\":\"" + profileText[j][i].id + "\",\n\t\"language\":\"en\"\n}";

                                if((i+1) != profileText[j].length)
                                {
                                    outputText += ",\n";
                                }
                            
                                //GET LOCATIONS 
                                if(profileText[j][i].place != null)
                                {
                                    if(profileText[j][i].place.bounding_box.coordinates.length != 0)
                                    {
                                        var long = 0;
                                        var lat = 0;
                                        for(var k = 0; k < profileText[j][i].place.bounding_box.coordinates[0].length; k++)
                                        {
                                            long += profileText[j][i].place.bounding_box.coordinates[0][k][0];
                                            lat += profileText[j][i].place.bounding_box.coordinates[0][k][1];
                                        
                                            if((k+1) >= profileText[j][i].place.bounding_box.coordinates[0].length)
                                            {
                                                temp.push(lat/profileText[j][i].place.bounding_box.coordinates[0].length + "," + long/profileText[j][i].place.bounding_box.coordinates[0].length);
                                            }
                                        }
                                    }
                                }

                                //GET POST IMAGES
                                if(profileText[j][i].entities.media && profileText[j][i].entities.media.length)
                                {
                                    if(imagesDownloaded < 20)
                                    {
                                        download(profileText[j][i].entities.media[0].media_url, './users/' + ID + '/images/' + i + '.jpg', function(){});
                                        imagesDownloaded++;
                                    }
                                }
                            
                                if((i+1) >= profileText[j].length && (j+1) >= profileText.length)
                                {
                                    info.coordinates = temp;
                                }
                            }
                            if((j+1) != profileText.length)
                            {
                                outputText += ",\n";
                            }
                        }
                        //Wait one second for the information to be processed and then write to files
                        setTimeout(function()
                        {
                            if(birthday.length)
                            {
                                info.birthday = birthday;
                            }
                            fs.writeFileSync('./users/' + ID + '/times.json', JSON.stringify(times));
                            outputText += "]}";
                            fs.writeFileSync('./users/' + ID + '/profile.json', outputText);
                            if(fs.existsSync('./users/' + ID + '/times.json') && fs.existsSync('./users/' + ID + '/profile.json'))
                            {
                                callback(1);
                            }
                            else
                            {
                                callback(0);
                            }
                        },1000)
                    });
                });
            });
        });
    })
}

//Get big 5 using Watson AI
function getBig5(callback)
{
    //Prepare a request for the watson ai
    var profileParams = {

        // Get the content from the JSON file.
        content: require('../users/' + ID + '/profile.json'),
        content_type: 'application/json',
        consumption_preferences: 'true'
    };

    //Gets the information from the Personality Insight tool belonging to the Watson AI
    personalityInsights.profile(profileParams, function(error, profile) 
    {
        if (error)
        {
            console.log("FAILED! Error code - " + error);
            if(fs.existsSync('./users/' + ID + '/watsonOutputRaw.json'))
            {
                callback(1);
            }
            else
            {
                callback(0);
            }
        } 
        else //If everything works out well we take the big 5 traits and adjust them from 0-1 to 1-20
        { 
            fs.writeFileSync('./users/' + ID + '/watsonOutputRaw.json', JSON.stringify(profile, null, 2));
            callback(1);
        }
    });
}

//Download documents/images of the internet
function download(uri, filename, callback)
{
    request.head(uri, function(err, res, body)
    {
        request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
};

//Getting dates
Date.prototype.getUnixTime = function() {return this.getTime()/1000|0};
if(!Date.now) Date.now = function() { return new Date(); }
Date.time = function() { return Date.now().getUnixTime(); }