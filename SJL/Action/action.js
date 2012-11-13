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
 * @version 2.0
 *
 */

/**
 * Class constructor
 *
 * @param {Void}
 * @return void
 */
function Action(){

    /**
     * Used to register the last action
     *
     * @param {Object} objInstance
     * @param {String} methodName
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
        if(typeof console == 'object'){
            console.log('Function has been registered');
//            console.log('Parameters: ' + this.objInstance + '(objInstance), ' + this.methodName + '(methodName), ' + this.params + '(params)');
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
        }
    }

    /**
     * Gets the params
     *
     * @param {Void}
     * @return void
     */
    this.get = function(){
        return this.params;
    }

    /**
     * Executes the registered action
     *
     * @param {Void}
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

                    // Default string value
                    var evalStr = _this.methodName + '.apply(';

                    // Setting the object instance
                    if(isset(_this.objInstance)){
                        evalStr = '_this.objInstance.' + evalStr + '_this.objInstance, ';
                    } else {
                        evalStr += 'null, ';
                    }

                    // Adding the rest of the elements for the string
                    evalStr += '_this.params);';

                    // Logging
                    if(typeof console == 'object'){
                        console.log(evalStr);
                    }

                    // Evaluating the string
                    eval(evalStr);

                    // Setting the flag
                    _this.executed = true;

                } else {

                    // Logging
                    if(typeof console == 'object'){
                        console.log('The last action can only be executed once.');
                    }

                }

            } else {

                // Logging
                if(typeof console == 'object'){
                    console.log('The Action.methodName variable is not set. Value is: ' + _this.methodName);
                }
            }
        });

        // Returning the result
        return _this.executed;
    }
}