/**
 * Function checks if a variable exists
 *
 * @param {Mixed} variable
 * @return void
 */
function isset(variable){

    if(typeof variable !== 'undefined' && variable !== null){

        return true;

    } else {

        return false;
        
    }
}