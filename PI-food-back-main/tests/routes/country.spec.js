/* eslint-disable import/no-extraneous-dependencies */
const { expect } = require('chai');
const session = require('supertest-session');
const app = require('../../src/app.js');
const { Recipe, conn } = require('../../src/db.js');

const agent = session(app);
const recipe = {
  "title": "Glass of cold water 6",
  "healthScore": 20,
  "summary": "It remains a much softer and more airy chocotorta. It is much lighter!.",
  "instructions": "Begin to beat the dulce de leche and when it is lighter in color add the cream . Beat at the lowest point of the mixer until it is about letter. Be extremely careful that you do not go past the point because otherwise you will be cut! If due to those tragedies of life it were to cut: add a splash of cream and integrate. Reserve aside. Soak each cookie and place in a fountain to form a layer. Place a layer of the dulce de leche cream. Another layer of moistened cookies and so 4 times.Cool for 1 hour in the refrigerator.Sprinkle with cocoa powder. When serving , grate some dark chocolate on top and be happy and eat chocotorta!",
  "image": "https://imagenes.elpais.com/resizer/mBf4fzypP93iPGrEGqd-vBjjRvg=/1200x0/cloudfront-eu-central-1.images.arcpublishing.com/prisa/MR6JKJS37FJZPFOABMJCAVYK4I.jpg",
  "diets": "Dairy free, Lacto ovo vegetarian",
  }


describe('Recipe routes', () => {
  before(() => conn.authenticate()
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  }));
  beforeEach(() => Recipe.sync({ force: true })
    .then(() => Recipe.create(recipe)));
  describe('GET /recipes', () => {
    it('should get 200', () =>
      agent.get('/recipes').expect(200)
    );
  });
});
