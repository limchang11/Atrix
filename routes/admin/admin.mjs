import { Router }              from 'express';
import { UserRole, ModelUser } from '../../data/user.mjs';

const router = Router();
export default router;

router.use(ensure_auth);
router.use(ensure_admin);
router.get("/", dashboard_page);

/**
 * Ensure logged in user
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 * @param {import('express').NextFunction} next 
 */
async function ensure_auth(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	else {
		return res.redirect("/auth/login");
	}
}

/**
 * Ensure Logged in user is admin
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 * @param {import('express').NextFunction} next 
 */
async function ensure_admin(req, res, next) {
	/** @type {ModelUser} */
	const user = req.user;
	if (user.role != UserRole.Admin) {
		return res.sendStatus(403).end();
	}
	else {
		return next();
	}
}

/**
 * Renders a dashboard
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
async function dashboard_page(req, res) {
	return res.render("admin/dashboard");
}
//arief crud
// read specific data
// router.get("/read", async function(req, res) {
// 	console.log("feedback page accessed");
// 	//to retrieve data
// 	const feedlist = await Feedback.findAll({
// 		where: {
// 			firstName: "fef"
// 		}
// 	});
// 	console.log(feedlist);
// 	return res.render('feedback' );
// });

// to update
// router.get("/update", async function(req, res) {
// 	console.log("feedback page accessed");
// 	const feedlist = await Feedback.update(
// 		{ firstName: "Iskandar" },
// 		{ where: {firstName: "fef"}
// 	});
// 	console.log(feedlist);
// 	return res.render('feedback' );
// });


//to delte
// router.get("/delete", async function(req, res) {
// console.log("feedback page accessed");

// 	const feedlist = await Feedback.destroy({
// 		where: {
// 			firstName: "Iskandar"
// 		}
// 	});
// 	console.log(feedlist);
