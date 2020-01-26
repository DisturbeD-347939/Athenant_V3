var currentYear = new Date().getFullYear();
var monthYear = new Date().getFullYear();
var weekYear = new Date().getFullYear();
var hourYear = new Date().getFullYear();

var chartWeeks;
var chartMonths;
var chartHour;

var parsedTime;

function setupCharts(percentile, times)
{
    percentile = percentile.split(",");
    personalityChart(percentile);
    parseTimes(times, function(data){ parsedTime = data });
    displayTimesWeek(0);
    displayTimesMonth(0);
    displayTimesHour(0);
}

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

function personalityChart(data)
{
    for(var i = 0; i < data.length; i++)
    {
        data[i] = Math.round(data[i]*100)/100;
    }

    var big5 = ['Openness', 'Conscientiousness', 'Extraversion', 'Agreeableness', 'Emotional range'];

    for(var i = 0; i < big5.length; i++)
    {
        var singleTrait = big5[i].replace(" ", "");
        $('#big5 > div').append("<div><p>" + big5[i] + "</p><div class='backgroundProgressBar'><div id='" + singleTrait + "progressBar'><p id='" + singleTrait + "percentile'></p></div></div></div>");
        $('#' + singleTrait + 'progressBar').width(data[i]*100 + '%');
        $('#' + singleTrait + 'percentile').text(Math.round(data[i]*100) + '%');
    }
}

function displayTimesWeek(update)
{
    times = parsedTime;
    //TIMES PER WEEKDAY
    var weekdays = [0,0,0,0,0,0,0];
    for(var i = 0; i < times.length; i++)
    {
        if(times[i][0] == "Mon" && times[i][5] == weekYear) weekdays[0]++;
        else if(times[i][0] == "Tue" && times[i][5] == weekYear) weekdays[1]++;
        else if(times[i][0] == "Wed" && times[i][5] == weekYear) weekdays[2]++;
        else if(times[i][0] == "Thu" && times[i][5] == weekYear) weekdays[3]++;
        else if(times[i][0] == "Fri" && times[i][5] == weekYear) weekdays[4]++;
        else if(times[i][0] == "Sat" && times[i][5] == weekYear) weekdays[5]++;
        else if(times[i][0] == "Sun" && times[i][5] == weekYear) weekdays[6]++;
    }

    var chart = document.getElementById('timesWeekdaysChart');

    if(!update)
    {
        chartWeeks = new Chart(chart,
        {
            type: 'radar',
            data: 
            {
                labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
                datasets: 
                [{
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
        chartWeeks.options.legend.labels.fontColor = "#0000CD";
        setTimeout(function(){ chartWeeks.options.legend.labels.fontColor = "#666666"; }, 500);
        chartWeeks.data.datasets[0].label = "Tweets per weekday in " + weekYear;
        chartWeeks.data.datasets[0].data = weekdays;
        chartWeeks.update();
    }
}

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
        chartMonths.options.legend.labels.fontColor = "#0000CD";
        setTimeout(function(){ chartMonths.options.legend.labels.fontColor = "#666666"; }, 500);
        chartMonths.data.datasets[0].label = "Tweets per month in " + monthYear;
        chartMonths.data.datasets[0].data = monthCount;
        chartMonths.update();
    }
}

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