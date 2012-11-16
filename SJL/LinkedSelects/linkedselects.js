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
    this.params     = params || new Object();
    this.links      = new Array();

    /**
     * Initializes the object
     *
     * @param {Void}
     * @return void
     */
    this.init = function(){
        if(isset(this.params.selects[0])){
            for(var i in this.params.selects){
                this.linkSelects(this.params.selects[i]);
            }
        } else {
            this.linkSelects(this.params.selects);
        }
    }

    /**
     * Links 2 select boxes
     *
     * @param {Object} elements
     * @return void
     */
    this.linkSelects = function(elements){

        // Getting the element objects
        var parentElement = $('#' + elements.parent);
        var childElement  = $('#' + elements.child);

        // If the elements are not present we do nothing
        if(parentElement !== null && childElement !== null)
        {
            // Linking the elements
            this.links[elements.parent] = childElement;
            this.links[elements.child]  = parentElement;

            // Replacing the elements with the objects
            elements.parent = parentElement;
            elements.child  = childElement;

            // Setting the events
            this.setupEvents(elements);
        }
    }

    /**
     * Sets up the event handlers
     *
     * @param {Object} elements
     * @return void
     */
    this.setupEvents = function(elements){

        var _this = this;

        elements.parent.bind('dblclick', function(){
            _this.processClick(elements.parent);
        });

        elements.child.bind('dblclick', function(){
            _this.processClick(elements.child);
        });
    }

    /**
     * Processes the click action
     *
     * @param {Object} element
     * @return void
     */
    this.processClick = function(element){

        var selectedOption  = $(element).find('option:selected');
        var optionInnerHtml = selectedOption.html();

        if(optionInnerHtml.trim() != ''){

            var linkedElement = this.links[element.attr('id')];
            var scrollTop     = linkedElement.scrollTop();

            // Removing the selected index from the select box
            selectedOption.remove();

            // Checking if we know were to move the element
            linkedElement.append(this.createOption(optionInnerHtml, this.getAttributes(selectedOption)));

            // Sorting the options of the destination elements
            this.sortOptions(linkedElement);

            // Setting the scroll bar where it should be
            linkedElement.scrollTop(scrollTop);
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
        var _this       = this;
        var options     = selectBox.find('option');
        var option      = null

        options.each(function(index){
            option       = $(this);
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