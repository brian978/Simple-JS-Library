/**
 *
 * A class that triggeres a set action when a set container changes it's state
 *
 * @author Brian
 * @link https://github.com/brian978
 * @copyright 2013
 * @license Creative Commons Attribution-ShareAlike 3.0
 *
 * @name ActionTriger
 * @version 1.3.2
 *
 */

/**
 * Used to trigger an action when the state of an element changes
 *
 * @param {Object} params
 * @return object
 */
function ActionTrigger(params)
{
    // Aliasing the 'this' keyword
    var _this = this;

    // Params
    this.params = params || {};

    this.callbacks = {
        DOMNodeInserted: null,
        load: null
    };

    // Object of the element
    this.object = null;

    this.objectType = null;

    // Timeout ID
    this.timeout = null;

    // Flag that is used by the timer method
    this.stateChanged = false;

    /**
     * --------------------
     * DEFAULT PARAMETERS
     * --------------------
     */
    // Checking if we have an element ID
    if (!isset(this.params.elementId))
    {
        this.params.elementId = null;
    }

    // By default the class triggers a loading screen
    if (!isset(this.params.loadingScreen))
    {
        this.params.loadingScreen = true;
    }

    // By default the wait period before the class will stop watching the element (in seconds)
    if (!isset(this.params.waitPeriod))
    {
        this.params.waitPeriod = 10;
    }

    // By default we have no Action object
    if (!isset(this.params.action))
    {
        this.params.action = null;
    }

    /**
     * Gets the observed object
     *
     * @return void
     */
    this.getObservedObject = function ()
    {
        if (this.params.elementId !== null)
        {
            this.object = $('#' + this.params.elementId);

            // The length must be greater then 0 if an object is found
            if (this.object.length <= 0)
            {
                this.object = null;
            }
        }
    };

    /**
     * Gets the type of the observed object
     *
     * @return string
     */
    this.getObjectType = function()
    {
        if(this.objectType == null)
        {
            this.objectType = getObjectType(this.object);
        }

        return this.objectType;
    };

    /**
     *
     * @return void
     */
    this.bindEvents = function ()
    {
        var callback = function ()
        {
            if (logMessages())
            {
                console.log('Object has changed it\'s contents.');
            }

            _this.stateChanged = true;
        };

        var event = 'DOMNodeInserted';

        // For iframes the binding needs to be done on the load event
        if(this.getObjectType() == 'iframe')
        {
            event = 'load';
        }

        this.callbacks[event] = callback;

        this.object.bind(event, callback);
    };

    /**
     *
     * @return void
     */
    this.unbindEvents = function ()
    {
        for(var event in this.callbacks)
        {
            if(this.callbacks[event] !== null)
            {
                if (logMessages())
                {
                    console.log('Unbind event: ' + event);
                }

                this.object.unbind(event, this.callbacks[event]);
            }
        }
    };

    /**
     * The method acts like a timer and checks if the observed object has changed it's value
     *
     * @param {Number} counter
     * @return void
     */
    this.timer = function (counter)
    {
        if (logMessages() && counter == 0)
        {
            console.log('Timer started.');
        }

        // Checking if the counter has reached the limit
        if (counter < this.params.waitPeriod && this.stateChanged == false)
        {
            counter++;

            if (logMessages())
            {
                console.log('Counter at ' + counter);
            }

            this.timeout = setTimeout(function ()
            {
                _this.timer(counter)
            }, 1000);

        }
        else if (this.stateChanged == true)
        {
            if (logMessages())
            {
                console.log('Canceling and triggering action.');
            }

            // Canceling the loop
            this.cancel();

            this.params.action.execute();

        }
        else
        {
            if (logMessages())
            {
                console.log('Operation timed out. The observed object has not changed it\'s state. Canceling...');
            }

            // Canceling the loop
            this.cancel();
        }
    };

    /**
     * The method prepares the requirements to start the timer
     *
     * @return void
     */
    this.beginProcess = function ()
    {
        // Checking if we have a loading screen
        if (this.loadScr !== null)
        {
            this.loadScr.show();

            if (logMessages())
            {
                console.log('Loading screen activated.');
            }
        }

        this.bindEvents();
        this.timer(0);
    };

    /**
     * The method cancels the counter
     *
     * @return void
     */
    this.cancel = function ()
    {
        // Checking if we have a loading screen
        if (this.loadScr !== null)
        {
            this.loadScr.destroy();

            if (logMessages())
            {
                console.log('Loading screen destroyed.');
            }
        }

        this.unbindEvents();

        // Clearing the timeout ID
        if (this.timeout != null)
        {
            clearTimeout(this.timeout);
        }

        if (logMessages())
        {
            console.log('Timer canceled.');
        }
    };

    return {
        init: function ()
        {
            // Checking if we have an action object
            if (_this.params.action instanceof Action)
            {
                // Initializing the loading screen variable
                _this.loadScr = (_this.params.loadingScreen == true ? new LoadingScreen() : null);

                // Getting the observed object
                _this.getObservedObject();

                // Checking if we have an object
                if (_this.object !== null)
                {
                    // Starting the counter
                    _this.beginProcess();
                }
                else
                {
                    if (logMessages())
                    {
                        console.log('Could not find an object with the given ID.');
                    }
                }
            }
            else
            {
                if (logMessages())
                {
                    console.log('The ActionTrigger object needs an Action object.');
                }
            }
        }
    }
}