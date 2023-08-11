const recipeRouter = require("express").Router();
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');

const { getApiInfo, getDBInfo, createRecipe,apiById, dbById, checkAtt, saveAtt, attIdSearch
} = require("../controllers/recetas.controllers.js");

recipeRouter.get("/", async (req, res) => {

  try {
    const { name } = req.query;
    // traer la info de la API
    const dbRecipes = await getDBInfo(name);
    const apiRecipes = await getApiInfo(name);
    if (!apiRecipes && !dbRecipes) throw Error("No existen recetas");

    const infoTotal = dbRecipes.concat(apiRecipes);
    res.status(200).send(infoTotal);
  } catch (error) {
    res.status(404).send("No se encontraron recetas con ese nombre");
  }
});

recipeRouter.get("/:idRecipe", async (req, res) => {

  try {
    const { idRecipe } = req.params;
    let recipe = {};
    if (Boolean(Number(idRecipe))) { //aca lo que hago es ver desde donde sale el ID, entonces preguntamos si el ID es solo un numero, toma la info de la API. En cambio, si el ID tiene letras y numeros, nos va a dar false y va a tomar la info de la DB
      recipe = await apiById(idRecipe);
    } else {
      recipe = await dbById(idRecipe);
    }
    res.json(recipe);
  } catch (error) {
    res.status(404).send("No existe receta con ese ID");
  }
});



recipeRouter.post("/", async (req, res) => {
  try {
    const {
      title,
      healthScore,
      summary,
      instructions,
      image,
      diets,
      
    } = req.body;
    
    if (!title || !summary) throw Error("Faltan datos importantes");

    let dietArr = diets.split(",").map((e) => e.trim());
    

    let recipe = { title, healthScore, summary, instructions, image };

    if (await checkAtt(title, "recipe")) {
      let createdRecipe = await createRecipe(recipe);

      await saveAtt(dietArr, "diet");
      

      await createdRecipe.addDiets(await attIdSearch(dietArr, "dietId"));
      

    } else throw Error("La receta ya existe en la base de datos");

    res.status(201).send(`La receta ${title} se ha creado correctamente`);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = recipeRouter;



