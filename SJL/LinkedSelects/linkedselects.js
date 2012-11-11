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
    this.options    = new Array();
    this.indexes    = new Array();

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

        // Initializing the options array for each element
        this.options[elements.parent] = new Array();
        this.options[elements.child]  = new Array();

        // Initializing the indexes array for each element
        this.indexes[elements.parent] = new Array();
        this.indexes[elements.child]  = new Array();

        // Linking the elements
        this.links[elements.parent] = childElement;
        this.links[elements.child]  = parentElement;

        // Replacing the elements with the objects
        elements.parent = parentElement;
        elements.child  = childElement;

        // Setting the events
        this.setupEvents(elements);
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
        var optionValue     = e.target.getAttribute('value');

        if(optionInnerHtml.trim() != '' && optionValue.trim() != ''){

            var option        = document.createElement('option');
            var selectedIndex = element.selectedIndex;
            var elementId     = element.getAttribute('id');
            var destElement   = this.links[elementId];
            var destId        = destElement.getAttribute('id');
            var scrollTop     = destElement.scrollTop;
            var selectedAttrs = this.getAttributes(e.target);

            // Adding info to the new options
            option.innerHTML = optionInnerHtml;

            // Moving the attributes
            for(var nodeName in selectedAttrs){
                option.setAttribute(nodeName, selectedAttrs[nodeName]);
            }

            // Removing the selected index from the select box
            element.remove(selectedIndex);

            // Remembering where the element came from
            this.indexes[elementId][optionValue] = selectedIndex;

            // Checking if we know were to move the element
            if(isset(this.indexes[destId][optionValue]))
            {
                destElement.insertBefore(option, destElement.options[this.indexes[destId][optionValue]]);
            }
            else
            {
                destElement.appendChild(option);
            }

            // Setting the scroll bar where it should be
            destElement.scrollTop = scrollTop;

            // Logging
            if(typeof console === 'object'){
                console.log('Links: ' + this.indexes.toSource());
                console.log('Selected index is: ' + selectedIndex);
                console.log('Destination index is: ' + this.indexes[destId][optionValue]);
            }
        }
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