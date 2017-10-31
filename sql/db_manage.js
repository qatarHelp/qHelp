const sqlite3 = require('sqlite3').verbose();

var db = new sqlite3.Database('./db/qhelp.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log("Connected to the qhelp database.");
});

db.serialize(function(){



//********************************** Creating Table Example ***********************************************//

	// db.run("CREATE TABLE IF NOT EXISTS login (email TEXT, password TEXT)", [], function(err){
	// 	if (err){
	// 		return console.log(err.message);
	// 	}
	// 	console.log("Login Table created successfully");
	// });


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