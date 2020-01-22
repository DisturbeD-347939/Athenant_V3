var fs = require('fs');

module.exports = 
{
    // function to encode file data to base64 encoded string
    base64: function(file)
    {
        // read binary data
        var bitmap = fs.readFileSync(file);
        // convert binary data to base64 encoded string
        return "data:image/png;base64," + new Buffer(bitmap).toString('base64');
    }
}