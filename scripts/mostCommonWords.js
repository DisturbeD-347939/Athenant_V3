var common = require('common-words');
var mostCommon = require('most-common');
sw = require('stopword')

var moreCommon = ['i\'m', 'and', 'don\'t', 'is', 'you', '-', 'i\'ve', 'i', 'it\'s', 'can\'t', 'that\'s', '\'cause', 'you\'re', 'i\'ll'];
module.exports = 
{
    getMostCommonWords: function (id, callback)
    {
        var profileData = require('../users/' + id + '/profile.json');
        var content = "";
        for(var i = 0; i < profileData['contentItems'].length; i++)
        {
            content += profileData['contentItems'][i]["content"] + " ";
            if((i+1) >= profileData['contentItems'].length)
            {
                content = content.split(" ");
                content = sw.removeStopwords(content);
                for(var k = 0; k < content.length; k++)
                {
                    content[k] = content[k].toLowerCase();
                    for(var j = 0; j < content[k].length; j++)
                    {
                        if(content[k][j] == '\’')
                        {
                            content[k] = content[k].replace("\’", "'");
                        }
                    }
                    for(var j = 0; j < moreCommon.length; j++)
                    {
                        if(content[k] == moreCommon[j] || content[k][0] == "@")
                        {
                            content.splice(k, 1);
                        }
                    }
                    if((k+1) >= content.length)
                    {
                        content = removeCommonWords(content, common);
                        content = mostCommon(content, 50);
                        callback(content);
                    }
                
                }
            }
        }
    },
    get: function (array, count, callback)
    {
        callback(mostCommon(array, count));
    }
}

function removeCommonWords(words) 
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