const sqlite3 = require('sqlite3').verbose();

var db = new sqlite3.Database('./db/qhelp.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log("Connected to the qhelp database.");
});

db.serialize(function(){

	// db.run(`CREATE TABLE IF NOT EXISTS customer (
	// 		email TEXT NOT NULL UNIQUE PRIMARY KEY, 
	// 		password TEXT NOT NULL,
	// 		first_name TEXT NOT NULL,
	// 		last_name TEXT NOT NULL,
	// 		address TEXT NOT NULL,
	// 		phone_no INTEGER UNIQUE NOT NULL,
	// 		qid INTEGER UNIQUE NOT NULL,
	// 		creditcard_no INTEGER UNIQUE,
	// 		sms BOOLEAN,
	// 		accountbalance INTEGER NOT NULL)`, [], function(err){
	// 	if (err){
	// 		return console.log(err.message);
	// 	}
	// 	console.log("customer Table created successfully");
	// });

	// db.run(`CREATE TABLE IF NOT EXISTS serviceprovider (
	// 		email TEXT NOT NULL UNIQUE PRIMARY KEY, 
	// 		password TEXT NOT NULL,
	// 		first_name TEXT NOT NULL,
	// 		last_name TEXT NOT NULL,
	// 		address TEXT NOT NULL,
	// 		phone_no INTEGER UNIQUE NOT NULL,
	// 		qid INTEGER UNIQUE NOT NULL,
	// 		creditcard_no INTEGER UNIQUE NOT NULL,
	// 		businesslicense UNIQUE,
	// 		accountbalance INTEGER NOT NULL)`, [], function(err){
	// 	if (err){
	// 		return console.log(err.message);
	// 	}
	// 	console.log("serviceprovider Table created successfully");
	// });

	// db.run(`CREATE TABLE IF NOT EXISTS request (
	// 	req_id INTEGER UNIQUE NOT NULL PRIMARY KEY AUTOINCREMENT,
	// 	service TEXT UNIQUE NOT NULL,
	// 	location TEXT NOT NULL,
	// 	time TEXT NOT NULL,
	// 	price INTEGER NOT NULL
	// 	)`, [], function(err){

	// 		if (err){
	// 			return console.log(err.message);
	// 		}
	// 		console.log("request Table created successfully");
	// 	});

	// db.run(`CREATE TABLE IF NOT EXISTS customer_request (
	// 	req_id INTEGER NOT NULL UNIQUE,
	// 	email TEXT NOT NULL,
	// 	FOREIGN KEY (req_id) REFERENCES request(req_id),
	// 	FOREIGN KEY (email) REFERENCES customer(email))`, [], function(err){

	// 		if (err){
	// 		return console.log(err.message);
	// 	}
	// 	console.log("customer_request Table created successfully");
	// 	});



//****************************** Inserting Example *********************************************************//

	// db.run(`INSERT INTO login(email, password) VALUES(?,?)`, ['wer', 'rew'], function(err) {
 //    if (err) {
 //      return console.log(err.message);
 //    }
 //    // get the last insert id
 //    	console.log(`A row has been inserted with rowid ${this.lastID}`);
  	// });


//***************************** PRINTING OR GETTING DATA FROM TABLE EXAMPLE ********************************//

	// db.all("Select * from login", [], function(err, rows){
	// 	if (err){
	// 		return console.log(err.message);
	// 	}

	// 	rows.forEach((row) => {
	// 		console.log(row.email);
	// 	});
	// });

//****************************** DROPPING A TABLE EXAMPLE ****************************************//

	// db.run("DROP TABLE IF EXISTS login", [], function(err){
	// 	if (err){
	// 		return console.log(err.message);
	// 	}
	// 	console.log("Table dropped successfully!");
	// });

});

module.exports = db;
// var db = new sqlite3.Database('./db/qhelp.db', (err) => {
//   if (err) {
//     console.error(err.message);
//   }
//   console.log("Connected to the qhelp database.");
// });