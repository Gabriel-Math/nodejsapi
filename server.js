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
	res.json({
		'message':'Ok, rota principal funcionando'
	});
});

router.route('/produtos/:productId')
.get(function(req, res){
	const id = req.params.productId;

	Product.findById(id, function(err, product){
		if(err){
			res.status(500).json({
				message: "Erro ao tentar encontrar produto, ID mal formado"
			});
		}
		else if (product == null){
			res.status(400).json({
				message: "Produto não encontrado"
			});
		}
		else {
			res.status(200).json({
				message: "Produto encontrado",
				product: product
			});
		}
	});
})

.put(function(req, res){
	const id = req.params.productId;
	Product.findById(id, function(err, product){
		if(err){
			res.status(500).json({
				message: "ID mal formado, erro ao tentar encontrar produto"
			});
		}
		else if (product == null){
			res.status(400).json({
				message: "Produto não encontrado"
			});
		}
		else {
			product.name = req.body.name;
			product.price = req.body.price;
			product.description = req.body.description;

			product.save(function(err){
				if(err)
					res.send("Erro ao tentar atualizar produto" + err);
				
				res.status(200).json({
					message:"Produto atualizado com sucesso"
				});
			});
		}
	});
})

.delete(function(req,res){
	Product.findByIdAndRemove(req.params.productId, (err, product) => {
		if(err) return res.status(500).send(err);

		const response = {
			message: "Produto removido com sucesso",
			id: product.id
		};
		return res.status(200).send(response);
	});
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
		  
		res.status(201).json({
			message:"Produto inserido com sucesso."
		});
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