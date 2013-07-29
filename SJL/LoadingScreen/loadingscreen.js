/**
 *
 * Class that can generate a loading screen
 *
 * @author Brian
 * @link https://github.com/brian978/Simple-JS-Library
 * @copyright 2012
 * @license Creative Commons Attribution-ShareAlike 3.0
 *
 * @name LoadingScreen
 * @version 1.5
 *
 */

/**
 * Loading screen class
 *
 * @class LoadingScreen
 * @param {Object} params
 * @return object
 */
function LoadingScreen(params){

    // Aliasing the 'this' keyword
    var _this = this;

    // Params
    this.params = new Object();

    // Child container - the container will hold the elements of the loading screen (this is only a default)
    this.childContainer = null;

    // Node (this is only a default)
    this.node = null;

    // Getting the params
    if(typeof params !== 'undefined' && typeof params === 'object' && params !== null){
        this.params = params;
    }

    /**
     * -----------------------------------------
     * SHORTCUTS WITH DEFAULT VALUES
     * -----------------------------------------
     */
    // Modal backgound opacity
    this.opacity = typeof this.params.opacity !== 'undefined' ? this.params.opacity : 0.3;

    // Timeout to autocancel the loading screen
    this.timeout = typeof this.params.timeout !== 'undefined' ? this.params.timeout : 20; // Seconds

    // Mode
    this.mode = typeof this.params.mode !== 'undefined' ? this.params.mode : 'normal'; // normal or small

    // Modal screen
    if(typeof this.params.modal === 'undefined' && this.mode === 'normal'){
        this.params.modal = true;
    } else {
        this.params.modal = false;
    }

    /**
     * --------------------------------------------
     * EXECUTED AFTER THE DOCUMENT HAS LOADED
     * --------------------------------------------
     */
    $(document).ready(function(){

        // Creating a span that will hold elements of the loading screen
        _this.node = document.createElement('div');

        // Failsafe trigger
        var failsafe = false;

        // Setting an attribute for the loading screen
        _this.node.setAttribute('id', 'loading_screen');

        // Setting the style attribute for the loading screen container
        _this.node.setAttribute('style', 'width: 100%; height: 100%;');

        // Checking if there is a container object given for the loading screen
        if(typeof _this.params.container !== 'undefined' && _this.params.container !== null && typeof _this.params.container === 'object'){

            // Checking if the container is a jQuery object
            if(_this.params.container instanceof jQuery){

                // Checking if the element exists
                if(_this.params.container.length !== 0){

                    // Appending the element
                    _this.params.container.append(_this.node);

                } else {

                    // Setting the failsafe flag
                    failsafe = true;
                }

            } else {

                // Checking if the element exists
                if(_this.params.container.length !== 0){

                    // Appending the element
                    _this.params.container.appendChild(_this.node);

                } else {

                    // Setting the failsafe flag
                    failsafe = true;
                }
            }
        } else {

            // Setting the failsafe flag
            failsafe = true;
        }

        // Checking if the failsafe should take effect
        if(failsafe === true){

            // Body element object
            _this.params.container = document.getElementsByTagName('body')[0];

            // Appending the span to the body
            _this.params.container.appendChild(_this.node);
        }
    });

    /**
     * Loading screen show method
     *
     * @param {Void}
     * @return LoadingScreen
     */
    this.show = function(){

        // Aliasing the 'this' keyword
        var _this = this;

        /**
         * --------------------------------------------
         * EXECUTED AFTER THE DOCUMENT HAS LOADED
         * --------------------------------------------
         */
        $(document).ready(function(){

            // Failsafe in case the show method is called again
            if(_this.childContainer == null){

                // Creating the screen container
                _this.childContainer = document.createElement('div');

                // Default imageId
                var containerId = '';

                // Container ID
                if(_this.params.modal === true){

                    containerId = 'Modal';

                } else {

                    containerId = 'Inner';
                }

                // Setting an ID to the container
                _this.childContainer.setAttribute('id', containerId);

                // Setting a class to the container
                _this.childContainer.setAttribute('class', 'lsContainer');

                // Checking if the modal screen should be active
                if(_this.params.modal === true){

                    // Creating the background container
                    var bgContainer = document.createElement('div');

                    // Setting an ID to the background container
                    bgContainer.setAttribute('id', 'lsBackgound');

                    // Setting some custom setting to the background container
                    bgContainer.setAttribute('style', 'opacity: ' + _this.opacity + ';');

                    // Adding the background to the container
                    _this.childContainer.appendChild(bgContainer);
                }

                // Adding the image to the container
                _this.childContainer.appendChild(_this.getImage(_this.childContainer));

                // Adding the container to the body
                _this.node.appendChild(_this.childContainer);

                // Checking the timeout
                _this.checkTimeout();
            }
        });

        return this;
    }

    /**
     * Loading image
     *
     * @param {Object} container
     * @return object
     */
    this.getImage = function(container){

        /**
         * -----------------------
         * CREATING THE IMAGE
         * -----------------------
         */
        // Creating new element
        var image = document.createElement('div');

        // Image ID
        var imageId = this.mode.toLowerCase();

        // Adding the image class
        image.setAttribute('id', imageId);

        /**
         * -------------------------------
         * CREATING THE IMAGE CONTAINER
         * -------------------------------
         */
        // Creating the div element
        var spacer = document.createElement('div');

        // Adding the ID of the div element
        spacer.setAttribute('class', 'lsImage' + ' ' + imageId);

        // Adding the image to the container
        spacer.appendChild(image);

        // Adding the spacer to the container
        container.appendChild(spacer);

        // Returning the object
        return image;
    }

    /**
     * Checking the timeout
     *
     * @param {Number} count
     * @return void
     */
    this.checkTimeout = function(count){

        // Checking if the container still exists
        if(this.childContainer != null){

            // Checking if the count variable is defined
            if(typeof count !== 'undefined'){

                // Checking the time
                if(count < this.timeout){

                    count++;

                    setTimeout(function(thisObj, count){ thisObj.checkTimeout(count) }, 1000, this, count);

                } else{

                    // Destroying the screen
                    this.destroy();
                }

            } else {

                setTimeout(function(thisObj, count){ thisObj.checkTimeout(count) }, 1000, this, 1);
            }
        }
    }

    /**
     * Loading screen destroy method
     *
     * @param {Void}
     * @return void
     */
    this.destroy = function(){

        // Aliasing the 'this' keyword
        var _this = this;

        // Destroying only after the entire document has loaded
        $(document).ready(function(){

            // Destroying the loading screen
            if(_this.childContainer != null){

                // Checking if the container is a jQuery object
                if(_this.params.container instanceof jQuery){

                    // Removing the node from the master container
                    $(_this.node).remove();

                } else {

                    // Removing the node from the master container
                    _this.params.container.removeChild(_this.node);
                }

                // Resetting the container
                _this.childContainer = null;
            }
        });
    }
}