/**
 *
 * Simple class that can be used to build a dialog
 *
 * @author Brian
 * @link https://github.com/brian978
 * @copyright 2012
 * @license Creative Commons Attribution-ShareAlike 3.0
 *
 * @name DialogCreator
 * @version 1.0
 *
 */

/**
 * Used to create a dialog
 *
 * @param {Object} params
 * @param {String} contents
 * @return void
 */
function DialogCreator(params, contents)
{
    // Transfering the params
    if(typeof params !== 'undefined'){
        this.params = params;
    } else{
        this.params = new Object();
    }

    // Transfering the contents
    if(typeof contents !== 'undefined'){
        this.contents = contents;
    } else{
        this.contents = new Object();
    }

    // Body element
    this.body = document.getElementsByTagName('body')[0];

    // Dialog instance
    this.dialog = null;

    // Flag for created
    this.created = false;

    // Flag for opened
    this.opened = false;

    /**
     * --------------------
     * DEFAULT PARAMETERS
     * --------------------
     */
    // By default the dialog id is "dialogCreator"
    if(!isset(this.params.dialogId)) {
        this.params.dialogId = 'dialogCreator';
    }

    // By default the dialog title is "Dialog"
    if(!isset(this.params.dialogTitle)) {
        this.params.dialogTitle = 'Dialog';
    }

    // By default the dialog doesn't disable the close event
    if(!isset(this.params.disableClose)) {
        this.params.disableClose = false;
    }

    // By default the dialog opens automatically
    if(!isset(this.params.autoOpen)) {
        this.params.autoOpen = true;
    }

    // By default the dialog has no buttons
    if(!isset(this.params.buttons)) {
        this.params.buttons = {};
    }

    // By default the dialog has a modal screen
    if(!isset(this.params.modal)) {
        this.params.modal = true;
    }

    // By default the dialog width is auto
    if(!isset(this.params.dialogWidth)) {
        this.params.dialogWidth = "auto";
    }

    // By default the dialog height is 300
    if(!isset(this.params.dialogHeight)) {
        this.params.dialogHeight = "auto";
    }

    // By default the dialog is resizable
    if(!isset(this.params.resizable)) {
        this.params.resizable = true;
    }

    // By default we show a loading screen
    if(!isset(this.params.loadingScreen)) {
        this.params.loadingScreen = true;
    }

    // By default the dialog will destroy on close
    if(!isset(this.params.destroyOnClose)) {
        this.params.destroyOnClose = true;
    }

    /**
     * Creats the dialog
     *
     * @param {Void}
     * @return {Void}
     */
    this.create = function(){

        // Aliasing the 'this' keyword
        var _this = this;

        // Checking if the dialog is opened of not
        if(_this.created == false){

            // Default for the loading screen var
            var loadScreen = false;

            // Creating a loading screen object
            if(_this.params.loadingScreen === true){
                loadScreen = new LoadingScreen({
                    'opacity': 0.3
                });

                loadScreen.show();
            }

            // Creating the DOM element
            _this.dialog = document.createElement('div');

            // Setting the ID
            _this.dialog.setAttribute('id', _this.params.dialogId);

            // Adding the contents
            _this.dialog.innerHTML = _this.contents;

            // Appending the dialog to the body
            _this.body.appendChild(_this.dialog);

            // Creating the dialog
            $(_this.dialog).dialog({
               beforeClose: function(event, ui){

                   // Checking if closing should be disabled
                   if(_this.params.disableClose == true){

                       return false;
                   }

                   return true;
               },
               open: function(event, ui){

                    if(loadScreen !== false){
                        loadScreen.destroy();
                    }
               },
               close: function(event, ui){

                    if(_this.params.destroyOnClose == true){

                        _this.destroy();

                    }
               },
               title: _this.params.dialogTitle,
               buttons: _this.params.buttons,
               modal: _this.params.modal,
               width: _this.params.dialogWidth,
               height: _this.params.dialogHeight,
               resizable: _this.params.resizable
            });

            // Setting the flag
            this.created = true;

            // Checking if autoopen
            if(_this.params.autoOpen == true){
                _this.opened = true;

                $(_this.dialog).dialog("open");
            }
        }
    }

    /**
     * Opens the dialog
     *
     * @param {Void}
     * @return {Void}
     */
    this.open = function(){

        // Aliasing the 'this' keyword
        var _this = this;

        // Checking if the dialog is opened of not
        if(_this.opened == false){

            if(_this.params.destroyOnClose){
                _this.create();

                if(_this.params.autoOpen == false){
                    $(_this.dialog).dialog("open");
                }

            } else {
                $(_this.dialog).dialog("open");
            }

            // Setting the flag
            this.opened = true;
        }
    }

    /**
     * Closes the dialog
     *
     * @param {Void}
     * @return {Void}
     */
    this.close = function(){

        // Aliasing the 'this' keyword
        var _this = this;

        // Checking if the dialog is opened of not
        if(_this.opened == true){

            if(_this.params.destroyOnClose == true){

                $(_this.dialog).dialog("close");

                _this.destroy();

            } else {
                $(_this.dialog).dialog("close");
            }

            // Setting the flag
            this.opened = false;
        }
    }

    /**
     * Destroys the dialog
     *
     * @param {Void}
     * @return {Void}
     */
    this.destroy = function(){

        // Aliasing the 'this' keyword
        var _this = this;

        // Checking if the dialog is opened of not
        if(_this.created == true){
            $(_this.dialog).dialog("destroy");

            // Removing the dialog from the body
            _this.body.removeChild(_this.dialog);

            // Setting the flag
            this.created = false;
        }
    }
}