$(document).ready(function () {
    var token = localStorage.getItem('usertoken');
          $.ajax({
          url: 'http://localhost:7777/users/me',
          type: 'get',
          beforeSend: function(xhr) {
            if (token) {
              xhr.setRequestHeader('Authorization', 'Bearer ' + token);
            }
          },
          success: function(data) {
             $("#usernameValue").append(data.username);                                      
          },
          error: function() {
            location.href="login.html";
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
  
        $.getJSON('http://localhost:7777/getAllHospitals', function(res) {
  
  $.each(res, function(index) {
    $('#rowDiv').append("<div class='col-sm-6 item-block'>"+
      "<img src='http://localhost:7777/uploads/"+res[index].hosImage+"' class='img-fluid' style='width: 650px; height: 400px;'>"+
                      "<a href='hospitalDetails.html?hosId="+res[index]._id+"'><center><h2>"+res[index].hosName+"</h2></center></a>"+
                      "<div class='row'>"+
                    "<div class='col'>"+
                       "<center><img src='assets/img/placeholder.png' style='width: 40px; height: 40px;'></center>"+
                       "<center><h4>"+res[index].hosAddress+"</h4></center></div>"+
                    "<div class='col'>"+
                    "<center><img src='assets/img/phone-receiver.png' style='width: 40px; height: 40px;'></center>"+
                    "<center><h4>"+res[index].hosContact+"</h4></center>"+
                    "</div>"+
                    "</div>"
    );
  });
      });
        
      });