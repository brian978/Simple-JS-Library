/**
 *
 * @author Brian
 * @link https://github.com/brian978
 * @copyright 2012
 * @license Creative Commons Attribution-ShareAlike 3.0
 *
 * @name LinkedSelects
 * @version 1.4
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

    this.params  = params || new Object();

    // Links between the selects Array( selectId => linkedSelectObj )
    this.links   = new Array();

    // Holds the links between the buttons and the selects Array( buttonId => linkedSelectObj )
    this.buttons = new Array();

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
            this.links[elements.parent] = childElement;
            this.links[elements.child]  = parentElement;

            // Replacing the elements with the objects
            elements.parent = parentElement;
            elements.child  = childElement;

            // Logging
            if(logMessages()){
                console.log('Initialized the select boxes');
            }

            // Setting the events
            this.setupEvents(elements);

            // Setting the buttons
            if(isset(this.params.buttons) && isset(this.params.buttons[index])){
                this.setupButtons(this.params.buttons[index], elements);
            }
        }
        else
        {
            // Logging
            if(logMessages()){
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

        // Getting the button objects
        var parentButton = $('#' + buttons.parent);
        var childButton  = $('#' + buttons.child);

        // If the elements are not present we do nothing
        if(isset(parentButton) && isset(parentButton))
        {
            // Linking the buttons to the elements they target
            this.buttons[buttons.parent] = elements.parent;
            this.buttons[buttons.child]  = elements.child;

            // Replacing the elements with the objects
            buttons.parent = parentButton;
            buttons.child  = childButton;

            // We check if they actually exist in the setupButtonsEvents method
            buttons.parentAll = $('#' + buttons.parentAll);
            buttons.childAll  = $('#' + buttons.childAll);

            // Logging
            if(logMessages()){
                console.log('Initialized the buttons');
            }

            // Setting the events
            this.setupButtonEvents(buttons);
        }
        else
        {
            // Logging
            if(logMessages()){
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

        // For visual feedback we need to remove the selected options of a select box
        // when the focus is on the other select box
        elements.parent.bind('focus', function(){
            elements.child.find('option:selected').removeAttr('selected');
        });

        // For visual feedback we need to remove the selected options of a select box
        // when the focus is on the other select box
        elements.child.bind('focus', function(){
            elements.parent.find('option:selected').removeAttr('selected');
        });

        // Logging
        if(logMessages()){
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

        // Event for the parent all
        if(isset(buttons.parentAll) && buttons.parentAll instanceof jQuery){
            buttons.parentAll.bind('click', function(){
                _this.processClick(_this.buttons[parentId], 'option', false);
            });
        }

        // Event for the child all
        if(isset(buttons.childAll) && buttons.childAll instanceof jQuery){
            buttons.childAll.bind('click', function(){
                _this.processClick(_this.buttons[childId], 'option', false);
            });
        }

        // Logging
        if(logMessages()){
            console.log('Button events have been set up for "' + parentId + '" and "' + childId + '"');
        }
    }

    /**
     * Processes the click action
     *
     * @param {Object} element
     * @param {String} findWhat
     * @param {Boolean} doSort
     * @return void
     */
    this.processClick = function(element, findWhat, doSort){

        var linkedElement   = this.links[element.attr('id')];
        var find            = findWhat || 'option:selected';
        var sort            = isset(doSort) ? doSort : true;
        var moved           = false;

        $(element).find(find).each(function(){

            var selectedOption  = $(this);
            var optionInnerHtml = selectedOption.html();

            if(optionInnerHtml.trim() != ''){

                var scrollTop = linkedElement.scrollTop();

                // Removing the selected index from the select box
                selectedOption.remove();

                // Checking if we know were to move the element
                linkedElement.append(_this.createOption(optionInnerHtml, _this.getAttributes(selectedOption)));

                // Setting the scroll bar where it should be
                linkedElement.scrollTop(scrollTop);

                // For a little visual feedback we focus on the select where we moved the elements
                linkedElement.focus();

                // Flag so that we do the sorting only once
                moved = true;
            }
        });

        // Sorting the options of the destination elements
        if(moved === true && sort === true){
            this.sortOptions(linkedElement);
        }
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
        if(logMessages()){
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