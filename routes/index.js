var express = require('express');
var router = express.Router();
var responsejson = require('./common/response.json');
var replacer = require('./common/replacer');

function companies(){
	this.objectId = '';
	this.id = 0;
	this.name = '';
    this.num_employees = 0;
	this.contact_email = '';
	this.year_founded = 0;
	this.contact_name = '';
	this.rankings = [];
}

function rankings(){
	this.financials = 0;
    this.team = 0;
	this.idea = 0;
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


/* GET companylist page. */
router.get('/companylist', function(req, res) {
	var response = Object.assign({}, responsejson);
	try {
    var db = req.db;
    var collection = db.get('company');
    collection.find({},{},function(e,docs){
        
	if (!e) {
        response.result = true;
        response.responseCode = 201;
        response.responseMessage = "Success";
		
		var companiesList = [];
		for (i = 0; i < docs.length; i++) {
			var company = new companies();
			company.objectId = docs[i]._id;
			company.id = docs[i].id;
			company.name = docs[i].name;
			company.num_employees = docs[i].num_employees;
			company.contact_email = docs[i].contact_email;
			company.year_founded = docs[i].year_founded;
			company.contact_name =docs[i].contact_name;
			company.rankings = docs[i].rankings;
			
			companiesList.push(company);
		}
		response.response = companiesList;
				
    } else {
        response.result = false;
        response.responseCode = 500;
        response.responseMessage = "Something went wrong, try later";
    }
    var jsonString = JSON.stringify(response, replacer);
    res.send(jsonString);
    });
	} catch (err) {
        console.log(err);
        response.result = false;
        response.responseCode = 500;
        response.responseMessage = "Something went wrong, try later";
        var jsonString = JSON.stringify(response, replacer);
        res.send(jsonString);
    }
});

/* POST to Add company Service */
router.post('/addcompany', function(req, res) {
	var response = Object.assign({}, responsejson);
	var query = require('url').parse(req.url, true).query;
	
	var company = new companies();
	company.id = parseInt(query["id"]);
	company.name = query["name"];
	company.num_employees = parseInt(query["num_employees"]);
	company.contact_email = query["contact_email"];
	company.year_founded = parseInt(query["year_founded"]);
	company.contact_name =query["contact_name"];
	
	var ranking = new rankings();
	ranking.financials = parseInt(query["financials"]);
	ranking.team = parseInt(query["team"]);
	ranking.idea = parseInt(query["idea"]);
	
	company.rankings = ranking;
    
    // Set our internal DB variable
    var db = req.db;
   // Set our collection
    var collection = db.get('company');

    // Submit to the DB
    collection.insert({
        "id" : company.id,
		"name" : company.name,
		"num_employees" : company.num_employees,
		"contact_email" : company.contact_email,
		"year_founded" : company.year_founded,
		"contact_name" : company.contact_name,
		"rankings" : company.rankings
    }, function (err, doc) {
        if (err) {
            response.result = false;
			response.responseCode = 500;
			response.responseMessage = "Something went wrong, try later";
        }
        else {
			response.result = true;
			response.responseCode = 201;
			response.responseMessage = "Success";
			response.id = doc._id;
        }
		var jsonString = JSON.stringify(response, replacer);
        res.send(jsonString);
    });
});

/* POST to Update company Service */
router.post('/updatecompany/:id', function(req, res) {
	var response = Object.assign({}, responsejson);
	var query = require('url').parse(req.url, true).query;
	
	var company = new companies();
	company.id = parseInt(query["id"]);
	company.name = query["name"];
	company.num_employees = parseInt(query["num_employees"]);
	company.contact_email = query["contact_email"];
	company.year_founded = parseInt(query["year_founded"]);
	company.contact_name =query["contact_name"];
	
	var ranking = new rankings();
	ranking.financials = parseInt(query["financials"]);
	ranking.team = parseInt(query["team"]);
	ranking.idea = parseInt(query["idea"]);
	
	company.rankings = ranking;
    
    // Set our internal DB variable
    var db = req.db;
   // Set our collection
    var collection = db.get('company');

    // Submit to the DB
    collection.update({_id: req.params.id},{
        "id" : company.id,
        "name" : company.name,
		"num_employees" : company.num_employees,
		"contact_email" : company.contact_email,
		"year_founded" : company.year_founded,
		"contact_name" : company.contact_name,
		"rankings" : company.rankings
    }, function (err, doc) {
        if (err) {
            response.result = false;
			response.responseCode = 500;
			response.responseMessage = "Something went wrong, try later";
        }
        else {
			response.result = true;
			response.responseCode = 201;
			response.responseMessage = "Success";
			response.id = req.params.id;
        }
		var jsonString = JSON.stringify(response, replacer);
        res.send(jsonString);
    });
});

/* POST to Remove company Service */
router.post('/removecompany/:id', function(req, res) {
	var response = Object.assign({}, responsejson);
	
    // Set our internal DB variable
    var db = req.db;
   // Set our collection
    var collection = db.get('company');

    // Submit to the DB
    collection.remove({_id: req.params.id}, function (err, doc) {
        if (err) {
            response.result = false;
			response.responseCode = 500;
			response.responseMessage = "Something went wrong, try later";
        }
        else {
			response.result = true;
			response.responseCode = 201;
			response.responseMessage = "Success";
			response.id = req.params.id;
        }
		var jsonString = JSON.stringify(response, replacer);
        res.send(jsonString);
    });
});

/* POST to Get Only one company's Detail Service */
router.get('/getcompany/:id', function(req, res) {
	var response = Object.assign({}, responsejson);
	
    // Set our internal DB variable
    var db = req.db;
   // Set our collection
    var collection = db.get('company');

    // Submit to the DB
    collection.find({_id: req.params.id}, function (err, doc) {
        if (err) {
            response.result = false;
			response.responseCode = 500;
			response.responseMessage = "Something went wrong, try later";
        }
        else {
			response.result = true;
			response.responseCode = 201;
			response.responseMessage = "Success";
			response.response = doc;
        }
		var jsonString = JSON.stringify(response, replacer);
        res.send(jsonString);
    });
});

/* POST to Get Only one company's Detail Service */
router.get('/getallcompany/:rows/:element', function(req, res) {
	var response = Object.assign({}, responsejson);
	
    // Set our internal DB variable
    var db = req.db;
   // Set our collection
    var collection = db.get('company');
	
	//Set default options for filtering
	var colObj = {"sort" : { 'rankings.financials' : -1},"limit":req.params.rows}
	
	if(req.params.element == 2)
		colObj = {"sort" : { 'rankings.team' : -1},"limit":req.params.rows}
	else if(req.params.element == 3)
		colObj = {"sort" : { 'rankings.idea' : -1},"limit":req.params.rows}
	
	// Submit to the DB
    collection.find({},colObj, function (err, doc) {
        if (err) {
			console.log(err);
            response.result = false;
			response.responseCode = 500;
			response.responseMessage = "Something went wrong, try later";
        }
        else {
			//console.log(doc);
			response.result = true;
			response.responseCode = 201;
			response.responseMessage = "Success";
			response.response = doc;
        }
		var jsonString = JSON.stringify(response, replacer);
        res.send(jsonString);
    });
	
});

module.exports = router;
