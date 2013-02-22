/**
 *
 * @author Brian
 * @link https://github.com/brian978
 * @copyright 2012
 * @license Creative Commons Attribution-ShareAlike 3.0
 *
 * @name ListSearch
 * @version 1.3.1
 *
 */

/**
 *
 * @param {Object} params
 * @returns {{init: Function, refresh: Function}}
 * @constructor
 */
function ListSearch(params)
{
    var $this = this;

    // Defining the available params
    $this.params = {
        damperTimeout: 500,
        listId: null,
        searchId: null,
        clearId: null,
        autoSort: true
    };

    // This will hold the contents of the target list
    $this.cache = {};
    $this.cacheLength = 0;

    // Timout ID is used to cancel the timeout when the user changes the
    // contents of the search box
    $this.timeoutId = null;

    // A list of required ID's: contains the id entry and objects entry
    $this.requiredIds = {
        listId: 'list',
        searchId: 'search'
    };

    // Optional ID's with the same contents as requiredIds
    $this.optionalIds = {
        clearId: 'clear'
    };

    // The objects for each element
    $this.objects = {
        list: null,
        search: null,
        clear: null
    };

    /**
     *
     * @returns ListSearch
     */
    $this.init = function ()
    {
        var allOk = true;
        var id;

        if (logMessages())
        {
            console.log('ListSearch::init() method called');
        }

        // Creating the required objects
        for (id in $this.requiredIds)
        {
            var objectIdentifier = $this.requiredIds[id];

            $this.objects[objectIdentifier] = $('#' + $this.params[id]);

            if ($this.objects[objectIdentifier].length == 0)
            {
                alert('The object for the ID ' + id + ' was not found');

                allOk = false;
            }
        }

        // Creating the optional objects
        for (id in $this.optionalIds)
        {
            var object = $('#' + $this.params[id]);

            if (object.length != 0)
            {
                $this.objects[$this.optionalIds[id]] = object;
            }
        }

        if (allOk == true)
        {
            $this.buildCache();
            $this.bindEvents();
        }

        return $this;
    };

    /**
     *
     * @param {Object} params
     * @return ListSearch
     */
    $this.setOptions = function (params)
    {
        if (typeof params === 'object')
        {
            for (var option in $this.params)
            {
                if (isset(params[option]))
                {
                    $this.params[option] = params[option];
                }
            }
        }

        return $this;
    };

    /**
     *
     * @returns ListSearch
     */
    $this.refresh = function ()
    {
        if (logMessages())
        {
            console.log('ListSearch::refresh() method called');
        }

        $this.cache = {};
        $this.cacheLength = 0;

        $this.buildCache();

        return $this;
    };

    /**
     *
     * @returns ListSearch
     */
    $this.bindEvents = function ()
    {
        if (logMessages())
        {
            console.log('ListSearch::bindEvents() method called');
        }

        // Search box
        $this.objects.search.bind('keyup', function ()
        {
            if ($this.timeoutId !== null)
            {
                clearTimeout($this.timeoutId);
            }

            $this.initDamper($(this).val());
        });

        // Clear button
        if ($this.objects.clear !== null)
        {
            $this.objects.clear.bind('click', function ()
            {
                $this.clearSearch();

                return false;
            });
        }

        return $this;
    };

    /**
     *
     * @returns ListSearch
     */
    $this.clearSearch = function ()
    {
        $this.objects.search.val('');
        $this.showResults($this.cache);

        sortOptions($this.objects.list);

        return $this;
    };

    /**
     *
     * @param {String} searchValue
     * @returns ListSearch
     */
    $this.initDamper = function (searchValue)
    {
        if (logMessages())
        {
            console.log('ListSearch::initDamper() method called');
        }

        var callback = function ()
        {
            $this.doSearch(searchValue);
        };

        $this.timeoutId = setTimeout(callback, $this.params.damperTimeout);

        return $this;
    };

    /**
     * Reads the entire list and loads it into the cache
     *
     * @returns ListSearch
     */
    $this.buildCache = function ()
    {
        if (logMessages())
        {
            console.log('ListSearch::buildCache() method called');
        }

        if ($this.params.autoSort === true)
        {
            sortOptions($this.objects.list);
        }

        $this.objects.list.find('option').each(function ()
        {
            // For element tracking purposes we add an index attribute so
            // we can identify the list entry when we search
            $(this).attr('lsindex', $this.cacheLength);

            $this.cache[$this.cacheLength] = $this.buildRow($(this));

            $this.cacheLength++;
        });

        return $this;
    };

    /**
     *
     * @returns {Object}
     */
    $this.getObservedElement = function ()
    {
        return $this.objects.list;
    }

    /**
     *
     * @param {Object} option
     * @param {String} mode
     */
    $this.notify = function (option, mode)
    {
        if (logMessages())
        {
            console.log('ListSearch::notify() method called with mode: ' + mode);
        }

        if (typeof mode !== 'undefined' && mode !== null)
        {
            var row = $this.buildRow(option);
            var rowIndex = null;
            var cacheUpdated = false;

            // If the option has a row index then we need to update the rowIndex
            if (isset(row.attributes['lsindex']))
            {
                rowIndex = row.attributes['lsindex'];
            }

            if (mode == 'add')
            {
                cacheUpdated = true;

                // This should only happen when moving an unindexed item
                if (rowIndex == null || typeof rowIndex == 'undefined')
                {
                    rowIndex = $this.cacheLength;
                    row.attributes['lsindex'] = rowIndex;
                }

                $this.cache[rowIndex] = row;
                $this.cacheLength++;
            }
            else if (mode == 'remove')
            {
                if (isset($this.cache[rowIndex]))
                {
                    cacheUpdated = true;

                    $this.cache[rowIndex] = null;
                    delete $this.cache[rowIndex];
                }
            }

            if (cacheUpdated === true && $this.params.autoSort === true)
            {
                sortOptions($this.objects.list);
            }
        }
    }

    /**
     *
     * @param {Object} option
     * @returns {{attributes: Array, value: String}}
     */
    $this.buildRow = function (option)
    {
        return {
            attributes: getElementAttributes(option),
            value: option.html()
        };
    }

    /**
     *
     * @param {String} value
     * @returns ListSearch
     */
    $this.doSearch = function (value)
    {
        if (logMessages())
        {
            console.log('ListSearch::doSearch() method called');
        }

        $this.showResults($this.searchCache(value));

        return $this;
    };

    /**
     *
     * @param {String} value
     * @returns {Object}
     */
    $this.searchCache = function (value)
    {
        if (logMessages())
        {
            console.log('ListSearch::searchCache() method called');
            console.log('Searching for: ' + value);
        }

        var index;
        var results = {};
        var localCache = jQuery.extend({}, $this.cache);
        var regex = new RegExp('^' + value, 'i');

        // Searching the words that start with the desired characters
        for (index in localCache)
        {
            if (localCache[index].value.search(regex) != -1)
            {
                results[index] = localCache[index];

                // We need to remove the row from the local cache to avoid
                // looking through it multiple times
                localCache[index] = null;
                delete localCache[index];

                if (logMessages())
                {
                    console.log('Result found: ' + results[index].value);
                }
            }
        }

        regex = new RegExp(value, 'i');

        // Searching everywhere
        for (index in localCache)
        {
            if (localCache[index].value.search(regex) != -1)
            {
                results[index] = localCache[index];

                if (logMessages())
                {
                    console.log('Result found (match everywhere): ' + results[index].value);
                }
            }
        }

        return results;
    };

    /**
     *
     * @param {Object} results
     * @returns ListSearch
     */
    $this.showResults = function (results)
    {
        if (logMessages())
        {
            console.log('ListSearch::showResults() method called');
        }

        $this.objects.list.html('');

        for (var index in results)
        {
            var row = results[index];
            var option = $(document.createElement('option'));

            option.html(row.value);

            setElementAttributes(option, row.attributes);

            $this.objects.list.append(option);
        }

        return $this;
    };

    // Setting the options provided by the user
    $this.setOptions(params);
}