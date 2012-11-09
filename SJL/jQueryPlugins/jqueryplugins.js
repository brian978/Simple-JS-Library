/**
 * Function used to build the error style box
 *
 * @param {Void}
 * @return void
 */
(function($){

    $.fn.errorWidget = function (){

        // The string
        var box = '';
        box += '<div class="ui-state-error ui-corner-all" style="padding-left: 0.7em; padding-right: 0.7em; height: 20px; margin-bottom: 2px;">';
        box += '<p>';
        box += '<span class="ui-icon ui-icon-alert" style="float: left; margin-right: 0.3em;"/>';
        box += '<strong>' + this.html() + '</strong>';
        box += '</p>';
        box += '</div>';

        // Replacing the object with the generated box
        this.html(box);

    }

})(jQuery);

/**
 * Function used to build the error style box
 *
 * @param {Void}
 * @return void
 */
jQuery.errorWidgetString = function (string){

        // The string
        var box = '';
        box += '<div class="ui-state-error ui-corner-all" style="padding-left: 0.7em; padding-right: 0.7em; height: 20px; margin-bottom: 2px;">';
        box += '<p>';
        box += '<span class="ui-icon ui-icon-alert" style="float: left; margin-right: 0.3em;"/>';
        box += '<strong>' + string + '</strong>';
        box += '</p>';
        box += '</div>';

        // Replacing the object with the generated box
        return box;

}