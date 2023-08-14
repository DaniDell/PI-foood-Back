const axios = require("axios");
const { Op } = require("sequelize");
const { Recipe, Diet } = require("../../db");
const { getPlainTextInstructions, getPlainTextSummary } = require('./normalizationUtils');
const { API_KEY } = process.env; // se desestructura la api key desde el .env para obtener el dato
require("dotenv").config();



const checkRecipe = async (recipe) => {
  const check = await Recipe.findOne({ where: { name: recipe }});
  return !check;
};

const getApiInfo = async (name) => {
  // Hace una solicitud a la API para obtener información de 100 recetas.
  const responseAPI = await axios(
    `https://api.spoonacular.com/recipes/complexSearch?addRecipeInformation=true&number=100&apiKey=${API_KEY}`
  );

  let recipes = responseAPI.data.results.map((recipe) => {
    // Verifica si hay dietas disponibles en la receta y las formatea correctamente.
    const diets = recipe.diets.length > 1 ? recipe.diets.map(d => `${d[0].toUpperCase()}${d.substring(1)}`) : ["Not defined"];

    // Crea un objeto con datos específicos de la receta.
    let newRecipe = {
      id: recipe.id,
      name: recipe.title,
      healthScore: recipe.healthScore,
      summary: getPlainTextSummary(recipe.summary),
      instructions: recipe.analyzedInstructions,
      image: recipe.image,
      diets: diets,
    };
    return newRecipe;
  });

  // Filtra las recetas que tengan dietas no nulas y no vacías
  recipes = recipes.filter((e) => e.diets !== null && e.diets.length > 0 && !e.diets.includes("Not defined"));

  // Si se proporciona un nombre, filtra las recetas por el nombre proporcionado.
  if (name) {
    recipes = recipes.filter((e) => e.name.includes(name));
  }

  return recipes;
};


  


const getDBInfo = async (name) => {
  // Objeto que contiene las opciones predeterminadas para la consulta a la base de datos.
  const queryOptions = {
    include: [
      { model: Diet,
        attributes: ["name"],
        through: { attributes: [] },
      },],};

  // Si se proporciona un nombre, agrega una condición 'where' a las opciones de consulta para buscar recetas que coincidan con el nombre.
  if (name) { queryOptions.where = { title: { [Op.iLike]: `%${name}%` } };}

  // Realiza la consulta a la base de datos utilizando las opciones configuradas.
  const dbQuery = await Recipe.findAll(queryOptions);

  // Normaliza los datos obtenidos de la base de datos utilizando la función 'dbNormalizer'.
  return dbNormalizer(dbQuery);
};


const createRecipe = async (obj) => {
  let recipe = await Recipe.create({
    title: obj.title,
    healthScore: obj.healthScore,
    summary: obj.summary,
    steps: obj.instructions,
    image: obj.image,
  });
  return recipe; 
};

const saveDiet = async () => {
  for (let diet of arr) {
    if (await checkDiet(diet)) {
      await Diet.create({ name: diet });
    }
  }
  return;
};

const dietIdSearch = async (arr) => {
  let dietIds = [];
  for (let diet of arr) {
    let id = await Diets.findOne({
      attributes: ["id"],
      where: {
        name: diet,
      },
    });
    dietIds.push(id);
  }
  return dietIds;
};



const apiByName = async(name) => {
  
  const responseAPI = await axios.get(`https://api.spoonacular.com/recipes/complexSearch?query=${name}&addRecipeInformation=true&number=100&apiKey=${API_KEY}`);
  
  
  const nombre = await responseAPI.map((recipe) => {
    return {
      id: recipe.id,
      title: recipe.title,
      healthScore: recipe.healthScore,
      summary: getPlainTextSummary(recipe.summary),
      instructions: getPlainTextInstructions(recipe.analyzedInstructions),
      image: recipe.image,
      diets: recipe.diets || ["Not defined"],
      
    }
  }
  
  )
}

const apiById = async (id) => {
  try {
    const responseAPI = await axios.get(
      `https://api.spoonacular.com/recipes/${id}/information?apiKey=${API_KEY}`
    );

    let recipe = responseAPI.data;

       return {
      id: recipe.id,
      title: recipe.title,
      healthScore: recipe.healthScore,
      summary: getPlainTextSummary(recipe.summary),
      instructions: getPlainTextInstructions(recipe.analyzedInstructions),
      image: recipe.image,
      diets: recipe.diets || ["-"],
    };
  } catch (error) {
    console.error(error);
    throw new Error("Algo salió mal, inténtalo nuevamente");
  }
};

const dbById = async (id) => {
  const recipes = await Recipe.findOne({
    where: {
      id: id,
    },
    include: [
      {
        model: Diet,
        attributes: ["name"],
        through: {
          attributes: [],
        },
      },
      ],
  });
  return dbNormalizer([recipes])[0]; //lo ejecutamos como un array y lo devuelvo en su indice 0 
  //porque es una buscqueda de nunico elemento y necesitamos que se ejecute como un array para 
  //pasarlo por el dbNormalizer
};

const dbNormalizer = (query) => {
  //normalizamos la query
  let recipes = query.map((recipe) => {
    return {
      id: recipe.id,
      name: recipe.title,
      healthScore: recipe.healthScore,
      summary: recipe.summary,
      instructions: recipe.steps,
      image: recipe.image,
      diets: recipe.diets,
    };
  });
  recipes.forEach((recipe) => {
    let mapDiets = recipe.diets.map((e) => e.name);
    recipe.diets = mapDiets;
  });
  return recipes;
};

const checkAtt = async (att, str) => {
  let check;
  if (str === "diet") {
    check = await Diet.findOne({
      where: {
        name: att,
      },
    });
  }
  if (str === "recipe") {
    check = await Recipe.findOne({
      where: {
        title: att,
      },
    });
  }
  if (!check) return true;
};

const saveAtt = async (arr, str) => {
  if (str === "diet") {
    for (let diet of arr) {
      if (await checkAtt(diet, "diet")) {
        await Diet.create({ name: diet });
      }
    }
    return;
  }
};

const attIdSearch = async (arr, str) => {
  if (str === "dietId") {
    let dietIds = [];
    for (let diet of arr) {
      let id = await Diet.findOne({
        attributes: ["id"],
        where: {
          name: diet,
        },
      });
      dietIds.push(id);
    }
    return dietIds;
  }
};

module.exports = {
  checkRecipe, getApiInfo, getDBInfo,
  createRecipe, saveDiet,
  apiById, dbById, dbNormalizer,
  apiByName, checkAtt, saveAtt, attIdSearch
};