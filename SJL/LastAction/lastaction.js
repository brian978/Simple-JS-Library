/**
 *
 * Class that stores the last action and allows you to call it again in case the process gets interrupted
 *
 * @author Brian
 * @link https://github.com/brian978/Simple-JS-Library
 * @copyright 2012
 * @license Creative Commons Attribution-ShareAlike 3.0
 *
 * @name LastAction
 * @version 1.0.1
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

    // Action
    if(typeof LastAction.action == 'undefined'){
        LastAction.action = new Action();
    }

    // Registering the action
    LastAction.action.register(objInstance, methodName, params);
}

/**
 * Executes the last action
 *
 * @param {Void}
 * @return boolean
 */
LastAction.execute = function(){

    // Executing and returning the result
    return LastAction.action.execute();
}