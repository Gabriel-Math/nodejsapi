var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Product = require('./app/models/product');

mongoose.connect('mongodb://localhost/superbanco');

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

var port = process.env.port || 8000;

var router = express.Router();

router.use(function(req, res, next) {
	console.log("interceptacao pelo middleware ok");
	next();
});

router.get('/', function (req, res) {
	res.json({'message':'Ok, rota principal funcionando'});
});


router.route('/produtos')
 
  .post(function(req, res) {
  	var product = new Product();
  	product.name = req.body.name;	
  	product.price = req.body.price;
  	product.description = req.body.description;
  
  	product.save(function(error) {
  		if(error)
  			res.send("Erro ao salvar produto no banco" + error);
		  
		res.status(201).json({message:"Produto inserido com sucesso."});
  	});
  })

  .get(function(req, res) {
	Product.find(function(err, prods){
		if(err)
			res.send(err);

		res.status(200).json({
			message: "retorno de todos os produtos",
			allProducts:prods
		});
	});
});

app.use('/api', router);

app.listen(port);
console.log("API up and running! on port" + port);