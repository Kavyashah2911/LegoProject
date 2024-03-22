const path = require("path");
const express = require('express');
const app = express();
const HTTP_PORT = process.env.PORT || 8080;

const legoData = require("./modules/legoSets");

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Home route
app.get('/', (req, res) => res.render('home'));

// About route
app.get('/about', (req, res) => res.render('about'));

// Lego sets route
app.get("/lego/sets", async (req, res) => {
  try {
    let sets;
    if (req.query.theme) {
      sets = await legoData.getSetsByTheme(req.query.theme);
    } else {
      sets = await legoData.getAllSets();
    }
    res.render("sets", { sets: sets });
  } catch (err) {
    res.status(404).render("404", { message: "Unable to find requested sets." });
  }
});

// Lego set detail route
app.get("/lego/sets/:num", async (req, res) => {
  try {
    let set = await legoData.getSetByNum(req.params.num);
    res.render("set", { set: set });
  } catch (err) {
    res.status(404).render("404", { message: "Unable to find requested set." });
  }
});

// 404 error handling middleware
app.use((req, res, next) => {
  res.status(404).render("404", { message: "I'm sorry, we're unable to find what you're looking for." });
});

// Initialize legoData and start the server
async function startServer() {
  try {
    await legoData.initialize();
    app.listen(HTTP_PORT, () => {
      console.log(`Server running on: http://localhost:${HTTP_PORT}`);
    });
  } catch (err) {
    console.error("Error initializing legoData:", err);
  }
}

startServer(); // Call the function to start the server
