/**
 *
 * Class that stores an action and allows you to call it again in case the process gets interrupted
 *
 * @author Brian
 * @link https://github.com/brian978
 * @copyright 2012
 * @license Creative Commons Attribution-ShareAlike 3.0
 *
 * @name Action
 * @version 2.1
 *
 */

/**
 * Class constructor
 *
 * @return void
 */
function Action(){

    /**
     * Used to register the last action
     *
     * @param {Object} objInstance
     * @param methodName
     * @param {Array} params
     * @return object
     */
    this.register = function(objInstance, methodName, params){

        // Executed status
        this.executed = false;

        // Object instance
        this.objInstance = objInstance || null;

        // Method name
        this.methodName = methodName || null;

        // Params
        this.params = params || new Array();

        // Logging
        if(logMessages()){
            console.log('Function has been registered');
        }

        return this;
    }

    /**
     * Changes the params
     *
     * @param {Array} params
     * @return void
     */
    this.set = function(params){
        if(typeof params !== 'undefined'){
            this.params = params;

            // If the parameters have changed then the action could have different outcome
            // so we need to reset the executed status
            this.reset();
        }
    }

    /**
     * Gets the params
     *
     * @return array
     */
    this.get = function(){
        return this.params;
    }

    /**
     * Resets the executed flag
     *
     * @return void
     */
    this.reset = function(){
        this.executed = false;
    }

    /**
     * Executes the registered action
     *
     * @return boolean
     */
    this.execute = function(){

        // Aliasing the 'this' keyword
        var _this = this;

        // Waiting for the document to be ready
        $(document).ready(function(){

            // Checking if we have the required parameters
            if(isset(_this.methodName)){

                // Checking if the last action was executed already or not
                if(_this.executed === false){

                    if(typeof _this.methodName == 'string')
                    {
                        // Default string value
                        var evalStr = _this.methodName + '.apply(';

                        // Setting the object instance
                        if(isset(_this.objInstance))
                        {
                            evalStr = '_this.objInstance.' + evalStr + '_this.objInstance, ';
                        }
                        else
                        {
                            evalStr += 'null, ';
                        }

                        // Adding the rest of the elements for the string
                        evalStr += '_this.params);';

                        // Logging
                        if(logMessages()){
                            console.log(evalStr);
                        }

                        // Evaluating the string
                        eval(evalStr);

                        // Setting the flag
                        _this.executed = true;
                    }
                    // Anonymous functions can only be called if a object instance is not given
                    else if(!isset(_this.objInstance))
                    {
                        _this.methodName(_this.params);

                        // Setting the flag
                        _this.executed = true;
                    }

                } else {

                    // Logging
                    if(logMessages()){
                        console.log('The last action can only be executed once.');
                    }

                }

            } else {

                // Logging
                if(logMessages()){
                    console.log('The Action.methodName variable is not set. Value is: ' + _this.methodName);
                }
            }
        });

        // Returning the result
        return _this.executed;
    }
}