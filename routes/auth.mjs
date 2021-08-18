import { Router }       from 'express';
import { flashMessage } from '../utils/flashmsg.mjs';
import  {ModelUser}     from '../data/user.mjs';
import Hash             from 'hash.js';
import Passport         from 'passport';
import ExpressHBS       from 'express-handlebars';
import SendGrid         from '@sendgrid/mail';
import JWT              from 'jsonwebtoken';
import { Database } from '../data/database.mjs';

SendGrid.setApiKey("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");



const router = Router();
export default router;

/**
 * Regular expressions for form testing
 **/ 
const regexEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
//	Min 3 character, must start with alphabet
const regexName  = /^[a-zA-Z][a-zA-Z]{2,}$/;
//	Min 8 character, 1 upper, 1 lower, 1 number, 1 symbol
const regexPwd   = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const hbsRender  = ExpressHBS.create({});

router.get("/login",         login_page);
router.post("/login",        login_process);
router.get("/register",      register_page);
router.post("/register",     register_process);
router.get("/logout",        logout_process);
router.get("/verify/:token", verify_process);
router.get("/editprofile",        editprofile_process);
router.post("/editprofile",                editprofile_process);
router.get("/list", 				manage_users );

/**
 * Renders the login page
 * @param {import('express')Request}  req Express Request handle
 * @param {import('express')Response} res Express Response handle
 */
		
async function login_page(req, res) {
	console.log("Login page accessed");
	return res.render('auth/login');
}

/**
 * Render the registration page
 * @param {import('express').Request}  req Express Request handle
 * @param {import('express').Response} res Express Response handle
 */
async function register_page(req, res) {
	console.log("Register page accessed");
	return res.render('auth/register');
}


/**
 * Process the login form body
 * @param {import('express').Request}  req Express Request handle
 * @param {import('express').Response} res Express Response handle
 * @param {import('express').NextFunction}
 */
async function editprofile_process(req,res,next){
	console.log("Profile edited")
	console.log(req.body);
}
async function manage_users(req, res) {
	const users= await ModelUser.findAll({ raw: true});
	console.log(users);
	return res.render('list',{
		users: users
	})
}
async function login_process(req, res, next) {
	console.log("login contents received");
	console.log(req.body);

	let errors = [];
	//	Check your Form contents
	//	Basic IF ELSE STUFF no excuse not to be able to do this alone
	//	Common Sense
	try {
		if (! regexEmail.test(req.body.email)) {
			errors = errors.concat({ text: "Invalid email address!" });
		}

		if (! regexPwd.test(req.body.password)) {
			errors = errors.concat({ text: "Password requires minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character!" });
		}

		if (errors.length > 0) {
			throw new Error("There are validation errors");
		}
	}
	catch (error) {
		console.error("There is errors with the login form body.");
		console.error(error);
		return res.render('auth/login', { errors: errors });
	}

	return Passport.authenticate('local', {
		successRedirect: "/home",
		failureRedirect: "/auth/login",
		failureFlash:    true
	})(req, res, next);
}

/**
 * Process the registration form body
 * @param {import('express').Request}  req Express Request handle
 * @param {import('express').Response} res Express Response handle
 */
async function register_process(req, res) {
	console.log("Register contents received");
	console.log(req.body);
	let errors = [];
	//	Check your Form contents
	//	Basic IF ELSE STUFF no excuse not to be able to do this alone
	//	Common Sense
	try {
		if (! regexName.test(req.body.name)) {
			errors = errors.concat({ text: "Invalid name provided! It must be minimum 3 characters and starts with a alphabet." });
		}

		if (! regexEmail.test(req.body.email)) {
			errors = errors.concat({ text: "Invalid email address!" });
		}
		else {
			const user = await ModelUser.findOne({where: {email: req.body.email}});
			if (user != null) {
				errors = errors.concat({ text: "This email cannot be used!" });
			}
		}

		if (! regexPwd.test(req.body.password)) {
			errors = errors.concat({ text: "Password requires minimum eight characters, at least one uppercase letter, one lowercase letter and one number!" });
		}
		else if (req.body.password !== req.body.password2) {
			errors = errors.concat({ text: "Password do not match!" });
		}

		if (errors.length > 0) {
			throw new Error("There are validation errors");
		}
	}
	catch (error) {
		console.error("There is errors with the registration form body.");
		console.error(error);
		return res.render('auth/register', { errors: errors, email: req.body.email, name: req.body.name });
	}

	//	Create new user, now that all the test above passed
	try {
		/** @type {ModelUser} */
		const user = await ModelUser.create({
				email:    req.body.email,
				password: Hash.sha256().update(req.body.password).digest("hex"),
				name:     req.body.name,
		});
		//	Retrieve list of contents in your table
		// const list = ModelUser.findAll({
		// 	where: {

		// 	},
		// 	limit: 20,
		// 	offset: 30
		// });

		//	Delete
		// ModelUser.destroy({
		// 	where: {

		// 	}
		// });

		//	Update
		// await (await ModelUser.findOne()).update();
		flashMessage(res, 'success', 'Successfully created an account. Please login', 'fas fa-sign-in-alt', true);
		return res.redirect("/auth/login");
	}
	catch (error) {
		//	Else internal server error
		console.error(`Failed to create a new user: ${req.body.email} `);
		console.error(error);
		return res.status(500).end();
	}
}

/**
 * Sends a email to the specified address
 * @param uid {string}
 * @param email {string}
 */


/**
 * Logout the user
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
async function logout_process(req, res) {
	req.logout();
	return res.redirect("/home");
}

/**
 * Process the verification token
 * @param {import('express').Request}  req Express Request handle
 * @param {import('express').Response} res Express Response handle
 */
async function verify_process(req, res) {
	const token = req.params.token;
	let   uuid  = null;
	try {
		const payload = JWT.verify(token, 'the-key');

		uuid    = payload.uuid;
	}
	catch (error) {
		console.error(`The token is invalid`);
		console.error(error);
		return res.sendStatus(400).end();
	}

	try {
		const user = await ModelUser.findByPk(uuid);
		user.verify();
		user.save();
		return res.render("auth/verified", {
			name: user.name
		});
	}
	catch (error) {
		console.error(`Failed to locate ${uuid}`);
		console.error(error);
		return res.sendStatus(500).end();
	}
}
