var express = require('express');
var app = express();

var Animal = require('./Animal.js');
var Toy = require('./Toy.js');


app.get('/', (req, res) => {
	res.json({ msg : 'It works!' });
});

app.get('/findToy', (req, res) => {
	var itemQuery = req.query.id;

	//fetch name and price from mongo db
	Toy.findOne( { id: itemQuery }, (err, toy) => {
		if (err) {
			res.type('html').status(500);
			res.send('Error: ' + err);
		}
		else if (!toy) {
			res.type('html').status(200);
			res.send('There is no toy with id ' + itemQuery);
			res.json(toy);
		}
		else {
			//return entire document object
			res.json(toy);
		}
	});
});


	newAnimal.save();
	console.log('new animal added');
});

app.get('/findAnimals', (req, res) => {
	Animal.find(req.query, (err, animals) => {
		if(err) {
			res.type('html').status(500);
			res.send('Error: ' + err);
		}
		else if (!animals) {
			res.type('html').status(200);
			res.send('There are no animals that match the provided query.');
			res.json(animals);
		}
		else {
			res.json(animals);
		}
	});
});

app.get('/animalsYoungerThan', (req, res) => {
	//get animals
	var query = {};
	if(req.query.age) query.age = { $lt: req.query.age};

	Animal.find(query, (err, animals) => {
		if(err) {
			res.type('html').status(500);
			res.send('Error: ' + err);
		}
		else if(!animals) {
			res.type('html').status(200);
			res.send('There are no animals younger than ' + req.query.age);
			res.json(animals);
		}
		else {
			//set values
			var animalsObj = {
				count: animals.length
			};
			if(animalsObj.count > 0) {
				animalsObj.name = [];

				animals.forEach((a) => {
					animalsObj.name.push(a.name);
				});
			}
			res.json(animalsObj);

		}
	});



});

app.get('/calculatePrice', (req, res) => {
	var query = {};
	var store = {};
	var cal = {
		totalPrice: 0,
		items: []
	};

	for(var i = 0 ; i < req.query.id.length; i++) {
		store[req.query.id[i]] = req.query.qty[i];
	}

	if(req.query.id){
		if(req.query.id.length > 1)	query.id = {"$in": req.query.id};
		else query.id = req.query.id;
	}


	Toy.find(query, (err, toys) => {
		if(err){
			res.type('html').status(500);
			res.send('Error: ' + err);
		} else if(!toys){
			res.type('html').status(200);
			res.send('There are no toys with id' + req.query.id);
		} else {
			toys.forEach((a) => {
				if(!isNaN(store[a.id]) || store[a.id] >= 1) {
					cal.totalPrice += a.price*Number(store[a.id]);
					cal.items.push({item: a.name, qty: store[a.id], subtotal: a.price*Number(store[a.id])});
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
