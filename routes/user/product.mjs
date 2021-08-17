import { Router }       from 'express';
import { Products }    from '../../data/products.mjs';
import { Cart }         from '../../data/cart.mjs';

const router = Router();
export default router;

/**
 * 
 * @param {Express.Request} req Express Request handle
 * @param {Express.Response} res Express Response handle
 */


// View products - Public
router.get("/",      async function(req, res) {
	console.log("public products page accessed");

    try {
        const products = await Products.findAll()
        console.log(products);

        return res.render('products/productPublic', {
            products : products
        });
    }
    catch(error) {
        console.log("Error accessing public products page");
        console.log(error);
    }
});