import { Router }       from 'express';
import { flashMessage } from '../utils/flashmsg.mjs';
import { Feedback } from '../data/feedback.mjs';
import BodyParser from 'body-parser';
var urlencodedParser = BodyParser.urlencoded({ extended: false });

const router = Router();
export default router;

// ---------------- 
//	Serves dynamic files from the dynamic folder
router.get("/dynamic/*", async function (req, res) {
	return res.sendFile(`${process.cwd()}/dynamic/${req.params[0]}`);
});

// ---------------- 
//	TODO: Attach additional routers here
import RouterAuth  from './auth.mjs';
import RouterAdmin from './admin/admin.mjs';
import RouterCreateInvoice from './invoice.mjs'
import RouterSupplier from './supplier.mjs'
import RouterAdminProduct from './admin/product.mjs'
import RouterProduct from './user/product.mjs'
import RouterCart from './user/cart.mjs'

router.use("/auth",  RouterAuth);
router.use("/admin", RouterAdmin);
router.use("/invoice", RouterCreateInvoice);
router.use("/supplier", RouterSupplier);
router.use("/productsA", RouterAdminProduct);
router.use("/productsPublic", RouterProduct)
router.use("/myCart", RouterCart);


router.get("/", async function (req, res) {
	return res.redirect("/home");
});
// ---------------- 
//	TODO:	Common URL paths here
router.get("/home",      async function(req, res) {
	console.log("Home page accessed");
	return res.render('index', {
		title: "Atrix"
	});
});

router.get("/feedback", async function(req, res) {
	console.log("feedback page accessed");
	return res.render('feedback' );
});
router.post("/acknowledge", async function(req, res) {
	console.log("feedback page accessed");
	// to check what is stored:console.log(req.body);
    //to store in sql 
	try {
		const feed = await Feedback.create({
			firstName: req.body.firstname,
			lastName: req.body.lastname,
			email: req.body.mailid,
			country: req.body.country,
			feedback: req.body.subject
		})
	}
	catch (error) {
		console.error ("Failed to store feedback info");
		console.error (error);
	  }

	return res.render('confirmfeedback.handlebars' );
});
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
