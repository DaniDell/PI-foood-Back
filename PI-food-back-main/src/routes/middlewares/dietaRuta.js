const  dietRouter  = require('express').Router();
const {crearDieta, traerDietas} = require('../controllers/dietas.controllers');

dietRouter.get('/', async(req, res) => {
    try {
        await crearDieta();
        const respose = await traerDietas();
        res.json(respose);
        
    } catch (error) {
        res.status(404).send(error.message)
    }
})


module.exports = dietRouter;

