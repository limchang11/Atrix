import { Router }       from 'express';
const router = Router();
export default router;


/**
 * 
 * @param {Express.Request} req Express Request handle
 * @param {Express.Response} res Express Response handle
 */

 router.get("/createinvoice", async function(req, res){
	console.log("create invoice page accessed");
	return res.render('createinvoice');
})

router.post('/createinvoice', async function(req, res) {
    console.log("create invoice details received");
    console.log(req.body);
    let errors = [];
    try {
        const name = await Invoice.findOne({where: {name:req.body.name}});
        if (name != null) {
            errors.push({text: "Stock already existed within the inventory"})
        }
        const description = await Invoice.findOne({where: {description:req.body.description}});
        if (description == null) {
            errors.push({text: "2nd Item: Food item not found in menu"})
        }
        const quantity = await Invoice.findOne({where: {quantity:req.body.quantity}})
    }
    catch(error) {
        console.error("Error updating reward item(s)")
        return res.render('createinvoice')
    }
});

router.get("/view",      async function(req, res) {
	console.log("View invoice page accessed");
	return res.render('viewinvoice');
});