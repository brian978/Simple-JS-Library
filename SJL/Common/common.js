/**
 * Function checks if a variable exists
 *
 * @param {Mixed} variable
 * @return void
 */
function isset(variable){

    if(typeof variable !== 'undefined' && variable !== null){

        return true;

    } else {

        return false;

    }
}

/**
 * The function does a redirect
 *
 * @param {String} url
 * @return void
 */
function redirect(url){
    location.replace(url);
}

/**
 * The function checks if the given value is numeric
 *
 * @param {String} n
 * @return boolean
 */
function is_numeric(n)
{
    // ==== List of valid characters for a number ==== //
    var validChars = "0123456789.-";

    // ==== Current character in loop ==== //
    var cChar;

    // ==== Check variable ==== //
    var result = true;

    // ==== Checking the string length ==== //
    if (n.length == 0) result = false;

    // ==== Testing if the string contains valid characters ==== //
    for (var i = 0; i < n.length && result == true; i++)
    {
        // ==== Getting the current character ==== //
        cChar = n.charAt(i);

        // ==== Checking if the character exists in the valid chars string ==== //
        if (validChars.indexOf(cChar) == -1)
        {
            result = false;
        }
    }

    // ==== result ==== //
    return result;
}