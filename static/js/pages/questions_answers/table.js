$(document).ready(function() {
    var options = {
        user_id: window.user_id ? window.user_id : null,
    };

    getTable('/questions_answers/table', options, '#questions_answers_table', function() {});

    $(document).on('click', 'ul.pagination a.page-link', function(e) {
        options.page = e.target.innerHTML;
        getTable('/questions_answers/table', options, '#questions_answers_table');
    });

});
