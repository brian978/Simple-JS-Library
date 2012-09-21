/**
 *
 * Simple class that can be used to build a page with infinite scroll
 *
 * @author Brian
 * @link https://github.com/brian978
 * @copyright 2012
 * @license Creative Commons Attribution-ShareAlike 3.0
 *
 * @name DataSender
 * @version 1.1
 *
 */

/**
 * Used to submit a set of data and then put the response in a container
 *
 * @param {Object} params
 * @return void
 */
function DataSender(params)
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
    // By default response is not treated as JSON
    if(!isset(this.params.jsonResponse)) {
        this.params.jsonResponse = false;
    }

    // By default no function will inspect the AJAX response
    if(!isset(this.params.inspectResponse)) {
        this.params.inspectResponse = false;

    } else if(this.params.inspectResponse === true) {

        // Checking if an inspector function name has been set
        if(!isset(this.params.inspectorFunc)){
            this.params.inspectResponse = false;
        }
    }

    // By default no function is called
    if(!isset(this.params.callFunc)) {
        this.params.callFunc = false;

    } else if(this.params.callFunc === true) {

        // Checking if a function name has been set
        if(!isset(this.params.funcName)){
            this.params.callFunc = false;

        } else {

            // By default the params is an empty array
            if(!isset(this.params.funcParams)){
                this.params.funcParams = new Array();
            }
        }
    }

    // By default not container will be populated
    if(!isset(this.params.targetContainer)) {
        this.params.targetContainer = false;
    }

    // By default loading screen is active
    if(!isset(this.params.loadingScreen)) {
        this.params.loadingScreen = true;
    }

    // By default the last Action is not registered
    if(!isset(this.params.lastAction)) {
        this.params.lastAction = false;
    }

    /**
     * -----------------------------------------
     * SHORTCUTS WITH DEFAULT VALUES
     * -----------------------------------------
     */
    // URL
    if(isset(this.params.url)){
        this.url = this.params.url;
    } else {
        this.url = '';
    }

    // Data
    this.data = new String();

    // Type
    this.type = typeof this.params.type !== 'undefined' ? this.params.type : "POST";

    // Timeout
    this.timeout = typeof this.params.timeout !== 'undefined' ? this.params.timeout : 20; // Seconds

    /**
     * -----------------------
     * REQUEST DATA PROCESS
     * -----------------------
     */
    // Building the data for the submit
    for(var index in this.params.data){

        // Adding the data to the data string
        this.data += index + '=' + this.params.data[index] + '&';
    }

    // Checking the data string
    if(this.data.length > 0){

        // Removing the last "&" sign
        this.data.substr(0, this.data.length-1);
    }

    /**
     * Makes the request
     *
     * @param {Void}
     * @return void
     */
    this.execute = function (){

        // Aliasing the 'this' keyword
        var _this = this;

        // Creating a loading screen object
        if(this.params.loadingScreen === true){
            var loadScreen = new LoadingScreen({
                'opacity': 0.3
            });
        }

        /**
         * -----------------------
         * MAKING THE REQUEST
         * -----------------------
         */
        // AJAX - Submitting the lists data
        $.ajax({
        url: this.url,
        type: this.type,
        data: this.data,
        timeout: (this.params.ajaxTimeout * 1000), // value in milliseconds
        beforeSend: function(){

            // Showing the loading screen
            if(_this.params.loadingScreen === true){
                loadScreen.show();
            }
        },
        success: function(jqXHR){

                // Flag that is used to determine if the response should be further processed
                var processResponse = true;

                // Checking if the last action should be registered
                if(_this.params.lastAction === true){

                    LastAction.register(_this, 'execute');
                }

                // Checking if the response should be inspected
                if(_this.params.inspectResponse === true){

                    // Evaluation string when a function should be called
                    processResponse = eval(_this.params.inspectorFunc + '(jqXHR)');
                }

                // Checking the flag
                if(processResponse === true){

                    // Response
                    var response;

                    // Checking if this is a JSON response
                    if(_this.params.jsonResponse === true){

                        try{
                            response = jQuery.parseJSON(jqXHR);
                        } catch (e){}

                    } else{
                        response = jqXHR;
                    }

                    // Checking if we should call e function and pass it the response
                    if(_this.params.callFunc === true){

                            // Adding the response to the function params
                            _this.params.funcParams.push(response);

                            // Default string evaluate
                            var evalStr = '';

                            // Checking if we have an object instance
                            if(isset(_this.params.objectInstance)){

                                // Evaluation string then an object must be called
                                evalStr = '_this.params.objectInstance.' + _this.params.funcName + '.apply(_this.params.objectInstance, _this.params.funcParams)';

                            } else {

                                // Evaluation string when a function should be called
                                evalStr = _this.params.funcName + '.apply(null, _this.params.funcParams)';

                            }

                            // Calling the function that needs to be triggered
                            eval(evalStr);
                    }

                    // Checking the target container params
                    if(_this.params.targetContainer !== false){

                        // Addding the response to the target container
                        _this.params.targetContainer.html(response);
                    }
                }
        },
        error: function(jqXHR, textStatus, errorThrown){

            // Showing an error
            alert('An error has occured with the following message: ' + errorThrown);
        },
        complete: function(){

            // Destroying the loading screen
            if(_this.params.loadingScreen === true){
                loadScreen.destroy();
            }
        }});
    }
}