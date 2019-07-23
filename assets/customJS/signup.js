$(document).ready(function () {


    $('form.signup').on('submit',function (e) {
      e.preventDefault();
      firstname = $("#firstName").val();
      lastname = $("#lastName").val();
      username = $("#username").val();
      gender = $("#gender").val();
      phone = $("#phone").val();
      address = $("#address").val();
      dob = $("#dob").val();
      email = $("#email").val();
      password = $("#password").val();
      data = {
        "firstname": firstname,
        "lastname": lastname,
        "username": username,
        "gender": gender,
        "phone": phone,
        "address": address,
        "dob": dob,
        "email": email,
        "password": password,
        "userType": "user"
      }

      if (firstname == null || lastname == null || username == null || gender == null || phone == null || address == null 
      || dob == null || email== null || password== null) {
        alert('Fill up the form')
      } 
      
      else {
        $.ajax({
          url: 'http://localhost:7777/register/',
          type: 'post',
          dataType: 'json',
          data: data,
          success: function (res, textStatus, xhr) {
            alert("Registered Successfully !!");
            location.href = "login.html";
          },
          error: function (err) {
            console.log(err);

          }
        });
      }


    });
  });