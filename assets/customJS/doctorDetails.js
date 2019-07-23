$(document).ready(function(){
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
    var docId = urlParams.get("docId");

    $.getJSON('http://localhost:7777/getDoctorById/'+docId, function (res) {
    $("#doctorName").text(res.docName);
    $("#doctorDetails").text(res.docDetails);
    $("#doctorEducation").text(res.docEducation);
    var hosId=res.docHosName;
    $.getJSON('http://localhost:7777/getSingleHospital/'+hosId, function (hos) {
        $("#doctorHospital").text(hos.hosName);
    
    })
    $("#doctorDepartment").text(res.docDepartment);
    $("#doctorImage").attr("src","http://localhost:7777/uploads/"+res.docImage);
    var times=[]
    times = res.docAvailable;
                    $("#timeTable").html("<tr><td>Sunday</td><td>" +
                        times[0].time + "</td></tr>" +
                        "<tr><td>Monday</td><td>" +
                        times[1].time + "</td></tr>" +
                        "<tr><td>Tuesday</td><td>" +
                        times[2].time + "</td></tr>" +
                        "<tr><td>Wednesday</td><td>" +
                        times[3].time + "</td></tr>" +
                        "<tr><td>Thursday</td><td>" +
                        times[4].time + "</td></tr>" +
                        "<tr><td>Friday</td><td>" +
                        times[5].time + "</td></tr>" +
                        "<tr><td>Saturday</td><td>" +
                        times[6].time + "</td></tr>"
                    )
    });
})