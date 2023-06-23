const httpModule = ( function( ) {
    // Private variables and functions
    const config = {
        baseUrl: window.location.origin
        , headers: {
            'Content-Type': "application/json"
        }
    };

    function setBaseUrl( baseUrl ) { config.baseUrl = baseUrl; }

    function setHeaders( headers ) { config.headers = headers; }

    function getFullPath( path ) {
        if ( config.baseUrl ) {
            return config.baseUrl + path;
        }
        return path;
    }

    function executeRequest( path, options ) {
        const fullPath = getFullPath( path );
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

    function request( method, path, data, headers ) {
        const options = {
            method: method
            , headers: headers || config.headers
            , body: JSON.stringify( data )
        };

        return new Promise( (resolve, reject) => {
            executeRequest( path, options )
                .then( (response) => { resolve( response ); } )
                .catch( (error) => {
                    console.log( `${ method } request error:`, error );
                    reject( error );
                } );
        } );
    }

    // Public API
    return {
        config: config
        , setBaseUrl: setBaseUrl
        , setHeaders: setHeaders
        , get: function( path ) { return request( "GET", path ); }
        , post: function( path, data ) { return request( "POST", path, data ); }
        , postFile: function( path, payload, files ) {
            const formData = new FormData( );
            formData.append( "payload", JSON.stringify( payload ) );
            for ( let i = 0; i < files.length; i++ ) {
                formData.append( "files", files[ i ] );
            }

            const headers = {
                ...config.headers
                , 'Content-Type': "multipart/form-data"
            };

            const options = {
                method: "POST"
                , body: formData
                , headers: headers
            };

            return executeRequest( path, options );
        }
        , put: function( path, data ) { return request( "PUT", path, data ); }
        , delete: function( path ) { return request( "DELETE", path ); }
    };
} )( );

const formModule = ( function( ) {
    // Private variables
    const bindings = {};

    // Private methods
    function handleFormSubmission( event ) {
        event.preventDefault( );

        const form = event.target;
        const action = form.getAttribute( "action" );
        const method = form.getAttribute( "method" );
        const enctype = form.getAttribute( "enctype" );

        const data = new FormData( form );
        const files = [ ];

        if ( enctype === "multipart/form-data" ) {
            const fileInputs = form.querySelectorAll( "input[type='file']" );
            for ( let i = 0; i < fileInputs.length; i++ ) {
                const fileInput = fileInputs[ i ];
                for ( let j = 0; j < fileInput.files.length; j++ ) {
                    files.push( fileInput.files[ j ] );
                }
            }
        }

        httpModule.postFile( action, data, files )
            .then( response => {
                const eventName = `${ method.toUpperCase( ) }_SUCCESS`;
                if ( bindings[ eventName ] ) {
                    bindings[ eventName ].forEach( callback => callback( response ) );
                }
            } )
            .catch( error => {
                const eventName = `${ method.toUpperCase( ) }_ERROR`;
                if ( bindings[ eventName ] ) {
                    bindings[ eventName ].forEach( callback => callback( error ) );
                }
            } );
    }

    // Public methods
    return {
        bindForm: function( formId ) {
            const form = document.getElementById( formId );
            if ( form ) {
                form.addEventListener( "submit"
                    , (e) => {
                        e.preventDefault( );
                        handleFormSubmission( e );
                    } );
            }
        }
        , on: function( eventName, callback ) {
            if ( !bindings[ eventName ] ) {
                bindings[ eventName ] = [ ];
            }
            bindings[ eventName ].push( callback );
        }
    };
} )( );

const storageModule = ( function( ) {
    // Private methods
    function isStorageSupported( storage ) {
        try {
            const testKey = "__storageModule__";
            storage.setItem( testKey, testKey );
            storage.removeItem( testKey );
            return true;
        } catch ( e ) {
            return false;
        }
    }

    // Public methods
    return {
        setItem: function( key, value, storageType ) {
            const storage = storageType === "localStorage" ? localStorage : sessionStorage;
            if ( isStorageSupported( storage ) ) {
                storage.setItem( key, JSON.stringify( value ) );
            } else {
                // Fallback for unsupported browsers
                // You can implement an alternative storage mechanism here
            }
        }
        , getItem: function( key, storageType ) {
            const storage = storageType === "localStorage" ? localStorage : sessionStorage;
            if ( isStorageSupported( storage ) ) {
                const value = storage.getItem( key );
                return value ? JSON.parse( value ) : null;
            } else {
                // Fallback for unsupported browsers
                // You can implement an alternative storage mechanism here
                return null;
            }
        }
        , removeItem: function( key, storageType ) {
            const storage = storageType === "localStorage" ? localStorage : sessionStorage;
            if ( isStorageSupported( storage ) ) {
                storage.removeItem( key );
            } else {
                // Fallback for unsupported browsers
                // You can implement an alternative storage mechanism here
            }
        }
        , clear: function( storageType ) {
            const storage = storageType === "localStorage" ? localStorage : sessionStorage;
            if ( isStorageSupported( storage ) ) {
                storage.clear( );
            } else {
                // Fallback for unsupported browsers
                // You can implement an alternative storage mechanism here
            }
        }
    };
} )( );

const partialViewModule = ( function( ) {
    // Private variables and functions
    const partialViews = {};

    function renderPartial( containerSelector, url ) {
        return new Promise( function( resolve, reject ) {
            const container = document.querySelector( containerSelector );
            if ( !container ) {
                reject( new Error( "Container element not found." ) );
                return;
            }

            fetch( url )
                .then( function( response ) {
                    if ( response.ok ) {
                        return response.text( );
                    } else {
                        throw new Error( "Failed to fetch partial view." );
                    }
                } )
                .then( function( partialHtml ) {
                    container.innerHTML = partialHtml;
                    resolve( );
                } )
                .catch( function( error ) { reject( error ); } );
        } );
    }

    // Public methods
    return {
        registerPartialView: function( partialViewName, partialViewContent ) {
            partialViews[ partialViewName ] = partialViewContent;
        }
        , renderPartial: renderPartial
    };
} )( );

const pageManager = ( function( httpModule, formModule, storageModule, partialViewModule ) {
    // Private variables and functions
    const bindings = {};

    // Public API
    const basePageMethods = {
        init(...externalFunctions) {
            for ( const selectorOrElement in bindings ) {
                if ( bindings.hasOwnProperty( selectorOrElement ) ) {
                    const events = bindings[ selectorOrElement ];
                    const element = Array.isArray( selectorOrElement )
                                        ? selectorOrElement
                                        : document.querySelectorAll( selectorOrElement );
                    element.forEach( (element) => {
                        for ( const event in events ) {
                            if ( events.hasOwnProperty( event ) ) {
                                element.addEventListener( event, events[ event ] );
                            }
                        }
                    } );
                }
            }
            
            // Call external functions
            externalFunctions.forEach( (externalFunction) => {
                if ( typeof externalFunction === "function" ) {
                    externalFunction( );
                }
            } );
        }
        , extend( extension ) {
            if ( typeof extension === "object" ) {
                Object.assign( this, extension );
            }
        }
        , registerBinding( selectorOrElement, event, handler ) {
            const selectors = Array.isArray( selectorOrElement ) ? selectorOrElement : [ selectorOrElement ];

            selectors.forEach( (selector) => {
                if ( !bindings[ selector ] ) {
                    bindings[ selector ] = {};
                }

                if ( !bindings[ selector ][ event ] ) {
                    bindings[ selector ][ event ] = [ ];
                }

                let elements;
                if ( selector.startsWith( "#" ) ) {
                    const id = selector.substring( 1 );
                    const element = document.getElementById( id );
                    elements = element ? [ element ] : [ ];
                } else {
                    elements = document.querySelectorAll( selector );
                }

                elements.forEach( (element) => {
                    const eventHandler = bindings[ selector ][ event ];
                    const existingHandler = eventHandler.find( (h) => h === handler );

                    if ( !existingHandler ) {
                        eventHandler.push( handler );
                        element.addEventListener( event, handler );
                    }
                } );
            } );
        }
        , deRegisterBindings( selector ) {
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
        , registerForm( id ) { formModule.bindForm( id ); }
        , setStorage( key, value, store = "localStorage" ) { storageModule.setItem( key, value, store ); }
        , getStorage( key, store = "localStorage" ) { return storageModule.getItem( key, store ); }
        , removeStorage( key, store = "localStorage" ) { storageModule.removeItem( key, store ); }
        , clearStorage( store ) { storageModule.clear( store ); }
        , renderPartial( containerId, path ) { partialViewModule.renderPartial( containerId, path ); }
        , get( path ) { return httpModule.get( path ); }
        , post( path, payload ) { return httpModule.post( path, payload ); }
        , put( path, payload ) { return httpModule.put( path, payload ); }
        , delete(path) { return httpModule.delete( path ); }
        , postFile( path, payload, files ) { return httpModule.postFile( path, payload, files ); }
    }

    basePageMethods.init( );
    return basePageMethods;
} )( httpModule, formModule, storageModule, partialViewModule );
