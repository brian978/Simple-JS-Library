/**
 *
 * @author Brian
 * @link https://github.com/brian978
 * @copyright 2012
 * @license Creative Commons Attribution-ShareAlike 3.0
 *
 * @name ListSearch
 * @version 1.3
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

    $this.params = {
        damperTimeout: 500,
        listId: null,
        searchId: null,
        clearId: null
    };

    $this.cache = {};
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

    // The objects for each ID
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

        if (logMessages())
        {
            console.log('ListSearch::init() method called');
        }

        // Creating the required objects
        for (var id in $this.requiredIds)
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
        for (var id in $this.optionalIds)
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
    $this.setOptions = function(params)
    {
        for(var option in $this.params)
        {
            if(isset(params[option]))
            {
                $this.params[option] = params[option];
            }
        }

       return $this;
    }

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
        $this.buildCache();

        return $this;
    }

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

        var index = 0;

        $this.objects.list.find('option').each(function ()
        {
            // For element tracking purposes we add an index attribute so
            // we can identify the list entry when we search
            $(this).attr('index', index);

            $this.cache[index] = {
                attributes: $this.getAttributes($(this)),
                value: $(this).html()
            };

            index++;
        });

        return $this;
    };

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

        var results = {};
        var localCache = jQuery.extend({}, $this.cache);
        var regex = new RegExp('^' + value, 'i');

        // Searching the words that start with the desired characters
        for (var index in localCache)
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
        for (var index in localCache)
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

            $this.applyAttributes(option, row.attributes);

            $this.objects.list.append(option);
        }

        return $this;
    };

    /**
     *
     * @param {Object} option
     * @param {Array} attributes
     * @returns ListSearch
     */
    $this.applyAttributes = function (option, attributes)
    {
        for (var name in attributes)
        {
            option.attr(name, attributes[name]);
        }

        return $this;
    };

    /**
     *
     * @param {Object} option
     * @returns {Array}
     */
    $this.getAttributes = function (option)
    {
        var nodeMap = option[0].attributes;
        var attributes = [];

        for (var i = 0; i < nodeMap.length; i++)
        {
            // The item is an object from the map
            var item = nodeMap.item(i);
            attributes[item.nodeName] = item.nodeValue;
        }

        return attributes;
    };

    // Setting the options provided by the user
    $this.setOptions(params);
}