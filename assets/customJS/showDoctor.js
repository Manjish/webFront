$(document).ready(function () {
    var hosId = "";
    var token = localStorage.getItem('usertoken');
    $.ajax({
        url: 'http://localhost:7777/users/me',
        type: 'get',
        beforeSend: function (xhr) {
            if (token) {
                xhr.setRequestHeader('Authorization', 'Bearer ' + token);
            }
        },
        success: function (data) {
            $("#usernameValue").append(data.username);
        },
        error: function () {
            location.href = "login.html";
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

    $.getJSON('http://localhost:7777/getAllHospitals', function (res) {
        console.log(res);
        $.each(res, function (index) {
            $("#list").append('<option value="' + res[index]._id + '">' + res[index]
                .hosName + '</option>');
        });
    });

    $("#list").on('change', function () {
        hosId = $(this).children("option:selected").val();
        if (hosId != "") {
          $("#docRow").text("");
            $.getJSON('http://localhost:7777/getDoctors/' + hosId, function (res) {
                $.each(res, function (index) {
                    
                    $("#docRow").append("<div class='card' style='width: 18rem;' id='doctorCard'>"+
"<img id='docImage' class='card-img-top mx-auto d-block' src='http://localhost:7777/uploads/"+res[index].docImage+"' alt='Card image cap'>"+
"<div class='card-body text-center'>"+
"<h5 class='card-title'>"+res[index].docName+"</h5>"+
"<p class='card-text'>"+res[index].docDepartment+"</p>"+
"<a href='doctorDetails.html?docId="+res[index]._id+"' class='btn btn-primary'>View Profile</a>"+
"</div></div>");

                });
            })
        }
    })
});
