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
 * @version 1.3
 *
 */

/**
 * Used to trigger an action when the state of an element changes
 *
 * @param {Object} params
 * @return void
 */
function ActionTrigger(params)
{
    // Aliasing the 'this' keyword
    var _this = this;

    // Params
    this.params = params || {};

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
     * The method gets the info about the observed object
     *
     * @return void
     */
    this.init = function ()
    {
        // Checking if we have an action object
        if (this.params.action instanceof Action)
        {
            // Object of the element
            this.object = null;

            // Timeout ID
            this.timeout = null;

            this.stateChanged = false;

            // Initializing the loading screen variable
            this.loadScr = (this.params.loadingScreen == true ? new LoadingScreen() : null);

            // Getting the observed object
            this.getObservedObject();

            // Checking if we have an object
            if (this.object !== null)
            {
                this.bindEvents();

                // Starting the counter
                this.beginProcess();

            }
            else
            {
                // Logging
                if (logMessages())
                {
                    console.log('Could not find an object with the given ID.');
                }
            }

        }
        else
        {
            // Logging
            if (logMessages())
            {
                console.log('The ActionTrigger object needs an Action object.');
            }
        }
    }

    /**
     * Gets the observed object
     *
     * @return void
     */
    this.getObservedObject = function ()
    {
        // Checking if we have and element ID
        if (this.params.elementId !== null)
        {
            this.object = $('#' + this.params.elementId);

            // Checking if an object was found
            if (this.object.length <= 0)
            {
                this.object = null;
            }
        }
    }

    /**
     *
     * @return void
     */
    this.bindEvents = function ()
    {
        var obj = $(this.object);
        var callback = function ()
        {
            // Logging
            if (logMessages())
            {
                console.log('Object has changed it\'s state.');
            }

            _this.stateChanged = true;
        };

        obj.bind('DOMNodeInserted', callback);
        obj.bind('DOMNodeRemoved', callback);
    }

    /**
     * The method acts like a timer and checks if the observed object has changed it's value
     *
     * @param {Number} counter
     * @return void
     */
    this.timer = function (counter)
    {
        // Counter variable
        var counter = counter;

        // Checking if the counter has reached the limit
        if (counter < this.params.waitPeriod && this.stateChanged == false)
        {
            counter++;

            // Logging
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
            // Logging
            if (logMessages())
            {
                console.log('The observed object has changed it\'s state. Canceling and triggering action.');
            }

            // Canceling the loop
            this.cancel();

            // Triggering the action
            this.params.action.execute();

        }
        else
        {
            // Logging
            if (logMessages())
            {
                console.log('Operation timed out. The observed object has not changed it\'s state. Canceling...');
            }

            // Canceling the loop
            this.cancel();
        }
    }

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

            // Logging
            if (logMessages())
            {
                console.log('Loading screen activated.');
            }
        }

        // Starting the timer
        this.timer(0);

        // Logging
        if (logMessages())
        {
            console.log('Timer started.');
        }
    }

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

            // Logging
            if (logMessages())
            {
                console.log('Loading screen destroyed.');
            }
        }

        // Clearing the timeout ID
        if (this.timeout != null)
        {
            clearTimeout(this.timeout);
        }

        // Logging
        if (logMessages())
        {
            console.log('Timer canceled.');
        }
    }
}