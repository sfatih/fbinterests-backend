/*************  Restful API  *************/

// This Api's error handling is made by promise chains
// The reason we chose promises is write cleaner
// code. Error handling is much easier. 

var getIP = require('external-ip')();
var request = require("request");
var express = require('express');
var router = express.Router();

// Connection and connection settings 
var config = require('../config.js');
var DB = require('../models/db');

var publicIP;

getIP(function (err, ip) {

  // Gets the IP address of the server

  if (err) {
    console.log("Failed to retrieve IP address: " + err.message);
    throw err;
  }
  console.log("API running on " + ip + ":" + config.expressPort);
  publicIP = ip;
});

router.get('/', function (req, res, next) {

  // Testing the main domain

  var test = {
    "AppName": "fb-interests backend",
    "Version": 1.0,
    "IP": publicIP
  }
  res.json(test);
});

router.get('/config', function (req, res, next) {
  res.json(config.client);
})

router.post('/addDoc', function (req, res, next) {

  /* Request from client to add documents to a collection;

  Request Form:
  {
  	collectionName: string,
  	document: JSON document,
  }

  Response Form:
  {
  	success: boolean,
  	error: string
  }
  */

  var requestBody = req.body;
  var database = new DB;

  database.connect(config.mongodb.defaultUri)
    .then(
      function () {
        return database.addDocument(requestBody.collectionName, requestBody.document)
      }
    )
    .then(
      function () {
        return {
          "success": true,
          "error": ""
        };
      },
      function (error) {
        console.log('Failed to add document: ' + error);
        return {
          "success": false,
          "error": "Failed to add document: " + error
        };
      })
    .then(
      function (resultObject) {
        database.close();
        res.json(resultObject);
      }
    )
})

router.post('/user', function (req, res, next) {


  /* Find user datas with email and returns data as a document
  
  
  Request Form:
  {
    email: string
  }

  Response Form:
  {
  	success: boolean,
  	data: array,
  	error: string
  }
  */

  var requestBody = req.body;
  var database = new DB;

  database.connect(config.mongodb.defaultUri)
    .then(
      function () {
        return database.findUser(requestBody.email)
      })
    .then(
      function (res) {
        return {
          "success": true,
          "data": res,
          "error": ""
        };
      },
      function (err) {
        console.log("Failed to get document: " + err);
        return {
          "success": false,
          "error": "Failed to get document: " + err
        };
      })
    .then(
      function (resultObject) {
        database.close();
        res.json(resultObject);
      })
})

router.post('/categories', function (req, res, next) {

  /* Find user likes categories with email and returns data as a document
  
  Request Form:
  {
    email: string
  }

  Response Form:
  {
  	success: boolean,
  	data: array,
  	error: string
  }
  */

  var requestBody = req.body;
  var database = new DB;

  database.connect(config.mongodb.defaultUri)
    .then(
      function () {
        console.log("DATA --->" + requestBody.email);
        return database.findCategories(requestBody.email)
      })
    .then(
      function (res) {
        return {
          "success": true,
          "data": res,
          "error": ""
        };
      },
      function (err) {
        console.log("Failed to get the document: " + err);
        return {
          "success": false,
          "error": "Failed to get the document: " + err
        };
      })
    .then(
      function (resultObject) {
        database.close();
        res.json(resultObject);
      })
})

module.exports = router;