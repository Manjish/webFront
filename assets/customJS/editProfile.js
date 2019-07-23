$(document).ready(function () {
    var token = localStorage.getItem('usertoken');
    var userId;
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
            userId=data._id;
            $("#firstName").val(data.firstname);
            $("#lastName").val(data.lastname);
            $("#username").val(data.username);
            $('input[value="'+data.gender+'"]').attr('checked',true);
            $("#phone").val(data.phone);
            $("#address").val(data.address);
            $("#dob").val(data.dob);
            $("#email").val(data.email);
            $("#password").val(data.password);
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

    $('form.editProfile').on('submit', function (e) {
        e.preventDefault();
        firstname = $("#firstName").val();
        lastname = $("#lastName").val();
        gender = $("#gender").val();
        phone = $("#phone").val();
        address = $("#address").val();
        dob = $("#dob").val();
        email = $("#email").val();
        password = $("#password").val();
        confirmPass = $("#confirm_password").val();
        data = {
            "firstname": firstname,
            "lastname": lastname,
            "gender": gender,
            "phone": phone,
            "address": address,
            "dob": dob,
            "email": email,
            "password": password,
            "userType": "user"
        }

        console.log(data);
        if (password != confirmPass) {
            alert("Password didn't matched")
        } else {
            $.ajax({
                url: 'http://localhost:7777/updateProfile/'+userId,
                type: 'PUT',
                dataType: 'json',
                data: data,
                beforeSend: function (xhr) {
                if (token) {
                    xhr.setRequestHeader('Authorization', 'Bearer ' + token);
                }
            },
                success: function (res, textStatus, xhr) {
                    console.log(res);
                    alert("Updated Successfully !!");
                    location.href = "dashboard.html";
                },
                error: function (err) {
                    console.log(err);

                }
            });
        }


    });
});