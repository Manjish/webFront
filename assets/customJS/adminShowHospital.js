$(document).ready( function () {
          
    var token = localStorage.getItem('admintoken');
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

$("#logoutClick").click(function(){
      if(confirm("Do you want to logout ?")){
        $.ajax({
          url:'http://localhost:7777/logout',
          type: 'post',
          beforeSend: function(xhr) {
    if (token) {
      xhr.setRequestHeader('Authorization', 'Bearer ' + token);
    }
  },
          success:function(){
            location.href='index.html';
          },
          error:function(error){
            console.log(error);
          }
        })
      }
    })

    var dt = $('#hosTable').DataTable({
      "columnDefs": [ {
      "targets": -1,
      "data": null,
      "defaultContent": "<button type='button' id='btnEditHos' class='btn btn-primary' style='margin:10px;width:100px;'>Edit</button>"+
                        "<button type='button' id='btnDeleteHos' class='btn btn-danger' style='margin:10px;width:100px;'>Delete</button>"
  } ],
  "columns": [
null,
null,
{ "width": "20%" },
null,
null,
null,
null,
null,
null,
null
]
    });
$.getJSON('http://localhost:7777/getAllHospitals', function(res) {
console.log(res);

$.each(res, function(index) {
var data=[]
data=res[index].hosDepartments;
var departments = "";
var array=[];
for(i=0;i<data.length;i++){
array.push(data[i].department);
}
departments=array.join('<br/>');
dt.row.add([
res[index]._id,
res[index].hosName,
res[index].hosDetails,
res[index].hosAddress,
res[index].hosContact,
res[index].hosEmail,
res[index].hosWebsite,
"<img src='http://localhost:7777/uploads/"+res[index].hosImage+"' width='100px' height='100px'/>",
departments
]).draw(false);
});
});
$('#hosTable tbody').on( 'click', '#btnDeleteHos', function () {
var hospital_data = dt.row( $(this).parents('tr') ).data();
var id=hospital_data[0];
if (confirm("Do you want to delete this hospital ?")) {
      $.ajax({
          type: 'DELETE',
          url: 'http://localhost:7777/deleteHospital/'+id,
          success: function () {
              location.reload();
          },
          error: function () {
              alert("Couldn't delete the hospital.");
          }
      });
  }
} );
$('#hosTable tbody').on( 'click', '#btnEditHos', function () {
var hospital_data = dt.row( $(this).parents('tr') ).data();
var id=hospital_data[0];
location.href="adminEditHospital.html?hosId="+id;
} );


} );