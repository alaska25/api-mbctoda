const jwt = require("jsonwebtoken");
// JSON Web Tokens - is used for sending secured transaction.

// Token Creation
/*
	Analogy
		Pack the gift and provide a lock with the secret code as the key.
*/
const secret = "crushAkoNgCrushKo"

module.exports.createAccessToken = (user) => {
	// When the user logs in, a token will be created with the user's information.
	// This will be used for the token payload
	const data = {
		id: user._id,
		email: user.email,
		isAdmin: user.isAdmin
	}
												// To set limits for client login
	//Syntax: jwt.sign(payload, secretOrPrivateKey, [options/callBackFunction]);
	return jwt.sign(data, secret, {});
}

// Token Verification
/*
	Analogy
		Receive the gift and open the lock to verify if the sender is legitimate and the gift was not tampered with.
*/

// Middleware functions
module.exports.verify = (req, res, next) =>{
	let token = req.headers.authorization;
	console.log(typeof token);

	if(typeof token !== "undefined"){
		console.log(token)

		// This code removes the "bearer"
		token = token.slice(7, token.length);
		console.log(token)

		// Syntax: jwt.verify(token, secretCode, [options/callBackFunction])
		return jwt.verify(token, secret, (err, data)=>{
			// If JWT is not valid
			if(err){
				return res.send({auth: "Token Failed"});
			}
			else{
				// The verify method will be used as a middleware in the route to verify the token before proceeding to the function that invokes the controller function.
				next();
			}
		})
	}
	else{
		return res.send({auth: "Failed"});
	}
}


// Token Decryption
/*
	Analogy
		Open the gift and get the content.
*/

module.exports.decode = (token) =>{

	if(typeof token !== "undefined"){
		token = token.slice(7, token.length);
		return jwt.verify(token, secret, (err, data)=>{
			// If JWT is not valid
			if(err){
				return null;
			}
			else{
				// Syntax: jwt.decode(token, [options])
				return jwt.decode(token, {complete: true}).payload;
			}
		})
	}
	else{
		return null;
	}
}