setTimeout(setup, 50);

var images = [];

setInterval(function()
{
    $('#profilePicture').css({'height':$('#profilePicture').width()+'px'});
    $('#bannerPicture').css({top: 0, left:0});
    $('#bannerPicture').width($('#profile').width() + 80);
    $('#bannerPicture').height($('#profilePicture').height()/2 + 60);
}, 3000);

$(window).resize(function()
{
    $('#profilePicture').css({'height':$('#profilePicture').width()+'px'});
    $('#bannerPicture').css({top: 0, left:0});
    $('#bannerPicture').width($('#profile').width() + 80);
    $('#bannerPicture').height($('#profilePicture').height()/2 + 60);
})

$(document).ready(function() 
{
    $('#profilePicture').css({'height':$('#profilePicture').width()+'px'});
    $('#bannerPicture').css({top: 0, left:0});
    $('#bannerPicture').width($('#profile').width() + 79);
    $('#bannerPicture').height($('#profilePicture').height()/2 + 60);
    $('#times > div > img').height($('#times > div > button').width());
    $('#heatmapMap').height($('#heatmapMap').width()/2);
    $('#wordCloudCanvas').height($('#wordCloudCanvas').width());
    $('#profile').css({position: 'sticky'});
    window.scrollTo(0, 0);

    //HOVERS
    $('.backYear').hover(function()
    {
        $(this).attr("src", "/images/backArrowHover.png");
    },
    function()
    {
        $(this).attr("src", "/images/backArrow.png");
    });

    $('.forwardYear').hover(function()
    {
        $(this).attr("src", "/images/forwardArrowHover.png");
    },
    function()
    {
        $(this).attr("src", "/images/forwardArrow.png");
    });
});

function setup()
{
    getInfo(function(data)
    {

        var list = [];
        for(var i = 0; i < data.commonWords.length; i++)
        {
            list.push([data.commonWords[i]["token"], data.commonWords[i]["count"]]);
            if(i+1 >= data.commonWords.length)
            {
                WordCloud(document.getElementById('wordCloudCanvas'), { list: list, fontWeight: 'bold', color: 'random-dark', wait: '100', shuffle: true, minSize: "30px"});
            }
        }

        var heatmapData = [];

        if(!data.coordinates.length)
        {
            $('#heatmap').hide();
        }

        for(var i = 0; i < data.coordinates.length; i++)
        {
            var split = data.coordinates[i].split(",");
            
            heatmapData.push(new google.maps.LatLng(split[0], split[1]));
        }

        var heatmap = new google.maps.visualization.HeatmapLayer
        ({
            
          data: heatmapData
        });

        map = new google.maps.Map(document.getElementById('heatmapMap'), 
        {
          center: new google.maps.LatLng(51.3811, 2.3590),
          zoom: 2,
          mapTypeId: 'roadmap',
        });

        heatmap.setMap(map);
    })
    
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