/**
 *
 * A class that triggeres a set action when a set container changes it's state
 *
 * @author Brian
 * @link https://github.com/brian978
 * @copyright 2012
 * @license Creative Commons Attribution-ShareAlike 3.0
 *
 * @name ActionTriger
 * @version 1.0
 *
 */

/**
 * Used to trigger an action when the state of an element changes
 *
 * @param {Object} params
 * @return void
 */
function ActionTrigger(params)
{
    // Copying the parameter to object property
    if(isset(params)){
        this.params = params;
    } else {
        this.params = new Object();
    }

    /**
     * --------------------
     * DEFAULT PARAMETERS
     * --------------------
     */
    // Checking if we have an element ID
    if(!isset(this.params.elementId)){
        this.params.elementId = null;
    }

    // Checking if the methods that determine the objects state should be triggered after the document has loaded or not
    if(!isset(this.params.documentReady)){
        this.params.documentReady = true;
    }

    // By default the class triggers a loading screen
    if(!isset(this.params.loadingScreen)){
        this.params.loadingScreen = true;
    }

    // By default the wait period before the class will stop watching the element (in seconds)
    if(!isset(this.params.waitPeriod)){
        this.params.waitPeriod = 10;
    }

    // By default we have no Action object
    if(!isset(this.params.action)){
        this.params.action = null;
    }

   /**
    * The method gets the info about the observed object
    *
    * @param {Void}
    * @return void
    */
   this.init = function(){

        // Checking if we have an action object
        if(this.params.action instanceof Action){

             // Object of the element
             this.object = null;

             // Observed object type
             this.objectType = null;

             // Observed object value
             this.objectValue = null;

             // Timeout ID
             this.timeoutId = null;

             // Initializing the loading screen variable
             this.loadScr = (this.params.loadingScreen == true ? new LoadingScreen() : null);

             // Getting the observed object
             this.getObject();

             // Checking if we have an object
             if(this.object !== null){

                // Getting the observed object type
                this.getObjectType();

                // Getting the initial value of the object value
                this.getObjectValue();

                // Starting the counter
                this.beginProcess();

             } else {

                // Logging
                if(typeof console == 'object'){
                    console.log('Could not find an object with the given ID.');
                }
             }

        } else {

             // Logging
             if(typeof console == 'object'){
                 console.log('The ActionTrigger object need an Action object.');
             }
        }
   }

    /**
     * Gets the observed object
     *
     * @param {Void}
     * @return void
     */
    this.getObject = function(){

        // Checking if we have and element ID
        if(this.params.elementId !== null){
            this.object = $('#' + this.params.elementId);

            // Checking if an object was found
            if(this.object.length <= 0){
                this.object = null;
            }
        }
    }

   /**
    * Gets the type of the observed object
    *
    * @param {Void}
    * @return void
    */
   this.getObjectType = function(){

        // Checking if we have an object
        if(this.object !== null){
            this.objectType = new String(this.object.get(0).tagName).toLowerCase();
        }
   }

   /**
    * Gets the value of an object depending on the object type
    *
    * @param {boolean} returnVal
    * @return mixed
    */
   this.getObjectValue = function(returnVal){

        // Object value
        var value = null;

        // Getting the value depending on the object type
        if(this.objectType == 'div' || this.objectType == 'span' || this.objectType == 'button' || this.objectType == 'textarea'){

            value = this.object.html();

        } else if (this.objectType == 'select'){

            value = this.object.find('option:selected').val();

        } else if (this.objectType == 'iframe'){

            /**
             * @TODO get contents of the iframe after it has loaded
             */
            value = this.object.contents().find("body").html();

        }

        // Checking if the value should be returned
        if(returnVal == true){

           return value;

        } else {

           this.objectValue = value;

        }

        return null;
   }

   /**
    * Used to check the state of the object
    *
    * @param {Void}
    * @return boolean
    */
   this.checkState = function(){

        // Flag
        var changed = false;

        // Checking the state
        if(this.getObjectValue(true) != this.objectValue){
            changed = true;

            // Logging
            if(typeof console == 'object'){
                console.log('Object has changed it\'s state.');
            }
        }

        // Returning
        return changed;
   }

   /**
    * The method acts like a timer and checks if the observed object has changed it's value
    *
    * @param {Number} counter
    * @return void
    */
   this.timer = function(counter){

        // Counter variable
        var counter = counter || 0;

        // Determins if the state has changed
        var stateChanged = this.checkState();

        // Checking if the counter has reached the limit
        if(counter < this.params.waitPeriod && stateChanged == false){

            counter++;

             // Logging
             if(typeof console == 'object'){
                 console.log('Counter at ' + counter);
             }

            this.timeout = setTimeout(function(){ _this.timer(counter) }, 1000);

        } else if(stateChanged == true){

             // Logging
             if(typeof console == 'object'){
                 console.log('The observed object has changed it\'s state. Canceling and triggering action.');
             }

            // Canceling the loop
            this.cancel();

             // Triggering the action
             this.params.action.execute();

        } else {

             // Logging
             if(typeof console == 'object'){
                 console.log('Operation timed out. The observed object has not changed it\'s state. Canceling...');
             }

            // Canceling the loop
            this.cancel();
        }
   }

   /**
    * The method prepares the requirements to start the timer
    *
    * @param {Void}
    * @return void
    */
   this.beginProcess = function(){

        // Checking if we have a loading screen
        if(this.loadScr !== null){
            this.loadScr.show();

             // Logging
             if(typeof console == 'object'){
                 console.log('Loading screen activated.');
             }
        }

        // Starting the timer
        this.timer();

        // Logging
        if(typeof console == 'object'){
            console.log('Timer started.');
        }
   }

   /**
    * The method cancels the counter
    *
    * @param {Void}
    * @return void
    */
   this.cancel = function(){

        // Checking if we have a loading screen
        if(this.loadScr !== null){
            this.loadScr.destroy();

            // Logging
            if(typeof console == 'object'){
                console.log('Loading screen destroyed.');
            }
        }

        // Clearing the timeout ID
        if(this.timeout != null){

            clearTimeout(this.timeout);
        }

        // Logging
        if(typeof console == 'object'){
            console.log('Timer canceled.');
        }
   }

    // Checking the document ready flag
    if(this.params.documentReady == true){

        // Aliasing the 'this' keyword
        var _this = this;

        // Getting the initial value of the object value
        $(document).ready(function(){

            // Initializing
            _this.init();
        });

    } else {

        // Initializing
        this.init();
    }
}