$(document).ready(function() {
    //process check points list
    var colors = {
        //test : '#355C7D',
        test : '#6c5b7b',
        exam : '#ed5564',
        attestation: '#3eacab'
    };
    var events = [];
    check_points.forEach(function(el) {
        var event_el = {};

        event_el.start = moment(el.start).format('YYYY-MM-DD HH:mm:ss');
        event_el.end = moment(el.end).format('YYYY-MM-DD HH:mm:ss');
        event_el.color = colors[el.type] || '#2d95bf';
        event_el.title = el.title;
        event_el.url = '/check_points/' + el.id;

        events.push(event_el);
    });


    //initialize the calendar
    $('#check_points_calendar').fullCalendar({
        header: {
            left: '',
            center: 'title',
            right: 'prev,next'
        },
        height: $(window).height() * 0.70,
        fixedWeekCount: false,
        timeFormat: 'H:mm',
        monthNames: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
        dayNames: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
        dayNamesShort: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
        firstDay: 1,
        editable: true,
        droppable: true, // this allows things to be dropped onto the calendar
        defaultDate: moment(),
        events: events,
        drop: function() {
            // is the "remove after drop" checkbox checked?
            if ($('#drop-remove').is(':checked')) {
                // if so, remove the element from the "Draggable Events" list
                $(this).remove();
            }
        }
    });

	/* initialize the external events
	-----------------------------------------------------------------*/

	$('#external-events .fc-event').each(function() {

		// Different colors for events
        $(this).css({'backgroundColor': $(this).data('color'), 'borderColor': $(this).data('color')});

		// store data so the calendar knows to render an event upon drop
		$(this).data('event', {
			title: $.trim($(this).text()), // use the element's text as the event title
			color: $(this).data('color'),
			stick: true // maintain when user navigates (see docs on the renderEvent method)
		});

		// make the event draggable using jQuery UI
		$(this).draggable({
			zIndex: 999,
			revert: true,      // will cause the event to go back to its
			revertDuration: 0  //  original position after the drag
		});

	});



	/************************************
	*				gcal				*
	************************************/
	$('#fc-gcal').fullCalendar({

		// THIS KEY WON'T WORK IN PRODUCTION!!!
		// To make your own Google API key, follow the directions here:
		// http://fullcalendar.io/docs/google_calendar/
		googleCalendarApiKey: 'AIzaSyAAZnaZBXLqNBRXjd-82km_NO7GUItyKek',

		// US Holidays
		events: 'en.indian#holiday@group.v.calendar.google.com',


		eventClick: function(event) {
			// opens events in a popup window
			window.open(event.url, 'gcalevent', 'width=700,height=600');
			return false;
		},

		loading: function(bool) {
			$('#loading').toggle(bool);
		}

	});


	/************************************
	*				json				*
	************************************/
	$('#fc-json').fullCalendar({
		header: {
			left: 'prev,next today',
			center: 'title',
			right: 'month,agendaWeek,agendaDay'
		},
		defaultDate: '2016-06-12',
		editable: true,
		eventLimit: true, // allow "more" link when too many events
		events: {
			url: '../../../robust-assets/demo-data/fullcalendar/php/get-events.php',
			error: function() {
				$('#script-warning').show();
			}
		},
		loading: function(bool) {
			$('#loading').toggle(bool);
		}
	});


	/****************************************
	*				Languages				*
	****************************************/
	var initialLangCode = 'en';

	$('#fc-languages').fullCalendar({
		header: {
			left: 'prev,next today',
			center: 'title',
			right: 'month,agendaWeek,agendaDay'
		},
		defaultDate: '2016-06-12',
		lang: initialLangCode,
		buttonIcons: false, // show the prev/next text
		weekNumbers: true,
		editable: true,
		defaultView: 'agendaWeek',
		eventLimit: true, // allow "more" link when too many events
		events: [
			{
				title: 'All Day Event',
				start: '2016-06-01'
			},
			{
				title: 'Long Event',
				start: '2016-06-07',
				end: '2016-06-10'
			},
			{
				id: 999,
				title: 'Repeating Event',
				start: '2016-06-09T16:00:00'
			},
			{
				id: 999,
				title: 'Repeating Event',
				start: '2016-06-16T16:00:00'
			},
			{
				title: 'Conference',
				start: '2016-06-11',
				end: '2016-06-13'
			},
			{
				title: 'Meeting',
				start: '2016-06-12T10:30:00',
				end: '2016-06-12T12:30:00'
			},
			{
				title: 'Lunch',
				start: '2016-06-12T12:00:00'
			},
			{
				title: 'Meeting',
				start: '2016-06-12T14:30:00'
			},
			{
				title: 'Happy Hour',
				start: '2016-06-12T17:30:00'
			},
			{
				title: 'Dinner',
				start: '2016-06-12T20:00:00'
			},
			{
				title: 'Birthday Party',
				start: '2016-06-13T07:00:00'
			},
			{
				title: 'Click for Google',
				url: 'http://google.com/',
				start: '2016-06-28'
			}
		]
	});

	// build the language selector's options
	$.each($.fullCalendar.langs, function(langCode) {
		$('#lang-selector').append(
			$('<option/>')
				.attr('value', langCode)
				.prop('selected', langCode == initialLangCode)
				.text(langCode)
		);
	});

	// when the selected option changes, dynamically change the calendar option
	$('#lang-selector').on('change', function() {
		if (this.value) {
			$('#fc-languages').fullCalendar('option', 'lang', this.value);
		}
	});


	/****************************************
	*				Time Zones				*
	****************************************/
	$('#fc-timezones').fullCalendar({
		header: {
			left: 'prev,next today',
			center: 'title',
			right: 'month,agendaWeek,agendaDay'
		},
		defaultDate: '2016-06-12',
		editable: true,
		selectable: true,
		eventLimit: true, // allow "more" link when too many events
		events: {
			url: '../../../robust-assets/demo-data/fullcalendar/php/get-events.php',
			error: function() {
				$('#script-warning').show();
			}
		},
		loading: function(bool) {
			$('#loading').toggle(bool);
		},
		eventRender: function(event, el) {
			// render the timezone offset below the event title
			if (event.start.hasZone()) {
				el.find('.fc-title').after(
					$('<div class="tzo"/>').text(event.start.format('Z'))
				);
			}
		},
		dayClick: function(date) {
			console.log('dayClick', date.format());
		},
		select: function(startDate, endDate) {
			console.log('select', startDate.format(), endDate.format());
		}
	});

	// load the list of available timezones, build the <select> options
	$.getJSON('../../../robust-assets/demo-data/fullcalendar/php/get-timezones.php', function(timezones) {
		$.each(timezones, function(i, timezone) {
			if (timezone != 'UTC') { // UTC is already in the list
				$('#timezone-selector').append(
					$("<option/>").text(timezone).attr('value', timezone)
				);
			}
		});
	});

	// when the timezone selector changes, dynamically change the calendar option
	$('#timezone-selector').on('change', function() {
		$('#fc-timezones').fullCalendar('option', 'timezone', this.value || false);
	});
});
