const httpRequestManager = {
    config: {
        baseUrl: window.location.origin
        , headers: {
            'Content-Type': 'application/json'
        }
    }
    , setBaseUrl: function( baseUrl ) { this.config.baseUrl = baseUrl; }
    , setHeaders: function( headers ) { this.config.headers = headers; }
    , get: function( path ) { return this.request( 'GET', path ); }
    , post: function( path, data ) { return this.request( 'POST', path, data ); }
    , postFile: function( path, payload, files ) {
        const formData = new FormData( );
        formData.append( 'payload', JSON.stringify( payload ) );
        for ( let i = 0; i < files.length; i++ ) {
            formData.append( 'files', files[ i ] );
        }

        const headers = {
            ...this.config.headers
            , 'Content-Type': 'multipart/form-data'
        };

        const options = {
            method: 'POST'
            , body: formData
            , headers: headers
        };

        return this.executeRequest( path, options );
    }
    , put: function( path, data ) { return this.request( 'PUT', path, data ); }
    , delete: function( path ) { return this.request( 'DELETE', path ); }
    , request: function( method, path, data, headers ) {
        const options = {
            method: method
            , headers: headers || this.config.headers
            , body: JSON.stringify( data )
        };

        return new Promise( (resolve, reject) => {
            this.executeRequest( path, options )
                .then( (response) => { resolve( response ); } )
                .catch( (error) => {
                    console.log( `${ method } request error:`, error );
                    reject( error );
                } );
        } );
    }
    , getFullPath: function( path ) {
        if ( this.config.baseUrl ) {
            return this.config.baseUrl + path;
        }
        return path;
    }
    , executeRequest: function( path, options ) {
        const fullPath = this.getFullPath( path );
        return fetch( fullPath, options )
            .then( (response) => {
                if ( !response.ok ) {
                    return response.json( )
                        .then( (errorBody) => {
                            const error = {
                                status: response.status
                                , statusText: response.statusText
                                , body: errorBody
                                ,
                            };
                            throw error;
                        } );
                }
                return response.json( )
                    .then( (data) => {
                        response.data = data;
                        return response;
                    } );
            } );
    }
};

const pageManager = ( function( ) {
    // Private variables
    const bindings = {};

    // Private methods

    // Handle form submissions
    function handleFormSubmission( form ) {
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
                        // Trigger a custom success event
                        const successEvent = new CustomEvent( "formSubmissionSuccess"
                            , {
                                detail: { response, formId: form.id }
                            } );
                        form.dispatchEvent( successEvent );
                    } else {
                        // Trigger a custom error event
                        const errorEvent = new CustomEvent( "formSubmissionError"
                            , {
                                detail: { response, formId: form.id }
                            } );
                        form.dispatchEvent( errorEvent );
                    }
                } )
                .then( () => {
                    //destroy form bindings
                    destroyFormBindings( form.id );
                } )
                .catch( function( error ) {
                    // Trigger a custom error event
                    const errorEvent = new CustomEvent( "formSubmissionError"
                        , {
                            detail: { error, formId: form.id }
                        } );
                    form.dispatchEvent( errorEvent );

                    console.error( "Form submission error:", error );
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
                        // Trigger a custom success event
                        const successEvent = new CustomEvent( "formSubmissionSuccess"
                            , {
                                detail: { response, formId: form.id }
                            } );
                        form.dispatchEvent( successEvent );
                    } else {
                        // Trigger a custom error event
                        const errorEvent = new CustomEvent( "formSubmissionError"
                            , {
                                detail: { response, formId: form.id }
                            } );
                        form.dispatchEvent( errorEvent );
                    }
                } )
                .then( () => {
                    //destroy form bindings 
                    destroyFormBindings( form.id );
                } )
                .catch( function( error ) {
                    // Trigger a custom error event
                    const errorEvent = new CustomEvent( "formSubmissionError"
                        , {
                            detail: { error, formId: form.id }
                        } );
                    form.dispatchEvent( errorEvent );

                    console.error( "Form submission error:", error );
                } );
        }

        function destroyFormBindings( id ) {
            const formBindings = bindings[ `#${ id }` ];
            if ( formBindings ) {
                for ( const event in formBindings ) {
                    if ( formBindings.hasOwnProperty( event ) ) {
                        formBindings[ event ].forEach( (handler) => { form.removeEventListener( event, handler ); } );

                        delete bindings[ `#${ id }` ];
                    }
                }
            }
        }
    }

    // Render a partial view
    function renderPartial( containerSelector, url ) {
        return new Promise( function( resolve, reject ) {
            const container = document.getElementById( containerSelector );

            if ( container ) {
                fetch( url )
                    .then( function( response ) {
                        if ( response.ok ) {
                            return response.json( );
                        } else {
                            throw new Error( "Failed to fetch partial view." );
                        }
                    } )
                    .then( function( partialHtml ) {
                        container.innerHTML = partialHtml;
                        resolve( );
                    } )
                    .catch( function( error ) { reject( error ); } );
            } else {
                reject( new Error( "Container element not found." ) );
            }
        } );
    }

    // Public methods
    const basePageMethods = {
        // Register a binding
        registerBinding: function( selectorOrElement, event, handler ) {
            const selectors = Array.isArray( selectorOrElement )
                                  ? selectorOrElement
                                  : [ selectorOrElement ];

            selectors.forEach( (selector) => {
                if ( !bindings[ selector ] ) {
                    bindings[ selector ] = {};
                }

                if ( !bindings[ selector ][ event ] ) {
                    bindings[ selector ][ event ] = [ ];
                }

                let elements;

                if ( selector.startsWith( "#" ) ) {
                    const id = selector.slice( 1 ); // Remove the '#' prefix
                    const element = document.getElementById( id );
                    elements = element ? [ element ] : [ ];
                } else {
                    elements = document.querySelectorAll( selector );
                }

                elements.forEach( (element) => {
                    const eventHandlers = bindings[ selector ][ event ];
                    const existingHandler = eventHandlers.find( (h) => h === handler );

                    if ( !existingHandler ) {
                        eventHandlers.push( handler );
                        element.addEventListener( event, handler );
                    }
                } );
            } );
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
        // DeRegister all bindings for a selector
        deRegisterBindings: function( selector ) {
            if ( bindings[ selector ] ) {
                const events = Object.keys( bindings[ selector ] );

                events.forEach( (event) => {
                    const eventHandlers = bindings[ selector ][ event ];

                    eventHandlers.forEach( (handler) => {
                        const elements = document.querySelectorAll( selector );

                        elements.forEach( (element) => { element.removeEventListener( event, handler ); } );
                    } );

                    delete bindings[ selector ][ event ];
                } );

                if ( Object.keys( bindings[ selector ] ).length === 0 ) {
                    delete bindings[ selector ];
                }
            }
        }
        ,
        // New method to register a form dynamically
        registerForm: function( form ) {
            function handleFormSubmit( e ) {
                e.preventDefault( );
                handleFormSubmission( e.target );
            }

            if ( form instanceof HTMLFormElement ) {
                form.addEventListener( "submit", handleFormSubmit );
            } else {
                throw new Error( "Invalid form element." );
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
            for ( let selectorOrElement in bindings ) {
                if ( bindings.hasOwnProperty( selectorOrElement ) ) {
                    const events = bindings[ selectorOrElement ];
                    const elements = Array.isArray( selectorOrElement )
                                         ? selectorOrElement
                                         : document.querySelectorAll( selectorOrElement );

                    elements.forEach( (element) => {
                        for ( let event in events ) {
                            if ( events.hasOwnProperty( event ) ) {
                                const handlers = events[ event ];

                                handlers.forEach( (handler) => { element.addEventListener( event, handler ); } );
                            }
                        }
                    } );
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

        // Render a partial view
        renderPartial: renderPartial
    };

    // Initialize the page
    basePageMethods.init( );

    // Return the basePageMethods object
    return basePageMethods;
} )( );
