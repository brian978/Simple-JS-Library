(function($){

    /**
     * Function used to build the error style box
     *
     * @param {Void}
     * @return void
     */
    $.fn.errorWidget = function (){

        // The string
        var box = '';
        box += '<div class="ui-state-error ui-corner-all" style="padding-left: 0.7em; padding-right: 0.7em; height: 20px; margin-bottom: 2px;">';
        box += '<p>';
        box += '<span class="ui-icon ui-icon-alert" style="float: left; margin-right: 0.3em;"/>';
        box += '<strong style="vertical-align: middle;">' + this.html() + '</strong>';
        box += '</p>';
        box += '</div>';

        // Replacing the object with the generated box
        this.html(box);
    }

    /**
     * Function used to build the highlight style box
     *
     * @param {Void}
     * @return void
     */
    $.fn.highlightWidget = function (){

        // The string
        var box = '';
        box += '<div class="ui-state-highlight ui-corner-all" style="padding-left: 0.7em; padding-right: 0.7em; height: 20px; margin-bottom: 2px;">';
        box += '<p>';
        box += '<span class="ui-icon ui-icon-info" style="float: left; margin-right: 0.3em;"/>';
        box += '<strong style="vertical-align: middle;">' + this.html() + '</strong>';
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
        box += '<strong style="vertical-align: middle;">' + string + '</strong>';
        box += '</p>';
        box += '</div>';

        // Replacing the object with the generated box
        return box;
}

/**
 * Function used to build the highlight style box
 *
 * @param {Void}
 * @return void
 */
jQuery.highlightWidgetString = function (string){

        // The string
        var box = '';
        box += '<div class="ui-state-highlight ui-corner-all" style="padding-left: 0.7em; padding-right: 0.7em; height: 20px; margin-bottom: 2px;">';
        box += '<p>';
        box += '<span class="ui-icon ui-icon-info" style="float: left; margin-right: 0.3em;"/>';
        box += '<strong style="vertical-align: middle;">' + string + '</strong>';
        box += '</p>';
        box += '</div>';

        // Replacing the object with the generated box
        return box;
}