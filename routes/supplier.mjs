import { Router }       from 'express';
import { Supplier } from '../data/supplier.mjs';
const router = Router();
export default router;


/**
 * 
 * @param {Express.Request} req Express Request handle
 * @param {Express.Response} res Express Response handle
 */

// Create supplier details
 router.get("/create", async function(req, res){
	console.log("create supplier page accessed");
	return res.render('createSupplier');
})

router.post('/create', async function(req, res) {
    console.log("create supplier details received");
    console.log(req.body);
    let errors = [];
    try {
        const name = await Supplier.findOne({where: {name:req.body.name}});
        if (name != null) {
            errors.push({text: "Repeated supplier name"})
        }
        const address = await Supplier.findOne({where: {address:req.body.address}});
        if (address == null) {
            errors.push({text: "Repeated supplier address name"})
        }
        const email = await Supplier.findOne({where: {email:req.body.email}})
        if (email == null) {
            errors.push({text: "Repeated supplier email address"})
        }

        try {
            const Supplier = await Supplier.create({
                    name:    req.body.name,
                    address: req.body.address,
                    email:     req.body.email})
            }
        catch(error){
            console.error(`Failed to create a new invoice: ${req.body.name} `);
		    console.error(error);
		    return res.status(500).end();
        }
        return res.render('viewSupplier')
    }
    catch(error) {
        console.error("Error updating reward item(s)")
        return res.render('viewSupplier')
    }
});


// Display supplier details
router.get("/read",      async function(req, res) {
	console.log("View supplier page accessed");
	return res.render('viewSupplier');
});

// Update Supplier details
router.get("/update", async function(req, res){
	console.log(" edit supplier page accessed");

    try {
        const suppliers = await Supplier.findOne({ where : { name: req.params.name } })

        return res.render('createSupplier', {
            name: req.params.name,
            address: suppliers.address,
            email: suppliers.email,
        })
    }

    catch (error) {
        console.log("Error fetching product");
        console.log(error);
    }
})

router.post("/update", async function (req, res){
    let errors = [];

    try {
        const update = await Products.update({
            name:           req.body.name,
            address:    req.body.address,
            email:          req.body.email,
        }, { where: { uuid: req.body.uuid}});

        console.log("Successfully updated product");
    }
    catch(error) {
        console.error("Error updating product");
        console.error(error);
        return res.status(500).end();
    }

    return res.redirect('/read');
})

// Delete supplier
router.get("/delete", async function(req, res){
    console.log(" delete supplier page accessed");

    try {
        const products = await Products.findOne({ where: { name: req.params.name } });
        return res.render("viewSupplier", {
            name:   req.params.name,
        })
    }
    catch(error) {
        console.log("Error fetching product");
        console.log(error);
    }
});

router.post("/delete", async function (req, res){
    try {
        const del = await Products.destroy({
            where: { uuid: req.body.uuid }
        });

        console.log("Successfully deleted product");
    }
    catch(error) {
        console.error("Error has occured when trying to delete supplier");
        console.error(error);
        return res.status(500).end();
    }

    return res.redirect('/viewSupplier');
});
