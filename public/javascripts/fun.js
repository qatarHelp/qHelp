// var express = require('express');
// //var index = require("../../index.js");
// var mysql = require('mysql');
// //var mysql = remote.getGlobal('mysql');


// var connection = mysql.createConnection({
//         host     : 'localhost',
//         user     : 'root',
//         password : 'Jingalalaka', 
//         database : 'myapp',
//     });

// connection.connect(function(err) {
//         // in case of error
//         if(err){
//             console.log(err.code);
//             console.log(err.fatal);
//         }
//         else{
//         	console.log("connected again");
//         }
//     });





function endConnection() {
	connection.end();
}


function goHome(){
	location.href = "./";
}

function backToLogin(){
	location.href = "./"
}

function addUser(){
    location.href = "./addUser"
}

// function addUser(){
// 	var email = document.getElementById("uEmail").value;
// 	var pass = document.getElementById("uPass").value;
// 	var name = document.getElementById("uName").value;
// 	var age = document.getElementById("uAge").value;

// 	$query = "INSERT INTO `user` VALUES ('" + email + "','" + pass + "','" + name + "','" + age + "');";

// 	connection.query ($query, function(err, rows, fields) {
// 		if (err){
// 			console.log("An error ocurred performing the query.");
//         	console.log(err);
//         	alert (err);
//         }
//         console.log(rows);
//         endConnection();
//         alert("User Created Succesfully");
//         goHome();
// 	})
// }

// module.exports = func;
/*function addEmployee(){
    var email = document.getElementById("employeeEmail").value
    var first = document.getElementById("employeeFirstName").value
    var last = document.getElementById("employeeLastName").value
    var andrewId = document.getElementById("employeeAndrewId").value
    var contractType = document.getElementById("employeeContractType").value

    $query = "INSERT INTO `employee` VALUES ('"+ andrewId + "','"+ email +"', '"+ first+"', '"+ last+"', '"+ contractType+"');";

    connection.query($query, function(err, rows, fields) {
        if(err){
            console.log("An error ocurred performing the query.");
            console.log(err);
            if (err.toString().includes("ER_DUP_ENTRY")){
                alert("Andrew ID already exists: " + andrewId + "\n\nEmployee was not created.", "Bill Management System");
            }
            else{
                alert(err, "Bill Management System");
            }
            return;
        }
        console.log(rows)
        endConnection();
        alert("Employee Succesfully Created!", "Bill Management System")
        goEmployeeMain();
    });
}*/