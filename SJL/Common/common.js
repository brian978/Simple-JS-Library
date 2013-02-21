/**
 * Function checks if a variable exists
 *
 * @param {Mixed} variable
 * @return boolean
 */
function isset(variable)
{
    if (typeof variable !== 'undefined' && variable !== null)
    {
        return true;
    }
    else
    {
        return false;
    }
}

/**
 * The function does a redirect
 *
 * @param {String} url
 * @return void
 */
function redirect(url)
{
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
    if (n.length == 0)
    {
        result = false;
    }

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

/**
 * Determins if the browser is Mozilla (uses jQuery)
 *
 * @return boolean
 */
function isMozilla()
{
    if (typeof isMozilla.result == 'undefined')
    {
        isMozilla.result = $.browser.mozilla;
    }

    return isMozilla.result;
}

/**
 * Determins if the scripts should log any messages
 *
 * @return boolean
 */
function logMessages()
{
    // TODO: Comment section below on production env so it returns false
    if (typeof console == 'object'
        && isMozilla()
        && (
        (
            isset(window.enableLogging)
                && window.enableLogging === true
            )
            || !isset(window.enableLogging)
        )
    ) {
        return true;
    }

    return false;
}

/**
 * Returns the type of a jQuery DOM element
 *
 * @param element
 * @returns {string}
 */
function getElementType(element)
{
    var result = '';

    if(element instanceof jQuery)
    {
        result = new String(element.get(0).tagName).toLowerCase();
    }

    return result;
}

/**
 * Returns the attributes of a jQuery DOM element
 *
 * @param {Object} element
 * @returns {Array}
 */
function getElementAttributes(element)
{
    var attributes = [];

    if(element instanceof jQuery)
    {
        var nodeMap = element[0].attributes;

        for (var i = 0; i < nodeMap.length; i++)
        {

            // The item is an object from the map
            var item = nodeMap.item(i);
            attributes[item.nodeName] = item.nodeValue;
        }
    }

    return attributes;
}