$(document).ready(function(){
    $("#export_from_mdb").submit(function(event){
        console.log("submit event");

        event.preventDefault();

        var formData = new FormData();
        formData.append('db', $('#mdb_file')[0].files[0]);
        formData.append('title', $('#mdb_title').val());
        formData.append('description', $('#mdb_description').val());

        $('#mdb_submit').prop('disabled', true);
        $('#mdb_submit').html('<i class="icon-spinner12"></i>');

        $.ajax({
            url: '/databases/add',
            type: 'POST',
            data: formData,
            cache: false,
            contentType: false,
            enctype: 'multipart/form-data',
            processData: false,
            success: function (response) {
              alert('success');
            }
        });


    /*    $.post('/databases/add', data).done(function() {
            window.location.href = '/';
        }).fail(function(res) {
            window.location.href = '/login';
        });
        */

    });
});
