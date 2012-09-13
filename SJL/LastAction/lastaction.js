/**
 *
 * Class that stores the last action than allows you to execute it again
 *
 * @author Brian
 * @link https://github.com/brian978
 * @copyright 2012
 * @license Creative Commons Attribution-ShareAlike 3.0
 *
 * @name LastAction
 * @version 1.0
 *
 */

/**
 * Class constructor
 *
 * @param {Void}
 * @return void
 */
function LastAction(){}

/**
 * Used to register the last action
 *
 * @param {Object} objInstance
 * @param {String} methodName
 * @param {Array} params
 * @return void
 */
LastAction.register = function(objInstance, methodName, params){

    // Object instance
    LastAction.objInstance = objInstance || null;

    // Method name
    LastAction.methodName = methodName || null;

    // Params
    LastAction.params = params || new Array();

    // Logging
    if(typeof console == 'object'){
        console.log('Function has been registered. With parameters: ' + LastAction.objInstance + '(objInstance), ' + LastAction.methodName + '(methodName), ' + LastAction.params + '(params)');
    }
}

/**
 * Executes the last action
 *
 * @param {Void}
 * @return boolean
 */
LastAction.execute = function(){

    // Check var
    var executed = false;

    // Waiting for the document to be ready
    $(document).ready(function(){
        // Checking if we have the required parameters
        if(isset(LastAction.methodName)){

            // Default string value
            var evalStr = LastAction.methodName + '.apply(';

            // Checking if the objInstance is set
            if(isset(LastAction.objInstance)){
                evalStr = 'LastAction.objInstance.' + evalStr + 'LastAction.objInstance, ';
            } else {
                evalStr += 'null, ';
            }

            // Adding the rest of the elements for the string
            evalStr += 'LastAction.params);';

            // Logging
            if(typeof console == 'object'){
                console.log(evalStr);
            }

            // Evaluating the string
            eval(evalStr);

            // Setting the flag
            executed = true;
        } else {

            // Logging
            if(typeof console == 'object'){
                console.log('The LastAction.methodName variable is not set. Value is: ' + LastAction.methodName);
            }
        }
    });

    // Returning the result
    return executed;
}