/**
 *
 * @author Brian
 * @see https://github.com/brian978
 * @copyright 2013
 * @license Creative Commons Attribution-ShareAlike 3.0
 *
 * @name LinkedSelects
 * @version 1.4.5
 *
 */

/**
 * The class is used to link 2 select boxes together
 *
 * @param {Object} params
 */
function LinkedSelects(params)
{
    // Closure
    var _this = this;

    // Defining the available params
    this.params = {
        selects: null,
        buttons: null,
        callbacks: {
            afterMove: null
        }
    };

    // Links between the selects Array( selectId => linkedSelectObj )
    this.links = [];

    // Holds the links between the buttons and the selects Array( buttonId => linkedSelectObj )
    this.buttons = [];

    // Holds the callbacks for each of the selects
    this.callbacks = [];

    // Holds the list of observers that need to be notified when options are moved
    // between the lists
    this.observers = [];

    // A list of moved options that will be passed to the callbacks
    this.movedOptions = [];

    /**
     * Initializes the object
     *
     * @returns LinkedSelects
     */
    this.init = function ()
    {
        $(document).ready(function ()
        {
            if (isset(_this.params.selects[0]))
            {
                for (var i in _this.params.selects)
                {
                    _this.setupSelects(_this.params.selects[i], i);
                }
            }
        });

        return this;
    };

    /**
     *
     * @param {Object} params
     * @returns LinkedSelects
     */
    this.setOptions = function (params)
    {
        if (typeof params === 'object')
        {
            for (var option in this.params)
            {
                if (isset(params[option]))
                {
                    this.params[option] = params[option];
                }
            }
        }

        return this;
    };

    /**
     *
     * @param {Object} observer
     * @returns LinkedSelects
     */
    this.registerObserver = function (observer)
    {
        this.observers.push(observer);

        return this;
    };

    /**
     *
     * @param {Object} element The element that triggered the processClick
     * @param {Object} option
     */
    this.notifyObservers = function (element, option)
    {
        for (var index in this.observers)
        {
            var observer = this.observers[index];
            var observedElement = observer.getObservedElement();
            var mode = null;


            if (observedElement.attr('id') == element.attr('id'))
            {
                mode = 'remove';
            }
            else
            {
                var elementId = element.attr('id');

                if(isset(this.links[elementId]))
                {
                    var linkedId = this.links[elementId].attr('id');

                    if (observedElement.attr('id') == linkedId)
                    {
                        mode = 'add';
                    }
                }
            }

            if (mode !== null)
            {
                observer.notify(option, mode);
            }
        }
    };

    /**
     * Links 2 select boxes
     *
     * @param {Object} elements
     * @param {Number} index
     * @returns void
     */
    this.setupSelects = function (elements, index)
    {
        // Getting the element objects
        var parentElement = $('#' + elements.parent);
        var childElement = $('#' + elements.child);

        // If the elements are not present we do nothing
        if (isset(parentElement) && isset(childElement))
        {
            // Linking the elements using their IDs
            this.links[elements.parent] = childElement;
            this.links[elements.child] = parentElement;

            // Replacing the elements with the objects
            elements.parent = parentElement;
            elements.child = childElement;

            // Logging
            if (logMessages())
            {
                console.log('Initialized the select boxes');
            }

            // Setting the events for the lists
            this.setupSelectEvents(elements);

            // Setting the buttons
            if (isset(this.params.buttons) && isset(this.params.buttons[index]))
            {
                this.setupButtons(this.params.buttons[index], elements);
            }

            // Setting up the callbacks for the lists
            if (isset(this.params.callbacks.afterMove) && isset(this.params.callbacks.afterMove[index]))
            {
                this.setupCallbacks(this.params.callbacks.afterMove[index], elements);
            }
        }
        else
        {
            // Logging
            if (logMessages())
            {
                console.log('Failed to initialize the select boxes (make sure they exist)');
            }
        }
    };

    /**
     * Adds the buttons for the select boxes
     *
     * @param {Object} buttons
     * @param {Object} elements
     * @returns void
     */
    this.setupButtons = function (buttons, elements)
    {
        // Getting the button objects
        var parentButton = $('#' + buttons.parent);
        var childButton = $('#' + buttons.child);

        // If the elements are not present we do nothing
        if (isset(parentButton) && isset(parentButton))
        {
            // Linking the buttons to the elements (which are objects) they target, again using the button IDs
            this.buttons[buttons.parent] = elements.parent;
            this.buttons[buttons.child] = elements.child;

            // Replacing the elements with the objects
            buttons.parent = parentButton;
            buttons.child = childButton;

            // We check if they actually exist in the setupButtonsEvents method
            buttons.parentAll = $('#' + buttons.parentAll);
            buttons.childAll = $('#' + buttons.childAll);

            // Logging
            if (logMessages())
            {
                console.log('Initialized the buttons');
            }

            // Setting the events for the buttons
            this.setupButtonEvents(buttons);
        }
        else
        {
            // Logging
            if (logMessages())
            {
                console.log('Failed to initialize the buttons (make sure they exist)');
            }
        }
    };

    /**
     * Adds the callbacks for the select boxes
     *
     * @param {Object} callbacks
     * @param {Object} elements
     * @returns void
     */
    this.setupCallbacks = function (callbacks, elements)
    {
        if (isset(callbacks.any) || isset(callbacks.parent) || isset(callbacks.child))
        {
            var parentId = elements.parent.attr('id');
            var childId = elements.child.attr('id');

            // Linking the buttons to the elements they target, again using the button IDs
            if (isset(callbacks.any))
            {
                this.callbacks[parentId] = callbacks.any;
                this.callbacks[childId] = callbacks.any;
            }
            else
            {
                if (isset(callbacks.parent))
                {
                    this.callbacks[parentId] = callbacks.parent;
                }

                if (isset(callbacks.child))
                {
                    this.callbacks[childId] = callbacks.child;
                }
            }

            // Logging
            if (logMessages())
            {
                console.log('Initialized the callbacks');
            }
        }
        else
        {
            alert('Callbacks could not be set because they either don\'t exist or are not configured properly');
        }
    };

    /**
     * Sets up the event handlers
     *
     * @param {Object} elements
     * @returns void
     */
    this.setupSelectEvents = function (elements)
    {
        // Event for the parent select
        elements.parent.bind('dblclick', function ()
        {
            _this.processClick(elements.parent, 'option:selected', true);
            _this.callCallbacks(elements.parent);
        });

        // Event for the child select
        elements.child.bind('dblclick', function ()
        {
            _this.processClick(elements.child, 'option:selected', true);
            _this.callCallbacks(elements.child);
        });

        // For visual feedback we need to remove the selected options of a select box
        // when the focus is on the other select box
        elements.parent.bind('focus', function ()
        {
            elements.child.find('option:selected').removeAttr('selected');
        });

        // For visual feedback we need to remove the selected options of a select box
        // when the focus is on the other select box
        elements.child.bind('focus', function ()
        {
            elements.parent.find('option:selected').removeAttr('selected');
        });

        // Logging
        if (logMessages())
        {
            console.log('Double click events have been set up for "' + elements.parent.attr('id') + '" and "' + elements.child.attr('id') + '"');
        }
    };

    /**
     * Sets up the event handlers for the buttons
     *
     * @param {Object} buttons
     * @returns void
     */
    this.setupButtonEvents = function (buttons)
    {
        var parentId = buttons.parent.attr('id');
        var childId = buttons.child.attr('id');

        // Event for the parent btn
        buttons.parent.bind('click', function ()
        {
            _this.processClick(_this.buttons[parentId], 'option:selected', true);
            _this.callCallbacks(_this.buttons[parentId]);
        });

        // Event for the child btn
        buttons.child.bind('click', function ()
        {
            _this.processClick(_this.buttons[childId], 'option:selected', true);
            _this.callCallbacks(_this.buttons[childId]);
        });

        // Event for the parent all
        if (isset(buttons.parentAll) && buttons.parentAll instanceof jQuery)
        {
            buttons.parentAll.bind('click', function ()
            {
                _this.processClick(_this.buttons[parentId], 'option', false);
                _this.callCallbacks(_this.buttons[parentId]);
            });
        }

        // Event for the child all
        if (isset(buttons.childAll) && buttons.childAll instanceof jQuery)
        {
            buttons.childAll.bind('click', function ()
            {
                _this.processClick(_this.buttons[childId], 'option', false);
                _this.callCallbacks(_this.buttons[childId]);
            });
        }

        // Logging
        if (logMessages())
        {
            console.log('Button events have been set up for "' + parentId + '" and "' + childId + '"');
        }
    };

    /**
     * Processes the click action
     *
     * @param {Object} element This is the select box from where the processClick was triggered
     * @param {String} findWhat
     * @param {Boolean} doSort
     * @returns void
     */
    this.processClick = function (element, findWhat, doSort)
    {
        // The linkedElement is the select box that is linked to "element"
        var linkedElement = this.links[element.attr('id')];
        var find = findWhat || 'option:selected';
        var sort = typeof doSort !== 'undefined' ? doSort : true;
        var moved = false;

        // The moved options need to be reset before each move
        // to avoid wrong data
        this.movedOptions = [];

        $(element).find(find).each(function ()
        {
            var selectedOption = $(this);
            var optionInnerHtml = selectedOption.html();

            if (optionInnerHtml.trim() != '')
            {
                // The scrollTop might not work in all the browsers
                var scrollTop = linkedElement.scrollTop();

                // Checking if we know were to move the element
                linkedElement.append(_this.createOption(optionInnerHtml, _this.getAttributes(selectedOption)));

                // Setting the scroll bar where it should be
                linkedElement.scrollTop(scrollTop);

                // For a little visual feedback we focus on the select where we moved the elements
                linkedElement.focus();

                _this.notifyObservers(element, selectedOption);

                // Removing the selected index from the select box
                selectedOption.remove();

                // Flag so that we do the sorting only once
                moved = true;

                // Registering the moved option
                _this.movedOptions.push(selectedOption)
            }
        });

        // Sorting the options of the destination elements
        if (moved === true && sort === true)
        {
            this.sortOptions(linkedElement);
        }
    };

    /**
     * Sorts the options of an element
     *
     * @param {Object} selectBox
     * @returns void
     */
    this.sortOptions = function (selectBox)
    {
        sortOptions(selectBox);

        // Logging
        if (logMessages())
        {
            console.log('Sorting the elements in the select box with ID "' + selectBox.attr('id') + '"');
            console.log('##############################################################################');
        }
    };

    /**
     * Creates an option element using the given data
     *
     * @param {String} text
     * @param {Array} attributes
     * @returns object
     */
    this.createOption = function (text, attributes)
    {
        // Creating the option
        var option = $(document.createElement('option'));
        option.html('' + text + '');

        setElementAttributes(option, attributes);

        return option;
    };

    /**
     * The method retrieves all the attributes of an element
     *
     * @param {Object} element
     * @returns Array
     */
    this.getAttributes = function (element)
    {
        return getElementAttributes(element);
    };

    /**
     * The method calls the given callback (if there is one of course)
     *
     * @param {Object} element
     * @returns void
     */
    this.callCallbacks = function (element)
    {
        var elementId = element.attr('id');

        if (isset(this.callbacks[elementId]))
        {
            if (typeof this.callbacks[elementId] === 'function')
            {
                this.callbacks[elementId](this.movedOptions);
            }
            // Support for callbacks build with the Action object
            else if (this.callbacks[elementId] instanceof Action)
            {
                var action = this.callbacks[elementId];
                var params = action.get();

                params.push(this.movedOptions);
                action.set(params);
                action.execute();

                // Arrays are passed by reference
                // so we need to remove the added element
                params.pop();
                action.set(params);
            }
        }
    };

    // Setting the options here because here we have the function available
    this.setOptions(params);
}