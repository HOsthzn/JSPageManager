//Date & Time

class KendoDateInput extends KendoControl {
    constructor(containerId, options, initialize = true) {
        const defaultOptions = {
            ...options
        };
        super( containerId, "kendoDateInput", defaultOptions, initialize );
    }

    value() { return this.control.value( ); }

    setValue(value) { this.control.value( value ); }

    enable() { this.control.enable( true ); }

    disable() { this.control.enable( false ); }
}

class KendoDatePicker extends KendoControl {
    constructor(containerId, options, initialize = true) {
        const defaultOptions = {
            ...options
        };
        super( containerId, "kendoDatePicker", defaultOptions, initialize );
    }

    value() { return this.control.value( ); }

    setValue(value) { this.control.value( value ); }

    enable() { this.control.enable( true ); }

    disable() { this.control.enable( false ); }
}

class KendoDateTimePicker extends KendoControl {
    constructor(containerId, options, initialize = true) {
        const defaultOptions = {
            ...options
        };
        super( containerId, "kendoDateTimePicker", defaultOptions, initialize );
    }

    value() { return this.control.value( ); }

    setValue(value) { this.control.value( value ); }

    enable() { this.control.enable( true ); }

    disable() { this.control.enable( false ); }
}

class KendoDateRangePicker extends KendoControl {
    constructor(containerId, options, initialize = true) {
        const defaultOptions = {
            ...options
        };

        super( containerId, "kendoDateRangePicker", defaultOptions, initialize );
    }

    value() { return this.control.value( ); }

    setValue(value) { this.control.value( value ); }

    enable() { this.control.enable( true ); }

    disable() { this.control.enable( false ); }

    destroy() {
        super.destroy( );
        this.control.destroy( );
    }
}

class KendoTimePicker extends KendoControl {
    constructor(containerId, options, initialize = true) {
        const defaultOptions = {
            ...options
        };

        super( containerId, "kendoTimePicker", defaultOptions, initialize );
    }

    value(value) {
        if ( value !== undefined ) {
            this.control.value( value );
        } else {
            return this.control.value( );
        }
    }

    enable() { this.control.enable( true ); }

    disable() { this.control.enable( false ); }

    open() { this.control.open( ); }

    close() { this.control.close( ); }

    refresh() { this.control.refresh( ); }

    destroy() {
        super.destroy( );
        this.control.destroy( );
    }
}

//Text

class KendoMaskedTextBox extends KendoControl {
    constructor(containerId, options, initialize = true) {
        const defaultOptions = {
            ...options
        };

        super( containerId, "kendoMaskedTextBox", defaultOptions, initialize );
    }

    value(value) {
        if ( value !== undefined ) {
            this.control.value( value );
        } else {
            return this.control.value( );
        }
    }

    enable() { this.control.enable( true ); }

    disable() { this.control.enable( false ); }

    focus() { this.control.focus( ); }

    destroy() {
        super.destroy( );
        this.control.destroy( );
    }
}

class KendoTextBox extends KendoControl {
    constructor(containerId, options, initialize = true) {
        const defaultOptions = {
            ...options
        };

        super( containerId, "kendoTextBox", defaultOptions, initialize );
    }

    value(value) {
        if ( value !== undefined ) {
            this.control.value( value );
        } else {
            return this.control.value( );
        }
    }

    enable() { this.control.enable( true ); }

    disable() { this.control.enable( false ); }

    focus() { this.control.focus( ); }

    refresh() { this.control.refresh( ); }

    destroy() {
        super.destroy( );
        this.control.destroy( );
    }
}

class KendoTextArea extends KendoControl {
    constructor(containerId, options, initialize = true) {
        const defaultOptions = {
            ...options
        };

        super( containerId, "kendoTextArea", defaultOptions, initialize );
    }

    value() { return this.control.value( ); }

    setValue(value) { this.control.value( value ); }

    enable() { this.control.enable( true ); }

    disable() { this.control.enable( false ); }

    focus() { this.control.focus( ); }

    blur() { this.control.blur( ); }

    destroy() {
        super.destroy( );
        this.control.destroy( );
    }
}

//Numbers

class KendoNumericTextBox extends KendoControl {
    constructor(containerId, options, initialize = true) {
        const defaultOptions = {
            ...options
        };

        super( containerId, "kendoNumericTextBox", defaultOptions, initialize );
    }

    value(value) {
        if ( value !== undefined ) {
            this.control.value( value );
        } else {
            return this.control.value( );
        }
    }

    enable() { this.control.enable( true ); }

    disable() { this.control.enable( false ); }

    readonly(readonly) {
        if ( readonly !== undefined ) {
            this.control.readonly( readonly );
        } else {
            return this.control.readonly( );
        }
    }

    destroy() {
        super.destroy( );
        this.control.destroy( );
    }
}

//Buttons

class KendoButton extends KendoControl {
    constructor(containerId, options, initialize = true) {
        const defaultOptions = {
            ...options
        };
        super( containerId, "kendoButton", defaultOptions, initialize );
    }

    enable() { this.control.enable( true ); }

    disable() { this.control.enable( false ); }
}

class KendoButtonGroup extends KendoControl {
    constructor(containerId, options, initialize = true) {
        const defaultOptions = {
            ...options
        };
        super( containerId, "kendoButtonGroup", defaultOptions, initialize );
    }

    enable() { this.control.enable( ); }

    disable() { this.control.disable( ); }

    select(index) { this.control.select( index ); }

    getSelectedIndex() { return this.control.selectedIndex; }
}

//Dropdowns

class KendoComboBox extends KendoControl {
    constructor(containerId, options, initialize = true) {
        const defaultOptions = {
            ...options
        };
        super( containerId, "kendoComboBox", defaultOptions, initialize );
    }

    value() { return this.control.value( ); }

    setValue(value) { this.control.value( value ); }

    dataSource() { return this.control.dataSource.data( ); }

    setDataSource(data) { this.control.setDataSource( data ); }

    enable() { this.control.enable( true ); }

    disable() { this.control.enable( false ); }
}

class KendoMultiColumnComboBox extends KendoControl {
    constructor(containerId, options, initialize = true) {
        const defaultOptions = {
            ...options
        };

        super( containerId, "kendoMultiColumnComboBox", defaultOptions, initialize );
    }

    value(value) {
        if ( value !== undefined ) {
            this.control.value( value );
        } else {
            return this.control.value( );
        }
    }

    enable() { this.control.enable( true ); }

    disable() { this.control.enable( false ); }

    open() { this.control.open( ); }

    close() { this.control.close( ); }

    refresh() { this.control.refresh( ); }

    destroy() {
        super.destroy( );
        this.control.destroy( );
    }
}

class KendoDropDownList extends KendoControl {
    constructor(containerId, options, initialize = true) {
        const defaultOptions = {
            ...options
        };
        super( containerId, "kendoDropDownList", defaultOptions, initialize );
    }

    value() { return this.control.value( ); }

    setValue(value) { this.control.value( value ); }

    dataSource() { return this.control.dataSource.data( ); }

    setDataSource(data) { this.control.setDataSource( data ); }

    enable() { this.control.enable( true ); }

    disable() { this.control.enable( false ); }
}

class KendoDropDownButton extends KendoControl {
    constructor(containerId, options, initialize = true) {
        const defaultOptions = {
            ...options
        };
        super( containerId, "kendoDropDownButton", defaultOptions, initialize );
    }

    open() { this.control.open( ); }

    close() { this.control.close( ); }

    toggle() { this.control.toggle( ); }

    enable() { this.control.enable( true ); }

    disable() { this.control.enable( false ); }
}

class KendoDropDownTree extends KendoControl {
    constructor(containerId, options, initialize = true) {
        const defaultOptions = {
            ...options
        };
        super( containerId, "kendoDropDownTree", defaultOptions, initialize );
    }

    expandAll() { this.control.expand( ".k-item" ); }

    collapseAll() { this.control.collapse( ".k-item" ); }

    enable() { this.control.enable( true ); }

    disable() { this.control.enable( false ); }
}

class KendoDropDownGrid extends KendoControl {
    constructor(containerId, options, initialize = true) {
        const defaultOptions = {
            ...options
        };
        super( containerId, "kendoDropDownGrid", defaultOptions, initialize );
    }

    open() { this.control.open( ); }

    close() { this.control.close( ); }

    enable() { this.control.enable( true ); }

    disable() { this.control.enable( false ); }
}

//Other

class KendoActionSheet extends KendoControl {
    constructor(containerId, options, initialize = true) {
        const defaultOptions = {
            ...options
        };

        super( containerId, "kendoActionSheet", defaultOptions, initialize );
    }

    open() { this.control.open( ); }

    close() { this.control.close( ); }

    toggle() { this.control.toggle( ); }

    enable() { this.control.enable( true ); }

    disable() { this.control.enable( false ); }

    destroy() {
        super.destroy( );
        this.control.destroy( );
    }
}

class KendoAutoComplete extends KendoControl {
    constructor(containerId, options, initialize = true) {
        const defaultOptions = {
            ...options
        };
        super( containerId, "kendoAutoComplete", defaultOptions, initialize );
    }

    search(text) { this.control.search( text ); }

    value(value) {
        if ( value !== undefined ) {
            this.control.value( value );
        } else {
            return this.control.value( );
        }
    }
}

class KendoChart extends KendoControl {
    constructor(containerId, options, initialize = true) {
        const defaultOptions = {
            ...options
        };
        super( containerId, "kendoChart", defaultOptions, initialize );
    }

    setDataSource(dataSource) { this.control.setDataSource( dataSource ); }

    refresh() { this.control.refresh( ); }

    redraw() { this.control.redraw( ); }
}

class KendoBreadcrumb extends KendoControl {
    constructor(containerId, options, initialize = true) {
        const defaultOptions = {
            ...options
        };
        super( containerId, "kendoBreadcrumb", defaultOptions, initialize );
    }

    setItems(items) { this.control.setItems( items ); }

    addItem(item) { this.control.addItem( item ); }

    removeItem(index) { this.control.removeItem( index ); }

    removeAllItems() { this.control.removeAllItems( ); }

    selectItem(index) { this.control.selectItem( index ); }
}

class KendoCalendar extends KendoControl {
    constructor(containerId, options, initialize = true) {
        const defaultOptions = {
            ...options
        };
        super( containerId, "kendoCalendar", defaultOptions, initialize );
    }

    navigateTo(date) { this.control.navigateTo( date ); }

    value() { return this.control.value( ); }

    setValue(date) { this.control.value( date ); }

    enable() { this.control.enable( true ); }

    disable() { this.control.enable( false ); }
}

class KendoColorPicker extends KendoControl {
    constructor(containerId, options, initialize = true) {
        const defaultOptions = {
            ...options
        };
        super( containerId, "kendoColorPicker", defaultOptions, initialize );
    }

    value() { return this.control.value( ); }

    setValue(color) { this.control.value( color ); }

    enable() { this.control.enable( true ); }

    disable() { this.control.enable( false ); }
}

class KendoContextMenu extends KendoControl {
    constructor(containerId, options, initialize = true) {
        const defaultOptions = {
            ...options
        };
        super( containerId, "kendoContextMenu", defaultOptions, initialize );
    }

    show(x, y) { this.control.show( x, y ); }

    hide() { this.control.hide( ); }
}

class KendoGrid extends KendoControl {
    constructor(containerId, options, initialize = true) {
        const defaultOptions = {
            pageable: {
                pageSize: 50
                , refresh: true
                , alwaysVisible: true
                , pageSizes: [ 10, 50, 70, 90 ]
                ,
            }
            , sortable: {
                allowUnsort: true
                , showIndexes: true
                , mode: "multiple"
                ,
            }
            , scrollable: true
            , groupable: true
            , filterable: true
            , reorderable: true
            , resizable: true
            , navigatable: true
            , columnMenu: {
                componentType: "modern"
                , filterable: true
                ,
            }
            , excel: {
                fileName: `${ options.Name }.xlsx`
                , proxyURL: "/Exports/Excel_Export_Save"
                , filterable: true
                , allPages: true
                ,
            }
            , ...options
        };
        super( containerId, "kendoGrid", defaultOptions, initialize );
    }

    refresh() { this.control.dataSource.read( ); }


}

class KendoDialog extends KendoControl {
    constructor(containerId, options, initialize = true) {
        const defaultOptions = {
            ...options
        };

        super( containerId, "kendoDialog", defaultOptions, initialize );
    }

    open() { this.control.open( ); }

    close() { this.control.close( ); }

    title() { return this.control.title( ); }

    setTitle(title) { this.control.title( title ); }

    content() { return this.control.content( ); }

    setContent(content) { this.control.content( content ); }

    destroy() {
        super.destroy( );
        this.control.destroy( );
    }
}

class KendoDrawer extends KendoControl {
    constructor(containerId, options, initialize = true) {
        const defaultOptions = {
            ...options
        };
        super( containerId, "kendoDrawer", defaultOptions, initialize );
    }

    show() { this.control.show( ); }

    hide() { this.control.hide( ); }

    toggle() { this.control.toggle( ); }

    enable() { this.control.enable( true ); }

    disable() { this.control.enable( false ); }
}

class KendoExpansionPanel extends KendoControl {
    constructor(containerId, options, initialize = true) {
        const defaultOptions = {
            ...options
        };

        super( containerId, "kendoExpansionPanel", defaultOptions, initialize );
    }

    expand() { this.control.expand( ); }

    collapse() { this.control.collapse( ); }

    toggle() { this.control.toggle( ); }

    enable() { this.control.enable( true ); }

    disable() { this.control.enable( false ); }

    destroy() {
        super.destroy( );
        this.control.destroy( );
    }
}

class KendoFilterMenu extends KendoControl {
    constructor(containerId, options, initialize = true) {
        const defaultOptions = {
            ...options
        };
        super( containerId, "kendoFilterMenu", defaultOptions, initialize );
    }

    applyFilters() { this.control.applyFilters( ); }

    clearFilters() { this.control.clearFilters( ); }

    enable() { this.control.enable( true ); }

    disable() { this.control.enable( false ); }
}

class KendoFab extends KendoControl {
    constructor(containerId, options, initialize = true) {
        const defaultOptions = {
            ...options
        };
        super( containerId, "kendoFab", defaultOptions, initialize );
    }

    open() { this.control.open( ); }

    close() { this.control.close( ); }

    toggle() { this.control.toggle( ); }

    enable() { this.control.enable( true ); }

    disable() { this.control.enable( false ); }
}

class KendoGantt extends KendoControl {
    constructor(containerId, options, initialize = true) {
        const defaultOptions = {
            ...options
        };
        super( containerId, "kendoGantt", defaultOptions, initialize );
    }

    dataSource() { return this.control.dataSource.data( ); }

    setDataSource(data) { this.control.setDataSource( data ); }

    refresh() { this.control.refresh( ); }

    expandAll() { this.control.expandAll( ); }

    collapseAll() { this.control.collapseAll( ); }

    enable() { this.control.enable( true ); }

    disable() { this.control.enable( false ); }
}

class KendoGridSort extends KendoControl {
    constructor(containerId, options, initialize = true) {
        const defaultOptions = {
            ...options
        };

        super( containerId, "kendoGridSort", defaultOptions, initialize );
    }

    sort(columnName, direction) {
        this.control.sort( {
            field: columnName
            , dir: direction
        } );
    }

    clear() { this.control.clear( ); }
}

class KendoGroupable extends KendoControl {
    constructor(containerId, options, initialize = true) {
        const defaultOptions = {
            ...options
        };

        super( containerId, "kendoGroupable", defaultOptions, initialize );
    }

    enable() { this.control.enable( ); }

    disable() { this.control.disable( ); }

    group(columnName) {
        this.control.group( {
            field: columnName
        } );
    }

    clear() { this.control.clear( ); }
}

class KendoLinearGauge extends KendoControl {
    constructor(containerId, options, initialize = true) {
        const defaultOptions = {
            ...options
        };

        super( containerId, "kendoLinearGauge", defaultOptions, initialize );
    }

    value(value) {
        if ( value !== undefined ) {
            this.control.value( value );
        } else {
            return this.control.value( );
        }
    }

    redraw() { this.control.redraw( ); }

    destroy() {
        super.destroy( );
        this.control.destroy( );
    }
}

class KendoListView extends KendoControl {
    constructor(containerId, options, initialize = true) {
        const defaultOptions = {
            ...options
        };

        super( containerId, "kendoListView", defaultOptions, initialize );
    }

    dataSource() { return this.control.dataSource; }

    refresh() { this.control.refresh( ); }

    destroy() {
        super.destroy( );
        this.control.destroy( );
    }
}

class KendoMenu extends KendoControl {
    constructor(containerId, options, initialize = true) {
        const defaultOptions = {
            ...options
        };

        super( containerId, "kendoMenu", defaultOptions, initialize );
    }

    enable() { this.control.enable( true ); }

    disable() { this.control.enable( false ); }

    open(element) { this.control.open( element ); }

    close(element) { this.control.close( element ); }

    destroy() {
        super.destroy( );
        this.control.destroy( );
    }
}

class KendoMenuButton extends KendoControl {
    constructor(containerId, options, initialize = true) {
        const defaultOptions = {
            ...options
        };

        super( containerId, "kendoMenuButton", defaultOptions, initialize );
    }

    enable() { this.control.enable( true ); }

    disable() { this.control.enable( false ); }

    open() { this.control.open( ); }

    close() { this.control.close( ); }

    toggle() { this.control.toggle( ); }

    destroy() {
        super.destroy( );
        this.control.destroy( );
    }
}

class KendoMultiSelect extends KendoControl {
    constructor(containerId, options, initialize = true) {
        const defaultOptions = {
            ...options
        };

        super( containerId, "kendoMultiSelect", defaultOptions, initialize );
    }

    value(values) {
        if ( values !== undefined ) {
            this.control.value( values );
        } else {
            return this.control.value( );
        }
    }

    enable() { this.control.enable( true ); }

    disable() { this.control.enable( false ); }

    refresh() { this.control.refresh( ); }

    destroy() {
        super.destroy( );
        this.control.destroy( );
    }
}

class KendoNotification extends KendoControl {
    constructor(containerId, options, initialize = true) {
        const defaultOptions = {
            position: {
                right: 0
                , bottom: 0
            }
            , stacking: "up"
            , autoHideAfter: 0
            , hideOnClick: true
            , templates: [
                {
                    type: "info"
                    , template:
                        "<div class='k-notification-wrap'><span class='k-icon k-i-info'></span><h3>#= title #</h3><p>#= message #</p></div>"
                }
                , {
                    type: "success"
                    , template:
                        "<div class='k-notification-wrap'><span class='k-icon k-i-tick'></span><h3>#= title #</h3><p>#= message #</p></div>"
                }
                , {
                    type: "warning"
                    , template:
                        "<div class='k-notification-wrap'><span class='k-icon k-i-warning'></span><h3>#= title #</h3><p>#= message #</p></div>"
                }
                , {
                    type: "error"
                    , template:
                        "<div class='k-notification-wrap'><span class='k-icon k-i-warning'></span><h3>#= title #</h3><p>#= message #</p></div>"
                }
            ]
            , animation: {
                open: {
                    effects: "slideIn:left"
                }
                , close: {
                    effects: "slideIn:left"
                    , reverse: true
                }
            }
            , ...options
        };

        super( containerId, "kendoNotification", defaultOptions, initialize );
    }

    show(data, type = "info") { this.control.show( data, type ); }

    hide() { this.control.hide( ); }

    destroy() {
        super.destroy( );
        this.control.destroy( );
    }
}

class KendoPanelBar extends KendoControl {
    constructor(containerId, options, initialize = true) {
        const defaultOptions = {
            ...options
        };
        super( containerId, "kendoPanelBar", defaultOptions, initialize );
    }

    expandAll() { this.control.expand( ".k-item" ); }

    collapseAll() { this.control.collapse( ".k-item" ); }

    enable() { this.control.enable( true ); }

    disable() { this.control.enable( false ); }
}

class KendoPivotConfigurator extends KendoControl {
    constructor(containerId, options, initialize = true) {
        const defaultOptions = {
            ...options
        };

        super( containerId, "kendoPivotConfigurator", defaultOptions, initialize );
    }

    refresh() { this.control.refresh( ); }

    destroy() {
        super.destroy( );
        this.control.destroy( );
    }
}

class KendoPivotGrid extends KendoControl {
    constructor(containerId, options, initialize = true) {
        const defaultOptions = {
            ...options
        };

        super( containerId, "kendoPivotGrid", defaultOptions, initialize );
    }

    refresh() { this.control.refresh( ); }

    destroy() {
        super.destroy( );
        this.control.destroy( );
    }
}

class KendoPopup extends KendoControl {
    constructor(containerId, options, initialize = true) {
        const defaultOptions = {
            ...options
        };

        super( containerId, "kendoPopup", defaultOptions, initialize );
    }

    open() { this.control.open( ); }

    close() { this.control.close( ); }

    destroy() {
        super.destroy( );
        this.control.destroy( );
    }
}

class KendoPopover extends KendoControl {
    constructor(containerId, options, initialize = true) {
        const defaultOptions = {
            ...options
        };

        super( containerId, "kendoPopover", defaultOptions, initialize );
    }

    show(targetElement) { this.control.show( targetElement ); }

    hide() { this.control.hide( ); }

    toggle(targetElement) { this.control.toggle( targetElement ); }

    enable() { this.control.enable( true ); }

    disable() { this.control.enable( false ); }

    destroy() {
        super.destroy( );
        this.control.destroy( );
    }
}

class KendoProgressBar extends KendoControl {
    constructor(containerId, options, initialize = true) {
        const defaultOptions = {
            ...options
        };

        super( containerId, "kendoProgressBar", defaultOptions, initialize );
    }

    value(value) {
        if ( value !== undefined ) {
            this.control.value( value );
        } else {
            return this.control.value( );
        }
    }

    enable() { this.control.enable( true ); }

    disable() { this.control.enable( false ); }

    destroy() {
        super.destroy( );
        this.control.destroy( );
    }
}

class KendoRangeSlider extends KendoControl {
    constructor(containerId, options, initialize = true) {
        const defaultOptions = {
            ...options
        };

        super( containerId, "kendoRangeSlider", defaultOptions, initialize );
    }

    value() { return this.control.value( ); }

    enable() { this.control.enable( true ); }

    disable() { this.control.enable( false ); }

    destroy() {
        super.destroy( );
        this.control.destroy( );
    }
}

class KendoRating extends KendoControl {
    constructor(containerId, options, initialize = true) {
        const defaultOptions = {
            ...options
        };

        super( containerId, "kendoRating", defaultOptions, initialize );
    }

    value(value) {
        if ( value !== undefined ) {
            this.control.value( value );
        } else {
            return this.control.value( );
        }
    }

    enable() { this.control.enable( true ); }

    disable() { this.control.enable( false ); }

    destroy() {
        super.destroy( );
        this.control.destroy( );
    }
}

class KendoRadioGroup extends KendoControl {
    constructor(containerId, options, initialize = true) {
        const defaultOptions = {
            ...options
        };

        super( containerId, "kendoRadioGroup", defaultOptions, initialize );
    }

    value() { return this.control.value( ); }

    setValue(value) { this.control.value( value ); }

    enable() { this.control.enable( true ); }

    disable() { this.control.enable( false ); }

    destroy() {
        super.destroy( );
        this.control.destroy( );
    }
}

class KendoScrollView extends KendoControl {
    constructor(containerId, options, initialize = true) {
        const defaultOptions = {
            ...options
        };

        super( containerId, "kendoScrollView", defaultOptions, initialize );
    }

    enable() { this.control.enable( true ); }

    disable() { this.control.enable( false ); }

    refresh() { this.control.refresh( ); }

    destroy() {
        super.destroy( );
        this.control.destroy( );
    }
}

class KendoScrollable extends KendoControl {
    constructor(containerId, options, initialize = true) {
        const defaultOptions = {
            ...options
        };

        super( containerId, "kendoScrollable", defaultOptions, initialize );
    }

    enable() { this.control.enable( true ); }

    disable() { this.control.enable( false ); }

    refresh() { this.control.refresh( ); }

    destroy() {
        super.destroy( );
        this.control.destroy( );
    }
}

class KendoSelectBox extends KendoControl {
    constructor(containerId, options, initialize = true) {
        const defaultOptions = {
            ...options
        };

        super( containerId, "kendoSelectBox", defaultOptions, initialize );
    }

    value(value) {
        if ( value !== undefined ) {
            this.control.value( value );
        } else {
            return this.control.value( );
        }
    }

    enable() { this.control.enable( true ); }

    disable() { this.control.enable( false ); }

    refresh() { this.control.refresh( ); }

    destroy() {
        super.destroy( );
        this.control.destroy( );
    }
}

class KendoSideMenu extends KendoControl {
    constructor(containerId, options, initialize = true) {
        const defaultOptions = {
            ...options
        };

        super( containerId, "kendoSideMenu", defaultOptions, initialize );
    }

    enable() { this.control.enable( true ); }

    disable() { this.control.enable( false ); }

    expand(item) { this.control.expand( item ); }

    collapse(item) { this.control.collapse( item ); }

    destroy() {
        super.destroy( );
        this.control.destroy( );
    }
}

class KendoSlider extends KendoControl {
    constructor(containerId, options, initialize = true) {
        const defaultOptions = {
            ...options
        };

        super( containerId, "kendoSlider", defaultOptions, initialize );
    }

    value(value) {
        if ( value !== undefined ) {
            this.control.value( value );
        } else {
            return this.control.value( );
        }
    }

    enable() { this.control.enable( true ); }

    disable() { this.control.enable( false ); }

    refresh() { this.control.refresh( ); }

    destroy() {
        super.destroy( );
        this.control.destroy( );
    }
}

class KendoSplitter extends KendoControl {
    constructor(containerId, options, initialize = true) {
        const defaultOptions = {
            ...options
        };

        super( containerId, "kendoSplitter", defaultOptions, initialize );
    }

    expand(pane) { this.control.expand( pane ); }

    collapse(pane) { this.control.collapse( pane ); }

    toggle(pane) { this.control.toggle( pane ); }

    enable() { this.control.enable( true ); }

    disable() { this.control.enable( false ); }

    refresh() { this.control.refresh( ); }

    destroy() {
        super.destroy( );
        this.control.destroy( );
    }
}

class KendoStepper extends KendoControl {
    constructor(containerId, options, initialize = true) {
        const defaultOptions = {
            ...options
        };

        super( containerId, "kendoStepper", defaultOptions, initialize );
    }

    next() { this.control.next( ); }

    prev() { this.control.prev( ); }

    enable() { this.control.enable( true ); }

    disable() { this.control.enable( false ); }

    refresh() { this.control.refresh( ); }

    destroy() {
        super.destroy( );
        this.control.destroy( );
    }
}

class KendoStockChart extends KendoControl {
    constructor(containerId, options, initialize = true) {
        const defaultOptions = {
            ...options
        };

        super( containerId, "kendoStockChart", defaultOptions, initialize );
    }

    refresh() { this.control.refresh( ); }

    destroy() {
        super.destroy( );
        this.control.destroy( );
    }
}

class KendoSwitch extends KendoControl {
    constructor(containerId, options, initialize = true) {
        const defaultOptions = {
            ...options
        };

        super( containerId, "kendoSwitch", defaultOptions, initialize );
    }

    value(value) {
        if ( value !== undefined ) {
            this.control.value( value );
        } else {
            return this.control.value( );
        }
    }

    enable() { this.control.enable( true ); }

    disable() { this.control.enable( false ); }

    toggle() { this.control.toggle( ); }

    refresh() { this.control.refresh( ); }

    destroy() {
        super.destroy( );
        this.control.destroy( );
    }
}

class KendoTabStrip extends KendoControl {
    constructor(containerId, options, initialize = true) {
        const defaultOptions = {
            ...options
        };
        super( containerId, "kendoTabStrip", defaultOptions, initialize );
    }

    count() { return this.control.items( ).length }

    activateTab(index) { this.control.select( index ); }

    disableTab(index) { this.control.enable( index, false ); }

    enableTab(index) { this.control.enable( index, true ); }

    reloadTab(index) { this.control.reload( this.control.tabGroup.children( )[ index ] ); }

    appendTab(tab) {
        const tabStrip = this.control;

        // Check if a similar tab already exists
        const exists = this.tabExists( tab.text );

        if ( exists ) {
            // Select the existing tab
            this.selectTab( this.getTabIndex( tab.text ) );
        } else {
            // Append the new tab
            tabStrip.append( tab );
        }
    }

    selectTab(index) { this.control.select( index ); }

    removeTab(index) {
        const tabStrip = this.control;
        const tab = this.getTab( index );
        let otherTab = tab.next( );
        otherTab = otherTab.length ? otherTab : tab.prev( );

        tabStrip.remove( tab );
        tabStrip.select( otherTab );
    }

    getTab(index) {
        const tabStrip = this.control;
        return tabStrip.tabGroup.children( "li" ).eq( index );
    }

    getTabIndex(text) {
        const tabStrip = this.control;
        let index = -1;
        const liList = tabStrip.items( );

        for ( let li of $( liList ) ) {
            if ( $( li ).find( ".k-link" )[ 0 ].innerHTML === text ) {
                index = $( li ).index( );
                break;
            }
        }

        return index;
    }

    tabExists(tabText) {
        const tabStrip = this.control;
        const tabStripElement = tabStrip.tabGroup;

        // Check if a tab with similar text already exists within the tab strip
        // text is stashed below levels of span tags
        const exists = tabStripElement.children( )
            .toArray( )
            .some( (element) => { return $( $( element ).find( ".k-link" )[ 0 ] ).first( ).html( ) === tabText; } );

        return exists;
    }
}

class KendoTooltip extends KendoControl {
    constructor(containerId, options, initialize = true) {
        const defaultOptions = {
            ...options
        };

        super( containerId, "kendoTooltip", defaultOptions, initialize );
    }

    content(content) {
        if ( content !== undefined ) {
            this.control.content( content );
        } else {
            return this.control.content( );
        }
    }

    show(target) { this.control.show( target ); }

    hide() { this.control.hide( ); }

    refresh() { this.control.refresh( ); }

    destroy() {
        super.destroy( );
        this.control.destroy( );
    }
}

class KendoTreeView extends KendoControl {
    constructor(containerId, options, initialize = true) {
        const defaultOptions = {
            ...options
        };

        super( containerId, "kendoTreeView", defaultOptions, initialize );
    }

    expand(node) { this.control.expand( node ); }

    collapse(node) { this.control.collapse( node ); }

    select(node) { this.control.select( node ); }

    unselect(node) { this.control.unselect( node ); }

    enable() { this.control.enable( true ); }

    disable() { this.control.enable( false ); }

    refresh() { this.control.refresh( ); }

    destroy() {
        super.destroy( );
        this.control.destroy( );
    }
}

class KendoUpload extends KendoControl {
    constructor(containerId, options, initialize = true) {
        const defaultOptions = {
            ...options
        };

        super( containerId, "kendoUpload", defaultOptions, initialize );
    }

    enable() { this.control.enable( true ); }

    disable() { this.control.enable( false ); }

    upload() { this.control.upload( ); }

    cancel() { this.control.cancel( ); }

    clearAllFiles() { this.control.clearAllFiles( ); }

    removeFileByUid(uid) { this.control.removeFileByUid( uid ); }

    destroy() {
        super.destroy( );
        this.control.destroy( );
    }
}

class KendoValidator extends KendoControl {
    constructor(containerId, options, initialize = true) {
        const defaultOptions = {
            ...options
        };

        super( containerId, "kendoValidator", defaultOptions, initialize );
    }

    validate() { return this.control.validate( ); }

    validateInput(input) { return this.control.validateInput( input ); }

    errors() { return this.control.errors( ); }

    hideMessages() { this.control.hideMessages( ); }

    showErrors(errors) { this.control.showErrors( errors ); }

    addRule(input, rule) { this.control.addRule( input, rule ); }

    removeRule(input, rule) { this.control.removeRule( input, rule ); }

    destroy() {
        super.destroy( );
        this.control.destroy( );
    }
}

class KendoWindow extends KendoControl {
    constructor(containerId, options, initialize = true) {
        // Merge the provided options with any default options
        const defaultOptions = {
            ...options
        };

        // Call the base class constructor with the necessary parameters
        super( containerId, "kendoWindow", defaultOptions, initialize );
    }

    // Additional methods specific to the KendoWindow control
    open() { this.control.open( ); }

    close() { this.control.close( ); }

    refresh() { this.control.refresh( ); }

    minimize() { this.control.minimize( ); }

    maximize() { this.control.maximize( ); }

    restore() { this.control.restore( ); }

    pin() { this.control.pin( ); }

    unpin() { this.control.unpin( ); }

    enable() { this.control.enable( true ); }

    disable() { this.control.enable( false ); }
}

//this is to prevent the usage of eval, or window[controlName]
const controlClassMap = {
    kendoActionSheet: KendoActionSheet
    , kendoAutoComplete: KendoAutoComplete
    , kendoBreadcrumb: KendoBreadcrumb
    , kendoButton: KendoButton
    , kendoCalendar: KendoCalendar
    , kendoChart: KendoChart
    , kendoColorPicker: KendoColorPicker
    , kendoContextMenu: KendoContextMenu
    , kendoDateTimePicker: KendoDateTimePicker
    , kendoDateRangePicker: KendoDateRangePicker
    , kendoDialog: KendoDialog
    , kendoDrawer: KendoDrawer
    , kendoDropDownList: KendoDropDownList
    , kendoExpansionPanel: KendoExpansionPanel
    , kendoGrid: KendoGrid
//    , kendoListBox: KendoListBox
    , kendoListView: KendoListView
    , kendoMenu: KendoMenu
    , kendoMultiColumnComboBox: KendoMultiColumnComboBox
//    , kendoMultiGrid: KendoMultiGrid
    , kendoMultiSelect: KendoMultiSelect
    , kendoNotification: KendoNotification
    , kendoNumericTextBox: KendoNumericTextBox
    , kendoPanelBar: KendoPanelBar
    , kendoPivotConfigurator: KendoPivotConfigurator
    , kendoPivotGrid: KendoPivotGrid
//    , kendoPivotGridDetail: KendoPivotGridDetail
    , kendoPopup: KendoPopup
    , kendoPopover: KendoPopover
    , kendoProgressBar: KendoProgressBar
//    , kendoRangeBar: KendoRangeBar
    , kendoRangeSlider: KendoRangeSlider
    , kendoRating: KendoRating
//    , kendoResizeSensors: KendoResizeSensors
    , kendoScrollable: KendoScrollable
    , kendoScrollView: KendoScrollView
    , kendoSelectBox: KendoSelectBox
    , kendoSideMenu: KendoSideMenu
    , kendoSlider: KendoSlider
    , kendoSplitter: KendoSplitter
    , kendoStepper: KendoStepper
    , kendoStockChart: KendoStockChart
    , kendoSwitch: KendoSwitch
    , kendoTabStrip: KendoTabStrip
    , kendoTextArea: KendoTextArea
    , kendoTextBox: KendoTextBox
    , kendoTimePicker: KendoTimePicker
    , kendoTooltip: KendoTooltip
    , kendoTreeView: KendoTreeView
    , kendoUpload: KendoUpload
    , kendoValidator: KendoValidator
    , kendoWindow: KendoWindow
};
