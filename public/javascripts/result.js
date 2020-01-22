setTimeout(setup, 50);

var images = [];

$(window).resize(function()
{
    $('#profilePicture').css({'height':$('#profilePicture').width()+'px'});
})

function setup()
{
    $('#profilePicture').css({'height':$('#profilePicture').width()+'px'});

    getImages(twitterid);
}

//Show further information
function big5Click(event, array)
{
    splitPercentile = percentile.split(",");
    for(var i = 0; i < splitPercentile.length; i++)
    {
        splitPercentile[i] = Math.round(splitPercentile[i]*100)/100;
    }
    if(typeof splitPercentile[array[0]._index !== 'undefined'])
    {
        console.log(splitPercentile[array[0]._index]);
    }
}

function getImages()
{
    $.ajax
    ({
        url: '/result',
        type: 'GET',
        contentType: "application/json",
        data: {"getImages": twitterid},
        success(data)
        {
            images = data;
            $('#profilePicture').attr('src', images[0]);
        }
    });
}