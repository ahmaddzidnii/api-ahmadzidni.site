const express = require("express");
const app = express();
const port = 3000;
const db = require("./connection");
const response = require("./response");
const NotFound = require("./notfound");

app.get("/", (req, res) => {
  res.send("Selamat datang di API");
});

app.get("/api/asmaulhusna", (req, res) => {
  db.query("SELECT * FROM `asmaul-husna`", (error, results) => {
    response(200, results, "data berhasil di ambil", res);
  });
});
app.get("/api/asmaulhusna/:id", (req, res) => {
  const sql = " SELECT * FROM `asmaul-husna` WHERE id=" + req.params.id;
  db.query(sql, (error, results) => {
    if(req.params.id < 100 && req.params.id != 0 && req.params.id != typeof(String)){
      response(200, results, "data berhasil di ambil", res);
    } else {
      NotFound(404, "NotFound", res);
    }
  });
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
