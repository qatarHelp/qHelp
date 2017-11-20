var request = require("request");
var base_url = "https://qhelp-mwarfa.c9users.io";
var app = require('../app');
var index = require('../routes/index.js');
var express = require('express');
var chai = require("chai");
chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.request(app);
var expect = chai.expect;

// describe("Test if the home page buttons redirects to the correct path",function(){
//   it("The Qatarhelp button takes us to the homepage", function(done){
//       chai.request(app)
//       .get('/main')
//       .end(function(err,res){
//         expect(res).to.have.status(200);
//         done();
//       });
//   });
   
//   it("The about button takes us to the about page", function(done){
//       chai.request(app)
//       .get('/aboutUs')
//       .end(function(err,res){
//         expect(res).to.have.status(200);
//         done();
//       });
//   });
  
//   it("The faQ button takes us to the faQ page", function(done){
//       chai.request(app)
//       .get('/faqPage')
//       .end(function(err,res){
//         expect(res).to.have.status(200);
//         done();
//       });
//   });


   
//   it('The login button takes us to the login page', function(done) { // <= Pass in done callback
//     chai.request(app)
//     .get('/loginPage')
//     .end(function(err, res) {
//     expect(res).to.have.status(200);
//     done();                               // <= Call done to signal callback end
//     });
//   });
  
//   it("The signup as a user gives us a user registration form", function(done){
//       chai.request(app)
//       .get('/userSignup')
//       .end(function(err,res){
//         expect(res).to.have.status(200);
//         done();
//       });
//   });
   
   
//   it("The signup as a business gives us a business registration form", function(done){
//       chai.request(app)
//       .get('/businessSignup')
//       .end(function(err,res){
//         expect(res).to.have.status(200);
//         done();
//       });
//   });
// });

// it('should take less than 500ms', function(done){
//   this.timeout(500);
//   setTimeout(done, 300);
// });
describe("Test if authentication system works as expected",function(){

//let's set up the data we need to pass to the login method
  const userCredentials = {
    uEmail: 'muhsin', 
    uPass: 'muhsin'
  }
  
//now let's login the user before we run any tests
  var authenticatedUser = chai.request.agent(app);

  it("should log you in with correct credential and redirect to UserHome",function(done){
  authenticatedUser
    .post('/login')
    .send(userCredentials)
    .end(function(err, response){
      console.log("hello");
      expect(response.statusCode).to.equal(200);
      expect('Location', '/userHome');
      done();
    });
  });
});

