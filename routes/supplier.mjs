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
            const supplier = await Supplier.create({
                    name:    req.body.name,
                    address: req.body.address,
                    email:     req.body.email})
            }
        catch(error){
            console.error(`Failed to create a new invoice: ${req.body.name} `);
		    console.error(error);
		    return res.status(500).end();
        }
        return res.render('createSupplier')
    }
    catch(error) {
        console.error("Error updating reward item(s)")
        return res.render('product')
    }
});


// Display supplier details
router.get("/read",      async function(req, res) {
	console.log("View supplier page accessed");
	return res.render('viewSupplier');
});