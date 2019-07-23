$(document).ready(function () {
       
        var token = localStorage.getItem('admintoken');
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

        var dt = $('#docTable').DataTable({
            "columnDefs": [{
                "targets": -1,
                "data": null,
                "defaultContent": "<button type='button' id='btnEditDoc' class='btn btn-primary' style='margin:10px;width:100px;'>Edit</button>" +
                    "<button type='button' id='btnDeleteDoc' class='btn btn-danger' style='margin:10px;width:100px;'>Delete</button>"
            }]
        });
        $.getJSON('http://localhost:7777/getAllDoctors', function (res) {
            
            $.each(res, function (index) {

                var data = []
                data = res[index].docAvailable;
                var availableTime = "";
                var array = [];
                array.push("Sunday : " + data[0].time);
                array.push("Monday : " + data[1].time);
                array.push("Tuesday : " + data[2].time);
                array.push("Wednesday : " + data[3].time);
                array.push("Thursday : " + data[4].time);
                array.push("Friday : " + data[5].time);
                array.push("Saturday : " + data[6].time);
                availableTime = array.join('<br/>');

                $.getJSON("http://localhost:7777/getSingleHospital/" + res[index]
                    .docHosName,
                    function (hosRes) {
                        var hospitalName=" ";
                        hospitalName=hosRes.hosName
                        
                    dt.row.add([
                    res[index]._id,
                    res[index].docName,
                    res[index].docDetails,
                    res[index].docEducation,
                    hospitalName,
                    res[index].docDepartment,
                    "<img src='http://localhost:7777/uploads/" + res[index].docImage +
                    "' width='100px' height='100px'/>",
                    availableTime
                ]).draw(false);
                    })

               
            });
        });
        $('#docTable tbody').on('click', '#btnDeleteDoc', function () {
            var doctor_data = dt.row($(this).parents('tr')).data();
            var id = doctor_data[0];
            if (confirm("Do you want to delete this doctor ?")) {
                $.ajax({
                    type: 'DELETE',
                    url: 'http://localhost:7777/deleteDoctor/' + id,
                    success: function () {
                        location.reload();
                    },
                    error: function () {
                        alert("Couldn't delete the hospital.");
                    }
                });
            }
        });
        $('#docTable tbody').on('click', '#btnEditDoc', function () {
            var doctor_data = dt.row($(this).parents('tr')).data();
            var id = doctor_data[0];
            location.href = "adminEditDoctor.html?docId=" + id;
        });


    });
