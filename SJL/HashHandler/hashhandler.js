/**
 *
 * A class that processes the hash value of the window object
 *
 * @author Brian
 * @link https://github.com/brian978/Simple-JS-Library
 * @copyright 2012
 * @license Creative Commons Attribution-ShareAlike 3.0
 *
 * @name HashHandler
 * @version 1.1
 *
 */

/**
 * Class that processes the window hash
 *
 * @param {Void}
 * @return void
 */
function HashHandler()
{
    // Simulating a Singleton pattern
    if (typeof HashHandler.instance == 'undefined') {
        HashHandler.instance = this;
    } else {
        return HashHandler.instance;
    }

    // Container of the hash values
    this.values = new Array();

    // Getting the hash
    this.hash = new String(window.location.hash).replace('#', '');

    /**
     * The method processes the hash
     *
     * @param {Void}
     * @return void
     */
    this.process = function ()
    {

        if (this.hash.length > 1) {

            // Splitting the hash based on the "&" sign
            var pairs = this.hash.split('&');

            // Going through the pairs and getting the values
            for (var index in pairs) {

                var pair = pairs[index];

                // Looking in the pair to see if we have to deal with an array
                var arrayIndexString = pair.match('\\[[0-9]+\\]');

                if (arrayIndexString !== null) {
                    this.processArrayPair(pair, arrayIndexString);
                } else {
                    this.processStringPair(pair);
                }
            }
        }
    }

    /**
     *
     * @param pair
     * @param arrayIndexString
     */
    this.processArrayPair = function (pair, arrayIndexString)
    {
        // Correcting the pair string so se can process it normally and
        // getting the index of the array
        var pieces = pair.replace(arrayIndexString, '').split('=');
        var arrayIndex = new String(arrayIndexString).replace(/\[|\]/g, '');

        if (typeof this.values[pieces[0]] == 'undefined') {
            this.values[pieces[0]] = [];
        }

        this.values[pieces[0]][arrayIndex] = pieces[1];
    }

    /**
     *
     * @param {String} pair
     */
    this.processStringPair = function (pair)
    {
        var pieces = pair.split('=');

        this.values[pieces[0]] = pieces[1];
    }

    /**
     * Retrieves a value from the hash
     *
     * @param {String} indexName
     * @return string
     */
    this.get = function (indexName, indexValue)
    {
        var value = '';

        if (typeof indexName == 'string' && isset(this.values[indexName])) {
            if (((typeof indexValue == 'string' && indexValue.length > 0) || typeof indexValue == 'number') && typeof this.values[indexName] == 'object' && isset(this.values[indexName][indexValue])) {
                value = this.values[indexName][indexValue];
            } else {
                value = this.values[indexName];
            }
        }

        return value;
    }

    /**
     * Adds a value to the hash
     *
     * @param {String} index
     * @param {String} value
     * @param {boolean} isArray
     * @return this
     */
    this.add = function (index, value, isArray)
    {
        if (typeof index == 'string' && (typeof value == 'string' || typeof value == 'number')) {
            if (typeof isArray != 'undefined' && isArray === true) {
                this.addInArray(index, value);
            } else {
                this.values[index] = value;
            }
        }

        return this;
    }

    /**
     *
     * @param index
     * @param value
     */
    this.addInArray = function (index, value)
    {
        if (typeof index == 'string' && (typeof value == 'string' || !isNaN(value))) {
            if (typeof this.values[index] == 'undefined') {
                this.values[index] = [];
            } else if (this.values[index] instanceof Array == false) {
                this.values[index] = [this.values[index]];
            }

            if (!this.isDuplicateValue(index, value)) {
                this.values[index].push(value);
            }
        }
    }

    /**
     * Method is used to determine if the value should be added in the array of values
     *
     * @param index
     * @param value
     * @returns {boolean}
     */
    this.isDuplicateValue = function (index, value)
    {
        var isDuplicate = false;

        if (typeof this.values[index] == 'object') {
            for (var idx in this.values[index]) {
                if (this.values[index][idx] == value) {
                    isDuplicate = true;
                    break;
                }
            }
        }

        return isDuplicate;
    }

    /**
     * Removes a value from the hash
     *
     * @param {String} index
     * @param {String} value This is given if the index is an array
     * @return this
     */
    this.remove = function (index, value)
    {
        if (typeof index == 'string' && isset(this.values[index])) {
            if (typeof this.values[index] == 'object' && (typeof value == 'string' || typeof value == 'number')) {
                for (var valueIndex in this.values[index]) {
                    if (this.values[index][valueIndex] == value) {
                        this.values[index][valueIndex] = null;
                        delete this.values[index][valueIndex];
                    }
                }
            } else {
                this.values[index] = null;
                delete this.values[index];
            }
        }

        return this;
    }

    /**
     * Removes all the values of the hash
     *
     * @param {Void}
     * @return this
     */
    this.reset = function ()
    {
        this.values = [];

        return this;
    }

    /**
     * Changes the entire hash
     *
     * @param {Void}
     * @return void
     */
    this.build = function ()
    {
        var hash = '';

        // Building the hash
        for (var index in this.values) {
            if (typeof this.values[index] == 'object') {
                for (var valueIndex in this.values[index]) {
                    hash += index + '[' + valueIndex + ']=' + this.values[index][valueIndex] + '&';
                }
            } else {
                hash += index + '=' + this.values[index] + '&';
            }
        }

        // Removing the last "&" sign
        hash = hash.substr(0, hash.length - 1);

        window.location.hash = hash;
    }

    // Triggering the processing
    this.process();
}