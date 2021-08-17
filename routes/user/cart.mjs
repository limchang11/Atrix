import { Router }       from 'express';
import { Products }    from '../data/products.mjs';
import { Cart }         from '../data/cart.mjs';

const router = Router();
export default router;

/**
 * 
 * @param {Express.Request} req Express Request handle
 * @param {Express.Response} res Express Response handle
 */


// View cart
router.get("/",      async function(req, res) {
	console.log("cart page accessed");

});