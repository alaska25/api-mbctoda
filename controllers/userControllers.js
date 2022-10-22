const User = require("../models/User");
const bcrypt = require("bcrypt");
const auth = require("../auth");

// Check if the email already exists
/*
	Steps:
	1. Use mongoose "find" method to find the duplicate emails.
	2. Use the ".then" method to send back a response to the front end application based on the result of find method.

*/

module.exports.checkEmailExists = (reqBody) => {
	return User.find({email: reqBody.email}).then(result => {
		// result is equal to an empty array ([]);
		// if result is greater than 0, user is found/already exists.
		if(result.length > 0){
			return true;
		}
		// No duplicate email found
		else{
			return false;
		}
	});
}

// User Registration
/*
	Steps:
	1. Create a new User object using the mongoose model and the information from the request body.
	2. Make sure that the password is encrypted.
	3. Save the new User to the database.

*/
module.exports.registerUser= (reqBody) => {
	return User.findOne({email: reqBody.email}).then(result => {
		if(result != null && result.email == reqBody.email){
			return false;
		}
		else{
			if(reqBody.email != "" && reqBody.password != ""){
				let newUser = new User({
					firstName: reqBody.firstName,
					lastName: reqBody.lastName,
					email: reqBody.email,
					password: bcrypt.hashSync(reqBody.password, 10)
				});
				return newUser.save().then((user, error) =>{
						if(error){
							return false;
						}
						else{
							console.log(newUser);
							return true;
						}
					})
			}
			else{
				return false; 
			}
		}
	})
}


// Retrieve all users
module.exports.retrieveAllUsers = () =>{
	return User.find({}).then(result => result);
}

//User login
/*
	Steps:
	1. Check the database if the user's email is registered.
	2. Compare the password provided in the login form with the password in the database.
	3. Generate and return a JSON web token if the user is successfully login and return false if not.
*/
module.exports.loginUser = (reqBody) => {
	return User.findOne({email: reqBody.email}).then(result =>{
		if(result == null){
			return false;
		}
		else{
			const isPasswordCorrect = bcrypt.compareSync(reqBody.password, result.password);
			if(isPasswordCorrect){
				return {access: auth.createAccessToken(result)}
			}
			else{
				return false;
			}
		}
	})
}

// Retrieve user details
/*
	Steps:
	1. Find the document in the database using the user's ID.
	2. Reassign the password of the result document to an empty string("").
	3. Return the result back to the frontend.
*/
module.exports.getProfile = (data) =>{
	console.log(data)
	return User.findById(data.userId).then(result =>{
		result.password ="";

		return result;
	})
}

//set a user to admin
module.exports.updateUserStatus = (userId) =>{

	let updatedStatus = {
		isAdmin: true
	}
	return User.findByIdAndUpdate(userId, updatedStatus).then((updatedStatus, error) =>{
		if (error) {
			return false;
		}
		else {
			return true;
		}
	})	
}

//set a user change status
module.exports.updateStatus = (userId) =>{

	let updateStatus = {
		isAdmin: false
	}
	return User.findByIdAndUpdate(userId, updateStatus).then((updatedStatus, error) =>{
		if (error) {
			return false;
		}
		else {
			return true;
		}
	})	
}



//Create Order - Customer only
module.exports.createOrder = async (data) =>{
let newOrder 
	let isOrderUpdated = await Order.findById(data.userId).then(orderResult =>{
				
				newOrder = new Order({
					userId: data.userId,
					productId: data.productId,
					price: data.price,
					quantity: data.quantity,
					total: data.total
				})
				return newOrder.save().then((order, error) =>{
					if(error){
						return false;
						}
					else{
						return true;
					}	
				})
		})

	//loop or for each
	let isProductUpdated = await Product.findById(data.productId).then(product =>{
		product.stocks = product.stocks - data.quantity;
		return product.save().then((stocks, error) =>{
			if(error){
				return false;
			}
			else{
				return true;
			}
		})
	})

	let isPriceUpdated = await Product.findById(newOrder.productId).then(priceResult =>{
		newOrder.price = priceResult.price;
		newOrder.total = priceResult.price * newOrder.quantity;
		return newOrder.save().then((order, error)=>{
			if(error){
				return false;
			}
			else{
				return true;
			}
		})
	})
	console.log(newOrder);
	if(isOrderUpdated && isProductUpdated && isProductUpdated){
		return true;
	}
	else{
		return false;
	}

}

// module.exports.enroll = async (data) =>{
		
// 		//true or false										//result
// 	let isUserUpdated = await User.findById(data.userId).then(user =>{
// 		// Add the courseId in the user's enrollment array
// 		user.enrollments.push({courseId: data.courseId})

// 		// Saves the updated user information in the database.
// 		return user.save().then((enrollment, error)=>{
// 			if(error){
// 				return false;
// 			}
// 			else{
// 				return true;
// 			}

// 		})
// 	})

// 	console.log(isUserUpdated);

// 	let isCourseUpdated = await Course.findById(data.courseId).then(course =>{
		
// 		// Adds the userId in the course's enrollees array
// 		course.enrollees.push({userId: data.userId})

// 		// Minus the slots available by 1
// 		course.slots -= 1;

// 		// Saves the updated course information in the database
// 		return course.save().then((enrollees, error) =>{
// 			if(error){
// 				return false;
// 			}
// 			else{
// 				return true;
// 			}
// 		})
// 	})

// 	console.log(isCourseUpdated);

// 	// Condition that will check if the user and course documents have been updated.
// 	// User enrollment successful
// 	if(isUserUpdated && isCourseUpdated){
// 		return true;
// 	}
// 	// User enrollment failure
// 	else{
// 		return false;
// 	}
// }

// Retrieve User’s orders (Customer) 
module.exports.getUserOrders = (data) =>{
	return Order.find({data}).then(result => result);
}


// Retrieve all orders (Admin only)
module.exports.getAllOrders = () =>{
	return Order.find({}).then(result => result);
}


	


