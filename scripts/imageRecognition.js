//File management
const fs = require('fs');

//IBM Visual Recognition module
const VisualRecognitionV3 = require('watson-developer-cloud/visual-recognition/v3');

//Keys for authentication
var Credentials = fs.readFileSync('./Keys.json', 'utf-8');
var ParsedCredentials = JSON.parse(Credentials);
//Authentication into the Personality Insight API
var visualRecognition = new VisualRecognitionV3
({
    version: ParsedCredentials.ibm[3].version,
    iam_apikey: ParsedCredentials.ibm[3].iam_apikey,
    url: ParsedCredentials.ibm[3].url,
});

module.exports =
{
    classify: function(path, callback)
    {
        {
            var params = 
            {
                image_file: fs.createReadStream(path)
            }
    
            visualRecognition.classify(params, function(err, res)
            {
                if(err)
                {
                    console.log(err);
                    callback("err");
                }
                else 
                {
                    var data = JSON.stringify(res, null, 2);
                    data = JSON.parse(data);
                    callback(data);
                }
            });
        });
    },
    getTags: function(data, callback)
    {
        var tags = [];
        var finalTags = [];
        for(var i = 0; i < 3; i++)
        {
            tags.push("#" + data.images[0].classifiers[0].classes[i].class);
        }
        for(var i = 0; i < tags.length; i++)
        {
            tags[i] = tags[i].split(/(?:,| )+/); 
            for(var j = 0; j < tags[i].length; j++)
            {
                if(tags[i][j].charAt(0) == "#")
                {
                    finalTags.push(tags[i][j]);
                }
            }
            
        }
        console.log(finalTags);
        callback(finalTags);
    }
}