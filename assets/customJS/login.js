$(document).ready(function () {
    $('#loginBtn').click(function (e) {
      e.preventDefault();
      username = $("#username").val();
      password = $("#password").val();
      data = {
        "username": username,
        "password": password
      }


      $.ajax({
        url: 'http://localhost:7777/login/',
        type: 'post',
        dataType: 'json',
        data: data,
        success: function (res, textStatus, xhr) {
          if(res.token!=null){
          
          if(res.userType == "admin"){
            localStorage.setItem('admintoken', res.token);
            location.href = "adminDashboard.html";  
          }else{
            localStorage.setItem('usertoken', res.token);
            localStorage.setItem('username', username);
          location.href = "dashboard.html";
          }
        }else{
          document.getElementById('message').style.color = 'red';
          document.getElementById('message').innerHTML = 'Invalid login';
        }
        },
        error: function (xhr, textStatus, errorThrown) {
          document.getElementById('message').style.color = 'red';
          document.getElementById('message').innerHTML = 'Invalid login';
        }
      });
      
    });
    });