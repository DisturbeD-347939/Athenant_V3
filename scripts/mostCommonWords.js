var mostCommonWords = require('./mostCommonWords.js.js');
var common = require('common-words');
var mostCommon = require('most-common');

module.exports = 
{
    getMostCommonWords: function (id, callback)
    {
        var profileData = require('../users/' + req.query.watsonID + '/profile.json');
        var content = "";
        for(var i = 0; i < profileData['contentItems'].length; i++)
        {
            content += profileData['contentItems'][i]["content"] + " ";
            if((i+1) >= profileData['contentItems'].length)
            {
                console.log(content);
                console.log("-------------------------------------------------------");
                content = content.split(" ");
                console.log(content);
                console.log("-------------------------------------------------------");
                console.log(content.length);
                for(var k = 0; k < content.length; k++)
                {
                    content[k] = content[k].replace(/\\/, "");
                    if((k+1) >= content.length)
                    {
                        console.log(content);
                        console.log("-------------------------------------------------------");
                        content = removeCommonWords(content, common);
                        console.log(content);
                        console.log("-------------------------------------------------------");
                        content = mostCommon(content, 15);
                        console.log(content[0].token);
                    }
                }
            }
        }
    }
}

function removeCommonWords(words, common) 
{
    common.forEach(function(obj) 
    {
        var word = obj.word;
        while (words.indexOf(word) !== -1) 
        {
            words.splice(words.indexOf(word), 1);
        }
    });
    return words;
};