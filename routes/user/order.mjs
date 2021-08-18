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


// Checkout order
router.get("/checkout",      async function(req, res) {
	console.log("checkout page accessed");

    try {
        const cart = await Cart.findAll({
            where: { user_id: req.user.uuid }
        });

        let total = 0
        for (let prod in cart) {
            total += cart[prod].product_price * cart[prod].product_qty;
        } 

        const dfee = 5;
        const total2 = total + dfee;

        return res.render('order', {
            cart        :   cart,
            subtotal    :   total.toFixed(2), 
            dfee        :   dfee.toFixed(2),
            total       :   total2.toFixed(2) 
        });
    }
    catch(error) {
        console.log("Error accessing checkout page");
        console.log(error);
        return res.status(500).end();
    }
});


// Add product to cart
router.get("/confirm", async function(req, res){
	console.log("confirmed order page accessed");

    try {
        const clear = await Cart.destroy({ where : { user_id: req.user.uuid } });

        console.log("cart cleared ad order confirmed")
        return res.render('confirmorder')
    }
    catch(error) {
        console.log("error clearing cart and confirming order");
        console.log(error);
    }
});