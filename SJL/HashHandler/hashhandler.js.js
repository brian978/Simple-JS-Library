/**
 *
 * A class that processes the hash value of the window object
 *
 * @author Brian
 * @link https://github.com/brian978
 * @copyright 2012
 * @license Creative Commons Attribution-ShareAlike 3.0
 *
 * @name HashHandler
 * @version 1.0
 *
 */

/**
 * Class that processes the window hash
 *
 * @param {Void}
 * @return void
 */
function HashHandler(){

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
    this.process = function(){

        // Splitting the hash based on the "&" sign
        var pairs = this.hash.split('&');

        // Going through the pairs and getting the values
        for(var index in pairs){

            var pair = pairs[index];

            var pieces = pair.split('=');

            this.values[pieces[0]] = pieces[1];
        }
    }

    /**
     * Retrieves a value from the hash
     *
     * @param {String} index
     * @return string
     */
    this.get = function(index){

        var value = '';

        if(isset(this.values[index])){
            value = this.values[index];
        }

        return value;
    }

    /**
     * Adds a value to the hash
     *
     * @param {String} index
     * @param {String} value
     * @return this
     */
    this.add = function(index, value){

        this.values[index] = value;

        return this;
    }

    /**
     * Removes a value from the hash
     *
     * @param {String} index
     * @return this
     */
    this.remove = function(index){

        if(isset(this.values[index])){
            this.values[index] = null;
            delete this.values[index];
        }

        return this;
    }

    /**
     * Changes the entire hash
     *
     * @param {Void}
     * @return void
     */
    this.build = function(){

        var hash = '';

        // Building the hash
        for(var index in this.values){

            hash += index + '=' + this.values[index] + '&';
        }

        // Removing the last "&" sign
        hash = hash.substr(0, hash.length - 1);

        window.location.hash = hash;
    }

    // Triggering the processing
    this.process();
}