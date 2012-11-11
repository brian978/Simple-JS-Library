/**
 *
 * @author Brian
 * @link https://github.com/brian978
 * @copyright 2012
 * @license Creative Commons Attribution-ShareAlike 3.0
 *
 * @name LinkedSelects
 * @version 1.0
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
        var parentElement = document.getElementById(elements.parent);
        var childElement  = document.getElementById(elements.child);

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

        elements.parent.addEventListener('dblclick', function(e){
            _this.processClick(e, elements.parent);
        });

        elements.child.addEventListener('dblclick', function(e){
            _this.processClick(e, elements.child);
        });
    }

    /**
     * Processes the click action
     *
     * @param {Object} e
     * @param {Object} element
     * @return void
     */
    this.processClick = function(e, element){

        var optionInnerHtml = e.target.innerHTML;

        if(optionInnerHtml.trim() != ''){

            var selectedIndex = element.selectedIndex;
            var elementId     = element.getAttribute('id');
            var destElement   = this.links[elementId];
            var scrollTop     = destElement.scrollTop;

            // Removing the selected index from the select box
            element.remove(selectedIndex);

            // Checking if we know were to move the element
            destElement.appendChild(this.createOption(optionInnerHtml, this.getAttributes(e.target)));

            // Sorting the options of the destination elements
            this.sortOptions(destElement);

            // Setting the scroll bar where it should be
            destElement.scrollTop = scrollTop;

            // Logging
            if(typeof console === 'object'){
            }
        }
    }

    /**
     * Sorts the options of an element
     *
     * @param {Object} selectBox
     * @return void
     */
    this.sortOptions = function(selectBox){

        var options  = new Array();
        var sortable = new Array();
        var text     = null;

        for(var i in selectBox.options){
            if(!isNaN(i)){
                text = selectBox.options[i].innerHTML;
                options[text] = this.getAttributes(selectBox.options[i]);
                sortable[i]   = text;
            }
        }

        // Sorting
        sortable.sort();

        // Rebuilding the option list
        for(var i in sortable){
            text = sortable[i];
            selectBox.options[i] = this.createOption(text, options[text]);
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

        var option = document.createElement('option');

        // Adding info to the new options
        option.innerHTML = text;

        // Moving the attributes
        for(var nodeName in attributes){
            option.setAttribute(nodeName, attributes[nodeName]);
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

        var nodeMap     = element.attributes;
        var attributes  = new Array();

        for(var i=0; i < nodeMap.length; i++){
            var item = nodeMap.item(i);

            attributes[item.nodeName] = item.nodeValue;
        }

        return attributes;
    }
}