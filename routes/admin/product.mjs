import { Router }       from 'express';
import { Products }    from '../data/products.mjs';
var urlencodedParser = BodyParser.urlencoded({ extended: false });
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
    let errors = [];
    try {
        const name = await Product.findOne({where: {name:req.body.name}});
        if (name != null) {
            errors.push({text: "Repeated product name"})
        }
        const description = await Product.findOne({where: {description:req.body.description}});
        if (description == null) {
            errors.push({text: "Repeated product description"})
        }
        const price = await Product.findOne({where: {price:req.body.price}})
        if (price == null) {
            errors.push({text: "Repeated product price"})
        }
        const stock = await Product.findOne({where: {stock:req.body.stock}})
        if (stock == null) {
            errors.push({text: "Repeated product stock"})
        }

        const create = await Product.create({
            name:           req.body.name,
            description:    req.body.description,
            price:          req.body.price,
            stock:          req.body.stock})
        
        console.log("Successfully created product");
    }
    catch(error) {
        console.error("Error creating product");
        console.error(error);
    }

    return res.redirect('product');
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
            stock: products.stock,
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
            stock:          req.body.stock,
        }, { where: { uuid: req.body.uuid}});

        console.log("Successfully updated product");
    }
    catch(error) {
        console.error("Error updating product");
        console.error(error);
        return res.render('product');
    }

    return res.redirect('product');
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
    }

    return res.redirect('product');
});

module.exports = Router;