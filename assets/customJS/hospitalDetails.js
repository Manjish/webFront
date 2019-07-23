$(document).ready(function () {
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

    var urlParams = new URLSearchParams(window.location.search);
    var hosId = urlParams.get("hosId");

    $.getJSON('http://localhost:7777/getSingleHospital/' + hosId, function (res) {

        $('#hospitalRow').append("<div class = 'col-sm-8'>" +
            "<img src='http://localhost:7777/uploads/" + res.hosImage +
            "' style='width: 100%; height: 700px;'></div>" +
            "<div class='col-sm-4'>" +
            "<h2>" + res.hosName + "</h2><br/>" +
            "<h4><i class = 'fa fa-info-circle'></i>  Details:</h4>" +
            "<p>" + res.hosDetails + "</p>" +
            "<h4><i class = 'fa fa-map-marker'></i>  Address:</h4>" +
            "<p>" + res.hosAddress + "</p>" +
            "<h4><i class = 'fa fa-phone'></i>  Phone:</h4>" +
            "<p>" + res.hosContact + "</p>" +
            "<h4><i class = 'fa fa-envelope'></i>  Email:</h4>" +
            "<p>" + res.hosEmail + "</p>" +
            "<h4><i class = 'fa fa-globe'></i>  Website:</h4>" +
            "<p>" + res.hosWebsite + "</p></div>"
        );
    });
});