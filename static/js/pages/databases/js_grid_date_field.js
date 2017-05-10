var MyDateField = function(config) {
    jsGrid.Field.call(this, config);
};
 
MyDateField.prototype = new jsGrid.Field({
 
    css: "date-field",            // redefine general property 'css'
    align: "center",              // redefine general property 'align'
 
    //myCustomProperty: "foo",      // custom property
 
    sorter: function(date1, date2) {
        return new Date(date1) - new Date(date2);
    },
 
    itemTemplate: function(value) {
        //return new Date(value).toDateString();
        return moment(value).format("DD.MM.YYYY HH:mm")

    },

    filterTemplate: function() {
        return this._filterPicker = $("<input>").datetimepicker({
            format: 'DD.MM.YYYY HH:mm',
            locale: 'ru',
            icons: {
                time: 'icon-alarm',
                date: 'icon-calendar3',
                up: 'icon-chevron-up',
                down: 'icon-chevron-down',
                previous: 'icon-chevron-left',
                next: 'icon-chevron-right',
                today: 'icon-crosshairs',
                clear: 'icon-bin',
                close: 'icon-close'
            }
        });
    },
 
    editTemplate: function(value) {
        return this._editPicker = $("<input>").datetimepicker({
            format: 'DD.MM.YYYY HH:mm',
            locale: 'ru',
            defaultDate: value,
            icons: {
                time: 'icon-alarm',
                date: 'icon-calendar3',
                up: 'icon-chevron-up',
                down: 'icon-chevron-down',
                previous: 'icon-chevron-left',
                next: 'icon-chevron-right',
                today: 'icon-crosshairs',
                clear: 'icon-bin',
                close: 'icon-close'
            }
        });
    },
 
    insertTemplate: function(value) {
        return this._insertPicker = $("<input>").datetimepicker({
            format: 'DD.MM.YYYY HH:mm',
            locale: 'ru',
            defaultDate: new Date((new Date()).setHours(0, 0, 0, 0)),
            icons: {
                time: 'icon-alarm',
                date: 'icon-calendar3',
                up: 'icon-chevron-up',
                down: 'icon-chevron-down',
                previous: 'icon-chevron-left',
                next: 'icon-chevron-right',
                today: 'icon-crosshairs',
                clear: 'icon-bin',
                close: 'icon-close'
            }
        });
    },
 
    editTemplate: function(value) {
        return this._editPicker = $("<input>").datetimepicker({
            format: 'DD.MM.YYYY HH:mm',
            locale: 'ru',
            defaultDate: value,
            icons: {
                time: 'icon-alarm',
                date: 'icon-calendar3',
                up: 'icon-chevron-up',
                down: 'icon-chevron-down',
                previous: 'icon-chevron-left',
                next: 'icon-chevron-right',
                today: 'icon-crosshairs',
                clear: 'icon-bin',
                close: 'icon-close'
            }
        });
    },

    filterValue: function() {
        if (this._filterPicker.data('DateTimePicker').date()) {
            date_from_picker = new Date(this._filterPicker.data('DateTimePicker').date());
            return moment(date_from_picker).format("YYYY-MM-DDTHH:mm:ss");
        } else {
            return "";
        }
    },
 
    insertValue: function() {
        date_from_picker = new Date(this._insertPicker.data('DateTimePicker').date());
        return moment(date_from_picker).format("YYYY-MM-DDTHH:mm:ss")
    },
 
    editValue: function() {
        date_from_picker = new Date(this._editPicker.data('DateTimePicker').date());
        return moment(date_from_picker).format("YYYY-MM-DDTHH:mm:ss")
    }
});
 
jsGrid.fields.date = MyDateField;
