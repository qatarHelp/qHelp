var express = require('express');
var router = express.Router();
var db = require("../sql/db_manage.js");


router.get('/',function(req,res){
    res.sendFile('main.html',{'root': __dirname + '/../views'});
});


router.get('/userSignup',function(req,res){
    res.sendFile('userSignup.html',{'root': __dirname + '/../views'});
});

module.exports = router;

router.get('/businessSignup',function(req,res){
    res.sendFile('businessSignup.html',{'root': __dirname + '/../views'});
});

router.post('/login', function(req, res, next){
	try{
		var email = req.body.uEmail;
		var pass = req.body.uPass;

		var sess = req.session;

		let sql_user = `SELECT * FROM customer
					WHERE email = ?`;

		let sql_bus = `SELECT * FROM serviceprovider
					WHERE email = ?`;

		var check = false;

		db.all(sql_user, [email], (err, rows) => {
			if (err){
				return console.log("SQLite Error=" + err);
			}
			if (rows == 0){
				console.log("No such user");
				check = true;
			}
			else{
				if (rows[0].password == pass){
					console.log(rows[0].password);
					var message = "";
					var name = rows[0].first_name + " " + rows[0].last_name;
					var user = rows[0];
					//req.session.userId = rows[0].id;
					req.session.email = rows[0].email;
					req.session.user = rows[0];
					console.log(req.session.userId);
					console.log(req.session.user);
					res.redirect('/userHome');
					// res.render('userHome.ejs', {message: message, name: name, user: user});
				}
				else{
					res.render('home.ejs', {message: "Seems like it's a wrong password."});
				}
			}
		});

		if (check = true){
			db.all(sql_bus, [email], (err, rows) => {
				if (err){
					return console.log("SQLite Error=" + err);
				}
				if (rows == 0){
					console.log("No such business");
					var message = "Wrong Credentials";
					res.render('home.ejs', {message: message});
				}
				else{
					if (rows[0].password == pass){
						console.log(rows[0].password);
						var message = "BusinessLogged in";
						req.session.bussEmail = rows[0].email;
						req.session.bussiness = rows[0];
						console.log(req.session.bussiness);

						res.redirect('/businessHome');

					//	var name = rows[0].first_name + " " + rows[0].last_name;
						// res.render('businessHome.ejs', {message: message, name: name});
					}
					else{
						res.render('home.ejs', {message: "Seems like it's a wrong password."});
					}
				}
			});
		}


	}
	catch(ex){
		console.error("Internal error:"+ex);
		return next(ex);
	}
});

router.post('/addUser', function(req,res,next){
	try{

		var email = req.body.uEmail;
		var pass = req.body.uPass;
		var f_name = req.body.ufirstName;
		var l_name = req.body.ulastName;
		var address = req.body.uAddress;
		var phone = req.body.uPhone;
		var qid = req.body.uQID;
		var credit_card = req.body.uCreditCard;
		var sms = req.body.uSms;
		var accountbalance = 0;

		let sql = `INSERT INTO customer (
		email, password, first_name, last_name, address, phone_no, qid, creditcard_no, sms, accountbalance) 
		VALUES(?,?,?,?,?,?,?,?,?,?)`;

		db.run (sql, [email, pass, f_name, l_name, address, phone, qid, credit_card, sms, accountbalance], function(err){
			if (err){
				return console.log("Insert User Error: " + err.message);
			}
			console.log(email + ` added Successfully with rowid ${this.lastID}`);
			var message = email + " created successfully. Login to continue.";
			res.render('home.ejs', {message: message});
		});
		
	}
	catch(ex){
		console.error("Internal error:"+ex);
		return next(ex);
	}
});

router.post('/addBusiness', function(req,res,next){
	try{

		var email = req.body.uEmail;
		var pass = req.body.uPass;
		var f_name = req.body.ufirstName;
		var l_name = req.body.ulastName;
		var address = req.body.uAddress;
		var phone = req.body.uPhone;
		var qid = req.body.uQID;
		var credit_card = req.body.uCreditCard;
		var businesslicense = req.body.uBusinessLicense;
		var accountbalance = 0;


		var delivery = req.body.delivery;
		var education = req.body.education;
		var electronic = req.body.electronic;
		var foodDelivery = req.body.foodDelivery;
		var painting = req.body.painting;
		var programming = req.body.programming;
		var repairing = req.body.repairing;
		var others =  req.body.others;

		if (delivery == null){ delivery = false}; //1
		
		if (education == null) education = false; //2

		if (electronic == null) electronic = false; //3

		if (foodDelivery == null) foodDelivery = false; //4
		
		if (painting == null) painting = false; //5
		
		if (programming == null) programming = false; //6
		
		if (repairing == null) repairing = false; //7
		
		if (others == null) others = false; //8
		
		console.log(delivery);
		console.log(education);
		console.log(electronic);
		console.log(foodDelivery);
		console.log(painting);
		console.log(programming);
		console.log(repairing);
		console.log(others);

		let sql = `INSERT INTO serviceprovider (
		email, password, first_name, last_name, address, phone_no, qid, creditcard_no, businesslicense, accountbalance) 
		VALUES(?,?,?,?,?,?,?,?,?,?)`;


		let sql0 = `INSERT INTO service_category (category_id, service_email, favorite) 
		VALUES(?,?,?)`;

		db.serialize(function(){
			db.run (sql, [email, pass, f_name, l_name, address, phone, qid, credit_card, businesslicense, accountbalance], function(err){
				if (err){
					return console.log("Insert ServiceProvider Error: " + err.message);
				}
				console.log(email + ` added Successfully with rowid ${this.lastID}`);
				var message = email + " created successfully. Login to continue.";
				res.render('home.ejs', {message: message});
			});
			if (delivery){
				db.run(sql0, [1, email, delivery], function(err){
					if(err){
						return console.log("Deliver error: " + err.message);
					}
					console.log("delivery made fav");
				});
			};
			if (education){
				db.run(sql0, [2, email, education], function(err){
					if(err){
						return console.log("education error: " + err.message);
					}
					console.log("education made fav");
				});
			};
			if (electronic){
				db.run(sql0, [3, email, electronic], function(err){
					if(err){
						return console.log("electronic error: " + err.message);
					}
					console.log("electronic made fav");
				});
			};
			if (foodDelivery){
				db.run(sql0, [4, email, foodDelivery], function(err){
					if(err){
						return console.log("foodDelivery error: " + err.message);
					}
					console.log("foodDelivery made fav");
				});
			};
			if (painting){
				db.run(sql0, [5, email, painting], function(err){
					if(err){
						return console.log("painting error: " + err.message);
					}
					console.log("painting made fav");
				});
			};
			if (programming){
				db.run(sql0, [6, email, programming], function(err){
					if(err){
						return console.log("programming error: " + err.message);
					}
					console.log("programming made fav");
				});
			};
			if (repairing){
				db.run(sql0, [7, email, repairing], function(err){
					if(err){
						return console.log("repairing error: " + err.message);
					}
					console.log("repairing made fav");
				});
			};
			if (delivery){
				db.run(sql0, [8, email, delivery], function(err){
					if(err){
						return console.log("others error: " + err.message);
					}
					console.log("others made fav");
				});
			};
		});
	}
	catch(ex){
		console.error("Internal error:"+ex);
		return next(ex);
	}
});


router.post('/requestSubmit', function(req, res, next){

	try{
		var service = req.body.service;
		var location = req.body.location;
		if (location == ""){
			location = null;
		}
		var time = req.body.stime;
		var price = req.body.price;
		var req_status = 0;
		var category_id = req.body.cats;

		var email = req.session.email;
		console.log("Email for the request is: " + email);

		if (email == null){
			res.redirect('/');
		}

		console.log(req.session.user);

		if (category_id == null) category_id = 8;
		console.log(category_id);

		var last_id;

		let sql = `INSERT INTO request (
		service, location, time, price, req_status, category_id) 
		VALUES(?,?,?,?,?,?)`;

		let sql2 = `INSERT INTO customer_request (req_id, email) VALUES (?,?)`;

		let sql3 = `select seq from sqlite_sequence where name="request"`;

		db.serialize(function(err){
			db.run (sql, [service, location, time, price, req_status, category_id], function(err){
				if (err){
					return console.log("Insert Request Error: " + err.message);
				}
				console.log(service + ` added Successfully with rowid ${this.lastID}`);
				var message = service + " added successfully.";
				req.session.message = message;
				res.redirect('/userHome');
			});

			db.all(sql3, [], function(err, rows){
				if(err){
					return console.log("Getting last id error: " + err.message);
				}

				console.log("This is the last ID: " + rows[0].seq);

				last_id = rows[0].seq;

				db.run(sql2, [last_id, email], function(err){
					if (err){
						console.log(last_id + " " + email);
						return console.log("Error while adding in customer_request table: " + err.message);
					}
					console.log("Successfully added in customer_request.");
				});
			});
			
		});
		
	}
	catch(ex){
		console.error("Internal error:"+ex);
		return next(ex);
	}
});

router.get('/loginPage', function(req,res,next){
	res.sendFile('home.html', {'root': __dirname + '/../views'});
});

router.get('/aboutUs', function(req,res,next){
	res.render('AboutUs.ejs',{'root': __dirname + '/../views'});
});

router.get('/faqPage', function(req,res,next){
	res.render('faq.ejs',{'root': __dirname + '/../views'});
});

router.get('/main',function(req,res){
    res.sendFile('main.html',{'root': __dirname + '/../views'});
});

router.get('/userHome',function(req,res){

	
	var message = 'LogIn successful!!';

	var user =  req.session.user;
	var userId = req.session.email;
	console.log(userId);

	var message2 = req.session.message;
	if (message2 != null){
		message = message2;
	}
	else{
		message = "";
	}
	
	if (userId == null){
		res.redirect('/');
	}
	res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
	res.render('userHome.ejs', {name: (user.first_name + ' ' + user.last_name), message: message});
	delete req.session.message;
	console.log(req.session.message);
	console.log(req.session);

});

router.get('/businesshome',function(req,res){

	var message = 'Login successful';

	var user =  req.session.bussiness;
	var userId = req.session.bussEmail;

	if (userId == null){
		res.redirect('/');
	}

	res.render('businessHome.ejs', {name: (user.first_name + ' ' + user.last_name), message: message})

});

router.get('/logout', function(req, res){
 req.session.destroy(function(err) {
      console.log("Session ended");
      res.redirect('/');
   })
})



//Customer Side Pages
router.get('/pendingreq', function(req,res,next){
	try{
		message = ''
		console.log("Pen request");
		// console.log(user);
		// console.log(user.first_name + ' ' + user.last_name + ' Yoooooooooooo');
		var requests = null;
		var email = req.session.email;

		let sql = `Select request.*, category.category from category, customer_request, request where 
					(customer_request.req_id = request.req_id and  customer_request.email = ?) 
					and (request.req_status = 0 OR 1) and (category.category_id = request.category_id)`;

		db.all(sql, [email], function(err, rows){
			if(err){
				return console.log(err);
			}

			requests = rows;
			console.log(rows);
			res.render('pendingReq.ejs', {message: message, requests: requests});

		})


		//res.render('pendingReq.ejs',{'root': __dirname + '/../views'});
	}
	catch(ex){
		console.log("Internal Error: " + ex);
		return next(ex);
	}
});


router.get('/businessbid', function(req,res,next){
	res.render('businessBid.ejs',{'root': __dirname + '/../views'});
});

router.get('/userhistory', function(req,res,next){
	res.render('userHistory.ejs',{'root': __dirname + '/../views'});
});

//categories

router.get('/pendingbids', function(req,res,next){
	res.render('pendingBids.ejs',{'root': __dirname + '/../views'});
});

router.get('/businesshistory', function(req,res,next){
	res.render('businessHistory.ejs',{'root': __dirname + '/../views'});
});

router.get('/allcategories', function(req,res,next){
	message = ''
	console.log("WERWERWEQR");
	// console.log(user);
	// console.log(user.first_name + ' ' + user.last_name + ' Yoooooooooooo');
	var requests = null;

	let sql = `SELECT * FROM request`;

	db.all(sql, [], function(err, rows){
		if(err){
			return console.log(err);
		}

		requests = rows;
		console.log(rows);
		res.render('categories/all.ejs', {message: message, requests: requests});

	})
	//res.render('categories/all.ejs',{'root': __dirname + '/../views'});
});

router.get('/delivery', function(req,res,next){
	try{
		message = ''
		console.log("Delivery Cat");
		// console.log(user);
		// console.log(user.first_name + ' ' + user.last_name + ' Yoooooooooooo');
		var requests = null;
		// var email = req.session.bussEmail;

		// if (email == null){
		// 	res.redirect('/');
		// }

		let sql = `Select request.*, category.category, customer.first_name, customer.last_name
					from category, customer_request, request, customer 
					where (request.req_status = 0 or 1) and (customer_request.req_id = request.req_id) 
					and (request.category_id = category.category_id) and (request.category_id = 1) 
					and (customer.email = customer_request.email)`;

		db.all(sql, [], function(err, rows){
			if(err){
				return console.log(err);
			}

			requests = rows;
			console.log(rows);
			res.render('categories/delivery.ejs', {message: message, requests: requests});
		})
	}
	catch(ex){
		console.log("Internal Error: " + ex);
		return next(ex);
	}
});

router.get('/education', function(req,res,next){try{
		message = ''
		console.log("Delivery Cat");
		// console.log(user);
		// console.log(user.first_name + ' ' + user.last_name + ' Yoooooooooooo');
		var requests = null;
		// var email = req.session.bussEmail;

		// if (email == null){
		// 	res.redirect('/');
		// }

		let sql = `Select request.*, category.category, customer.first_name, customer.last_name
					from category, customer_request, request, customer 
					where (request.req_status = 0 or 1) and (customer_request.req_id = request.req_id) 
					and (request.category_id = category.category_id) and (request.category_id = 2) 
					and (customer.email = customer_request.email)`;

		db.all(sql, [], function(err, rows){
			if(err){
				return console.log(err);
			}

			requests = rows;
			console.log(rows);
			res.render('categories/education.ejs', {message: message, requests: requests});
		})
	}
	catch(ex){
		console.log("Internal Error: " + ex);
		return next(ex);
	}
});

router.get('/electronics', function(req,res,next){
	try{
		message = ''
		console.log("Delivery Cat");
		// console.log(user);
		// console.log(user.first_name + ' ' + user.last_name + ' Yoooooooooooo');
		var requests = null;
		var email = req.session.bussEmail;

		if (email == null){
			res.redirect('/');
		}

		let sql = `Select request.*, category.category, customer.first_name, customer.last_name
					from category, customer_request, request, customer 
					where (request.req_status = 0 or 1) and (customer_request.req_id = request.req_id) 
					and (request.category_id = category.category_id) and (request.category_id = 3) 
					and (customer.email = customer_request.email)`;

		db.all(sql, [], function(err, rows){
			if(err){
				return console.log(err);
			}

			requests = rows;
			console.log(rows);
			res.render('categories/electronics.ejs', {message: message, requests: requests});
		})
	}
	catch(ex){
		console.log("Internal Error: " + ex);
		return next(ex);
	}
});

router.get('/foodDelivery', function(req,res,next){
	try{
		message = ''
		console.log("Delivery Cat");
		// console.log(user);
		// console.log(user.first_name + ' ' + user.last_name + ' Yoooooooooooo');
		var requests = null;
		var email = req.session.bussEmail;

		if (email == null){
			res.redirect('/');
		}

		let sql = `Select request.*, category.category, customer.first_name, customer.last_name
					from category, customer_request, request, customer 
					where (request.req_status = 0 or 1) and (customer_request.req_id = request.req_id) 
					and (request.category_id = category.category_id) and (request.category_id = 4) 
					and (customer.email = customer_request.email)`;

		db.all(sql, [], function(err, rows){
			if(err){
				return console.log(err);
			}

			requests = rows;
			console.log(rows);
			res.render('categories/foodDelivery.ejs', {message: message, requests: requests});
		})
	}
	catch(ex){
		console.log("Internal Error: " + ex);
		return next(ex);
	}
});

router.get('/painting', function(req,res,next){
	try{
		message = ''
		console.log("Delivery Cat");
		// console.log(user);
		// console.log(user.first_name + ' ' + user.last_name + ' Yoooooooooooo');
		var requests = null;
		var email = req.session.bussEmail;

		if (email == null){
			res.redirect('/');
		}

		let sql = `Select request.*, category.category, customer.first_name, customer.last_name
					from category, customer_request, request, customer 
					where (request.req_status = 0 or 1) and (customer_request.req_id = request.req_id) 
					and (request.category_id = category.category_id) and (request.category_id = 5) 
					and (customer.email = customer_request.email)`;

		db.all(sql, [], function(err, rows){
			if(err){
				return console.log(err);
			}

			requests = rows;
			console.log(rows);
			res.render('categories/painting.ejs', {message: message, requests: requests});
		})
	}
	catch(ex){
		console.log("Internal Error: " + ex);
		return next(ex);
	}
});

router.get('/programming', function(req,res,next){
	try{
		message = ''
		console.log("Delivery Cat");
		// console.log(user);
		// console.log(user.first_name + ' ' + user.last_name + ' Yoooooooooooo');
		var requests = null;
		var email = req.session.bussEmail;

		if (email == null){
			res.redirect('/');
		}

		let sql = `Select request.*, category.category, customer.first_name, customer.last_name
					from category, customer_request, request, customer 
					where (request.req_status = 0 or 1) and (customer_request.req_id = request.req_id) 
					and (request.category_id = category.category_id) and (request.category_id = 6) 
					and (customer.email = customer_request.email)`;

		db.all(sql, [], function(err, rows){
			if(err){
				return console.log(err);
			}

			requests = rows;
			console.log(rows);
			res.render('categories/painting.ejs', {message: message, requests: requests});
		})
	}
	catch(ex){
		console.log("Internal Error: " + ex);
		return next(ex);
	}
});

router.get('/repairing', function(req,res,next){
	try{
		message = ''
		console.log("Delivery Cat");
		// console.log(user);
		// console.log(user.first_name + ' ' + user.last_name + ' Yoooooooooooo');
		var requests = null;
		var email = req.session.bussEmail;

		if (email == null){
			res.redirect('/');
		}

		let sql = `Select request.*, category.category, customer.first_name, customer.last_name
					from category, customer_request, request, customer 
					where (request.req_status = 0 or 1) and (customer_request.req_id = request.req_id) 
					and (request.category_id = category.category_id) and (request.category_id = 7) 
					and (customer.email = customer_request.email)`;

		db.all(sql, [], function(err, rows){
			if(err){
				return console.log(err);
			}

			requests = rows;
			console.log(rows);
			res.render('categories/repairing.ejs', {message: message, requests: requests});
		})
	}
	catch(ex){
		console.log("Internal Error: " + ex);
		return next(ex);
	}
});

router.get('/others', function(req,res,next){
	try{
		message = ''
		console.log("Delivery Cat");
		// console.log(user);
		// console.log(user.first_name + ' ' + user.last_name + ' Yoooooooooooo');
		var requests = null;
		var email = req.session.bussEmail;

		if (email == null){
			res.redirect('/');
		}

		let sql = `Select request.*, category.category, customer.first_name, customer.last_name
					from category, customer_request, request, customer 
					where (request.req_status = 0 or 1) and (customer_request.req_id = request.req_id) 
					and (request.category_id = category.category_id) and (request.category_id = 8) 
					and (customer.email = customer_request.email)`;

		db.all(sql, [], function(err, rows){
			if(err){
				return console.log(err);
			}

			requests = rows;
			console.log(rows);
			res.render('categories/others.ejs', {message: message, requests: requests});
		})
	}
	catch(ex){
		console.log("Internal Error: " + ex);
		return next(ex);
	}
});

// router.post('/addUser', function(req,res,next){
// 	try{

// 		var email = req.body.uEmail;
// 		var pass = req.body.uPass;
// 		var f_name = req.body.ufirstName;
// 		var l_name = req.body.ulastName;
// 		var address = req.body.uAddress;
// 		var phone = req.body.uPhone;
// 		var qid = req.body.uQID;
// 		var credit_card = req.body.uCreditCard;
// 		var checkBox = req.body.uSms;

// 		//var reqObj = req.body;	
// 		//console.log(reqObj);

// 		req.getConnection(function(err, conn){
// 			if(err){
// 				console.error('SQL Connection error: ', err);
// 				return next(err);
// 			}
// 			else{
// 				var insertSql = "INSERT INTO user SET ?";
// 				var insertValues = {
// 				"email" : email,
// 				"bpassword" : pass,
// 				"fullname" : name,
// 				"age"	: age
// 				};
// 				var query = conn.query(insertSql, insertValues, function (err, result){
// 					if(err){
// 						console.error('SQL error: ', err);
// 						return next(err);
// 					}
// 					console.log(result);
// 					var Employee_Id = result.insertId;
// 					var message = "User Added Successfully!"
// 					res.render('home.ejs',{message: message});
// 					//res.redirect('/');
// 				});
// 			}
// 		});
// 	}
// 	catch(ex){
// 		console.error("Internal error:"+ex);
// 		return next(ex);
// 	}
// });

// router.post('/addBusiness', function(req,res,next){
// 	try{

// 		var email = req.body.uEmail;
// 		var pass = req.body.uPass;
// 		var name = req.body.uName;
// 		var yos = req.body.yos;
// 		//var reqObj = req.body;	
// 		//console.log(reqObj);

// 		req.getConnection(function(err, conn){
// 			if(err){
// 				console.error('SQL Connection error: ', err);
// 				return next(err);
// 			}
// 			else{
// 				var insertSql = "INSERT INTO business SET ?";
// 				var insertValues = {
// 				"email" : email,
// 				"bpassword" : pass,
// 				"fullname" : name,
// 				"years_service"	: yos
// 				};
// 				var query = conn.query(insertSql, insertValues, function (err, result){
// 					if(err){
// 						console.error('SQL error: ', err);
// 						return next(err);
// 					}
// 					console.log(result);
// 					var Employee_Id = result.insertId;
// 					//res.json({"B_ID": Employee_Id});
// 					res.redirect('/');
// 				});
// 			}
// 		});
// 	}
// 	catch(ex){
// 		console.error("Internal error:"+ex);
// 		return next(ex);
// 	}
// });

// router.post('/login', function(req,res,next){
// 	try{

// 		var email = req.body.uEmail;
// 		var pass = req.body.uPass;

// 		req.getConnection(function(err, conn){
// 			if(err){
// 				console.log("get fucked");
// 				console.error('SQL Connection error: ', err);
// 				return next(err);
// 			}
// 			else{
// 				var insertSql = "SELECT id, email, fullname, age FROM user WHERE `email`='"+email+"' and bpassword = '"+pass+"';";
				
// 				var query = conn.query(insertSql, function (err, result){
// 					if(err){
// 						console.error('SQL error: ', err);
// 						return next(err);
// 					}
					
// 					if (result.length){
// 						res.json({"Id: ": result[0].id})
// 					}
// 					else{
// 						message = 'Wrong Credentials.';
//            				res.render('home.ejs',{message: message});
// 					}
// 					// console.log(result);
// 					// var Employee_Id = result.insertId;
// 					// res.json({"B_ID": Employee_Id});
// 					// res.redirect('/');
// 				});
// 			}
// 		});
// 	}
// 	catch(ex){
// 		console.error("Internal error:"+ex);
// 		return next(ex);
// 	}
// });

// db.query(sql, function(err, results){      
//          if(results.length){
//             req.session.userId = results[0].id;
//             req.session.user = results[0];
//             console.log(results[0].id);
//             res.redirect('/home/dashboard');
//          }
//          else{
//             message = 'Wrong Credentials.';
//             res.render('index.ejs',{message: message});
//          }