$(document).ready(function () {
    var token = localStorage.getItem('admintoken');
    $.ajax({
    url: 'http://localhost:7777/users/me',
    type: 'get',
    beforeSend: function(xhr) {
      if (token) {
        xhr.setRequestHeader('Authorization', 'Bearer ' + token);
      }
    },
    success: function(data) {
       $("#usernameValue").append(data.username);                                      
    },
    error: function() {
      location.href="login.html";
    }
  });

  $("#logoutClick").click(function () {
    if (confirm("Do you want to logout ?")) {
        $.ajax({
            url: 'http://localhost:7777/logout',
            type: 'post',
            beforeSend: function (xhr) {
                if (token) {
                    xhr.setRequestHeader('Authorization', 'Bearer ' + token);
                }
            },
            success: function () {
                location.href = 'index.html';
            },
            error: function (error) {
                console.log(error);
            }
        })
    }
})
    let imageFile = '';
    $("#hospitalImage").on('change', function () {
        let formData = new FormData();
        let files = $("#hospitalImage").get(0).files;
        if (files.length > 0) {
            formData.append("imageFile", files[0]);
        }
        $.ajax({
            type: 'POST',
            url: 'http://localhost:7777/uploadHosImage',
            contentType: false,
            cache: false,
            processData: false,
            data: formData,
            beforeSend: function (xhr) {
                if (token) {
                    xhr.setRequestHeader('Authorization', 'Bearer ' + token);
                }
            },
            success: function (data) {
                imageFile = data.filename;
                console.log(data.filename)
            },
            error: function () {
                alert("Image upload failed!");
            }
        });
    });

    $("#addHos").on('click', function () {
         var departments=[];
         var test="";
        $.each($("input[name='department']:checked"), function(){            
            departments.push($(this).val());
        });
        test=departments.join(",");
        
        
        let hospitalData = {
            hosName: $("#hospitalname").val(),
            hosDetails: $("#hospitaldetails").val(),
            hosAddress: $("#hospitaladdress").val(),
            hosContact: $("#hospitalcontact").val(),
            hosEmail: $("#hospitalemail").val(),
            hosWebsite: $("#hospitalwebsite").val(),
            hosImage: imageFile,
            hosDepartmentsString:test

        };
        console.log(hospitalData);
        

        $.ajax({
            type: 'POST',
            url: 'http://localhost:7777/addHospital',
            data: hospitalData,
            beforeSend: function (xhr) {
                if (token) {
                    xhr.setRequestHeader('Authorization', 'Bearer ' + token);
                }
            },
            success: function (hospitalData) {
                alert("Added successfully")
                imageFile = '';
                location.reload();
            },
            error: function () {
                alert("Fill all the form fields!");
            }
        });
    });
});