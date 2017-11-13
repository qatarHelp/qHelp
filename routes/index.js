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

		let sql = `INSERT INTO serviceprovider (
		email, password, first_name, last_name, address, phone_no, qid, creditcard_no, businesslicense, accountbalance) 
		VALUES(?,?,?,?,?,?,?,?,?,?)`;

		db.run (sql, [email, pass, f_name, l_name, address, phone, qid, credit_card, businesslicense, accountbalance], function(err){
			if (err){
				return console.log("Insert ServiceProvider Error: " + err.message);
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


router.post('/requestSubmit', function(req, res, next){

	try{
		var service = req.body.service;
		var location = req.body.location;
		if (location == ""){
			location = null;
		}
		var time = req.body.stime;
		var price = req.body.price;
		

		let sql = `INSERT INTO request (
		service, location, time, price) 
		VALUES(?,?,?,?)`;

		db.run (sql, [service, location, time, price], function(err){
			if (err){
				return console.log("Insert Request Error: " + err.message);
			}
			console.log(service + ` added Successfully with rowid ${this.lastID}`);
			var message = service + " added successfully.";
			res.render('userHome.ejs', {message: message, name:""});
		});
		
	}
	catch(ex){
		console.error("Internal error:"+ex);
		return next(ex);
	}
})

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
	if (userId == null){
		res.redirect('/');
	}
	res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
	res.render('userHome.ejs', {name: (user.first_name + ' ' + user.last_name), message: message});

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
router.get('/businessbid', function(req,res,next){
	res.render('businessBid.ejs',{'root': __dirname + '/../views'});
});

router.get('/userhistory', function(req,res,next){
	res.render('userHistory.ejs',{'root': __dirname + '/../views'});
});



//categories
router.get('/allcategories', function(req,res,next){
	res.render('categories/all.ejs',{'root': __dirname + '/../views'});
});

router.get('/delivery', function(req,res,next){
	res.render('categories/delivery.ejs',{'root': __dirname + '/../views'});
});

router.get('/education', function(req,res,next){
	res.render('categories/education.ejs',{'root': __dirname + '/../views'});
});

router.get('/electronics', function(req,res,next){
	res.render('categories/electronics.ejs',{'root': __dirname + '/../views'});
});
router.get('/foodDelivery', function(req,res,next){
	res.render('categories/foodDelivery.ejs',{'root': __dirname + '/../views'});
});

router.get('/others', function(req,res,next){
	res.render('categories/others.ejs',{'root': __dirname + '/../views'});
});

router.get('/painting', function(req,res,next){
	res.render('categories/painting.ejs',{'root': __dirname + '/../views'});
});
router.get('/programming', function(req,res,next){
	res.render('categories/programming.ejs',{'root': __dirname + '/../views'});
});

router.get('/repairing', function(req,res,next){
	res.render('categories/repairing.ejs',{'root': __dirname + '/../views'});
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