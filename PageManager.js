//__________________________________________________________________________________________________________________
// HTTP Module

// Create an Immediately-Invoked Function Expression (IIFE) named httpModule
const httpModule = (() => {

    // Define an object containing the primary HTTP request methods
    const methods = {
        GET: 'GET', POST: 'POST', PUT: 'PUT', DELETE: 'DELETE', HEAD: "HEAD", PATCH: "PATCH"
    };

    // Private properties definition
    let config = {
        baseUrl: window.location.origin, // Set the base URL to the window's origin
        subDomain: undefined, // Subdomain is undefined initially
        headers: { // Default request headers
            'Accept': 'application/json',
        },
    };

    // Function to get full path for request
    const getFullPath = (path) => {
        // If path already starts with the base URL, remove it from the path, else keep as is
        path = path.startsWith(config.baseUrl) ? path.replace(config.baseUrl, '') : path;
        // Determine whether to add or not the '/' at the beginning of the path
        const connector = path.startsWith('/') ? '' : '/';
        // Return the full path, composed of the base URL, optional subdomain, connector, and the path
        return `${config.baseUrl}${config.subDomain ? '/' + config.subDomain : ''}${connector}${path}`;
    };

    // Function to get the CSRF token (if it exists) from a form
    const getAntiForgeryToken = (formId) => {
        let selector = 'input[name="__RequestVerificationToken"]';
        if (formId) {
            // If formId specified, modify selector to target the element in the specific form
            selector = `#${formId} ${selector}`;
        }
        // Find the CSRF token element and return its value, or return null if not found
        const tokenElement = document.querySelector(selector);
        return tokenElement ? tokenElement.value : null;
    };

    // Core function to issue HTTP request
    const request = async (method, path, payload, headers = {}, formId = null) => {

        // Throws error if method is not a valid HTTP method
        if (!Object.values(methods).includes(method)) {
            throw new Error(`Invalid HTTP method: ${method}`);
        }

        // Throws error if path is not a string
        if (typeof path !== 'string') {
            throw new Error('Path should be a string');
        }

        // Get Anti-Forgery Token (if exists)
        const antiForgeryToken = getAntiForgeryToken(formId);

        // Prepare options for the Fetch API
        let options = {
            method: method,
            headers: {
                // Combines default and additional headers,
                // plus it appends an anti-forgery token (if exists) to the request
                ...config.headers,
                ...headers,
                ...antiForgeryToken ? {'X-Request-Verification-Token': antiForgeryToken} : {},
            }
        };

        // Here we process the request payload - either as application/json or a FormData object
        if (payload !== null && payload !== undefined && ![methods.GET, methods.HEAD].includes(method)) {
            // Throws error if payload is not an object
            if (typeof payload !== 'object') {
                throw new Error('Payload should be an object');
            }

            // Checks if payload is FormData object, adds payload directly if yes
            if (payload.constructor.name === 'FormData') {
                options.body = payload;
            } else {
                // If anti-forgery token exists, content type is set to 'application/x-www-form-urlencoded' & payload is URL-encoded
                if (antiForgeryToken) {
                    options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
                    options.body = Object.keys(payload).flatMap(key => {
                        let value = payload[key];
                        if (Array.isArray(value)) {
                            // If value of given key is array, map each entry as separate key-value pair
                            // Doing it this way will allow for strong-typed arrays to be bound correctly on the server
                            return value.map(val => `${encodeURIComponent(key)}=${encodeURIComponent(val)}`);
                        } else {
                            // Else, stringify value as is
                            return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
                        }
                        // Concatenate all with '&'
                    }).join('&');
                } else {
                    // If no anti-forgery token, assumes payload as JSON and converts it into string
                    options.headers['Content-Type'] = 'application/json';
                    options.body = JSON.stringify(payload);
                }
            }
        }

        // Process the request and handle potential errors
        try {
            const response = await fetch(getFullPath(path), options);

            if (!response.ok) {
                throw new Error(`HTTP error !status: ${response.status}`);
            }

            // If the response's content type is 'application/json', return the JSON parsed data.
            // Else, return the text data.
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.indexOf('application/json') !== -1) {
                return await response.json();
            } else {
                return await response.text();
            }
        } catch (e) {
            // Log and rethrow any error that occurred during the request
            console.error(`Error during fetch: ${e}`);
            throw e;
        }

    };

    // Return an object exposing methods for different HTTP requests and configurations
    return {
        get: (path, headers, formId = null) => request(methods.GET, path, null, headers, formId),
        post: (path, payload, headers, formId = null) => request(methods.POST, path, payload, headers, formId),
        put: (path, payload, headers, formId = null) => request(methods.PUT, path, payload, headers, formId),
        delete: (path, headers, formId = null) => request(methods.DELETE, path, null, headers, formId),
        patch: (path, payload, headers, formId = null) => request(methods.PATCH, path, payload, headers, formId),
        setSubDomain: (subDomain) => {
            if (typeof subDomain !== 'string') {
                throw new Error('Subdomain should be a string');
            }
            // Function to set subDomain in config
            config.subDomain = subDomain;
        },
        setBaseUrl: (url) => {
            if (typeof url !== 'string') {
                throw new Error('Base URL should be a string');
            }
            // Function to set baseUrl in config
            config.baseUrl = url;
        },
        setDefaultHeaders: (headers) => {
            if (typeof headers !== 'object') {
                throw new Error('Headers should be an object');
            }
            // Function to set headers in config
            config.headers = headers;
        },
        // Expose methods object for external reference if needed
        methods: methods
    };
})();

//__________________________________________________________________________________________________________________
// Form Module

// Create an Immediately-Invoked Function Expression (IIFE) named formModule
const formModule = ((httpModule) => {
    // This function processes a form and returns its data
    const processForm = (form) => {
        // Initializing an empty object to store data
        const data = {};

        // A flag to check if the form has a file input
        let hasFile = false;

        // Initializing a FormData object to handle form data
        const formData = new FormData();

        // Loop through each element in the form
        [...form.elements].forEach((element) => {
            // Process the element if it has a 'name' attribute
            if (element.name) {
                // Check if the element is a file input
                if (element.type === 'file') {
                    hasFile = true;
                    // Append each chosen file to the FormData object
                    [...element.files].forEach((file) => {
                        formData.append(element.name, file);
                    });
                }
                // Check if the element is a checkbox
                else if (element.type === 'checkbox') {
                    // If the checkbox's name already exists in the data, the checkbox is part of a group
                    if (data.hasOwnProperty(element.name)) {
                        // Convert the value to an array if it's not already
                        if (!Array.isArray(data[element.name])) {
                            data[element.name] = [data[element.name]];
                        }

                        // If the checkbox has a value and is checked, add the value to the FormData and data object
                        if (element.value && element.checked) {
                            formData.append(element.name, element.value);
                            data[element.name].push(element.value);
                        }
                        // If the checkbox doesn't have a value but is checked, add the checked status
                        else if (element.checked) {
                            formData.append(element.name, element.checked);
                            data[element.name].push(element.checked);
                        }
                    }
                    // If the checkbox's name does not exist in the data, this is the first of its name
                    else {
                        if (element.value) {
                            formData.append(element.name, element.value);
                            data[element.name] = element.value;
                        } else {
                            formData.append(element.name, element.checked);
                            data[element.name] = element.checked;
                        }
                    }
                }
                // Check if the element is a multiple select
                else if (element.type === 'select-multiple') {
                    let arrItems = [];
                    // Loop through the selected options of the select
                    for (let option of element.selectedOptions) {
                        // Add each selected value to the array and FormData
                        arrItems.push(option.value);
                        formData.append(element.name, option.value);
                    }
                    // Store the selected values in the data object
                    data[element.name] = arrItems;
                }
                // If the element isn't a file, checkbox, or multiple select
                else {
                    if (isDate(element.value)) {
                        const date = new Date(element.value);
                        const value = date.toLocaleDateString() + " " + date.toLocaleTimeString();

                        formData.append(element.name, value);
                        data[element.name] = value;
                    } else {
                        formData.append(element.name, element.value);
                        data[element.name] = element.value;
                    }
                }
            }
        });

        // If there was at least one file input, return the FormData object
        // Else, just return the regular data object
        return hasFile ? formData : data;

        // Helper function to check if a value is a valid date
        function isDate(date) {
            if (!isNaN(date)) return false
            return new Date(date) !== "Invalid Date" && !isNaN(new Date(date));
        }
    };

    // This function handles a form submission by making a HTTP request
    const handleFormSubmit = async (event, callback, url = "", method = "") => {
        // Check if the provided callback is a function, if not, throw an error
        if (typeof callback !== 'function') {
            throw new Error('Callback is not a function');
        }

        // Prevent the form from submitting normally
        event.preventDefault();

        try {
            // Get the data from the form that was submitted
            let form = event.target;

            // Set URL and method from the form if not provided
            url = url || form.action;
            method = method || form.method;

            // Get the submitted form's id
            const formId = form.getAttribute('id');

            // Check if the HTTP method is supported
            if (!['GET', 'POST', 'PUT', 'DELETE', 'PATCH'].includes(method.toUpperCase())) {
                throw new Error(`Unsupported HTTP method: ${method}`);
            }

            // Process the form data
            let data = processForm(form);
            let response;

            // Send the HTTP request with the provided method
            if (httpModule[method.toLowerCase()]) {
                response = await httpModule[method.toLowerCase()](url, method === "GET" ? undefined : data, {}, formId);
            } else {
                throw new Error(`Unsupported HTTP method: ${method}`);
            }

            // Execute the callback with the response
            callback(response);
        } catch (error) {
            // If an error occurred, execute the callback with the error
            callback(null, error);
        }
    }

    // This function binds a form submit event to the specified callback
    const bindFormSubmit = (formId, callback, url, method) => {
        // Get the form element by its id
        const form = document.getElementById(formId);

        // If a form with the specified id exists
        if (form) {
            // Add an event listener to the form that handles form submission
            form.addEventListener('submit', (e) =>
                handleFormSubmit(e, callback, url, method));
        } else {
            // Log a warning if no form was found with the given id
            console.warn(`No form found with id ${formId}`);
        }
    }

    // Return an object exposing methods for registering form submit events
    return {
        bindFormSubmit: bindFormSubmit
    }
})(httpModule || {});

//__________________________________________________________________________________________________________________
// Storage Module

// Create an Immediately-Invoked Function Expression (IIFE) named storageModule
const storageModule = (() => {
    // Defines different actions that this module can perform
    const ACTIONS = {
        SET: "set", GET: "get", REMOVE: "remove", CLEAR: "clear"
    };

    // Checks if the provided storage type (localStorage or sessionStorage) is supported in the current browser
    function isStorageSupported(storage) {
        try {
            const testKey = "__storagetest__";
            storage.setItem(testKey, "1"); // Tries to set a dummy key
            storage.removeItem(testKey);
            return true;
        } catch (e) { // If any error occurs, it means storage is not supported
            return false;
        }
    }

    // Returns the actual storage object based on the provided storage type
    function getStorageType(storageType) {
        return storageType === "localStorage" ? localStorage : sessionStorage;
    }

    // Retrieves the value from the storage object. If the value can be parsed as JSON, return the parsed value
    function get(key, storageObject) {
        const storedData = storageObject.getItem(key);
        try {
            return JSON.parse(storedData);
        } catch (e) { // If parsing fails, return the original value
            return storedData;
        }
    }

    // Main function that validates the inputs, checks for storage support, and then executes the action on the storage
    function executeWithStorage(storageType = "localStorage", action, key, value, lifetime) {
        const storageObject = getStorageType(storageType);
        if (!isStorageSupported(storageObject)) { // If storage is not supported, throw an error
            throw new Error(`Sorry, ${storageType} is not supported in your browser.`);
        }

        switch (action) {
            case ACTIONS.SET: {
                if (typeof key !== 'string' && typeof key !== 'number') {
                    throw new Error("Invalid key. Key should be either a string or a number");
                }
                const data = {
                    value: value,
                    expiry: lifetime && !isNaN(parseInt(lifetime)) ? new Date().getTime() + lifetime * 1000 : null
                };

                const stringifiedData = JSON.stringify(data);
                if ((value && typeof value === "object" && Object.keys(value).length > 0) && stringifiedData === "{}") {
                    throw new Error("Invalid value. Value object contains non-stringifiable values");
                }

                storageObject.setItem(key, stringifiedData); // Stores the value in the storage as a string
                break;
            }
            case ACTIONS.GET: {
                const data = get(key, storageObject);
                if (data && data.expiry && data.expiry < new Date().getTime()) {
                    // If the value has expired, remove the item from the storage and return null
                    storageObject.removeItem(key);
                    return null;
                }
                return data ? data.value : null; // Returns the value if it exists, and hasn't expired
            }

            case ACTIONS.REMOVE: // Removes the specified item from the storage
                storageObject.removeItem(key);
                break;
            case ACTIONS.CLEAR: // Clears all items from the specified storage type
                storageObject.clear();
                break;
        }
    }

    // The public methods that can be accessed outside the module
    return {
        set: (key, value, storageType, lifetime) => executeWithStorage(storageType, ACTIONS.SET, key, value, lifetime),
        get: (key, storageType) => executeWithStorage(storageType, ACTIONS.GET, key),
        remove: (key, storageType) => executeWithStorage(storageType, ACTIONS.REMOVE, key),
        clear: (storageType) => executeWithStorage(storageType, ACTIONS.CLEAR)
    }

})();

//__________________________________________________________________________________________________________________
// Partial View Module

// Create an Immediately-Invoked Function Expression (IIFE) named partialViewModule
const partialViewModule = (() => {

    // Create a cache for storing fetching data
    const cache = {};

    // Function to render a partial view. It fetches the contents from a path and injects them into a target container
    async function renderPartial(containerId, path, options = {}) {

        // Check if data already exists in cache
        if (cache[path]) {

            // If exists, add safe HTML to the container
            safeSetHTML(containerId, cache[path]);

            // If a callback function is defined, execute it
            if (typeof options.callback === 'function') {
                options.callback();
            }
            return;
        }

        // Fetch data from the path
        try {
            const response = await fetch(path);

            // Check if the response is successful
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            // Parse the response as a text
            const data = await response.text();

            // Store the fetched data in the cache
            cache[path] = data;

            // Add safe HTML to the container
            safeSetHTML(containerId, data);

            // If a scriptPath is defined, import the script
            if (options.scriptPath && typeof options.scriptPath === 'string') {
                await import(options.scriptPath);
            }

            // If a callback function is defined, execute it
            if (typeof options.callback === 'function') {
                options.callback();
            }
        } catch (error) {
            // If there's an error during the fetch operation, print it to the console
            console.error('There has been a problem with your fetch operation: ', error);
        }
    }

    // Function to safely set HTML to a container
    function safeSetHTML(containerId, data) {

        // Find the container using its Id
        const container = findContainer(containerId);

        // If the container exists, set its content
        if (container) {
            container.textContent = data; // Safer alternative to innerHTML
        }
    }

    // Function to find a container by its id
    function findContainer(containerId) {

        // Get the container by its Id
        const container = document.getElementById(containerId);

        // If the container doesn't exist, print a warning to the console
        if (!container) {
            console.warn(`No container found with id: ${containerId}`);
        }
        return container;
    }

    // Expose the renderPartial function to the outside of the IIFE
    return {
        renderPartial
    }
})();

//__________________________________________________________________________________________________________________
// Browser Module

// Create an Immediately-Invoked Function Expression (IIFE) named browserModule
const browserModule = (({screen, ontouchstart}, {userAgent, msMaxTouchPoints}) => {
    // Variables to store browser information
    let _canUse, _name, _version, _os, _osVersion, _touch, _mobile;

    // Helper functions
    // Function to capitalize the first character of a string
    const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1);

    // Function to check if the operating system is mobile OS (checks for 'wp', 'android', 'ios', 'bb')
    const isMobileOS = os => ['wp', 'android', 'ios', 'bb'].includes(os);

    // Function to check if a specific CSS feature is available in the browser by creating a dummy element and checking its style properties
    function canUse(feature) {
        _canUse = _canUse || document.createElement('div');
        const style = _canUse.style;
        return ['Moz', 'Webkit', 'O', 'ms'].some(prefix => `${prefix}${capitalize(feature)}` in style) || feature in style;
    }

    // Function to identify the browser type using User Agent string
    function identifyBrowser(userAgent) {
        if (userAgent.includes('Firefox')) return 'Firefox';
        if (userAgent.includes('Chrome')) return 'Chrome';
        if (userAgent.includes('Safari')) return userAgent;
        return 'other'; // return other if browser is not Firefox, Chrome, or Safari
    }

    // Function to identify the browser version using User Agent string
    function identifyBrowserVersion(userAgent) {
        // Regex pattern could differ depending on the browser
        // Find a match by looking for the pattern "browser/version number"
        let version = userAgent.match(/(Firefox|Chrome|Safari)[\/\s](\d+)/);
        return (version && version.length > 1) ? version[1] : null;
    }

    // Function that detects whether a MacOS device supports touch or not
    function _resolveMacOSTouch(os) {
        if (os === 'mac' && 'ontouchstart' in window) {
            const screenSize = `${screen.width}x${screen.height}`;
            // Check for specific screen size that matches with iOS devices
            if (["1024x1366", "834x1112", "810x1080", "768x1024"].includes(screenSize)) {
                return 'ios'; // Return iOS if touch is supported
            }
        }
        return os;
    }

    // Public API exposed by this function
    return {
        canUse,
        get name() { // Browser name
            return _name ?? (_name = identifyBrowser(userAgent));
        },
        get version() { // Browser version
            return _version ?? (_version = identifyBrowserVersion(userAgent));
        },
        get os() { // Operating System
            return _os ?? (_os = _resolveMacOSTouch('other'));
        },
        get osVersion() { // OS version (not implemented, always returns null)
            return _osVersion ?? (_osVersion = null);
        },
        get touch() { // Touch support
            return _touch ?? (_touch = isMobileOS(_os) ? !!ontouchstart : (_os === 'wp' && msMaxTouchPoints > 0));
        },
        get mobile() { // Whether operating system is mobile
            return _mobile ?? (_mobile = isMobileOS(_os));
        }
    };
})(window, navigator); // Instantly execute the function with window and navigator as parameters

//__________________________________________________________________________________________________________________
// Breakpoint Module

// Create an Immediately-Invoked Function Expression (IIFE) named breakpointModule
const breakpointModule = ((window) => {

    // `list` will hold the list of breakpoints
    // `media` will hold the media query information
    // `events` will keep track of all the registered events
    let list = null;
    let media = {};
    let events = [];

    // the `init` function is used to initialize the list of breakpoints
    // and set up event listeners for window resize, orientation change, page load,
    // and fullscreen change events
    const init = function (breakpointsList) {
        if (!Array.isArray(breakpointsList)) {
            throw new TypeError('Expected argument to be an Array.');
        }

        list = breakpointsList;
        const events = ["resize", "orientationchange", "load", "fullscreenchange"];
        events.forEach(event => window.addEventListener(event, poll));
    };

    // the `active` function checks if a specific media query is active
    // if the media query is starting with ">="
    // then it will run the `checkQuery` function to determine its state
    const active = function (query) {
        if (!(query in media)) {
            if (query.startsWith(">=")) {
                return checkQuery("gte", query.substring(2));
            }
            //and so on
        }
        return media[query] !== false && window.matchMedia(media[query]).matches;
    };

    // the `checkQuery` function will check the operator and value of the query
    const checkQuery = function (operator, value) {
        if (value && value in list) {
            const breakpointValue = list[value];
            // and so on
        }
        return false;
    };

    // the `on` function is used to add a handler for a specific media query
    const on = function (query, handler) {
        if (typeof handler !== 'function') {
            throw new TypeError('Expected handler to be a function.');
        }

        events.push({query: query, handler: handler, state: false});
        if (active(query)) {
            handler();
        }
    };

    // the `poll` function will update the state of each event
    const poll = function () {
        events = events.map(activeEvent);
    };

    // the `activeEvent` function will check if an event is active and it will execute
    // the event's handler function if it just became active
    const activeEvent = function (event) {
        const isActive = active(event.query);
        if (isActive && !event.state) {
            event.state = true;
            event.handler();
        } else if (!isActive && event.state) {
            event.state = false;
        }
        return event;
    };

    // Expose `init`, `on`, `list`, `media` and `events` methods
    return {
        init, on, list: () => list, media: () => media, events: () => events
    };
})(window);

//__________________________________________________________________________________________________________________
// SignalR Module

// Create a SignalR module with defined constants: maximum retries, retry delay, and logging level.
const signalRModule = ((MAX_RETRIES, RETRY_DELAY, LOGGING_LEVEL) => {

    // Variables to hold the connection, retry count and connection url.
    let connection = null;
    let retryCount = 0;
    let connectionUrl = undefined;

    // Function to log messages. Flag 'isError' determines if it's an error message (then console.error is used).
    const log = (message, isError = false) => {
        const logMessage = `${new Date().toISOString()} - ${message}`;
        isError ? console.error(logMessage) : console.log(logMessage);
    };

    // Function for assigning a given method to be called when specific event is received from SignalR hub.
    const onReceive = (method, newMethod) => {
        connection.on(method, newMethod);
    };

    // Asynchronous function to start the connection with the SignalR hub.
    const startConnection = async () => {
        // If a connection is already being made, return.
        if (connection && connection.state === signalR.HubConnectionState.Connecting) {
            return;
        }

        // Build the hub connection with provided connection URL and logging level.
        connection = new signalR.HubConnectionBuilder()
            .withUrl(connectionUrl)
            .configureLogging(LOGGING_LEVEL)
            .build();

        // Event handler for disconnection. It will retry (with back-off) up to MAX_RETRIES.
        connection.onclose(async (error) => {
            if (retryCount < MAX_RETRIES) {
                await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * (2 ** retryCount)));
                await startConnection();
                retryCount++;
                log(`SignalR is retrying to connect. Attempt number ${retryCount}`);
            } else {
                log('SignalR: Max retry attempts exceeded', true);
            }
        });

        // Event handlers for reconnection and reconnected scenarios.
        connection.onreconnecting((error) => {
            log(`SignalR Connection lost due to error "${error}". Reconnecting.`);
        });

        connection.onreconnected(connectionId => {
            log(`SignalR Connection reestablished. Connected with "${connectionId}".`);
        });

        // Start the connection. If unsuccessful, log an error and try again.
        try {
            await connection.start();
            log('SignalR Connected.');
            retryCount = 0;
        } catch (err) {
            log(`SignalR Connection Error: ${err.message || err}`, true);
            await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
            await startConnection();
        }
    };

    // Function to stop the connection. If it's connected, stop it while handling any potential error
    const stopConnection = async () => {
        if (connection && connection.state === signalR.HubConnectionState.Connected) {
            try {
                await connection.stop();
                log('SignalR Disconnected.');
            } catch (err) {
                log(`SignalR Disconnection Error: ${err.message || err}`, true);
            }
        }
    };

    // Function to send a message to the hub. If connected, sends it while handling any potential error.
    const sendMessage = async (message) => {
        if (connection && connection.state === signalR.HubConnectionState.Connected) {
            try {
                await connection.invoke('SendMessage', message);
            } catch (err) {
                log(`Error in SignalR SendMessage: ${err}`, true);
            }
        } else {
            log("Cannot send message when connection isn't in the 'Connected' state.", true);
        }
    };

    // Getter function for current connection state.
    const getConnectionState = () => connection?.connectionState;

    // The module exposes the following public methods
    return {
        startConnection,
        stopConnection,
        sendMessage,
        onReceive,
        setConnUrl: (connUrl) => {
            connectionUrl = connUrl
        },
        getConnectionState
    };
})(5, 5000, signalR.LogLevel.Information);  // Pass some initial configuration when declaring this IIFE.

//__________________________________________________________________________________________________________________
// Page Manager

// The 'pageManager' serves as a wrapper for all modules, using the JavaScript module pattern
const pageManager = ((httpModule, formModule, storageModule, partialViewModule, browserModule, breakpointModule, signalRModule) => {
    // Below are private properties and methods specific to this module

    // Method to initialize objects and setup configurations
    function init() {
        // Initialize the breakpoint module with specific width values for different devices
        breakpointModule.init({
            wide: ["1281px", "1680px"], // for screens with a width between 1281px and 1680px
            normal: ["981px", "1280px"], // for screens with a width between 981px and 1280px
            narrow: ["737px", "980px"], // for screens with a width between 737px and 980px
            narrower: ["737px", "840px"], // for screens with a width between 737px and 840px
            mobile: ["481px", "736px"], // for screens with a width between 481px and 736px
            mobilep: [null, "480px"] // for screens with a width up to 480px
        })
    }

    // Publicly exposed APIs
    return {
        http: httpModule,              // HTTP module for making requests
        form: formModule,              // Form Module for dealing with forms
        storage: storageModule,        // Storage Module for local storage functionality
        partialView: partialViewModule,// PartialView module for loading partial views
        browser: browserModule,        // Browser module for managing browser related functionalities
        breakpoint: breakpointModule,  // Breakpoint module for managing responsive design breakpoints
        signalR: signalRModule,        // SignalR module for real-time bidirectional communication
    }
})(httpModule, formModule, storageModule, partialViewModule, browserModule, breakpointModule, signalRModule);
