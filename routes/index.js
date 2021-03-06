var express = require('express');
var router = express.Router();
var db = require("../sql/db_manage.js");
// var $ = require('jquery');

router.get('/',function(req,res){
	var email = req.session.email;
	console.log("IN MAIN !! " + email);

	if (email == null){
    	res.sendFile('main.html',{'root': __dirname + '/../views'});
    }

    else {
    	res.redirect('/userHome');
    }
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
		console.log(pass);
		db.run (sql, [email, pass, f_name, l_name, address, phone, qid, credit_card, sms, accountbalance], function(err){
			if (err){
				return console.log("Insert User Error: " + err.message);
			}
			console.log(email + ` added Successfully with rowid ${this.lastID}`);
			var message = email + " created successfully. Login to continue.";
			req.session.message = message
			res.redirect('/loginPage');
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

		var user =  req.session.user;
		var email = req.session.email;
		var message = ''; 
		var errors = {
			"errors": [
			{
				"service": false,
				"location": false,
				"time": false,
				"price": false,
				"category_id": false
			}
			]
		}
		var service = req.body.service;
		if (service == ""){
			console.log("CMMMMMMMOOOOOONNNNNN");
			errors.service = true;
		}

		var location = req.body.location;
		if (location == ""){
			errors.location = true;
		}

		var time = req.body.stime;
		if (time == ""){
			errors.time = true;
		}

		var price = req.body.price;
		if (price == ""){
			errors.price = true;
		}

		var req_status = 0;

		var category_id = req.body.category;
		if (category_id == null){
			errors.category_id = true;
		}

		console.log("Email for the request is: " + email);

		if (email == null){
			res.redirect('/');
		}

		console.log(req.session.user);

		if (errors.service == true || errors.location == true ||
			errors.time == true || errors.price == true || 
			errors.category_id == true){
			return res.render ('userHome.ejs', {name: (user.first_name + " " + user.last_name), message: '', error: errors});
		}

		

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

				res.redirect('/userHome');

			});
			
		});
		
	}
	catch(ex){
		console.error("Internal error:"+ex);
		return next(ex);
	}
});

router.get('/loginPage', function(req,res,next){
	var message = '';

	if (req.session.message != null){
		message = req.session.message;
	}
	else{
		message = '';
	}
	req.session.message = null;

	res.render('home.ejs', {message: message});
});

router.get('/aboutUs', function(req,res,next){
	res.render('AboutUs.ejs',{'root': __dirname + '/../views'});
});

router.get('/faqPage', function(req,res,next){
	res.render('faq.ejs',{'root': __dirname + '/../views'});
});

router.get('/',function(req,res){
    res.sendFile('main.html',{'root': __dirname + '/../views'});
});

router.get('/userHome',function(req,res){

	
	var message = 'LogIn successful!!';
	var errors = {
			"errors": [
			{
				"service": false,
				"location": false,
				"time": false,
				"price": false,
				"category_id": false
			}
			]
		}


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
	res.render('userHome.ejs', {name: (user.first_name + ' ' + user.last_name), message: message, error: errors});
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

router.get('/viewalloffers/:id', function(req,res,next){

	try{
		var id = req.params.id;

		var email = req.session.email;

		message = '';
		var requests = null;
		console.log("The is id and email are: " + id + " " + email);

		sql1 = `Select request.*, category.category, bid.*, serviceprovider.first_name, serviceprovider.last_name, 
				request_bid.request_bid_id
				from bid, category, customer_request, request, 
				bid_service, request_bid, serviceprovider where 
				(customer_request.req_id = ?) and
				(request.req_id = customer_request.req_id and request.req_id = request_bid.req_id) and 
				(request_bid.bid_id = bid.bid_id) and (bid_service.bid_id = bid.bid_id) and
				(bid_service.service_email = serviceprovider.email) and 
				(category.category_id = request.category_id)`;


		db.all(sql1, [id], function(err, rows){
			if(err){
				return console.log(err.message);
			}
			console.log("Got all offers");

			if (rows.length == 0){
				requests = null;
			}
			else{
				requests = rows;
			}

			res.render('view_all_offers.ejs',{message: message, requests: requests});
		});

	}
	catch(ex){
		console.log("Internal Error: " + ex);
		return next(ex);
	}
	
});

//Customer Side Pages
router.get('/pendingreq', function(req,res,next){
	try{
		var message = '';

		var message2 = req.session.message;
		if (message2 != null){
			message = message2;
		}
		else{
			message = '';
		}

		req.session.message = null;

		console.log("Pen request");
		// console.log(user);
		// console.log(user.first_name + ' ' + user.last_name + ' Yoooooooooooo');
		var requests = null;
		var email = req.session.email;
		console.log("EMAIL IN PEN REQ: " + email);
		if (email == null) res.redirect('/');

		let sql = `Select request.*, category.category from category, customer_request, request where 
					(customer_request.req_id = request.req_id and customer_request.email = ?) 
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
router.get('/pendingreq/:id', function(req, res, next){
	try{
		var id = req.params.id;

		var email = req.session.email;
		console.log("The is and email are: " + id + " " + email);

		sql1 = `DELETE FROM request WHERE req_id=?`;

		sql2 = `DELETE FROM customer_request WHERE req_id = ? and email = ?`;

		db.run(sql1, [id], function(err){
			if(err){
				return console.log(err.message);
			}
			console.log("Successfully deleted id: " + id + " from request table");

			db.run(sql2, [id, email], function(err){
				if(err){
					return console.log(err.message);
				}
				console.log("Successfully deleted id and email: " + id + " " + email
					 		+ "from customer_request table");

				var message = "Request id " + id + " deleted successfully for " + email;
				req.session.message = message;
				res.redirect('/pendingreq');
			});
		});



	}
	catch(ex){
		console.log("Internal Error: " + ex);
		return next(ex);
	}
});

router.get('/makeBid/:id', function(req,res,next){

	try{
		var id = req.params.id;

		var bus_email = req.session.bussEmail;
		var requestBid = null;
		if (bus_email == null){
			res.redirect('login.ejs');
		}

		var sql = `Select request.*,  customer.first_name, customer.last_name
					from customer_request, request, customer 
					where (request.req_id = ?) and (customer_request.req_id = request.req_id) 
					and (customer.email = customer_request.email);`;

		db.all(sql, [id], function(err, rows){
			if(err){
				return console.log(err.message);
			};
			requestBid = rows[0];
			res.render('makeBid.ejs', {requests: requestBid});
		});
	}
	catch(ex){
		console.log("Internal Error: " + ex);
		return next(ex);
	}
});

router.get('/makePayment/:id', function(req, res, next){
	req_id = req.params.id;

	res.render('paymentOptions.ejs', {id: req_id});
});

router.post('/paymentMade', function(req, res, next){
	try{

		var req_id = req.body.req_id;

		sql1 = `UPDATE request SET req_status = 2 WHERE req_id = ?`;

		sql2 = `select bid.* from request, request_bid, bid where 
				request.req_id = ? and request.req_id = request_bid.req_id and request_bid.bid_id = bid.bid_id`;

		sql3 = `UPDATE bid SET bid_status = 3 WHERE bid_id = ?`;

		console.log(req_id);


		db.serialize(function(err){
			db.run(sql1, [req_id], function(err){
				if(err){
					return console.log("Payment Made Error: " + err.message);
				}
				console.log("Payment made successfully");
				
			});
			db.all(sql2, [req_id], function(err, rows){
				if(err){
					return console.log("Payment Made Error: " + err.message);
				}

				db.run(sql3, [rows[0].bid_id], function(err){
					if(err){
						return console.log("Payment Made Error: " + err.message);
					};
					console.log("Successfully changed bid status in payment");
				})
			});
			res.redirect('/pendingreq');
		});
		

	}
	catch(ex){
		console.log("Internal Error: " + ex);
		return next(ex);
	}
});

router.get('/acceptOffer/:id/:request_bid_id/:bid_price', function(req, res, next){
	try{

		req_id = req.params.id;
		request_bid_id = req.params.request_bid_id;

		email = req.session.email;

		console.log(email);

		if (req.session.email == null){
			return res.redirect("/");
		}
		
		new_price = req.params.bid_price;

		console.log("price is:" + new_price + " email and req_id are: " + email + " " + req_id);

		sql1 = `UPDATE request SET price = ?, req_status = 1 WHERE req_id = ?`;

		sql2 = `UPDATE request_bid SET customer_accepted = 'True' WHERE request_bid_id = ?`; 

		sql3 = `Select bid.* from bid, request_bid where 
				request_bid.request_bid_id = ? and bid.bid_id = request_bid.bid_id`;

		sql4 = `UPDATE bid SET bid_status = 1 WHERE bid_id = ?`;

		db.serialize(function(err){

			db.run(sql1, [new_price, req_id], function(err){
				if(err){
					return console.log("Accept Offer Error: " + err.message);
				}

				console.log('Offer Request Accepted Successfully!');
			});

			db.run(sql2, [request_bid_id], function(err){
				if(err){
					return console.log("Accept Offer Error: " + err.message);
				}

				console.log('Offer Request_Bid Customer Accepted Changed Successfully!');
			});

			db.all(sql3, [request_bid_id], function(err, rows){
				if(err){
					return console.log("Accept Offer Error: " + err.message);
				}

				data = rows[0];

				db.run(sql4, [data.bid_id], function(err){
					if(err){
						return console.log("Accept Offer Error: " + err.message);
					}

					console.log("Bid status successfully changed in Accept.");

					
					req.session.message = "Offer Accepted Successfully.";
					res.redirect('/pendingreq');
				});

			});

		});
		
		
	}
	catch(ex){
		console.log("Internal Error: " + ex);
		return next(ex);
	}
});

router.get('/negotiation/:id/:request_bid_id', function(req, res, next){
	try{
		req_id = req.params.id;
		request_bid_id = req.params.request_bid_id;

		email = req.session.email;

		console.log(email);

		if (req.session.email == null){
			return res.redirect("/");
		}

		var message;

		if (req.session.message != null){
			message = req.session.message;
		}
		else{
			message = '';
		}


		req.session.message = null;

		var requests;

		var s_bid;

		sql1 = `Select request.*, request_bid.request_bid_id, customer.*, category.category
				from request_bid, request, customer, customer_request, category
				where (request.req_id = ? and request.req_id = customer_request.req_id) and 
				(customer_request.email = ? and customer_request.email = customer.email) and
				(request_bid.request_bid_id = ? and request_bid.req_id = request.req_id) and
				(request.category_id = category.category_id)`;

		sql2 = `select serviceprovider.*, bid.*, request_bid.request_bid_id 
				from serviceprovider, bid_service, bid, request_bid
				where (request_bid.request_bid_id = ? and request_bid.bid_id = bid.bid_id) and
				(bid_service.bid_id = bid.bid_id and bid_service.service_email = serviceprovider.email)`;

		db.all(sql1, [req_id, email, request_bid_id], function(err, rows){
			if(err){
				return console.log("Negotiation Error: " + err.message);
			}

			console.log("got cust req details;");

			requests = rows[0];
			console.log(rows[0]);

			db.all(sql2, [request_bid_id], function(err, rowss){
				if(err){
					return console.log("Negotiation2 Error: " + err.message);
				}
				console.log("got bid req details");

				s_bid = rowss[0];

				console.log(requests);
				console.log(s_bid);
				res.render('negotiation.ejs', {requests: requests, serbid: s_bid, message:message});
			});

		});
		
	}
	catch(ex){
		console.log("Internal Error: " + ex);
		return next(ex);
	}

});

router.post('/bidMade', function(req, res, next){
	try{
		var req_id = req.body.req_id;

		var bid_price = req.body.bid_price;
		var bid_description = req.body.desc;
		var bid_status = 0;

		var bus_email = req.session.bussEmail;

		var requestBid = null;

		if (bus_email == null){
			res.redirect('login.ejs');
		}

		console.log(req_id);

		var last_id = null;


		let sql = `INSERT INTO bid (
		bid_price, bid_description, bid_status) 
		VALUES(?,?,?)`;

		let sql2 = `INSERT INTO bid_service (bid_id, service_email) VALUES (?,?)`;

		let sql4 = `INSERT INTO request_bid (customer_accepted, serviceprovider_accepted, req_id, bid_id) VALUES (?,?,?,?)`;

		let sql3 = `select seq from sqlite_sequence where name="bid"`;



		db.serialize(function(err){
			db.run (sql, [bid_price, bid_description, bid_status], function(err){
				if (err){
					return console.log("Insert Request Error: " + err.message);
				}
				console.log(`Bid made Successfully with rowid ${this.lastID}`);

				// var message =  "Bid made successfully.";
				

				db.all(sql3, [], function(err, rows){
					if(err){
						return console.log("Getting last id error: " + err.message);
					}

					console.log("This is the last ID: " + rows[0].seq);

					last_id = rows[0].seq;

					db.run(sql2, [last_id, bus_email], function(err){
						if (err){
							console.log(last_id + " " + bus_email);
							return console.log("Error while adding in customer_request table: " + err.message);
						}
						console.log("Successfully added in bid_service");
					});

					db.run(sql4, [false, true, req_id, last_id], function(err){
						if (err){
							console.log(last_id + " " + req_id);
							return console.log("Error while adding in request_bid table: " + err.message);
						}
						console.log("Successfully added in request_bid");
					});
				});

				res.redirect('/allcategories');

			});
			
		});
		// 	res.render('makeBid.ejs', {requests: requestBid});
		// });
	}
	catch(ex){
		console.log("Internal Error: " + ex);
		return next(ex);
	}
});


router.get('/userhistory', function(req,res,next){
	try{
		var message = '';

		var message2 = req.session.message;
		if (message2 != null){
			message = message2;
		}
		else{
			message = '';
		}

		req.session.message = null;

		console.log("Pen request");
		// console.log(user);
		// console.log(user.first_name + ' ' + user.last_name + ' Yoooooooooooo');
		var requests = null;
		var email = req.session.email;
		console.log("EMAIL IN User history REQ: " + email);
		if (email == null) res.redirect('/');

		let sql = `Select request.*, category.category from category, customer_request, request where 
					(customer_request.req_id = request.req_id and customer_request.email = ?) 
					and (request.req_status = 2) and (category.category_id = request.category_id)`;

		db.all(sql, [email], function(err, rows){
			if(err){
				return console.log(err);
			}

			requests = rows;
			
			console.log(rows);
			res.render('userHistory.ejs', {message: message, requests: requests});

		})


		//res.render('pendingReq.ejs',{'root': __dirname + '/../views'});
	}
	catch(ex){
		console.log("Internal Error: " + ex);
		return next(ex);
	}

});

//categories

router.get('/pendingbids', function(req,res,next){


	try{
		var message = '';

		var message2 = req.session.message;
		if (message2 != null){
			message = message2;
		}
		else{
			message = '';
		}

		req.session.message = null;

		console.log("Pen request");
		// console.log(user);
		// console.log(user.first_name + ' ' + user.last_name + ' Yoooooooooooo');
		var requests = null;
		var email = req.session.bussEmail;
		console.log("EMAIL IN PEN BID: " + email);
		if (email == null) res.redirect('/');

		let sql = `Select request.*, category.category, bid.*, customer.first_name, customer.last_name
					from bid, category, customer_request, request, 
					bid_service, request_bid, serviceprovider, customer where 
					(bid_service.bid_id = bid.bid_id and bid_service.service_email = ?) and
					(serviceprovider.email = ?) and
					(request_bid.bid_id = bid.bid_id and request_bid.req_id = request.req_id) and
					(customer_request.req_id = request.req_id and customer_request.email = customer.email) 
					and (request.req_status = 0 OR 1) and (category.category_id = request.category_id)`;

		db.all(sql, [email, email], function(err, rows){
			if(err){
				return console.log(err);
			}

			requests = rows;
			console.log(rows);
			res.render('pendingBids.ejs', {message: message, requests: requests});

		})


		//res.render('pendingReq.ejs',{'root': __dirname + '/../views'});
	}
	catch(ex){
		console.log("Internal Error: " + ex);
		return next(ex);
	}
});

router.get('/businesshistory', function(req,res,next){

	try{
		var message = '';

		var message2 = req.session.message;
		if (message2 != null){
			message = message2;
		}
		else{
			message = '';
		}

		req.session.message = null;

		console.log("Pen request");
		// console.log(user);
		// console.log(user.first_name + ' ' + user.last_name + ' Yoooooooooooo');
		var requests = null;
		var email = req.session.bussEmail;
		console.log("EMAIL IN PEN BID: " + email);
		if (email == null) res.redirect('/');

		let sql = `Select request.*, category.category, bid.*, customer.first_name, customer.last_name
					from bid, category, customer_request, request, 
					bid_service, request_bid, serviceprovider, customer where 
					(bid_service.bid_id = bid.bid_id and bid_service.service_email = ?) and
					(serviceprovider.email = ?) and
					(request_bid.bid_id = bid.bid_id and request_bid.req_id = request.req_id) and
					(customer_request.req_id = request.req_id and customer_request.email = customer.email) 
					and (request.req_status = 0 OR 1) and (category.category_id = request.category_id)`;

		db.all(sql, [email, email], function(err, rows){
			if(err){
				return console.log(err);
			}

			requests = rows;
			console.log(rows);
			res.render('businessHistory.ejs', {message: message, requests: requests});

		})


		//res.render('pendingReq.ejs',{'root': __dirname + '/../views'});
	}
	catch(ex){
		console.log("Internal Error: " + ex);
		return next(ex);
	}
});

router.get('/allcategories', function(req,res,next){
	message = ''
	console.log("WERWERWEQR");
	// console.log(user);
	// console.log(user.first_name + ' ' + user.last_name + ' Yoooooooooooo');
	var requests = null;

	var email = req.session.bussEmail;

	if (email == null){
		res.redirect('/');
	}

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
		var email = req.session.bussEmail;

		if (email == null){
			res.redirect('/');
		}

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
		var email = req.session.bussEmail;

		if (email == null){
			res.redirect('/');
		}

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
			res.render('categories/programming.ejs', {message: message, requests: requests});
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