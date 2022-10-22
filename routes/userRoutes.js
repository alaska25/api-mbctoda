const express = require("express");
const router = express.Router();
const userControllers = require("../controllers/userControllers")
const auth = require("../auth");

// Router for checking if the email exists
router.post("/checkEmail", (req, res) =>{
	userControllers.checkEmailExists(req.body).then(resultFromController => res.send(resultFromController));
});

// Router for the user registration
router.post("/register", (req, res) =>{
	userControllers.registerUser(req.body).then(resultFromController => res.send(resultFromController));
});

//Route to retrieve all users
router.get("/", (req, res)=>{
	const userData = auth.decode(req.headers.authorization);
	if(userData.isAdmin){
		userControllers.retrieveAllUsers(req.params.userId).then(resultFromController => res.send(resultFromController));
	}
	else{
		res.send("Failed");
	}
})

//Route for the user login(with token creation)
router.post("/login", (req, res)=>{
	userControllers.loginUser(req.body).then(resultFromController => res.send(resultFromController));
})

// Route for the retrieving the current user's details
router.get("/details", auth.verify, (req, res) =>{
	const userData = auth.decode(req.headers.authorization); //contains the token 
	console.log(userData);

	// Provides the user's ID for the getProfile controller method
	userControllers.getProfile({userId: userData.id}).then(resultFromController => res.send(resultFromController));
})


// set user as admin
router.put("/:userId/setAsAdmin",auth.verify, (req, res)=>{
	// token
	const userData = auth.decode(req.headers.authorization);

	if(userData.isAdmin){
		userControllers.updateUserStatus(req.params.userId).then(resultFromController => res.send(resultFromController));
	}
	else{
		res.send("Failed")
}
})

//set a user change status
router.put("/:userId/",auth.verify, (req, res)=>{
	// token
	const userData = auth.decode(req.headers.authorization);

	if(userData.isAdmin){
		userControllers.updateStatus(req.params.userId).then(resultFromController => res.send(resultFromController));
	}
	else{
		res.send("Failed")
}
})

//Create Order(Adding orders)
router.post("/addOrder", auth.verify, (req, res)=>{
	const userData = auth.decode(req.headers.authorization)
	let data = {
		userId: userData.id,
		productId: req.body.productId,
		price: req.body.price,
		quantity: req.body.quantity
	}
	
	if(userData.isAdmin){
		res.send(false)
	}
	else{
		userControllers.createOrder(data).then(resultFromController => res.send(resultFromController));
	}
})


// Retrieve User’s orders (Customer only)
router.get("/Orders", auth.verify, (req, res)=>{
	const userData = auth.decode(req.headers.authorization)
	if(userData.isAdmin){
		res.send("You're not allowed to access this page!")
	}
	else{
		userControllers.getUserOrders(req.params.userId).then(resultFromController => res.send(resultFromController));
	}
})


// Retrieve all orders (Admin only)
router.get("/allOrders", auth.verify, (req, res) =>{
	const userData = auth.decode(req.headers.authorization)
	if(userData.isAdmin){
		userControllers.getAllOrders().then(resultFromController => res.send(resultFromController));
	}
	else{
		res.send("You're not allowed to access this page!")
	}
})

module.exports = router;