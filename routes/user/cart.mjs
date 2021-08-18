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


// View cart
router.get("/",      async function(req, res) {
	console.log("cart page accessed");

    try {
        const cart = await Cart.findAll({
            where: { user_id: req.user.uuid }
        });

        console.log(cart);

        let total = 0
        for (let prod in cart) {
            total += cart[prod].product_price * cart[prod].product_qty;
        } 

        const total2 = total;

        return res.render('cart/cart', {
            cart    :   cart,
            total   :   total2.toFixed(2) 
        });
    }
    catch(error) {
        console.log("Error retrieving products on cart page");
        console.log(error);
    }
});


// Add product to cart
router.get("/addToCart/:name", async function(req, res){
	console.log("add to cart page accessed");

    try {
        // let quantity = 1;

        const products = await Products.findOne({ where : { name: req.params.name } });

        return res.render('cart/addCart', {
            user_id: req.user.uuid,
            product_id: products.uuid,
            product_name: req.params.name,
            product_price: products.price,
            // product_qty: quantity
        })        
    }
    catch(error) {
        console.log("Error adding product to cart");
        console.log(error);
    }
});

router.post("/addToCart/:name", async function(req, res){
    const products = await Products.findOne({ where : { name: req.params.name } });

    const prod = await Cart.findOne({ where: { product_id: products.uuid } })

    let quantity = 1;

    try {
        if (prod == null) {
            const addProd = await Cart.create({
                user_id: req.body.user_id,
                product_id: req.body.product_id,
                product_name: req.body.product_name,
                product_price: req.body.product_price,
                product_qty: quantity
            })
        }
        else {
            let addqty = prod.product_qty + 1;
            const addQuantity = await Cart.update({
                product_qty: addqty
            }, { where: { user_id: req.body.user_id, product_id: req.body.product_id }});
        }
        
        console.log("Successfully added product to cart");
    }
    catch(error) {
        console.error("Error adding product to cart");
        console.error(error);
    }

    return res.redirect("/productsPublic");
});


// Remove product from cart
router.get("/delete/:product_name", async function(req, res){
    console.log("remove product from cart page accessed")

    try {
        const cart = await Cart.findOne({ where: { user_id: req.user.uuid, product_name: req.params.product_name } });

        return res.render('cart/deleteCart', {
            product_name: req.params.product_name,
            uuid: cart.uuid
        })
    }
    catch(error) {
        console.log("Error trying to remove product to cart");
        console.log(error);
    }
});

router.post("/delete/:product_name", async function (req, res) {
    try {
        const delCart = await Cart.destroy({
            where: { uuid: req.body.uuid }
        });

        console.log("Successfully removed item from cart");
    }
    catch(error) {
        console.error("Error removing product from cart");
        console.error(error);
    }

    return res.redirect("/myCart");
});