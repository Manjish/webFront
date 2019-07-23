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

    $.getJSON('http://localhost:7777/getAllHospitals', function (res) {
        
        $.each(res, function (index) {
            $("#hospitalList").append('<option value="'+res[index]._id+'">' + res[index].hosName + '</option>');
        });
    });

    $("#hospitalList").on('change', function () {
        var id =  $(this).children("option:selected").val();
        $("#departmentList").text('<option></option>');
        if (id != "") {
            $.getJSON('http://localhost:7777/getDepartments/' + id, function (res) {
               
                var dataDep = []
                    dataDep = res.hosDepartments;
                $.each(dataDep, function (index) {
                        $("#departmentList").append('<option>' + dataDep[index].department +
                            '</option>');

                });
            })
            $("#departmentList").prepend('<option selected="selected" disabled>--Select a department--</option>');
            
        }
    })


    let imageFile = '';
    $("#docImage").on('change', function () {
        let formData = new FormData();
        let files = $("#docImage").get(0).files;
        if (files.length > 0) {
            formData.append("imageFile", files[0]);
        }
        $.ajax({
            type: 'POST',
            url: 'http://localhost:7777/uploadDocImage',
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

    $("#addDoc").on('click', function () {
        var time = [];
        var test = "";
        var sunday,monday,tuesday,wednesday,thursday,friday,saturday="";
        sunday=$("#sunday").val();
        monday=$("#monday").val();
        tuesday=$("#tuesday").val();
        wednesday=$("#wednesday").val();
        thursday=$("#thursday").val();
        friday=$("#friday").val();
        saturday=$("#saturday").val();
        
        time.push(sunday,monday,tuesday,wednesday,thursday,friday,saturday);
        test = time.join(",");
        
        

        let doctorData = {
            docName: $("#docName").val(),
            docDetails: $("#docDetails").val(),
            docEducation: $("#docEducation").val(),
            docHosName: $("#hospitalList").val(),
            docDepartment: $("#departmentList").val(),
            docImage: imageFile,
            docAvailable: test

        };
        console.log(doctorData);


        $.ajax({
            type: 'POST',
            url: 'http://localhost:7777/addDoctor',
            data: doctorData,
            beforeSend: function (xhr) {
                if (token) {
                    xhr.setRequestHeader('Authorization', 'Bearer ' + token);
                }
            },
            success: function (hospitalData) {
                alert("Added successfully")
                imageFile = '';
                 location.href = "adminAddDoctor.html";
            },
            error: function () {
                alert("Fill all the form fields!");
            }
        });
    });
});