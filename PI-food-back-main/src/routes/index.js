const { Router } = require('express');
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
const dietRouter = require('./Diets/dietRoute')
const recipeRouter = require('./Recipes/recipeRoute')

const router = Router();

router.use('/recipes', recipeRouter) // este es nuestro ruteo
router.use('/diets', dietRouter)
// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);


module.exports = router;
