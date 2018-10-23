var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password: "password",
	database: "productsDB"
});

connection.connect(function (err) {
	if (err) throw err;
	console.log("connection as id: " + connection.threadId + "\n");
});

function runShop() {
	displayProduct(); 
}

function displayProduct() {
	connection.query("SELECT * FROM products", function (err, res) {
		if (err) throw err;
		for (var i = 0; i < res.length; i++) {
			console.log("Item Id: " + res[i].item_id + " \nProduct: " + res[i].product_name + " \nPrice: " + res[i].price + "\n---------------\n");
		}
		// connection.end();
		intitalPrompt(); 
	});
}

function intitalPrompt() {
	inquirer.prompt([
		{
			name: "item",
			type: "input",
			message: "What is the item ID of the product you would like to buy? ",
			validate: function (value) {
				if (isNaN(value) === false) {
					return true;
				}
				console.log("Sorry, product is unavailable.")
				return false;
			},
			filter: Number
		},
		{
			name: "qty",
			type: "input",
			message: "How many would you like to buy? ",
			filter: Number
		}
	]).then(function(input) {
	
		checkQuantity(input.item, input.qty);
	})
}

function checkQuantity(item, qty) {
	connection.query("SELECT stock_quantity FROM products WHERE ?", 
	{item_id: item}, function(err, res) {
		var availableQty = res[0].stock_quantity; 
		if (qty > availableQty) {
			console.log("\nOops! We don't carry that many products. Please try again and select a lower quantity.\n"); 
			anythingElse(); 
			// runShop(); 
		}	else {
	totalCost(item, qty); 
	}
	})
}

function anythingElse() {
	inquirer.prompt (
		{
			name: "morePurchases", 
			type: "rawlist",
			message: "Would you like to make another purchase today?",
			choices: ["YES", "NO"]
		}).then(function(input) {
		if(input.morePurchases.toUpperCase() === "YES") {
			runShop(); 
		}
		else {
			console.log("Thanks for shopping! We'll see you next time.");
			connection.end(); 
		}
	})
}

function totalCost(item, qty) {
	connection.query("SELECT * FROM products WHERE ?", {item_id: item}, function(err, res) {
		if (err) throw err; 
		var price = res[0].price;
		var updatedQty = res[0].stock_quantity - qty; 
		console.log("Ready to checkout! Your total comes to: " + (price * qty) + " dollars."); 
		updateStock(item, qty);
		anythingElse(); 
	})
}

function updateStock(item, qty) {
	connection.query("SELECT * FROM products WHERE ?", {
		item_id: item
	}, function(err, res) {
		if (err) throw err; 

		var newQty = res[0].stock_quantity - qty; 

		if (newQty < 0)
		newQty = 0; 

		connection.query("UPDATE products SET ? WHERE ?", [
			{
			stock_quantity: newQty
		},
	{
		item_id: item
	}], function (err, res) {
		if (err) throw err;
	})
	})	
// 	connection.query("UPDATE products SET ? WHERE ?" ,  [
// 	{
// 		stock_quantity: updatedQty 
// 	},
// {
// 	product_name: item
// }], function(err, res) {
// 	if (err) throw err;  
// })
}

runShop(); 




// connection.query("SELECT * FROM products", function(err, res) {
// 	if (err) throw err;

// 	for(var i = 0; i < res.length; i++) {

// 	console.log("\nItem ID: " + res[i].item_id);
// 	console.log("\nProduct: " + res[i].product_name);
// 	console.log("\nPrice: " + res[i].price);
// 	console.log("\n---------------------");
// 	}


// inquirer.prompt([
// 	{
// 		name: "item",
// 		type: "input",
// 		message: "What is the item ID of the product you would like to buy? ",
// 		validate: function(value) {
// 			if (isNaN(value) === false) {
// 					return true;
// 			}
// 			return false;
// 	}
// 	},
// 	{
// 		name: "qty",
// 		type: "input",
// 		message: "How many would you like to buy? ",
// 		validate: function(value) {
// 			if (isNaN(value) === false) {
// 					return true;
// 			}
// 			return false;
// 	}
// }
// ]).then(function(input) {
// 	for (var i = 0; i < res.length; i++) {
// 		if(res[i].item_id === parseInt(input.item))
// 		stock(parseInt(input.item), input.qty); 
// 	}
// })
// })

// function stock(itemId, qty) {
// 	connection.query("SELECT * FROM products WHERE ?"), {
// 		item_id: itemId
// 	}, function(err, res) {
// 		if (err) throw err; 

// 		if (res[0].stock_quantity <= 0) {
// 			console.log("Insufficient quantity! Please input a lower number."); 
// 		}
// 		else {
// 			updateQty(itemId, qty); 
// 		}
// 	}
// }

// function totalCost(itemId, qty) {
// 	connection.query("SELECT * FROM products WHERE ?"), {
// 		item_id: itemId
// 	}, function(err, res) {
// 		if (err) throw err; 

// 		var cost = res[0].price * qty;
// 		console.log("Your total cost is: " + cost); 
// 	}
// }

// function updateQty(itemID, qty) {
// 	connection.query("SELECT * FROM products WHERE ?", {
// 			item_id: itemID
// 	}, function(err, res) {
// 			if (err) throw err;

// 			var newQty = response[0].stock_quantity - qty;

// 			if (newQty < 0)
// 					newQty = 0;

// 			connection.query("UPDATE products SET ? WHERE ?", [{
// 					stock_quantity: newQty
// 			}, {
// 					item_id: itemID
// 			}], function(err, res) {});

// 			totalCost(itemID, qty);
// 	});
// }

// // function updateQty(itemId, qty) {
// // 	connection.query("SELECT * FROM products WHERE ?"), {
// // 		item_id: itemId
// // 	}, function(err, res) {
// // 		if (err) throw err; 

// // 		var newQty = res[0].stock_quantity - units;

// // 		if (newQty < 0)
// // 		newQty = 0; 

// // 		connection.query("UPDATE products SET ? WHERE ?"), [{
// // 			stock_quantity: newQty
// // 		}, {
// // 			item_id: itemId
// // 		}], function(err, res) {}); 
// // 		totalCost(itemId, qty); 
// // 	}
// // }
// // // function buy() {
// // 	inquirer.prompt([
// // 		{
// // 			name: "choice",
// // 			type: "rawlist",
// // 			choices: function () {
// // 				var choiceArray = [];
// // 				for (var i = 0; i < res.length; i++) {
// // 					choiceArray.push("ID [#" + res[i].item_id + "] - " + res[i].product_name);
// // 				}
// // 				return choiceArray;
// // 			},
// // 		}			
// // 	])
// // }

// // function buy() {
// // 	connection.query("SELECT * FROM products", function (err, res) {
// // 		if (err) throw err; 
// // 	inquirer.prompt([
// // 		{
// // 			name: "choice",
// // 			type: "rawlist",
// // 			choices: function() {
// // 				var choiceArray = [];
// // 				for(var i = 0; i < res.length; i++) {
// // 					choiceArray.push("ID [#" + res[i].item_id + "] - " + res[i].product_name);
// // 				}
// // 				return choiceArray;
// // 			},
// // 			message: "What is the item ID of the product you would like to buy?",
// // 		// 	validate: function(value) {
// // 		// 		//if input if incorrect or store has less than 1 item left, error message
// // 		// 		if (isNaN(value) === true && products.indexOf(value) !== -1) {
// // 		// 		return true;
// // 		// 		}
// // 		// 		console.log("Sorry, that product is unavailable");
// // 		// 		return false;
// // 		// }
// // 	}, 
// // 	{
// // 		name: "qty",
// // 		type: "input", 
// // 		message: "How many would you like to buy?"
// // 	}
// // 		})
// // 	})
// // 	}





// 	// ]).then(function(input) {
// 	// 	connection.query(
// 	// 		"UPDATE auctions SET ? WHERE ?",
// 	// 		[var chosenItem;

// 	// 	for(var i = 0; i < res.length; i++) {
// 	// 		if (res[i].item_id === input.choice) {
// 	// 			chosenItem = res[i]; 
// 	// 		}
// 	// 	}
// 	// 	if(chosenItem.stock_quantity < parseInt(input.qty)) {
// 			// connection.query(
// 			// 	"UPDATE products SET ? WHERE ?",
// 			// 	[
// 			// 		{
// 			// 			stock_quantity: input.qty
// 			// 		},
// 			// 		{
// 			// 			item_id: chosenItem.item_id
// 			// 		}
// 			// 	],
// 			// 	function (err) {
// 			// 		if (err) throw err;
// 			// 		console.log("Product purchased!"); 
// 			// 		buy(); 
// 			// 	}
// 			// )

// // 		}
// // 	})
// // })
// // }


// // function start() {
// // 	connection.query("SELECT * FROM products", function(err, res) {
// // 		if (err) throw err; 
// // 	inquirer.prompt([
// // 		{
// // 			name: "productId",
// // 			type: "input",
// // 			message: "What is the item ID of the product you would like to buy?"
// // 		},
// // 		{
// // 			name: "qty",
// // 			type: "input",
// // 			message: "How many would you like to buy?",
// // 			validate: function(value) {
// // 				if (isNaN(value) === false) {
// // 					return true;
// // 				}
// // 				return false;
// // 			}
// // 		}
// // 	]).then(function(input) {
// // 		connection.query(
// // 			"INSERT INTO products SET ?",
// // 			{
// // 				item_id: input.productId,
// // 				stock_quantity: input.qty
// // 			},
// // 			function (err) {
// // 				if (err) throw err;
// // 				console.log("Item ID updated")
// // 			}
// // 		)
// // 		var chosenItem;
// // 		for(var i = 0; i < res.length; i++) {
// // 			if(res[i].item_id === input.productId) {
// // 				chosenItem = res[i]; 
// // 			}
// // 		}

// // 		if (chosenItem.stock_quantity < parseInt(input.qty)) {
// // 			connection.query(
// // 				"UPDATE products SET? WHERE ?",
// // 				[
// // 					{
// // 						stock_quantity: input.qty
// // 					},
// // 					{
// // 						item_id: chosenItem.productId
// // 					}
// // 				],
// // 				function(err) {
// // 					if (err) throw err;
// // 					console.log("Purchase Successful"); 
// // 					start(); 
// // 				}
// // 			);
// // 		}
// // 		else {
// // 			console.log("Only " + stock_quantity + "left. Please select a lower number");
// // 			start(); 
// // 		}
// // 	})
// // })
// // }