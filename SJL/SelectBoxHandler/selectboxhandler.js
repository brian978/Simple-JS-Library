/**
 * WARNING: This class works only with Firefox (was not able to make it work cross-browser) and it will NOT be autoloaded
 *
 * @author Brian
 * @link https://github.com/brian978
 * @copyright 2012
 * @license Creative Commons Attribution-ShareAlike 3.0
 *
 * @name SelectBoxHandler
 * @version 1.0
 *
 */

/**
 * The class is designed to inhibit the default actions of the browser for multiple select boxes
 *
 * @param {Object} params
 * @return void
 */
function SelectBoxHandler(params)
{
    // Class params
    this.params = params || new Object();

    // Selected options
    this.options = new Array();

    // The clicked element of the select box
    this.target = null;

    /**
     * Initializes the object
     *
     * @param {Void}
     * @return void
     */
    this.init = function(){

        // Closure for this object
        var _this = this;

        // We need an ID so that we can create an object
        if(isset(this.params.id) && !isset(this.obj)){
            this.obj = document.getElementById(this.params.id);
            this.setOptionsState();
        }

        // Adding the event listener for the specified select box
        if(isset(this.obj)){
            this.obj.addEventListener('click', function(e){
                _this.handleClick(e);
            });

            this.obj.addEventListener('click', function(e){
                _this.setOptionsState();
            });
        }

        // Logging
        if(typeof console === 'object'){
            console.log('The SelectBoxHandler object has been initialized');
        }
    }

    /**
     * The method is executed when a click event is triggered
     *
     * @param {Object} e The event object
     * @return void
     */
    this.handleClick = function(e){

        this.getTarget(e);

        // Value of the last clicked target
        var value = this.target.getAttribute('value');

        // Selected index of the select box
        var selectedIndex = this.obj.selectedIndex;

        // Setting the select state
        if(this.options[selectedIndex] != 1){
            this.options[selectedIndex] = 1;
        } else {
            this.options[selectedIndex] = 0;
        }

        // Logging
        if(typeof console === 'object'){
            console.log('The value of the clicked target is: ' + value);
            console.log('Selected index: ' + selectedIndex);
        }
    }

    /**
     * The method determins the last clicked target
     *
     * @param {Object} e The event object
     * @return void
     */
    this.getTarget = function(e){

        // Getting the event object
        var event = e || window.event;

        // Trying to determine the target
        if(event.target){
            this.target = event.target;
        }
    }

    /**
     * The method sets the selected items
     *
     * @param {Void}
     * @return void
     */
    this.setOptionsState = function(){

        // We need to get the scroll bar position because after the selects
        // it resets
        var scrollTop = $(this.obj).scrollTop();

        for(var i in this.obj.options){

            if(isNaN(i)){
                continue;
            }

            var option = this.obj.options[i];
            var value = option.value;

            if(this.options[i] === 1){

                // Setting the selected status
                option.selected = 'selected';

                // Logging
                if(typeof console === 'object'){
                    console.log('The state of the element with value "' + value + '" and index "' + i + '" has been changed to selected');
                }

            } else if(this.options[i] === 0){

                // Removing the attribute
                option.selected = '';

                // Logging
                if(typeof console === 'object'){
                    console.log('Setting the select state of the element was removed');
                }
            } else if (!isset(this.options[i])){

                // Logging
                if(typeof console === 'object'){
                    console.log('Setting option with index ' + i + ' to 2');
                }

                this.options[i] = 2;
            }
        }

        // Setting the scroll bar where it should be
        $(this.obj).scrollTop(scrollTop);
    }
}