var year = new Date().getFullYear();
var changedYear = 1;

setTimeout(function()
{
    $('#changeDate').text(year-1);
}, 20)


function setupCharts(percentile, times)
{
    percentile = percentile.split(",");
    personalityChart(percentile);
    displayTimes(times);
}

function changeDate(data)
{
    if(changedYear == 0)
    {
        year = new Date().getFullYear();
        $('#changeDate').text(year);
        changedYear++;
    }
    else
    {
        year--;
        $('#changeDate').text(year-1);
        changedYear--;
    }
    console.log(year + " | " + changedYear);
    $('#changeDate').text(year);
    displayTimes(data.times);
}

function personalityChart(data)
{
    for(var i = 0; i < data.length; i++)
    {
        data[i] = Math.round(data[i]*100)/100;
    }

    var big5 = document.getElementById('big5Chart');
    new Chart(big5, 
    {
        type: 'horizontalBar',
        data: 
        {
            labels: ['Openness', 'Conscientiousness', 'Extraversion', 'Agreeableness', 'Emotional range'],
            datasets:
            [{
                label: 'Personality Traits',
                data: data,
                backgroundColor: 'rgba(0, 0, 255, 0.5)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }]
        },
        options: 
        {
            scales: 
            {
                xAxes: 
                [{
                    ticks: 
                    {
                        suggestedMax: 1,
                        suggestedMin: 0,
                        beginAtZero: true
                    }
                }]
            },
            onClick: big5Click 
        }
    });
}

function displayTimes(times)
{
    parseTimes(times, function(data)
    {
        times = data;

        //TIMES PER MONTH
        var monthCount = [0,0,0,0,0,0,0,0,0,0,0,0];
        for(var i = 0; i < times.length; i++)
        {
            if(times[i][1] == "Jan" && times[i][5] == year) monthCount[0]++;
            else if(times[i][1] == "Feb" && times[i][5] == year) monthCount[1]++;
            else if(times[i][1] == "Mar" && times[i][5] == year) monthCount[2]++;
            else if(times[i][1] == "Apr" && times[i][5] == year) monthCount[3]++;
            else if(times[i][1] == "May" && times[i][5] == year) monthCount[4]++;
            else if(times[i][1] == "Jun" && times[i][5] == year) monthCount[5]++;
            else if(times[i][1] == "Jul" && times[i][5] == year) monthCount[6]++;
            else if(times[i][1] == "Aug" && times[i][5] == year) monthCount[7]++;
            else if(times[i][1] == "Sep" && times[i][5] == year) monthCount[8]++;
            else if(times[i][1] == "Oct" && times[i][5] == year) monthCount[9]++;
            else if(times[i][1] == "Nov" && times[i][5] == year) monthCount[10]++;
            else if(times[i][1] == "Dec" && times[i][5] == year) monthCount[11]++;
        }

        var chart = document.getElementById('timesMonthChart');
        new Chart(chart,
	    {
	    	type: 'line',
            data: 
            {
	    		labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December',],
                datasets: 
                [{
	    			label: 'Tweets per month',
	    			fill: false,
	    			borderColor: 'red',
	    			backgroundColor: 'red',
	    			data: monthCount
	    		}]
	    	},
            options: 
            {
                title: 
                {
	    			display: true,
	    			text: 'Tweets per month in ' + new Date().getFullYear()
                },
                scales: 
                {
                    yAxes: 
                    [{
                        ticks: 
                        {
                            beginAtZero: true
                        }
                    }]
                },
	    	}
        });
        
        //TIMES PER WEEKDAY
        var weekdays = [0,0,0,0,0,0,0];
        for(var i = 0; i < times.length; i++)
        {
            if(times[i][0] == "Mon" && times[i][5] == year) weekdays[0]++;
            else if(times[i][0] == "Tue" && times[i][5] == year) weekdays[1]++;
            else if(times[i][0] == "Wed" && times[i][5] == year) weekdays[2]++;
            else if(times[i][0] == "Thu" && times[i][5] == year) weekdays[3]++;
            else if(times[i][0] == "Fri" && times[i][5] == year) weekdays[4]++;
            else if(times[i][0] == "Sat" && times[i][5] == year) weekdays[5]++;
            else if(times[i][0] == "Sun" && times[i][5] == year) weekdays[6]++;
        }

        var chart = document.getElementById('timesWeekdaysChart');
        new Chart(chart,
	    {
	    	type: 'bar',
            data: 
            {
	    		labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
                datasets: 
                [{
	    			label: 'Tweets per weekdays',
	    			fill: false,
	    			borderColor: 'red',
	    			backgroundColor: 'red',
	    			data: weekdays
	    		}]
	    	},
            options: 
            {
                title: 
                {
	    			display: true,
	    			text: 'Tweets per month in ' + new Date().getFullYear()
                },
                scales: 
                {
                    yAxes: 
                    [{
                        ticks: 
                        {
                            beginAtZero: true
                        }
                    }]
                }
	    	}
        });
    })
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