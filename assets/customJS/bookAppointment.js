$(document).ready(function () {
    var today = new Date();
    var dd = today.getDate() ;
    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();
    if (dd < 10) {
        dd = '0' + dd
    }
    if (mm < 10) {
        mm = '0' + mm
    }

    var minDate = yyyy + '-' + mm + '-' + dd;
    document.getElementById("appointDate").setAttribute("min", minDate);

    var hosId = "";
    var token = localStorage.getItem('usertoken');
    var username="";
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
            username=data.username;
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
        $.each(res, function (index) {
            $("#list").append('<option value="' + res[index]._id + '" name="' + res[index]
                .hosName + '">' + res[index]
                .hosName + '</option>');
        });
    });

    $("#list").on('change', function () {
        hosId = $(this).children("option:selected").val();
        $("#list2").text('<option></option>');
        $("#list3").text('<option></option>');
        $("#docName").text("Doctor Name here");
        $("#docDepartment").text("Department here");
        $("#docImage").attr("src", "http://localhost:7777/uploads/user1.png");
        $("#timeTable").text("")
        if (hosId != "") {
            $.getJSON('http://localhost:7777/getDepartments/' + hosId, function (res) {
                console.log(res);
                var dataDep = []
                dataDep = res.hosDepartments;
                $.each(dataDep, function (index) {
                    $("#list2").append('<option>' + dataDep[index].department +
                        '</option>');


                });

                $("#list2").prepend(
                    '<option selected="selected" disabled>--Select a department--</option>'
                );

            })
        }
    })

    $("#list2").on('change', function () {
        var departmentName = $("#list2").val();
        $("#list3").text('<option></option>');
        $("#docName").text("Doctor Name here");
        $("#docDepartment").text("Department here");
        $("#docImage").attr("src", "http://localhost:7777/uploads/user1.png");
        $("#timeTable").text("")
        if (departmentName != "") {

            $.getJSON('http://localhost:7777/getDoctorBy/' + hosId + '/' + departmentName,
                function (res) {
                    $.each(res, function (index) {
                        $("#list3").append('<option value="' + res[index]._id +
                            '" name="' + res[index]
                            .docName + '">' +
                            res[index].docName +
                            '</option>');
                    });
                })
            $("#list3").prepend(
                '<option selected="selected" disabled>--Select a doctor--</option>');
        }

    })

    $("#list3").on('change', function () {
        docId = $(this).children("option:selected").val();
        if (docId != "") {
            $.getJSON('http://localhost:7777/getDoctorById/' + docId,
                function (res) {
                    var times = [];
                    $("#docName").text(res.docName);
                    $("#docDepartment").text(res.docDepartment);
                    $("#docImage").attr("src", "http://localhost:7777/uploads/" + res.docImage);
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
                })
        }
    })

    $("#btnAddAppointment").on('click', function () {

        var selectedHos = $("#list").val();
        var deptName = $("#list2").val();
        var selectedDoc = $("#list3").val();
        var date = $("#appointDate").val();
        var bookingStatus="0";



        if (selectedHos && deptName && selectedDoc && date) {
        var data={
            "bookingUsername":username,
            "bookingHosId":selectedHos,
            "bookingDepartment":deptName,
            "bookingDocId":selectedDoc,
            "bookingDate":date,
            "bookingStatus":bookingStatus
        }    

        $.ajax({
      url: 'http://localhost:7777/checkBooking/',
      type: 'post',
      dataType: 'json',
      async:false,
      data: data,
      success: function (res, textStatus, xhr) {
        if(res=="Found"){
            alert("Same booking already exist");
        }
        else{
            $.ajax({
                url: 'http://localhost:7777/addBooking/',
                type: 'post',
                dataType: 'json',
                data: data,
                success: function (res, textStatus, xhr) {
                  alert("Booking added successfully !!");
                  location.href = "bookAppointment.html";
                },
                error: function (err) {
                  console.log(err);
          
                }
              });
        }
      },
      error: function (err) {
        console.log(err);

      }
    });
    
        } else {
            alert("Fill up all fields")
        }
    })

    $("#viewProfile").on('click',function(){
        docId=$("#list3").val();
        location.href="doctorDetails.html?docId="+docId;
    })

});