var express = require('express');
var app = express();

var Animal = require('./Animal.js');
var Toy = require('./Toy.js');


app.get('/', (req, res) => {
	res.json({ msg : 'It works!' });
});

app.get('/findToy', (req, res) => {
	var itemQuery = req.query.id;
	var foundToy = {};

	//fetch name and price from mongo db
	Toy.findOne( { id: itemQuery }, (err, toy) => {
		if (err) {
			res.type('html').status(500);
			res.send('Error: ' + err);
		}
		else if (!toy) {
			res.type('html').status(200);
			res.json(foundToy);
		}
		else {
			//return entire document object
			foundToy = toy;
			res.json(foundToy);
		}
	});
});


app.get('/findAnimals', (req, res) => {
	var foundAnimals = {};
	var query = {};
	if(!(req.query.name || req.query.trait ||
		req.query.species || req.query.breed ||
		req.query.gender || req.query.age)){
			res.json({});
			return;
		}
		if(req.query.trait) query.traits = req.query.trait;
		if(req.query.name) query.name = req.query.name;
		if(req.query.species) query.species = req.query.species;
		if(req.query.breed) query.breed = req.query.breed;
		if(req.query.gender) query.gender = req.query.gender;
		if(req.query.age) query.age = req.query.age;


	Animal.find(query, (err, animals) => {

		if(err) {
			res.type('html').status(500);
			res.send('Error: ' + err);
		}
		else if (!animals) {
			res.type('html').status(200);
			res.json(foundAnimals);
		}
		else {

			res.json(animals);
		}
	}).select({"_id": 0, "traits": 0, "__v": 0});
});

app.get('/animalsYoungerThan', (req, res) => {
	//get animals
	var query = {};
	if(req.query.age && !isNaN(req.query.age)) query.age = { $lt: req.query.age};
	else {
		res.json({});
		return;
	}

	Animal.find(query, (err, animals) => {
		var animalsObj = {
			count: 0
		};

		if(err) {
			res.type('html').status(500);
			res.send('Error: ' + err);
		}
		else if(!animals) {
			res.type('html').status(200);
			res.json(animalsObj);
		}
		else {
			//set values
			animalsObj.name = [];

			animals.forEach((a) => {
				animalsObj.count++;
				animalsObj.name.push(a.name);
			});
		}
		res.json(animalsObj);
	});



});

app.get('/calculatePrice', (req, res) => {
	var query = {};
	var store = {};
	var cal = {
		totalPrice: 0,
		items: []
	};
	var i = 0;

	while(req.query.id[i])
	{
		if(store[req.query.id[i]]) store[req.query.id[i]] += Number(req.query.qty[i]);
		else store[req.query.id[i]] = Number(req.query.qty[i]);
		i++;
	}

	if(req.query.id){
		if(i > 1)	query.id = {"$in": req.query.id};
		else query.id = req.query.id;
	}

	if(req.query.id.length != req.query.qty.length) res.json({});


	Toy.find(query, (err, toys) => {
		if(err){
			res.type('html').status(500);
			res.send('Error: ' + err);
		} else if(!toys){
			res.type('html').status(200);
			res.json({});
		} else {
			toys.forEach((a) => {
				if(!isNaN(store[a.id]) && store[a.id] >= 1) {
					cal.totalPrice += a.price*store[a.id];
					cal.items.push({item: a.id, qty: store[a.id], subtotal: a.price*store[a.id]});
				}
			});
			res.json(cal);
		}

	});


});


app.listen(3000, () => {
	console.log('Listening on port 3000');
    });



// Please do not delete the following line; we need it for testing!
module.exports = app;
