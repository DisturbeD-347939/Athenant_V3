//Variables for the years
var monthYear = new Date().getFullYear();
var weekYear = new Date().getFullYear();
var hourYear = new Date().getFullYear();

//Variables for the charts
var chartWeeks;
var chartMonths;
var chartHour;

var parsedTime;

//Run all necessary functions at the start
function setupCharts(percentile, times)
{
    percentile = percentile.split(",");
    personalityChart(percentile);
    parseTimes(times, function(data){ parsedTime = data });
    displayTimesWeek(0);
    displayTimesMonth(0);
    displayTimesHour(0);
}

//Update the charts
function changeDate(data)
{
    
    if(data.graph == "month")
    {
        if(data.direction == "back")
        {
            monthYear--;
        }
        else
        {
            monthYear++;
        }
        displayTimesMonth(1);
    }
    else if(data.graph == "week")
    {
        if(data.direction == "back")
        {
            weekYear--;
        }
        else
        {
            weekYear++;
        }
        displayTimesWeek(1);
    }
    else if(data.graph == "hour")
    {
        if(data.direction == "back")
        {
            hourYear--;
        }
        else
        {
            hourYear++;
        }
        displayTimesHour(1);
    }
}

//Create the big 5 personality bars
function personalityChart(data)
{
    for(var i = 0; i < data.length; i++)
    {
        //Round the numbers
        data[i] = Math.round(data[i]*100)/100;
    }

    var big5 = ['Openness', 'Conscientiousness', 'Extraversion', 'Agreeableness', 'Emotional range'];

    //Display the numbers
    for(var i = 0; i < big5.length; i++)
    {
        var singleTrait = big5[i].replace(" ", "");
        $('#big5 > div').append("<div><p>" + big5[i] + "</p><div class='backgroundProgressBar'><div id='" + singleTrait + "progressBar'><p id='" + singleTrait + "percentile'></p></div></div></div>");
        $('#' + singleTrait + 'progressBar').width(data[i]*100 + '%');
        $('#' + singleTrait + 'percentile').text(Math.round(data[i]*100) + '%');
    }
}

//Create tweets per week chart
function displayTimesWeek(update)
{
    times = parsedTime;
    //TIMES PER WEEKDAY
    var weekdays = [0,0,0,0,0,0,0];

    //Count how many days are of each and if the year is the year selected
    var possibilities = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    for(var i = 0; i < times.length; i++)
    {
        var extractHour = times[i][0];
        
        for(var j = 0; j < possibilities.length; j++)
        {
            if(extractHour == possibilities[j] && times[i][5] == weekYear) weekdays[j]++;
        }
    }

    //Get the chart ID
    var chart = document.getElementById('timesWeekdaysChart');

    //Create or update the chart
    if(!update)
    {
        //Create chart
        chartWeeks = new Chart(chart,
        {
            type: 'radar',
            data: 
            {
                labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
                datasets: 
                [{
                    //Display information on the chart
                    label: "Tweets per weekday in " + weekYear,
                    fill: false,
                    borderColor: '#E7DFC6',
                    backgroundColor: 'black',
                    data: weekdays
                }]
            },
            options: 
            {
                scale: 
                {
                    //Remove unnecessary lines in the chart
                    angleLines: 
                    {
                        display: false
                    }
                }
            }
        });
    }
    else
    {
        //Update charts with new year
        chartWeeks.options.legend.labels.fontColor = "#0000CD";
        setTimeout(function(){ chartWeeks.options.legend.labels.fontColor = "#666666"; }, 500);
        chartWeeks.data.datasets[0].label = "Tweets per weekday in " + weekYear;
        chartWeeks.data.datasets[0].data = weekdays;
        chartWeeks.update();
    }
}

//Same thing as previous chart
function displayTimesMonth(update)
{
    times = parsedTime;
    //TIMES PER MONTH
    var monthCount = [0,0,0,0,0,0,0,0,0,0,0,0];
    var possibilities = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    for(var i = 0; i < times.length; i++)
    {
        var extractHour = times[i][1];
        
        for(var j = 0; j < possibilities.length; j++)
        {
            if(extractHour == possibilities[j] && times[i][5] == monthYear) monthCount[j]++;
        }
    }

    var chart = document.getElementById('timesMonthChart');

    if(!update)
    {
        chartMonths = new Chart(chart,
        {
            type: 'line',
            data: 
            {
                labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December',],
                datasets: 
                [{
                    label: "Tweets per month in " + monthYear,
                    fill: false,
                    borderColor: '#2274A5',
                    backgroundColor: '131B23',
                    data: monthCount
                }]
            },
            options: 
            {
                scales: 
                {
                    yAxes: 
                    [{
                        //Make the numbers whole
                        ticks: 
                        {
                            beginAtZero: true,
                            precision:0
                        },
                        //Remove grid lines
                        gridLines: 
                        {
                            color: "rgba(0, 0, 0, 0)",
                        }
                    }],
                    xAxes:
                    {
                        //Remove grid lines
                        gridLines: 
                        {
                            color: "rgba(0, 0, 0, 0)",
                        }
                    }
                }
            }
        });
    }
    else
    {
        //Update the chart
        chartMonths.options.legend.labels.fontColor = "#0000CD";
        setTimeout(function(){ chartMonths.options.legend.labels.fontColor = "#666666"; }, 500);
        chartMonths.data.datasets[0].label = "Tweets per month in " + monthYear;
        chartMonths.data.datasets[0].data = monthCount;
        chartMonths.update();
    }
}

//Same as previous chart
function displayTimesHour(update)
{
    //TIMES PER HOUR
    times = parsedTime;
    var hourCount = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    var possibilities = ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23"];
    for(var i = 0; i < times.length; i++)
    {
        var extractHour = times[i][3][0] + times[i][3][1];
        //console.log(extractHour);
        
        for(var j = 0; j < possibilities.length; j++)
        {
            if(extractHour == possibilities[j] && times[i][5] == hourYear) hourCount[j]++;
        }
    }

    var chart = document.getElementById('timesHourChart');

    if(!update)
    {
        chartHour = new Chart(chart,
        {
            type: 'line',
            data: 
            {
                labels: ["12AM", "1AM", "2AM", "3AM", "4AM", "5AM", "6AM", "7AM", "8AM", "9AM", "10AM", "11AM", "12PM", "1PM", "2PM", "3PM", "4PM", "5PM", "6PM", "7PM", "8PM", "9PM", "10PM", "11PM"],
                datasets: 
                [{
                    label: "Tweets per hour in " + hourYear,
                    fill: false,
                    borderColor: '#2274A5',
                    backgroundColor: '131B23',
                    data: hourCount
                }]
            },
            options: 
            {
                scales: 
                {
                    yAxes: 
                    [{
                        ticks: 
                        {
                            beginAtZero: true,
                            precision:0
                        },
                        gridLines: 
                        {
                            color: "rgba(0, 0, 0, 0)",
                        }
                    }],
                    xAxes:
                    {
                        gridLines: 
                        {
                            color: "rgba(0, 0, 0, 0)",
                        }
                    }
                }
            }
        });
    }
    else
    {
        chartHour.options.legend.labels.fontColor = "#0000CD";
        setTimeout(function(){ chartHour.options.legend.labels.fontColor = "#666666"; }, 500);
        chartHour.data.datasets[0].label = "Tweets per hour in " + hourYear;
        chartHour.data.datasets[0].data = hourCount;
        chartHour.update();
    }
}

//Transform the times string into an organized array
function parseTimes(times, callback)
{
    times = times.split(",");
    var parsedTimes = [];
    for(var i = 0; i < times.length; i+=6)
    {
        var temp = [];
        for(var j = 0; j < 6; j++)
        {
            temp.push(times[i+j]);
            if((j+1) >= 6)
            {
                parsedTimes.push(temp);
            }
        }
        if((i+6) >= times.length)
        {
            times = parsedTimes;
            callback(times);
        }
    }
}