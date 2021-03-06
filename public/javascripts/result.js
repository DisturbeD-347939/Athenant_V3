setTimeout(setup, 50);

//Arrays for variables
var images = [];
var imageTags = [];

//Wait for the images to be ready on the server side
setInterval(function()
{
    if(!imageTags.length)
    {
        //Ajax request to get images
        $.ajax
        ({
            url: '/result',
            type: 'GET',
            contentType: "application/json",
            data: {"imageTags": twitterid},
            success(data)
            {
                if(data != 0)
                {
                    for(var i = 0; i < data.length; i++)
                    {
                        imageTags.push([data[i]["token"],data[i]["count"]]);
                        if(i+1 >= data.length)
                        {
                            //Display the images tags in a word cloud chart
                            $('#wordCloudTags > h1').hide();
                            $('#wordCloudTags').css("display", "block");
                            var chart = anychart.tagCloud(imageTags);
                            chart.title(imageTags.length + ' most common words found by AI in pictures')// enable a color range
                            chart.angles([0]);
                            chart.colorRange().length('80%');
                            chart.container("wordCloudTags");
                            chart.draw();
                            setImmediate(function(){ $('.anychart-credits').hide(); });
                        }
                    }
                }
            }
        });
    }
}, 5000);

//Update some of the elements properties every 3 seconds to avoid bugs
setInterval(function()
{
    $('#profilePicture').css({'height':$('#profilePicture').width()+'px'});
    $('#bannerPicture').css({top: 0, left:0});
    $('#bannerPicture').width($('#profile').width() + 80);
    $('#bannerPicture').height($('#profilePicture').height()/2 + 60);
    $('#times > div > img').height($('#times > div > button').width());
    $('#heatmapMap').height($('#heatmapMap').width()/2);
    $('#wordCloudWords').height($('#wordCloudWords').width());
    $('#wordCloudTags').height($('#wordCloudTags').width());
}, 3000);

//On window resize update the elements sizes and positions
$(window).resize(function()
{
    $('#profilePicture').css({'height':$('#profilePicture').width()+'px'});
    $('#bannerPicture').css({top: 0, left:0});
    $('#bannerPicture').width($('#profile').width() + 80);
    $('#bannerPicture').height($('#profilePicture').height()/2 + 60);
    $('#times > div > img').height($('#times > div > button').width());
    $('#heatmapMap').height($('#heatmapMap').width()/2);
    $('#wordCloudWords').height($('#wordCloudWords').width());
    $('#wordCloudTags').height($('#wordCloudTags').width());
})

//When the document is ready run this code
$(document).ready(function() 
{
    //Update the elements sizes and positions
    $('#profilePicture').css({'height':$('#profilePicture').width()+'px'});
    $('#bannerPicture').css({top: 0, left:0});
    $('#bannerPicture').width($('#profile').width() + 79);
    $('#bannerPicture').height($('#profilePicture').height()/2 + 60);
    $('#times > div > img').height($('#times > div > button').width());
    $('#heatmapMap').height($('#heatmapMap').width()/2);
    $('#wordCloudWords').height($('#wordCloudWords').width());
    $('#wordCloudTags').height($('#wordCloudTags').width());
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
    //Gather all the necessary info from the server
    getInfo(function(data)
    {
        //If there is a birthday available, display it
        if(data.birthday)
        {
            data.birthday[0] = data.birthday[0].split(" ");
            if(data.birthday[0].length)
            {
                data.birthday[0] = data.birthday[0][2] + " " + data.birthday[0][1]; 
            }
        }
    
        //Set variables;
        $('#twitterUsername').html(data.name);
        var dataCounter = 0;
        var dataPoints = ["location", "birthday", "followers", "following", "posts", "likes"];

        //Create a grid with all items provided by the server
        for(var i = 0; i < dataPoints.length; i++)
        {
            if(data[dataPoints[i]])
            {
                dataCounter++;
                $('#userInfo').append("<div id='" + dataPoints[i] + "'><img src='/images/" + dataPoints[i] + ".png'><p>" + data[dataPoints[i]] + "</p><div>");
            }
        }

        //Adjust the grid depending on the number of data gotten from the server
        setTimeout(function()
        {
            $('#userInfo > img').height($('#userInfo > img').width());
            $('#userInfo').css("grid-template-rows", "repeat(" + Math.round(dataCounter/2) + ", 1fr");
            if(dataCounter%2)
            {
                $('#userInfo > div:first-child > img').css("width", "11%");
                $('#userInfo > div:first-child').css("grid-column", "1/3");
            }
        }, 100);

        //Create heatmap using the google maps api
        var heatmapData = [];

        if(!data.coordinates.length)
        {
            $('#heatmapMap').hide();
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
        
        //Create the list of the 50 most common words
        var list = [];
        for(var i = 0; i < data.commonWords.length; i++)
        {
            //Parse them
            list.push([data.commonWords[i]["token"], data.commonWords[i]["count"]]);
            if(i+1 >= data.commonWords.length)
            {
                console.log(list);
                var chart = anychart.tagCloud(list);
                chart.title(list.length + ' most common words')// enable a color range
                chart.angles([0]);
                chart.colorRange().length('80%');
                chart.container("wordCloudWords");
                chart.draw();
                setImmediate(function(){ $('.anychart-credits').hide(); });
            }
        }
    })
    
}

function getInfo(callback)
{
    //Ajax call to get images from the server, like profile picture and banner
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
            if(images[4])
            {
                $('#bannerPicture').attr('src', images[4]);
            }
        }
    });
    //Ajax call to get all the information from the server, like names, birthdays, etc
    $.ajax
    ({
        url: '/result',
        type: 'GET',
        contentType: "application/json",
        data: {"getInfo": twitterid},
        success(data)
        {
            console.log(data);
            callback(data);
        }
    });
} 