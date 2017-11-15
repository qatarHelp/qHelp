const sqlite3 = require('sqlite3').verbose();

var db = new sqlite3.Database('./db/qhelp.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log("Connected to the qhelp database.");
});

db.serialize(function(){

	db.run(`CREATE TABLE IF NOT EXISTS customer (
			email TEXT NOT NULL UNIQUE PRIMARY KEY,
			password TEXT NOT NULL,
			first_name TEXT NOT NULL,
			last_name TEXT NOT NULL,
			address TEXT NOT NULL,
			phone_no INTEGER UNIQUE NOT NULL,
			qid INTEGER UNIQUE NOT NULL,
			creditcard_no INTEGER UNIQUE,
			sms BOOLEAN,
			accountbalance INTEGER NOT NULL)`, [], function(err){
		if (err){
			return console.log(err.message);
		}
		console.log("customer Table created successfully");
	});

	db.run(`CREATE TABLE IF NOT EXISTS serviceprovider (
			email TEXT NOT NULL UNIQUE PRIMARY KEY,
			password TEXT NOT NULL,
			first_name TEXT NOT NULL,
			last_name TEXT NOT NULL,
			address TEXT NOT NULL,
			phone_no INTEGER UNIQUE NOT NULL,
			qid INTEGER UNIQUE NOT NULL,
			creditcard_no INTEGER UNIQUE NOT NULL,
			businesslicense UNIQUE,
			accountbalance INTEGER NOT NULL
      )`, [], function(err){
		if (err){
			return console.log(err.message);
		}
		console.log("serviceprovider Table created successfully");
	});


  db.run(`CREATE TABLE IF NOT EXISTS category (
    category_id	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
    category TEXT NOT NULL UNIQUE
    )`, [], function(err){
        if (err){return console.log(err.message);}
        console.log("category Table created successfully");
  });

  db.run(`CREATE TABLE IF NOT EXISTS service_category (
    category_id INTEGER NOT NULL,
    service_email TEXT NOT NULL,
    favorite BOOLEAN,
  	FOREIGN KEY (category_id) REFERENCES category(category_id),
  	FOREIGN KEY (service_email) REFERENCES serviceprovider(email)
    )`, [], function(err){
      if (err){return console.log(err.message);}
      console.log("service_category Table created successfully");
    });

  db.run(`CREATE TABLE IF NOT EXISTS request (
		req_id INTEGER UNIQUE NOT NULL PRIMARY KEY AUTOINCREMENT,
		service TEXT UNIQUE NOT NULL,
		location TEXT NOT NULL,
		time TEXT NOT NULL,
		price INTEGER NOT NULL,
    req_status INTEGER,
    category_id INTEGER,
    FOREIGN KEY (category_id) REFERENCES category(category_id)
		)`, [], function(err){

			if (err){
				return console.log(err.message);
			}
			console.log("request Table created successfully");
		});
  // IN REQ STATUS 0 is pending 1 is accepted 2 is completed 3 is deleted 4 is overdue

	db.run(`CREATE TABLE IF NOT EXISTS customer_request (
		req_id INTEGER NOT NULL,
		email TEXT NOT NULL,
		FOREIGN KEY (req_id) REFERENCES request(req_id),
		FOREIGN KEY (email) REFERENCES customer(email))`, [], function(err){
  
			if (err){
			return console.log(err.message);
		}
		console.log("customer_request Table created successfully");
		});

  db.run(`CREATE TABLE IF NOT EXISTS bid (
    bid_id INTEGER UNIQUE NOT NULL PRIMARY KEY AUTOINCREMENT,
    bid_price INTEGER NOT NULL,
    bid_description TEXT,
    bid_status INTEGER NOT NULL
    )`, [], function(err){
      if (err){return console.log(err.message);}
      console.log("bid Table created successfully");}
    );

  db.run(`CREATE TABLE IF NOT EXISTS bid_service (
    bid_id INTEGER NOT NULL,
    service_email TEXT NOT NULL,
  	FOREIGN KEY (bid_id) REFERENCES bid(bid_id),
  	FOREIGN KEY (service_email) REFERENCES serviceprovider(email)
    )`, [], function(err){
      if (err){return console.log(err.message);}
      console.log("bid_service Table created successfully");}
    );

  db.run(`CREATE TABLE IF NOT EXISTS request_bid (
    request_bid_id INTEGER UNIQUE NOT NULL PRIMARY KEY AUTOINCREMENT,
    customer_accepted BOOLEAN,
    serviceprovider_accepted BOOLEAN,
    req_id INTEGER NOT NULL,
    bid_id INTEGER NOT NULL,
    trans_id INTEGER NOT NULL,
    FOREIGN KEY (req_id) REFERENCES request(req_id),
    FOREIGN KEY (bid_id) REFERENCES bid(bid_id),
    FOREIGN KEY (trans_id) REFERENCES trans(trans_id)
    )`, [], function(err){
      if (err){return console.log(err.message);}
      console.log("request_bid Table created successfully");}
    );

  db.run(`CREATE TABLE IF NOT EXISTS trans (
		trans_id INTEGER UNIQUE NOT NULL PRIMARY KEY AUTOINCREMENT,
    trans_complete BOOLEAN NOT NULL
    )`, [], function(err){
      if (err){return console.log(err.message);}
      console.log("trans Table created successfully");}
    );


  db.run(`CREATE TABLE IF NOT EXISTS evaluate (
		eval_id INTEGER UNIQUE NOT NULL PRIMARY KEY AUTOINCREMENT,
    rate INTEGER NOT NULL,
    review TEXT,
    service_email TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    trans_id INTEGER NOT NULL,
    FOREIGN KEY (service_email) REFERENCES serviceprovider(email),
		FOREIGN KEY (customer_email) REFERENCES customer(email),
		FOREIGN KEY (trans_id) REFERENCES trans(trans_id)
    )`, [], function(err){
      if (err){return console.log(err.message);}
      console.log("evaluate Table created successfully");}
    );





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

	// db.run("DROP TABLE IF EXISTS customer", [], function(err){
	// 	if (err){
	// 		return console.log(err.message);
	// 	}
	// 	console.log("customer Table dropped successfully!");
	// });

 //  db.run("DROP TABLE IF EXISTS serviceprovider", [], function(err){
 //    if (err){
 //      return console.log(err.message);
 //    }
 //    console.log("serviecprovider Table dropped successfully!");
 //  });

 //  db.run("DROP TABLE IF EXISTS category", [], function(err){
 //    if (err){
 //      return console.log(err.message);
 //    }
 //    console.log("category Table dropped successfully!");
 //  });

  // db.run("DROP TABLE IF EXISTS service_category", [], function(err){
  //   if (err){
  //     return console.log(err.message);
  //   }
  //   console.log("service_category Table dropped successfully!");
  // });

  // db.run("DROP TABLE IF EXISTS request", [], function(err){
  //   if (err){
  //     return console.log(err.message);
  //   }
  //   console.log("request Table dropped successfully!");
  // });

  // db.run("DROP TABLE IF EXISTS customer_request", [], function(err){
  //   if (err){
  //     return console.log(err.message);
  //   }
  //   console.log("customer_request Table dropped successfully!");
  // });

  // db.run("DROP TABLE IF EXISTS bid", [], function(err){
  //   if (err){
  //     return console.log(err.message);
  //   }
  //   console.log("bid Table dropped successfully!");
  // });

  // db.run("DROP TABLE IF EXISTS bid_service", [], function(err){
  //   if (err){
  //     return console.log(err.message);
  //   }
  //   console.log("bid_service Table dropped successfully!");
  // });

  // db.run("DROP TABLE IF EXISTS request_bid", [], function(err){
  //   if (err){
  //     return console.log(err.message);
  //   }
  //   console.log("request_bid Table dropped successfully!");
  // });

  // db.run("DROP TABLE IF EXISTS trans", [], function(err){
  //   if (err){
  //     return console.log(err.message);
  //   }
  //   console.log("trans Table dropped successfully!");
  // });

  // db.run("DROP TABLE IF EXISTS evaluate", [], function(err){
  //   if (err){
  //     return console.log(err.message);
  //   }
  //   console.log("evaluate Table dropped successfully!");
  // });



});

module.exports = db;
// var db = new sqlite3.Database('./db/qhelp.db', (err) => {
//   if (err) {
//     console.error(err.message);
//   }
//   console.log("Connected to the qhelp database.");
// });
