var fs = require('fs');

module.exports = 
{
    // function to encode file data to base64 encoded string
    base64: function(file)
    {
        // read binary data
        var bitmap = fs.readFileSync(file);
        // convert binary data to base64 encoded string
        return "data:image/png;base64," + Buffer.from(bitmap).toString('base64');
    },

    formatNumber: function(number)
    {
        number = number.toString();
        var formatted = "";
        if(number.length > 6)
        {
            for(var i = 0; i < (number.length - 6); i++)
            {
                formatted += number[i]; 
            }
            formatted += "." + number[number.length - 6] + "M";
        }
        else if(number.length > 3)
        {
            for(var i = 0; i < (number.length - 3); i++)
            {
                formatted += number[i]; 
            }
            formatted += "." + number[number.length - 3] + "k";
        }
        else
        {
            return number;
        }
        return formatted;
    }
}