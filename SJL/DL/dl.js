/**
 *
 * The class simply loads the required files for the framework to load
 *
 * @author Brian
 * @link https://github.com/brian978
 * @copyright 2012
 * @license Creative Commons Attribution-ShareAlike 3.0
 *
 * @name DependencyLoader
 * @version 1.0
 *
 */

/**
 * Class constructor
 *
 * @param {Void}
 * @return void
 */
function DL(){}

/**
 * Used to execute the dependency loading
 *
 * @param {String} libraryPath
 * @return void
 */
DL.execute = function(libraryPath){

    // Setting a default libraryPath if not set
    var libraryPath = libraryPath || '';

    // Getting the head element object
    var container = $('head');

    // Array of classes in the library
    var classes = {
        'Common': {},
        'LastAction': {},
        'DataSender': {},
        'LoadingScreen': {
            'css': {
                0: 'loadingscreen.css'
            }
        },
        'InfiniteScroll': {}
    };

    // Loading the dependencies
    for (var className in classes){

        // Array of CSS files
        var css = new Array();

        // Getting the class filename
        var classFilename = new String(className).toLowerCase() + '.js';

        /**
         * -----------------------------------
         * PROCESSING CLASS DEPENDENCIES
         * -----------------------------------
         */
        // Going through the dependencies of the class (for now only css files
        for (var filesType in classes[className]){

            // Checking if the filesType is CSS
            if(filesType == 'css'){

                // Going through the CSS files
                for (var fileIndex in classes[className][filesType]){

                    // Adding the file to the array
                    css.push(classes[className][filesType][fileIndex]);
                }
            }
        }

        /**
         * ----------------------------
         * ADDING THE CSS FILES
         * ----------------------------
         */
        // Going through the CSS files and creating the elements then appending to the container
        for (var index in css){

            // Creating the link element
            var link = document.createElement('link');

            // Adding attributes
            link.setAttribute('rel', 'stylesheet');
            link.setAttribute('type', 'text/css');
            link.setAttribute('href', libraryPath + 'SJL/' + className + '/css/' + css[index]);

            // Adding the element to the container
            container.append(link);
        }

        /**
         * ----------------------------
         * ADDING THE JS FILE
         * ----------------------------
         */
        // Creating the link element
        var script = document.createElement('script');

        // Adding attributes
        script.setAttribute('type', 'text/javascript');
        script.setAttribute('src', libraryPath + 'SJL/' + className + '/' + classFilename);

        // Adding the element to the container
        container.append(script);
    }
}
