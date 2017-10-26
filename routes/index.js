var express = require('express');
var router = express.Router();

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

router.get('/',function(req,res){
    res.sendFile('home.html',{'root': __dirname + '/../views'});
});

router.get('/userSignup',function(req,res){
    res.sendFile('userSignup.html',{'root': __dirname + '/../views'});
});

module.exports = router;

router.get('/businessSignup',function(req,res){
    res.sendFile('businessSignup.html',{'root': __dirname + '/../views'});
});

router.post('/addUser', function(req,res,next){
	try{

		var email = req.body.uEmail;
		var pass = req.body.uPass;
		var name = req.body.uName;
		var age = req.body.uAge;
		//var reqObj = req.body;	
		//console.log(reqObj);

		req.getConnection(function(err, conn){
			if(err){
				console.error('SQL Connection error: ', err);
				return next(err);
			}
			else{
				var insertSql = "INSERT INTO user SET ?";
				var insertValues = {
				"email" : email,
				"bpassword" : pass,
				"fullname" : name,
				"age"	: age
				};
				var query = conn.query(insertSql, insertValues, function (err, result){
					if(err){
						console.error('SQL error: ', err);
						return next(err);
					}
					console.log(result);
					var Employee_Id = result.insertId;
					var message = "User Added Successfully!"
					res.render('home.ejs',{message: message});
					//res.redirect('/');
				});
			}
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
		var name = req.body.uName;
		var yos = req.body.yos;
		//var reqObj = req.body;	
		//console.log(reqObj);

		req.getConnection(function(err, conn){
			if(err){
				console.error('SQL Connection error: ', err);
				return next(err);
			}
			else{
				var insertSql = "INSERT INTO business SET ?";
				var insertValues = {
				"email" : email,
				"bpassword" : pass,
				"fullname" : name,
				"years_service"	: yos
				};
				var query = conn.query(insertSql, insertValues, function (err, result){
					if(err){
						console.error('SQL error: ', err);
						return next(err);
					}
					console.log(result);
					var Employee_Id = result.insertId;
					//res.json({"B_ID": Employee_Id});
					res.redirect('/');
				});
			}
		});
	}
	catch(ex){
		console.error("Internal error:"+ex);
		return next(ex);
	}
});

router.post('/login', function(req,res,next){
	try{

		var email = req.body.uEmail;
		var pass = req.body.uPass;

		req.getConnection(function(err, conn){
			if(err){
				console.log("get fucked");
				console.error('SQL Connection error: ', err);
				return next(err);
			}
			else{
				var insertSql = "SELECT id, email, fullname, age FROM user WHERE `email`='"+email+"' and bpassword = '"+pass+"';";
				
				var query = conn.query(insertSql, function (err, result){
					if(err){
						console.error('SQL error: ', err);
						return next(err);
					}
					
					if (result.length){
						res.json({"Id: ": result[0].id})
					}
					else{
						message = 'Wrong Credentials.';
           				res.render('home.ejs',{message: message});
					}
					// console.log(result);
					// var Employee_Id = result.insertId;
					// res.json({"B_ID": Employee_Id});
					// res.redirect('/');
				});
			}
		});
	}
	catch(ex){
		console.error("Internal error:"+ex);
		return next(ex);
	}
});

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