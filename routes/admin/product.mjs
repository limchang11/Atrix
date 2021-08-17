import { Router }       from 'express';
import { Products }    from '../../data/products.mjs';

const router = Router();
export default router;


/**
 * 
 * @param {Express.Request} req Express Request handle
 * @param {Express.Response} res Express Response handle
 */


// Create product
router.get("/addProduct", async function(req, res){
    try {
        console.log("create products page accessed");
	    return res.render('products/addProduct');
    }
	catch(error) {
        console.log("Error acessing create products page");
        console.log(error);
    }
})

router.post('/addProduct', async function(req, res) {
    console.log("create products page accessed");
    console.log(req.body);
    
    try {
        let errors = []

        const name = await Products.findOne({where: {name:req.body.name}});
        if (name != null) {
            errors.push({text: "Repeated product name"})
        }
        const description = await Products.findOne({where: {description:req.body.description}});
        if (description == null) {
            errors.push({text: "Repeated product description"})
        }
        const price = await Products.findOne({where: {price:req.body.price}})
        if (price == null) {
            errors.push({text: "Repeated product price"})
        }

        const create = await Products.create({
            name:           req.body.name,
            description:    req.body.description,
            price:          req.body.price})
        
        console.log("Successfully created product");
    }
    catch(error) {
        console.error("Error creating product");
        console.error(error);
        return res.status(500).end();
    }

    return res.redirect('/productsA');
});


// Display products (Admin)
router.get("/",      async function(req, res) {
	console.log("admin view product page accessed");

    try {
        const products = await Products.findAll();
        console.log(products);

        return res.render('products/viewProduct', {
            products : products
        });
    }
    catch(error) {
        console.log("Error accessing admin products page");
        console.log(error);
    }
});


// Update product
router.get("/editProduct/:name", async function(req, res){
	console.log("admin edit product page accessed");

    try {
        const products = await Products.findOne({ where : { name: req.params.name } })

        return res.render('products/editProduct', {
            name: req.params.name,
            description: products.description,
            price: products.price,
            uuid: products.uuid
        })
    }

    catch (error) {
        console.log("Error fetching product");
        console.log(error);
    }
})

router.post("/editProduct/:name", async function (req, res){
    let errors = [];

    try {
        const update = await Products.update({
            name:           req.body.name,
            description:    req.body.description,
            price:          req.body.price,
        }, { where: { uuid: req.body.uuid}});

        console.log("Successfully updated product");
    }
    catch(error) {
        console.error("Error updating product");
        console.error(error);
        return res.status(500).end();
    }

    return res.redirect('/productsA');
})


// Delete product
router.get("/deleteProduct/:name", async function(req, res){
    console.log("admin delete product page accessed");

    try {
        const products = await Products.findOne({ where: { name: req.params.name } });
        return res.render("products/deleteProduct", {
            name:   req.params.name,
            uuid:   products.uuid
        })
    }
    catch(error) {
        console.log("Error fetching product");
        console.log(error);
    }
});

router.post("/deleteProduct/:name", async function (req, res){
    try {
        const del = await Products.destroy({
            where: { uuid: req.body.uuid }
        });

        console.log("Successfully deleted product");
    }
    catch(error) {
        console.error("Error has occured when trying to delete product");
        console.error(error);
        return res.status(500).end();
    }

    return res.redirect('/productsA');
});