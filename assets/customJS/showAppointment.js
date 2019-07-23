$(document).ready(function () {

    var token = localStorage.getItem('usertoken');
    var username = localStorage.getItem('username');


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

    var dt = $('#bookingTable').DataTable({
        "columnDefs": [{
            "targets": -1,
            "data": null,
            "defaultContent": "<button type='button' id='btnDetails' class='btn btn-success' data-toggle='modal' style='margin:10px;width:100px;'>Details</button>"
        }],
        "columns": [
            null,
            {
                "width": "20%"
            },
            {
                "width": "20%"
            },
            {
                "width": "20%"
            },
            {
                "width": "20%"
            },
            {
                "width": "20%"
            },
            {
                "width": "20%"
            }
        ]
    });
    console.log(username)
    $.getJSON('http://localhost:7777/getAllBooking/' + username, function (res) {
        console.log(res)
        $.each(res, function (index) {

            $.getJSON("http://localhost:7777/getSingleHospital/" + res[index]
                .bookingHosId,
                function (hosRes) {
                    var hospitalName = "";
                    hospitalName = hosRes.hosName

                    $.getJSON("http://localhost:7777/getDoctorById/" + res[index]
                        .bookingDocId,
                        function (docRes) {
                            var docName = "";
                            docName = docRes.docName

                            var statusStr="";
                            if(res[index].bookingStatus=="0"){
                                statusStr="Upcoming"
                            }
                            else if(res[index].bookingStatus=="1"){
                                statusStr="Completed"
                            }else{
                                statusStr="Canceled"
                            }

                            dt.row.add([
                                res[index]._id,
                                docName,
                                res[index].bookingDepartment,
                                hospitalName,
                                res[index].bookingDate,
                                statusStr
                            ]).draw(false);
                        })



                });
        });
    });
    $('#bookingTable tbody').on('click', '#btnDetails', function () {

        var book_data = dt.row($(this).parents('tr')).data();
        var id = book_data[0];
        if (book_data[5] == "Upcoming") {
            $("#statusText").html("<p>Upcoming</p>")
            $("#statusText").css({
                'color': 'green',
                'font-weight': 'bold'
            })
            $("#statusAction").html(
                "<button type='button' id='btnCancel' class='btn btn-danger'>Cancel Appointment</button>"
                );

            $("#btnCancel").on('click', function () {
                if (confirm("Do you want to cancel this apppointment ?")) {
                    $.ajax({
                        type: 'PUT',
                        url: 'http://localhost:7777/cancelBooking/' + id,
                        beforeSend: function (xhr) {
                            if (token) {
                                xhr.setRequestHeader('Authorization',
                                    'Bearer ' + token);
                            }
                        },
                        success: function () {
                            location.href = "showAppointment.html"
                        },
                        error: function () {
                            alert("Couldn't cancel the appointment.");
                        }
                    });
                }
            })
        } else if (book_data[5] == "Completed") {
            $("#statusText").html("<p>Completed</p>")
            $("#statusText").css({
                'color': 'green',
                'font-weight': 'bold'
            })
            $("#statusAction").html(
                "<button type='button' class='btn btn-secondary' data-dismiss='modal'>Close</button>"
                );
        } else {
            $("#statusText").html("<p>Canceled</p>")
            $("#statusText").css({
                'color': 'red',
                'font-weight': 'bold'
            })
            $("#statusAction").html(
                "<button type='button' class='btn btn-secondary' data-dismiss='modal'>Close</button>"
                );
        }
        $('#myModal').modal('show');
    })
});