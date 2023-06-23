class KendoDataSourceManager {
    constructor() { this.dataSources = {}; }

    addDataSource(id, dataSource) { this.dataSources[ id ] = dataSource; }

    removeDataSource(id) { delete this.dataSources[ id ]; }

    getDataSource(id) { return this.dataSources[ id ]; }

    createDataSource(id, options) {
        const dataSource = new kendo.data.DataSource( options );
        this.addDataSource( id, dataSource );
        
        return dataSource;
    }

    refreshDataSource(id) { this.dataSources[ id ].read( ); }

    refreshAllDataSources() {
        const dataSources = this.dataSources;
        for ( let key in dataSources ) {
            if ( dataSources.hasOwnProperty( key ) ) {
                dataSources[ key ].read( );
            }
        }
    }
}

class KendoControlManager {
    constructor(controlType) {
        this.controlType = controlType;
        this.controls = {};
    }

    addControl(id, controlInstance, overwrite = false) {
        if ( !this.controls[ id ] || overwrite ) {
            this.controls[ id ] = controlInstance;
        }
    }

    removeControl(id) { delete this.controls[ id ]; }

    getControl(id) { return this.controls[ id ]; }

    addSpecificControl(id, controlClass, options, overwrite = false) {
        if ( !this.controls[ id ] || overwrite ) {
            const controlInstance = new controlClass( id, options, false );
            this.controls[ id ] = controlInstance;

            return controlInstance;
        }

        return this.controls[ id ];
    }
}

const kendoManager = ( function( ) {
    // Private variables
    const kendoBindings = {};
    const controlManagers = {};

    // ReSharper disable IdentifierTypo
    const roleToControlMap = {
        ACTIONSHEET: "kendoActionSheet"
        , AUTOCOMPLETE: "kendoAutoComplete"
        , BREADCRUMB: "kendoBreadcrumb"
        , BUTTON: "kendoButton"
        , CALENDAR: "kendoCalendar"
        , CHART: "kendoChart"
        , COLORPICKER: "kendoColorPicker"
        , CONTEXTMENU: "kendoContextMenu"
        , DATETIMEPICKER: "kendoDateTimePicker"
        , DATERANGEPICKER: "kendoDateRangePicker"
        , DIALOG: "kendoDialog"
        , DRAWER: "kendoDrawer"
        , DROPDOWNLIST: "kendoDropDownList"
        , EXPANSIONPANEL: "kendoExpansionPanel"
        , GRID: "kendoGrid"
        , LISTBOX: "kendoListBox"
        , LISTVIEW: "kendoListView"
        , MENU: "kendoMenu"
        , MULTICOLUMNCOMBOBOX: "kendoMultiColumnComboBox"
        , MULTIGRID: "kendoMultiGrid"
        , MULTISELECT: "kendoMultiSelect"
        , NOTIFICATION: "kendoNotification"
        , NUMERICTEXTBOX: "kendoNumericTextBox"
        , PANELBAR: "kendoPanelBar"
        , PIVOTCONFIGURATOR: "kendoPivotConfigurator"
        , PIVOTGRID: "kendoPivotGrid"
        , PIVOTGRIDDETAIL: "kendoPivotGridDetail"
        , POPUP: "kendoPopup"
        , POPOVER: "kendoPopover"
        , PROGRESSBAR: "kendoProgressBar"
        , RANGEBAR: "kendoRangeBar"
        , RANGESLIDER: "kendoRangeSlider"
        , RATING: "kendoRating"
        , RESIZESENSORS: "kendoResizeSensors"
        , SCROLLABLE: "kendoScrollable"
        , SCROLLVIEW: "kendoScrollView"
        , SELECTBOX: "kendoSelectBox"
        , SIDEMENU: "kendoSideMenu"
        , SLIDER: "kendoSlider"
        , SPLITTER: "kendoSplitter"
        , STEPPER: "kendoStepper"
        , STOCKCHART: "kendoStockChart"
        , SWITCH: "kendoSwitch"
        , TABSTRIP: "kendoTabStrip"
        , TEXTAREA: "kendoTextArea"
        , TEXTBOX: "kendoTextBox"
        , TIMEPICKER: "kendoTimePicker"
        , TOOLTIP: "kendoTooltip"
        , TREEVIEW: "kendoTreeView"
        , UPLOAD: "kendoUpload"
        , VALIDATOR: "kendoValidator"
        , WINDOW: "kendoWindow"
    };
    // ReSharper restore IdentifierTypo


    // Data Source Manager
    const dataSourceManager = new KendoDataSourceManager( );

    // Private methods

    // Handle Kendo events
    function handleKendoEvent( element, event, handler ) {
        if ( !kendoBindings[ element ] ) {
            kendoBindings[ element ] = {};
        }

        if ( !kendoBindings[ element ][ event ] ) {
            kendoBindings[ element ][ event ] = [ ];
        }

        kendoBindings[ element ][ event ].push( handler );
        $( element ).on( event, handler );
    }

    // Public methods
    const kendoMethods = {
        // Register a Kendo event binding
        registerKendoEvent: function( element, event, handler ) {
            const elements = Array.isArray( element )
                                 ? element
                                 : document.querySelectorAll( element );

            elements.forEach( (el) => { handleKendoEvent( el, event, handler ); } );
        }
        ,
        // Initialize Kendo controls
        initializeKendoControls: function( ) {
            const controlElements = document.querySelectorAll( "[data-role]" );
            controlElements.forEach( (element) => {
                const role = element.dataset.role;
                const controlType = roleToControlMap[ role.toUpperCase( ) ];
                if ( controlType ) {
                    const containerId = element.id;
                    const options = {}; // Add any desired options for the control
                    new KendoControl( containerId, controlType, options );
                } else {
                    console.log( `Element with role (${ role }) not supported.` );
                }
            } );
        }
        ,
        // Add a data source to the manager
        addDataSource: function( id, dataSource ) { dataSourceManager.addDataSource( id, dataSource ); }
        , addDataSourceRange: function( dataSources ) {
            if ( Array.isArray( dataSources ) ) {

                dataSources.forEach( (dataSourceObj) => {
                    const id = dataSourceObj.id;
                    const dataSource = dataSourceObj.dataSource;
                    dataSourceManager.addDataSource( id, dataSource );
                } );

            } else {
                console.error( "Invalid argument provided to addDataSource." );
            }
        }
        ,
        // Remove a data source from the manager
        removeDataSource: function( id ) { dataSourceManager.removeDataSource( id ); }
        ,

        // Get a data source from the manager
        getDataSource: function( id ) { return dataSourceManager.getDataSource( id ); }
        , refreshDataSource: function( id ) { dataSourceManager.refreshDataSource( id ); }
        , refreshAllDataSources: function( ) { dataSourceManager.refreshAllDataSources( ); }
        ,
        // Create a data source with options and add it to the manager
        createDataSource: function( id, options ) {
            const dataSource = dataSourceManager.createDataSource( id, options );
            return dataSource;
        }
        ,
        // Render Telerik HTML template
        renderHtmlTemplate: function( container, template, data ) {
            data = Array.isArray( data ) ? data : [ data ];

            const con = document.getElementById( container );
            con.insertAdjacentHTML( "beforeend"
                , kendo.render( kendo.template( $( `#${ template }` ).html( ) ), data ) );
        }
        ,
        // Extend the KendoManager with additional functionality
        extend: function( extension ) {
            if ( typeof extension === "object" ) {
                Object.assign( this, extension );
            }
        }
        ,
        // Get a Kendo control by ID
        getControl: function( id ) {
            let result = undefined;

            if ( id ) {
                const con = id.startsWith( "#" ) ? $( id ) : $( `#${ id }` );

                if ( con.length > 0 ) {
                    if ( con[ 0 ].dataset ) {
                        const role = con[ 0 ].dataset.role;
                        if ( role ) {
                            const controlName = roleToControlMap[ role.toUpperCase( ) ];
                            if ( controlName ) {
                                let controlManager = kendoManager.getControlManager( controlName );
                                if ( !controlManager ) {
                                    controlManager = new KendoControlManager( controlName );
                                    kendoManager.addControlManager( controlName, controlManager );
                                }

                                const specifiedControlClass = controlClassMap[ controlName ];

                                if ( typeof specifiedControlClass === "function" ) {
                                    result = controlManager.getControl( id );
                                    if ( !result ) {
                                        const options = {};
                                        result =
                                            controlManager.addSpecificControl( id, specifiedControlClass, options );
                                    }
                                } else {
                                    result = controlManager.getControl( id );
                                    if ( !result ) {
                                        const options = {}; // Add any desired options for the control
                                        result = new KendoControl( id, controlName, options );
                                        controlManager.addControl( id, result );
                                    }
                                }
                            } else {
                                console.log( `Element with role (${ role }) not supported.` );
                            }
                        } else {
                            console.log( "Element dataset doesn't contain a role." );
                        }
                    } else {
                        console.log( "Element dataset is undefined." );
                    }
                } else {
                    console.log( "Element not found." );
                }
            }

            return result;
        }
        ,
        // Add a control manager for a specific control type
        addControlManager: function( controlType, manager ) { controlManagers[ controlType ] = manager; }
        , // Get the control manager for a specific control type
        getControlManager: function( controlType ) { return controlManagers[ controlType ]; }
    };

    // Extend the KendoManager with pageManager functionality
    Object.assign( kendoMethods, pageManager );

    // Initialize the KendoManager
    kendoMethods.init = function( ...externalFunctions ) {
        pageManager.init.apply( this, externalFunctions );
        this.initializeKendoControls( );
    };

    // Return the KendoManager object
    return kendoMethods;
} )( );

class KendoControl {
    constructor(containerId, controlType, options, initialize) {
        this.container = document.getElementById( containerId );
        this.controlType = controlType;
        this.options = options;
        this.initializeControl( );

        let controlManager = kendoManager.getControlManager( controlType );
        if ( !controlManager ) {
            controlManager = new KendoControlManager( controlType );
            kendoManager.addControlManager( controlType, controlManager );
        }

        controlManager.addControl( containerId, this );
    }

    initializeControl() {
        this.control = $( this.container )[ this.controlType ]( this.options ).data( this.controlType );
    }

    destroy() {
        const controlManager = kendoManager.getControlManager( this.controlType );
        if ( controlManager ) {
            controlManager.removeControl( this.container.id );
        }
        this.control.destroy( );
        this.container.innerHTML = "";
    }
}
