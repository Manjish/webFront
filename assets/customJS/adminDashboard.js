$(document).ready(function () {
    var token = localStorage.getItem('admintoken');
    var hospitalCount = 0;
    var doctorCount = 0;
    var userCount = 0;
    var bookingCount = 0;

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
        hospitalCount = res.length;
        $("#hospitalCount").text(hospitalCount);
    });
    $.getJSON('http://localhost:7777/getAllDoctors', function (res) {
        doctorCount = res.length;
        $("#doctorCount").text(doctorCount);
    });
    $.getJSON('http://localhost:7777/getAllUsers', function (res) {
        userCount=res.length;
        $("#userCount").text(userCount);
    });
    $.getJSON('http://localhost:7777/getAllBookings', function (res) {
        bookingCount=res.length;
        $("#bookingCount").text(bookingCount);
    });
})