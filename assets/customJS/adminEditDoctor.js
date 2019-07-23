
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

        $.getJSON('http://localhost:7777/getAllHospitals', function (res) {
            console.log(res);
            $.each(res, function (index) {
                $("#hospitalList").append('<option value="'+res[index]._id+'">' + res[index].hosName + '</option>');
            });
        });

        var urlParams = new URLSearchParams(window.location.search);
        var docId = urlParams.get("docId");
        let imageFile = '';

        $.getJSON('http://localhost:7777/getDoctorById/'+docId,function(res){
            var time=res.docAvailable;
            $("#docName").val(res.docName);
            $("#docDetails").val(res.docDetails);
            $("#docEducation").val(res.docEducation);
            $("#hospitalList").val(res.docHosName);
            var id=$("#hospitalList").val();
            $.getJSON('http://localhost:7777/getDepartments/' + id, function (res) {
                    console.log(res);
                    var dataDep = []
                        dataDep = res.hosDepartments;
                        console.log(dataDep);
                    $.each(dataDep, function (index) {
                            $("#departmentList").append('<option value="'+dataDep[index].department+'">' + dataDep[index].department + 
                                '</option>');

                    });
                })
            $("#departmentList").prepend('<option disabled>--Select a department--</option>');
            $("#departmentList").val(res.docDepartment);
            $("#sunday").val(time[0].time);
            $("#monday").val(time[1].time);
            $("#tuesday").val(time[2].time);
            $("#wednesday").val(time[3].time);
            $("#thursday").val(time[4].time);
            $("#friday").val(time[5].time);
            $("#saturday").val(time[6].time);
            imageFile=res.docImage;
        })
        
        $("#hospitalList").on('change', function () {
            var id =  $(this).children("option:selected").val();
            $("#departmentList").text('<option></option>');
            if (id != "") {
                alert(id)
                $.getJSON('http://localhost:7777/getDepartments/' + id, function (res) {
                    console.log(res);
                    var dataDep = []
                        dataDep = res.hosDepartments;
                        console.log(dataDep);
                    $.each(dataDep, function (index) {
                            $("#departmentList").append('<option>' + dataDep[index].department +
                                '</option>');

                    });
                })
                $("#departmentList").prepend('<option selected="selected" disabled>--Select a department--</option>');
                
            }
        })


        
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

        $("#updateDoc").on('click', function () {
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
            
            console.log("Array:", time);
            console.log("test", test);
            

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
                type: 'PUT',
                url: 'http://localhost:7777/editDoctor/'+docId,
                data: doctorData,
                beforeSend: function (xhr) {
                    if (token) {
                        xhr.setRequestHeader('Authorization', 'Bearer ' + token);
                    }
                },
                success: function (hospitalData) {
                    alert("Updated successfully")
                    imageFile = '';
                     location.href = "adminShowDoctor.html";
                },
                error: function () {
                    alert("Fill all the form fields!");
                }
            });
        });
    });