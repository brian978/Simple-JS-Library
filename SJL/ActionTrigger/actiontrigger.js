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

   /**
    * The method gets the info about the observed object
    *
    * @param {Void}
    * @return void
    */
   this.init = function(){

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

        // Getting the observed object type
        this.getObjectType();

        // Getting the initial value of the object value
        this.getObjectValue();

        // Starting the counter
        this.beginProcess();
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
    * The method acts like a timer and checks if the observed object has changed it's value
    *
    * @param {Number} counter
    * @return void
    */
   this.startTimer = function(counter){

       // Counter variable
       var counter = counter || 0;
   }

   /**
    * The method starts the counter
    *
    * @param {Void}
    * @return void
    */
   this.beginProcess = function(){

       // Checking if we have a loading screen
       if(this.loadScr !== null){
           this.loadScr.show();
       }

       // Starting the timer
       this.startTimer();
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
       }

        // Clearing the timeout ID
        if(this.timeout != null){

            clearTimeout(this.timeout);
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