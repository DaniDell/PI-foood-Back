require("dotenv").config();
const axios = require("axios");
const { Diet } = require("../db");
const { API_KEY } = process.env;

const traerDietaApi = async () => {
    const responseAPI = await axios(
      `https://api.spoonacular.com/recipes/complexSearch?addRecipeInformation=true&number=100&apiKey=${API_KEY}`
    );
    let diets = responseAPI.data.results.map((recipe) => recipe.diets).flat(2).map(d => `${d[0].toUpperCase()}${d.substring(1)}`);
      //normalizamos la info dejando la primera letra en mayusculas

    return diets;
  }
  


const traerDietaDB = async () => {
    let dbQuery = await Diet.findAll({
      attributes: ["name"],
    });
  
    let diets = dbQuery.map((diet) => diet.dataValues.name);

    return diets;
  }



const crearDieta = async () => {

    let dbDiets = await traerDietaDB();

    if (dbDiets.length === 0) { // si no tenemos ninguna dieta, creamos las basicas
        let basicDiets = [
          { name: "Omnivorous" }       
        ];
        return await Diet.bulkCreate(basicDiets); // es un metodo de sequelize para insertar varios registros en una tabla de base de datos 
      } else return;
}



const traerDietas = async () => {
    const apiDiets = await traerDietaApi();
    const dbDiets = await traerDietaDB();
  
    let diets = apiDiets.concat(dbDiets).flat(2); //concatenamos la info en un array de una unica dimension
  
    let setDiets = new Set(diets); //evitamos los repetidos
  
    return [...setDiets];
  }

module.exports = {crearDieta, traerDietas}