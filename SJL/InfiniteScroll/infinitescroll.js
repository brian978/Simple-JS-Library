/**
 *
 * Simple class that can be used to build a page with infinite scroll
 *
 * @author Brian
 * @link https://github.com/brian978
 * @copyright 2012
 * @license Creative Commons Attribution-ShareAlike 3.0
 *
 * @name InfiniteScroll
 * @version 1.5
 *
 */

/**
 * Infinite scoll class
 *
 * @param {Object} params The parameters that will be used to pull the contents
 * @return void
 */
function InfiniteScroll(params){

    // Aliasing the 'this' keyword
    var _this = this;

    // Params
    this.params = params || new Object();

    // By default no function will inspect the AJAX response
    if(!isset(this.params.inspectResponse))
    {
        this.params.inspectResponse = false;
    }
    else if(this.params.inspectResponse === true)
    {
        // Checking if an inspector function name has been set
        if(!isset(this.params.inspectorFunc)){
            this.params.inspectResponse = false;
        }
    }

    // Loading the stuff when the document is ready
    $(document).ready(function(){

        // Pull limit - the pull limit is used to determine if the object needs to perform a pull action
        _this.pullLimit = _this.params.pullLimit || 250;

        // Page height (determined dynamically)
        _this.pageHeight = 0;

        // Scroll position (determined dynamically)
        _this.scrollPosition = 0;

        // Content height (determined dynamically)
        _this.contentHeight = 0;

        // Offset (determined dynamically)
        _this.offsetTop = 0;

        // Container (determined dynamically)
        _this.container = null;

        // Scrollable element
        _this.scrollElement = null;

        // Page
        _this.page = 2;

        // Triggered flag
        _this.triggered = false;

        // Looking for the container parameter
        if(isset(_this.params.container)){

            // Container
            _this.container = $(_this.params.container);

            // Checking for the scrollElement parameter
            if(isset(_this.params.scrollElement)){

                // Scrollable element
                _this.scrollElement = $(_this.params.scrollElement);

                // Detecting the scroll
                _this.scrollElement.scroll(function(){
                    _this.check();
                });

                // Looking for the offsetType
                if(isset(_this.params.offsetType)){

                    // Determining the offset
                    if(_this.params.offsetType === 'document' || _this.params.offsetType === 'window')
                    {
                        _this.offsetTop = Math.round(_this.container.offset().top);
                    }
                    else if (_this.params.offsetType === 'element')
                    {
                        var parentOffset = Math.round(_this.scrollElement.offset().top);
                        var childOffset = Math.round(_this.container.offset().top);

                        _this.offsetTop = childOffset - parentOffset;
                    }

                } else {
                    alert('The InfiniteScroll object requires a "offsetType" parameter, which was not found in the "params" parameter passed to it.');
                }

            } else {
                alert('The InfiniteScroll object requires a "scrollElement" parameter, which was not found in the "params" parameter passed to it.');
            }

        } else {
            alert('The InfiniteScroll object requires a "container" parameter, which was not found in the "params" parameter passed to it.');
        }
    });

    /**
     * Sets the data
     *
     * @param {Object} data
     * @return void
     */
    this.setData = function(data){

        this.params.data = data;

        // Resetting the flag
        this.triggered = false;

        // Resetting the page
        this.page = 2;
    }

    /**
     * Does some checks and triggers some methods
     *
     * @param {Void}
     * @return void
     */
    this.check = function(){

        // Checking if already triggered
        if(this.triggered == false){

            // Getting the scoll position
            this.getScrollPosition();

            // Checking the pull limit
            var triggerPull = this.checkPullLimit();

            // Checking the trigger
            if(triggerPull === true){

                // Triggered flag
                this.triggered = true;

                // Triggering the content pull
                this.triggerPullContent();
            }
        }
    }

    /**
     * Updates the scroll position
     *
     * @param {Void}
     * @return void
     */
    this.getScrollPosition = function(){


        // Looking for the offsetType
        if(typeof this.params.offsetType !== 'undefined'){

            // Determining the scrollTop
            if(this.params.offsetType === 'document'){
                this.scrollPosition = $(document).scrollTop();

            } else if (this.params.offsetType === 'window') {
                this.scrollPosition = $(window).scrollTop();

            } else if (this.params.offsetType === 'element') {
                this.scrollPosition = this.scrollElement.scrollTop();

            }

        } else {
            alert('The InfiniteScroll object requires a "offsetType" parameter, which was not found in the "params" parameter passed to it.');
        }
    }

    /**
     * Checks if content should be pulled
     *
     * @param {Void}
     * @return boolean
     */
    this.checkPullLimit = function(){

        // Result
        var result = false;

        // Checking for the required data
        if(isset(this.params.container)){

            // Getting the page height
            this.pageHeight = document.documentElement.clientHeight;

            // Getting the container height
            this.contentHeight = this.container.height() + this.offsetTop;

            // Getting the computed pull limit
            var computedPullLimit = this.contentHeight - this.pageHeight - this.scrollPosition;

            // Logging
            if(logMessages()){
                console.log(this.contentHeight + ' - ' + this.pageHeight + ' - ' + this.scrollPosition + ' = ' + computedPullLimit);
                console.log('this.offsetTop: ' + this.offsetTop);
            }

            // The check
            if(computedPullLimit < this.pullLimit){
                result = true;
            }
        }

        return result;
    }

    /**
     * Triggers the content pull
     *
     * @param {Void}
     * @return void
     */
    this.triggerPullContent = function(){

        // Checking for the required params
        if(isset(this.params.url) && isset(this.params.container)){

            // Adding some more data to the data
            this.params.data['page'] = this.page;

            // Creating the AjaxCaller object
            var sender = new DataSender({
                url:                this.params.url,
                postReceiveAction:  new Action().register(_this, 'pullContent', []),
                loadingScreen:      false,
                data:               this.params.data,
                inspectResponse:    this.params.inspectResponse,
                inspectorFunc:      this.params.inspectorFunc
            });

            // Sending the request
            sender.execute();

            // Deleting the object so it doesn't remain after the trigger
            sender = null;
            delete sender;

            // Incrementing the page
            this.page++;
        }
    }

    /**
     * Pulls the content (it is called by another function and receives the content)
     *
     * @param {String} content
     * @return void
     */
    this.pullContent = function(content){

        // Setting the flag
        if(content.length > 0){
            this.triggered = false;
        }

        // Appending the content
        if(typeof this.container !== 'undefined'){
            this.container.append(content);
        } else {
            alert('The container for the content is undefined');
        }
    }

    /**
     * Unbined
     *
     * @param {Void}
     * @return void
     */
    this.unbindAll = function(){

        this.scrollElement.unbind('scroll');
    }
}