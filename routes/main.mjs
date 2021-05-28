import { Router }       from 'express';
import { flashMessage } from '../utils/flashmsg.mjs'

const router = Router();
export default router;

// ---------------- 
//	Serves dynamic files from the dynamic folder
router.get("/dynamic/:path", async function (req, res) {	
	return res.sendFile(`./dynamic/${req.params.path}`)
});

// ---------------- 
//	TODO: Attach additional routers here
import RouterAuth  from './auth.mjs';
import RouterAdmin from './admin/admin.mjs';
router.use("/auth",  RouterAuth);
router.use("/admin", RouterAdmin);


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

router.get("/product", async function(req, res) {
	console.log("product page accessed");
	
	return res.render('product' );
});

router.get("/feedback", async function(req, res) {
	console.log("feedback page accessed");
	
	return res.render('feedback' );
});