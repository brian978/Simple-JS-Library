function ListSearch(params)
{
    var $this = this;

    $this.params = {
        damperTimeout: 1000,
        listId: null,
        searchId: null
    };

    $this.ids = {
        listId: 'list',
        searchId: 'search'
    };

    $this.objects = {
        list: null,
        search: null
    };

    $this.cache = {};
    $this.timeoutId = null;

    for (var id in $this.ids)
    {
        if (isset(params[id]) && typeof params[id] == 'string')
        {
            $this.params[id] = params[id];
        }
        else
        {
            alert('The listId parameter is missing or of the wrong type');
        }
    }

    /**
     *
     * @returns {*}
     */
    $this.bindEvents = function ()
    {
        if (logMessages())
        {
            console.log('ListSearch::bindEvents() method called');
        }

        $this.objects.search.bind('keyup', function ()
        {
            if ($this.timeoutId !== null)
            {
                clearTimeout($this.timeoutId);
            }

            $this.initDamper($(this).val());
        });

        return $this;
    }

    /**
     *
     * @param {String} searchValue
     * @returns {*}
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
    }

    /**
     * Reads the entire list and loads it into the cache
     *
     * @returns {*}
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
     * @returns {*}
     */
    $this.doSearch = function (value)
    {
        if (logMessages())
        {
            console.log('ListSearch::doSearch() method called');
        }

        $this.showResults($this.searchCache(value));

        return $this;
    }

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
     * @returns {*}
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
     * @returns {*}
     */
    $this.applyAttributes = function (option, attributes)
    {
        for (var name in attributes)
        {
            option.attr(name, attributes[name]);
        }

        return $this;
    }

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

    return {
        init: function ()
        {
            var objOk = true;

            if (logMessages())
            {
                console.log('ListSearch::init() method called');
            }

            for (var id in $this.ids)
            {
                var objectIdentifier = $this.ids[id];

                $this.objects[objectIdentifier] = $('#' + $this.params[id]);

                if ($this.objects[objectIdentifier].length == 0)
                {
                    alert('The object for the ID ' + id + ' was not found');

                    objOk = false;
                }
            }

            if (objOk == true)
            {
                $this.buildCache();
                $this.bindEvents();
            }
        }
    }
}