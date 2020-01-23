setTimeout(setup, 50);

var images = [];

setTimeout(function()
{
    $('#profilePicture').css({'height':$('#profilePicture').width()+'px'});
    $('#bannerPicture').css({top: 0, left:0});
    $('#bannerPicture').width($('#profile').width() + 80);
    $('#bannerPicture').height($('#profilePicture').height()/2 + 60);
}, 1000);

$(window).resize(function()
{
    $('#profilePicture').css({'height':$('#profilePicture').width()+'px'});
    $('#bannerPicture').css({top: 0, left:0});
    $('#bannerPicture').width($('#profile').width() + 80);
    $('#bannerPicture').height($('#profilePicture').height()/2 + 60);
})

function setup()
{
    //Styling
    $('#profilePicture').css({'height':$('#profilePicture').width()+'px'});
    $('#bannerPicture').css({top: 0, left:0});
    $('#bannerPicture').width($('#profile').width() + 79);
    $('#bannerPicture').height($('#profilePicture').height()/2 + 60);
    $('#profile').css({position: 'sticky'});
    window.scrollTo(0, 0);

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

function getInfo()
{
    $.ajax
    ({
        url: '/result',
        type: 'GET',
        contentType: "application/json",
        data: {"getImages": twitterid},
        success(data)
        {
            console.log(data);
            images = data;
            $('#profilePicture').attr('src', images[0]);
            if(images[4])
            {
                $('#bannerPicture').attr('src', images[4]);
            }
        }
    });
    $.ajax
    ({
        url: '/result',
        type: 'GET',
        contentType: "application/json",
        data: {"getNames": twitterid},
        success(data)
        {
            console.log(data);
            images = data;
            $('#profilePicture').attr('src', images[0]);
            $('#bannerPicture').attr('src', images[4]);
        }
    });
} 