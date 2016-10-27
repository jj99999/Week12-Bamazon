var inquirer = require('inquirer');

var mysql = require('mysql');
var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password: "",
	database: "Bamazon"

})

connection.connect(function(err) {
	if (err) throw err;
	// console.log("connected as id " + connection.threadId);

})





connection.query('SELECT * FROM Products' , function(err, res){
	console.log("-------------------------------------------------");
	console.log("Welcome to Bamazon!  Please peruse our inventory.");
	console.log("-------------------------------------------------\n");
	for (var i=0; i<res.length; i++){
		console.log(res[i].ItemID + " | " + res[i].ProductName + " | " + res[i].DepartmentName + " | $" + res[i].Price + " | Quantity: " + res[i].StockQuantity);
		console.log("-------------------------------------------------");
	}



	var begin = function(){

		inquirer.prompt([
				{
				name: "choice",
				type: "input",
				message: "Please type the ID number of the item you would like to purchase.",
				validate: function(value){
	        		if(isNaN(value) == false && parseInt(value) > 0){
	          			return true;
	        			}else{
	          			return false;}
					},
				},
					
				{
				name: "number",
				type: "input",
				message: "How many would you like to buy?",
				validate: function(value){
	        		if(isNaN(value) == false && parseInt(value) > 0){
	          			return true;
	        			}else{
	          			return false;}
					},
				}


			]).then(function(answer) {
				
				var custChoice = answer.choice;
				var custQty = parseInt(answer.number);
				var custPrice = parseFloat((res[custChoice-1].Price)*custQty);
				var currentQty = res[custChoice-1].StockQuantity;
				var newQty = (currentQty - custQty);
				var custProduct = res[custChoice-1].ProductName;

				// console.log(custChoice+"\n");
				// console.log(custQty+"\n");
				// console.log(custPrice+"\n");
				// console.log(currentQty+"\n");
				// console.log(newQty+"\n");
				// console.log(custProduct+"\n");

				if(currentQty >= custQty){

					connection.query('UPDATE Products SET ? WHERE ?', [
					{StockQuantity: newQty},
					{ItemID: custChoice}
					], function(err, res){
						if(err) throw err;
						console.log("-------------------------------------")
						console.log("\nYour total is $"+custPrice+". Thank you for shopping with Bamazon.");
						console.log("\n");
						begin();
						}

					);

				}else{
					console.log("We only have "+currentQty+" of that item. Please try again.");
					begin();
					}

				});
			
	}

begin();

});	