// HttpRequestManager
var httpRequestManager = {
    get: async function( path ) {
        const response = await fetch( path
            , {
                method: "GET"
                ,
            } );

        return this.handleResponse( response );
    }
    , post: async function( path, data ) {
        const response = fetch( path
            , {
                method: "POST"
                , body: JSON.stringify( data )
                , headers: {
                    "Content-Type": "application/json"
                    ,
                }
                ,
            } );

        return this.handleResponse( response );
    }
    , postFile: async function( path, payload, files ) {
        const formData = new FormData( );
        formData.append( "payload", JSON.stringify( payload ) );
        for ( let i = 0; i < files.length; i++ ) {
            formData.append( "files", files[ i ] );
        }

        const response = fetch( path
            , {
                method: "POST"
                , body: formData
                ,
            } );

        return this.handleResponse( response );
    }
    , put: async function( path, data ) {
        const response = fetch( path
            , {
                method: "PUT"
                , body: JSON.stringify( data )
                , headers: {
                    "Content-Type": "application/json"
                    ,
                }
                ,
            } );

        return this.handleResponse( response );
    }
    , delete: async function( path ) {
        const response = fetch( path
            , {
                method: "DELETE"
                ,
            } );

        return this.handleResponse( response );
    }
    , handleResponse: async function( response ) {
        if ( !response.ok ) {
            const error = {
                status: response.status
                , statusText: response.statusText

            };
            throw error;
        }

        response[ "data" ] = await response.json( );
        return response;
    }
};

// BasePage
const PageManager = ( function( ) {
    // Private variables
    const bindings = {};

    // Private methods

    // Handle form submissions
    function handleFormSubmission( form ) {
        const method = form.getAttribute( "method" );
        const action = form.getAttribute( "action" );
        const enctype = form.getAttribute( "enctype" );
        const data = new FormData( form );

        if ( enctype === "multipart/form-data" ) {
            // Form submission with files
            const payload = {};
            for ( const [ key, value ] of data.entries( ) ) {
                payload[ key ] = value;
            }
            const files = Array.from( data.getAll( "files" ) );
            httpRequestManager
                .postFile( action, payload, files )
                .then( function( response ) {
                    if ( response.ok ) {
                        // Success handling
                    } else {
                        // Error handling
                    }
                } )
                .catch( function( error ) {
                    // Error handling
                } );
        } else {
            // Normal form submission
            const jsonData = {};
            for ( const [ key, value ] of data.entries( ) ) {
                jsonData[ key ] = value;
            }
            httpRequestManager
                .post( action, jsonData )
                .then( function( response ) {
                    if ( response.ok ) {
                        // Success handling
                    } else {
                        // Error handling
                    }
                } )
                .catch( function( error ) {
                    // Error handling
                } );
        }
    }

    // Public methods
    const basePageMethods = {
        // Register a binding
        registerBinding: function( selectorOrElement, event, handler ) {
            if (!bindings[selectorOrElement]) {
                bindings[selectorOrElement] = {};
            }

            if (!bindings[selectorOrElement][event]) {
                bindings[selectorOrElement][event] = [];
            }

            const elements = Array.isArray(selectorOrElement) ? selectorOrElement : document.querySelectorAll(selectorOrElement);

            elements.forEach((element) => {
                bindings[selectorOrElement][event].push(handler);
                element.addEventListener(event, handler);
            });
        }
        ,

        // Handle form submissions for all forms on the page
        handleFormSubmissions: function( ) {
            const forms = document.getElementsByTagName( "form" );
            for ( let i = 0; i < forms.length; i++ ) {
                const form = forms[ i ];
                form.addEventListener(
                    "submit"
                    , function( e ) {
                        e.preventDefault( );
                        handleFormSubmission( form );
                    }
                );
            }
        }
        ,

        // Set data in local storage
        setLocalStorage: function( key, value ) { localStorage.setItem( key, JSON.stringify( value ) ); }
        ,

        // Get data from local storage
        getLocalStorage: function( key ) {
            const value = localStorage.getItem( key );
            return value ? JSON.parse( value ) : null;
        }
        ,

        // Remove data from local storage
        removeLocalStorage: function( key ) { localStorage.removeItem( key ); }
        ,

        // Set data in session storage
        setSessionStorage: function( key, value ) { sessionStorage.setItem( key, JSON.stringify( value ) ); }
        ,

        // Get data from session storage
        getSessionStorage: function( key ) {
            const value = sessionStorage.getItem( key );
            return value ? JSON.parse( value ) : null;
        }
        ,

        // Remove data from session storage
        removeSessionStorage: function( key ) { sessionStorage.removeItem( key ); }
        ,

        // Make a GET request
        get: function( path ) { return httpRequestManager.get( path ); }
        ,

        // Make a POST request
        post: function( path, data ) { return httpRequestManager.post( path, data ); }
        ,

        // Make a POST request with files
        postFile: function( path, payload, files ) { return httpRequestManager.postFile( path, payload, files ); }
        ,

        // Make a PUT request
        put: function( path, data ) { return httpRequestManager.put( path, data ); }
        ,

        // Make a DELETE request
        delete: function( path ) { return httpRequestManager.delete( path ); }
        ,

        // Initialize the page
        init: function( ...externalFunctions ) {
            for (let selectorOrElement in bindings) {
                if (bindings.hasOwnProperty(selectorOrElement)) {
                    const events = bindings[selectorOrElement];
                    const elements = Array.isArray(selectorOrElement) ? selectorOrElement : document.querySelectorAll(selectorOrElement);

                    elements.forEach((element) => {
                        for (let event in events) {
                            if (events.hasOwnProperty(event)) {
                                const handlers = events[event];

                                handlers.forEach((handler) => {
                                    element.addEventListener(event, handler);
                                });
                            }
                        }
                    });
                }
            }

            this.handleFormSubmissions( ); // Handle form submissions

            // Call external functions
            externalFunctions.forEach( fn => {
                if ( typeof fn === "function" ) {
                    fn( );
                }
            } );
        }
        ,

        // Extend the BasePage with additional functionality
        extend: function( extension ) {
            if ( typeof extension === "object" ) {
                Object.assign( this, extension );
            }
        }
        ,
    };

    // Initialize the page
    basePageMethods.init( );

    // Return the basePageMethods object
    return basePageMethods;
} )( );
