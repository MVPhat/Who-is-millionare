const express = require("express");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(require("./routes/index"));

app.use((req, res, next) => {
  res.status(404).send("Sorry can't find that");
});

module.exports = app;
