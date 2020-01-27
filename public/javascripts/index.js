setTimeout(setup, 50);

//If the ID is wrong
function setup()
{
    if(error)
    {
        $('#error').text("Incorrect ID, try again!");
    }
}