var currentYear = new Date().getFullYear();
var monthYear = new Date().getFullYear();
var weekYear = new Date().getFullYear();

var chartWeeks;
var chartMonths;

var parsedTime;

function setupCharts(percentile, times)
{
    console.log("Setting up charts");
    percentile = percentile.split(",");
    personalityChart(percentile);
    parseTimes(times, function(data){ parsedTime = data });
    displayTimesWeek(0);
    displayTimesMonth(0);
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
    else
    {
        $('#timesWeekdaysChart').remove();
        $('#weekChart > .chartjs-size-monitor').remove();
        $("<canvas id='timesWeekdaysChart'>").insertAfter("#weekChart > img");
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
        $('#big5 > div').append("<p>" + big5[i] + "</p><div class='backgroundProgressBar'><div id='" + singleTrait + "progressBar'><p id='" + singleTrait + "percentile'></p></div></div>");
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
            type: 'bar',
            data: 
            {
                labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
                datasets: 
                [{
                    label: "Tweets per weekday in " + weekYear,
                    fill: false,
                    borderColor: 'black',
                    backgroundColor: '#E7DFC6',
                    data: weekdays
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
        chartWeeks.data.datasets[0].label = "Tweets per month in " + weekYear;
        chartWeeks.data.datasets[0].data = weekdays;
        chartWeeks.update();
    }
}

function displayTimesMonth(update)
{
    times = parsedTime;
    //TIMES PER MONTH
    var monthCount = [0,0,0,0,0,0,0,0,0,0,0,0];
    for(var i = 0; i < times.length; i++)
    {
        if(times[i][1] == "Jan" && times[i][5] == monthYear) monthCount[0]++;
        else if(times[i][1] == "Feb" && times[i][5] == monthYear) monthCount[1]++;
        else if(times[i][1] == "Mar" && times[i][5] == monthYear) monthCount[2]++;
        else if(times[i][1] == "Apr" && times[i][5] == monthYear) monthCount[3]++;
        else if(times[i][1] == "May" && times[i][5] == monthYear) monthCount[4]++;
        else if(times[i][1] == "Jun" && times[i][5] == monthYear) monthCount[5]++;
        else if(times[i][1] == "Jul" && times[i][5] == monthYear) monthCount[6]++;
        else if(times[i][1] == "Aug" && times[i][5] == monthYear) monthCount[7]++;
        else if(times[i][1] == "Sep" && times[i][5] == monthYear) monthCount[8]++;
        else if(times[i][1] == "Oct" && times[i][5] == monthYear) monthCount[9]++;
        else if(times[i][1] == "Nov" && times[i][5] == monthYear) monthCount[10]++;
        else if(times[i][1] == "Dec" && times[i][5] == monthYear) monthCount[11]++;
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
        chartMonths.data.datasets[0].label = "Tweets per month in " + monthYear;
        chartMonths.data.datasets[0].data = monthCount;
        chartMonths.update();
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