/**
 *
 * @author Brian
 * @link https://github.com/brian978
 * @copyright 2012
 * @license Creative Commons Attribution-ShareAlike 3.0
 *
 * @name LinkedSelects
 * @version 1.2
 *
 */

/**
 * The class is used to link 2 select boxes together
 *
 * @param {Object} params
 * @return void
 */
function LinkedSelects(params)
{
    // Closure
    var _this = this;

    this.params     = params || new Object();
    this.links      = new Array();
    this.buttons    = new Array(); // Holds the links between the buttons and the selects

    /**
     * Initializes the object
     *
     * @param {Void}
     * @return void
     */
    this.init = function(){
        $(document).ready(function(){
            if(isset(_this.params.selects[0])){
                for(var i in _this.params.selects){
                    _this.linkSelects(_this.params.selects[i], i);
                }
            }
        });
    }

    /**
     * Links 2 select boxes
     *
     * @param {Object} elements
     * @param {Integer} index
     * @return void
     */
    this.linkSelects = function(elements, index){

        // Getting the element objects
        var parentElement = $('#' + elements.parent);
        var childElement  = $('#' + elements.child);

        // If the elements are not present we do nothing
        if(isset(parentElement) && isset(childElement))
        {
            // Linking the elements
            _this.links[elements.parent] = childElement;
            _this.links[elements.child]  = parentElement;

            // Replacing the elements with the objects
            elements.parent = parentElement;
            elements.child  = childElement;

            // Logging
            if(typeof console == 'object'){
                console.log('Initialized the select boxes');
            }

            // Setting the events
            _this.setupEvents(elements);

            // Setting the buttons
            if(isset(_this.params.buttons[index])){
                _this.setupButtons(_this.params.buttons[index], elements);
            }
        }
        else
        {
            // Logging
            if(typeof console == 'object'){
                console.log('Failed to initialize the select boxes (make sure they exist)');
            }
        }
    }

    /**
     * Adds the buttons for the select boxes
     *
     * @param {Object} buttons
     * @param {Object} elements
     * @return void
     */
    this.setupButtons = function(buttons, elements){

        // Getting the element objects
        var fromParentButton = $('#' + buttons.parent);
        var fromChildButton  = $('#' + buttons.child);

        // If the elements are not present we do nothing
        if(isset(fromParentButton) && isset(fromChildButton))
        {
            // Linking the elements
            _this.buttons[buttons.parent] = elements.parent;
            _this.buttons[buttons.child]  = elements.child;

            // Replacing the elements with the objects
            buttons.parent = fromParentButton;
            buttons.child  = fromChildButton;

            // Logging
            if(typeof console == 'object'){
                console.log('Initialized the buttons');
            }

            // Setting the events
            _this.setupButtonEvents(buttons);
        }
        else
        {
            // Logging
            if(typeof console == 'object'){
                console.log('Failed to initialize the buttons (make sure they exist)');
            }
        }
    }

    /**
     * Sets up the event handlers
     *
     * @param {Object} elements
     * @return void
     */
    this.setupEvents = function(elements){

        // Event for the parent select
        elements.parent.bind('dblclick', function(){
            _this.processClick(elements.parent);
        });

        // Event for the child select
        elements.child.bind('dblclick', function(){
            _this.processClick(elements.child);
        });

        // Logging
        if(typeof console == 'object'){
            console.log('Double click events have been set up for "' + elements.parent.attr('id') + '" and "' + elements.child.attr('id') + '"');
        }
    }

    /**
     * Sets up the event handlers for the buttons
     *
     * @param {Object} buttons
     * @return void
     */
    this.setupButtonEvents = function(buttons){

        var parentId = buttons.parent.attr('id');
        var childId  = buttons.child.attr('id');

        // Event for the parent btn
        buttons.parent.bind('click', function(){
            _this.processClick(_this.buttons[parentId]);
        });

        // Event for the child btn
        buttons.child.bind('click', function(){
            _this.processClick(_this.buttons[childId]);
        });

        // Logging
        if(typeof console == 'object'){
            console.log('Button events have been set up for "' + parentId + '" and "' + childId + '"');
        }
    }

    /**
     * Processes the click action
     *
     * @param {Object} element
     * @return void
     */
    this.processClick = function(element){

        $(element).find('option:selected').each(function(){
            var selectedOption  = $(this);
            var optionInnerHtml = selectedOption.html();

            if(optionInnerHtml.trim() != ''){

                var linkedElement = _this.links[element.attr('id')];
                var scrollTop     = linkedElement.scrollTop();

                // Removing the selected index from the select box
                selectedOption.remove();

                // Checking if we know were to move the element
                linkedElement.append(_this.createOption(optionInnerHtml, _this.getAttributes(selectedOption)));

                // Sorting the options of the destination elements
                _this.sortOptions(linkedElement);

                // Setting the scroll bar where it should be
                linkedElement.scrollTop(scrollTop);
            }
        });
    }

    /**
     * Sorts the options of an element
     *
     * @param {Object} selectBox
     * @return void
     */
    this.sortOptions = function(selectBox){

        var attributes  = new Array();
        var sortable    = new Array();
        var text        = null;
        var options     = selectBox.find('option');
        var option      = null

        options.each(function(index){
            option           = $(this);
            text             = option.html();
            attributes[text] = _this.getAttributes(option);
            sortable[index]  = text;
        });

        // Sorting
        sortable.sort();

        // Rebuilding the option list
        for(var i in sortable){
            text   = sortable[i];
            option = $(options.get(i));
            option.html(text);
        }

        // Logging
        if(typeof console == 'object'){
            console.log('Sorting the elements in the select box with ID "' + selectBox.attr('id') + '"');
            console.log('##############################################################################');
        }
    }

    /**
     * Creates an option element using the given data
     *
     * @param {String} text
     * @param {Array} attributes
     * @return object
     */
    this.createOption = function(text, attributes){

        // Creating the option
        var option = $('<option>' + text + '</option>');

        // Moving the attributes
        for(var nodeName in attributes){
            option.attr(nodeName, attributes[nodeName]);
        }

        return option;
    }

    /**
     * The method retrieves all the attributes of an element
     *
     * @param {Object} element
     * @return array
     */
    this.getAttributes = function(element){

        var nodeMap     = element[0].attributes;
        var attributes  = new Array();

        for(var i=0; i < nodeMap.length; i++){

            // The item is an object from the map
            var item                    = nodeMap.item(i);
            attributes[item.nodeName]   = item.nodeValue;
        }

        return attributes;
    }
}