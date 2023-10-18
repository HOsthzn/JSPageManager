//__________________________________________________________________________________________________________________
// HTTP Module

const httpModule = (() => {
    // HTTP methods
    const methods = {
        GET: 'GET', POST: 'POST', PUT: 'PUT', DELETE: 'DELETE', HEAD: "HEAD", PATCH: "PATCH"
    };

    // Private properties
    let config = {
        baseUrl: window.location.origin, subDomain: undefined, headers: {
            'Accept': 'application/json',
        },
    };

    const getFullPath = (path) => {
        path = path.startsWith(config.baseUrl) ? path.replace(config.baseUrl, '') : path;
        const connector = path.startsWith('/') ? '' : '/';
        return `${config.baseUrl}${config.subDomain ? '/' + config.subDomain : ''}${connector}${path}`;
    };

    const getAntiForgeryToken = (formId) => {
        let selector = 'input[name="__RequestVerificationToken"]';
        if (formId) {
            selector = `#${formId} ${selector}`;
        }
        const tokenElement = document.querySelector(selector);
        return tokenElement ? tokenElement.value : null;
    };

    const request = async (method, path, payload, headers = {}, formId = null) => {

        if (!Object.values(methods).includes(method)) {
            throw new Error(`Invalid HTTP method: ${method}`);
        }

        if (typeof path !== 'string') {
            throw new Error('Path should be a string');
        }

        const antiForgeryToken = getAntiForgeryToken(formId);

        let options = {
            method: method, headers: {
                ...config.headers, ...headers, ...antiForgeryToken ? {'X-Request-Verification-Token': antiForgeryToken} : {},
            }
        };

        if (payload !== null && payload !== undefined && ![methods.GET, methods.HEAD].includes(method)) {
            if (typeof payload !== 'object') {
                throw new Error('Payload should be an object');
            }

            if (payload.constructor.name === 'FormData') {
                options.body = payload;
            } else {
                if (antiForgeryToken) {
                    options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
                    // Converts the JSON payload to application/x-www-form-urlencoded format
                    options.body = Object.keys(payload).flatMap(key => {
                        let value = payload[key];
                        if (Array.isArray(value)) {
                            // Maps each array value to its own key-value pair
                            return value.map(val => `${encodeURIComponent(key)}=${encodeURIComponent(val)}`);
                        } else {
                            return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
                        }
                    }).join('&');
                } else {
                    options.headers['Content-Type'] = 'application/json';
                    options.body = JSON.stringify(payload);
                }
            }
        }

        try {
            const response = await fetch(getFullPath(path), options);

            if (!response.ok) {
                throw new Error(`HTTP error !status: ${response.status}`);
            }

            const contentType = response.headers.get('content-type');
            if (contentType && contentType.indexOf('application/json') !== -1) {
                return await response.json();
            } else {
                return await response.text();
            }
        } catch (e) {
            console.error(`Error during fetch: ${e}`);
            throw e;
        }

    };

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
            config.subDomain = subDomain;
        },
        setBaseUrl: (url) => {
            if (typeof url !== 'string') {
                throw new Error('Base URL should be a string');
            }
            config.baseUrl = url;
        },
        setDefaultHeaders: (headers) => {
            if (typeof headers !== 'object') {
                throw new Error('Headers should be an object');
            }
            config.headers = headers;
        },
        methods: methods
    };
})();

//__________________________________________________________________________________________________________________
// Form Module

const formModule = ((httpModule) => {
    const processForm = (form) => {
        const data = {};
        let hasFile = false;
        const formData = new FormData();

        [...form.elements].forEach((element) => {
            if (element.name) {
                if (element.type === 'file') {
                    hasFile = true;
                    [...element.files].forEach((file) => {
                        formData.append(element.name, file);
                    });
                } else if (element.type === 'checkbox') {
                    if (data.hasOwnProperty(element.name)) {
                        if (!Array.isArray(data[element.name])) {
                            data[element.name] = [data[element.name]];
                        }
                        //if element contains value and is checked push the value to the array else push the check
                        if (element.value && element.checked) {
                            formData.append(element.name, element.value);
                            data[element.name].push(element.value);
                        } else if (element.checked) {
                            formData.append(element.name, element.checked);
                            data[element.name].push(element.checked);
                        }
                    } else {
                        if (element.value) {
                            formData.append(element.name, element.value);
                            data[element.name] = element.value;
                        } else {
                            formData.append(element.name, element.checked);
                            data[element.name] = element.checked;
                        }
                    }
                } else if (element.type === 'select-multiple') {
                    let arrItems = [];
                    for (let option of element.selectedOptions) {
                        arrItems.push(option.value);
                        formData.append(element.name, option.value);
                    }
                    data[element.name] = arrItems;
                } else {
                    //check for Date
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

        return hasFile ? formData : data;

        function isDate(date) {
            if (!isNaN(date)) return false
            return new Date(date) !== "Invalid Date" && !isNaN(new Date(date));
        }
    };

    const handleFormSubmit = async (event, callback, url = "", method = "") => {
        if (typeof callback !== 'function') {
            throw new Error('Callback is not a function');
        }

        event.preventDefault();

        try {
            let form = event.target;
            url = url || form.action;
            method = method || form.method;
            const formId = form.getAttribute('id');

            if (!['GET', 'POST', 'PUT', 'DELETE', 'PATCH'].includes(method.toUpperCase())) {
                throw new Error(`Unsupported HTTP method: ${method}`);
            }

            let data = processForm(form);
            let response;

            if (httpModule[method.toLowerCase()]) {
                response = await httpModule[method.toLowerCase()](url, method === "GET" ? undefined : data, {}, formId);
            } else {
                throw new Error(`Unsupported HTTP method: ${method}`);
            }

            callback(response);
        } catch (error) {
            callback(null, error);
        }
    }

    const bindFormSubmit = (formId, callback, url, method) => {
        const form = document.getElementById(formId);
        if (form) {
            form.addEventListener('submit', (e) =>
                handleFormSubmit(e, callback, url, method));
        } else {
            console.warn(`No form found with id ${formId}`);
        }
    }

    return {
        bindFormSubmit: bindFormSubmit
    }
})(httpModule || {}); // Fallback to an empty object if httpModule is not defined

//__________________________________________________________________________________________________________________
// Storage Module

const storageModule = (() => {
    // Actions definition
    const ACTIONS = {
        SET: "set", GET: "get", REMOVE: "remove", CLEAR: "clear"
    };

    // Check if storage is supported
    function isStorageSupported(storage) {
        try {
            const testKey = "__storagetest__";
            storage.setItem(testKey, "1");
            storage.removeItem(testKey);
            return true;
        } catch (e) {
            return false;
        }
    }

    // Get storage type
    function getStorageType(storageType) {
        return storageType === "localStorage" ? localStorage : sessionStorage;
    }

    // Get value from storage
    function get(key, storageObject) {
        const storedData = storageObject.getItem(key);
        try {
            return JSON.parse(storedData);
        } catch (e) {
            return storedData;
        }
    }

    // Perform action with storage
    function executeWithStorage(storageType = "localStorage", action, key, value, lifetime) {
        const storageObject = getStorageType(storageType);
        if (!isStorageSupported(storageObject)) {
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

                // Check if data can be stringified
                const stringifiedData = JSON.stringify(data);
                if ((value && typeof value === "object" && Object.keys(value).length > 0) && stringifiedData === "{}") {
                    throw new Error("Invalid value. Value object contains non-stringifiable values");
                }

                storageObject.setItem(key, stringifiedData);
                break;
            }
            case ACTIONS.GET: {
                const data = get(key, storageObject);
                if (data && data.expiry && data.expiry < new Date().getTime()) {
                    storageObject.removeItem(key);
                    return null;
                }
                return data ? data.value : null;
            }

            // Remove unnecessary check
            case ACTIONS.REMOVE:
                storageObject.removeItem(key);
                break;
            case ACTIONS.CLEAR:
                storageObject.clear();
                break;
        }
    }

    // The returned public API of the module
    return {
        set: (key, value, storageType, lifetime) => executeWithStorage(storageType, ACTIONS.SET, key, value, lifetime),
        get: (key, storageType) => executeWithStorage(storageType, ACTIONS.GET, key),
        remove: (key, storageType) => executeWithStorage(storageType, ACTIONS.REMOVE, key),
        clear: (storageType) => executeWithStorage(storageType, ACTIONS.CLEAR)
    }

})();

//__________________________________________________________________________________________________________________
// Partial View Module

const partialViewModule = (() => {
    const cache = {};

    async function renderPartial(containerId, path, options = {}) {
        if (cache[path]) {
            safeSetHTML(containerId, cache[path]);
            if (typeof options.callback === 'function') {
                options.callback();
            }
            return;
        }

        try {
            const response = await fetch(path);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.text();
            cache[path] = data;
            safeSetHTML(containerId, data);

            if (options.scriptPath && typeof options.scriptPath === 'string') {
                await import(options.scriptPath);
            }

            if (typeof options.callback === 'function') {
                options.callback();
            }
        } catch (error) {
            console.error('There has been a problem with your fetch operation: ', error);
        }
    }

    function safeSetHTML(containerId, data) {
        const container = findContainer(containerId);
        if (container) {
            container.textContent = data; // Safer alternative to innerHTML
        }
    }

    function findContainer(containerId) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.warn(`No container found with id: ${containerId}`);
        }
        return container;
    }

    return {
        renderPartial
    }
})();

//__________________________________________________________________________________________________________________
// Browser Module

const browserModule = (({screen, ontouchstart}, {userAgent, msMaxTouchPoints}) => {
    let _canUse, _name, _version, _os, _osVersion, _touch, _mobile;

    // Helper methods
    const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1);
    const isMobileOS = os => ['wp', 'android', 'ios', 'bb'].includes(os);

    function canUse(feature) {
        _canUse = _canUse || document.createElement('div');
        const style = _canUse.style;
        return ['Moz', 'Webkit', 'O', 'ms'].some(prefix => `${prefix}${capitalize(feature)}` in style) || feature in style;
    }

    function identifyBrowser(userAgent) {
        if (userAgent.includes('Firefox')) return 'Firefox';
        if (userAgent.includes('Chrome')) return 'Chrome';
        if (userAgent.includes('Safari')) return userAgent;
        // Add more browsers if necessary...
        return 'other';
    }

    function identifyBrowserVersion(userAgent) {
        // Regex pattern could differ depending on the browser
        let version = userAgent.match(/(Firefox|Chrome|Safari)[\/\s](\d+)/);
        return (version && version.length > 1) ? version[1] : null;
    }

    function _resolveMacOSTouch(os) {
        if (os === 'mac' && 'ontouchstart' in window) {
            const screenSize = `${screen.width}x${screen.height}`;
            if (["1024x1366", "834x1112", "810x1080", "768x1024"].includes(screenSize)) {
                return 'ios';
            }
        }
        return os;
    }

    // Public APIs
    return {
        canUse, get name() {
            return _name ?? (_name = identifyBrowser(userAgent));
        }, get version() {
            return _version ?? (_version = identifyBrowserVersion(userAgent));
        }, get os() {
            return _os ?? (_os = _resolveMacOSTouch('other'));
        }, get osVersion() {
            return _osVersion ?? (_osVersion = null);
        }, get touch() {
            return _touch ?? (_touch = isMobileOS(_os) ? !!ontouchstart : (_os === 'wp' && msMaxTouchPoints > 0));
        }, get mobile() {
            return _mobile ?? (_mobile = isMobileOS(_os));
        }
    };
})(window, navigator);

//__________________________________________________________________________________________________________________
// Breakpoint Module

const breakpointModule = ((window) => {
    let list = null;
    let media = {};
    let events = [];

    const init = function (breakpointsList) {
        if (!Array.isArray(breakpointsList)) {
            throw new TypeError('Expected argument to be an Array.');
        }

        list = breakpointsList;
        const events = ["resize", "orientationchange", "load", "fullscreenchange"];
        events.forEach(event => window.addEventListener(event, poll));
    };

    // check if the media query is active
    const active = function (query) {
        if (!(query in media)) {
            if (query.startsWith(">=")) {
                return checkQuery("gte", query.substring(2));
            }
            //and so on
        }
        return media[query] !== false && window.matchMedia(media[query]).matches;
    };

    // check the operator and value
    const checkQuery = function (operator, value) {
        if (value && value in list) {
            const breakpointValue = list[value];
            // and so on
        }
        return false;
    };

    // add a handler for the media query
    const on = function (query, handler) {
        if (typeof handler !== 'function') {
            throw new TypeError('Expected handler to be a function.');
        }

        events.push({query: query, handler: handler, state: false});
        if (active(query)) {
            handler();
        }
    };

    const poll = function () {
        events = events.map(activeEvent);
    };

    // check if the event is active or not
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

    return {
        init, on, list: () => list, media: () => media, events: () => events
    };
})(window);

//__________________________________________________________________________________________________________________
// SignalR Module

const signalRModule = ((MAX_RETRIES, RETRY_DELAY, LOGGING_LEVEL) => {
    let connection = null;
    let retryCount = 0;
    let connectionUrl = undefined;

    const log = (message, isError = false) => {
        const logMessage = `${new Date().toISOString()} - ${message}`;
        isError ? console.error(logMessage) : console.log(logMessage);
    };

    const onReceive = (method, newMethod) => {
        connection.on(method, newMethod);
    };

    const startConnection = async () => {
        if (connection && connection.state === signalR.HubConnectionState.Connecting) {
            return;
        }

        connection = new signalR.HubConnectionBuilder()
            .withUrl(connectionUrl)
            .configureLogging(LOGGING_LEVEL)
            .build();

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

        connection.onreconnecting((error) => {
            log(`SignalR Connection lost due to error "${error}". Reconnecting.`);
        });

        connection.onreconnected(connectionId => {
            log(`SignalR Connection reestablished. Connected with "${connectionId}".`);
        });

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

    const getConnectionState = () => connection?.connectionState;

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
})(5, 5000, signalR.LogLevel.Information);

//__________________________________________________________________________________________________________________
// Page Manager

//serves as a wrapper for all modules
const pageManager = ((httpModule, formModule, storageModule, partialViewModule, browserModule, breakpointModule, signalRModule) => {
    // Private properties

    // Private methods

    function init() {
        // Initialize modules

        breakpointModule.init({
            wide: ["1281px", "1680px"],
            normal: ["981px", "1280px"],
            narrow: ["737px", "980px"],
            narrower: ["737px", "840px"],
            mobile: ["481px", "736px"],
            mobilep: [null, "480px"]
        })
    }

    // Public APIs
    return {
        http: httpModule,
        form: formModule,
        storage: storageModule,
        partialView: partialViewModule,
        browser: browserModule,
        breakpoint: breakpointModule,
        signalR: signalRModule,
    }
})(httpModule, formModule, storageModule, partialViewModule, browserModule, breakpointModule, signalRModule);
