const express = require("express");
const app = express();
const port = 3000;
const db = require("./connection");
const response = require("./response");
const NotFound = require("./notfound");


app.use((req, res, next)=> {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  next();
})



app.get("/api/doaharian",(req, res)=>{
  const doasql = "SELECT * FROM doaharian"
  db.query(doasql, (error, results) =>{
    response(200, results, "data berhasil di ambil", res);
  })
})

app.get("/api/doaharian/:id", (req, res) => {
  const inputId = parseInt(req.params.id); // Mengubah ID dari string ke integer
  if (isNaN(inputId)) {
    return response(400, null, "Invalid ID format/ID harus Berupa ANGKA!!!", res);
  }
  
  const filterdoasql = `SELECT * FROM doaharian WHERE id = ${inputId};`;
  db.query(filterdoasql, (error, result) => {
    if (error) {
      return response(500, null, "Internal server error", res);
    }
    
    if (result.length === 0) {
      return response(404, null, "Data not found", res);
    }
    
    response(200, result, "Data ditemukan", res);
  });
});


app.get("/", (req, res) => {
  res.send("Selamat datang di API ahmadzidni.site");
});

app.get("/api/asmaulhusna", (req, res) => {
  db.query("SELECT * FROM `asmaul-husna`", (error, results) => {
    response(200, results, "data berhasil di ambil", res);
  });
});

app.get("/api/asmaulhusna/:id", (req, res) => {
  const id = parseInt(req.params.id);
  if (id <= 0 || id >= 100 || isNaN(id)) {
    return NotFound(404, "NotFound", res);
  }
  
  const sql = "SELECT * FROM `asmaul-husna` WHERE id=" + id;
  const prev = id > 1 ? id - 1 : false;
  const next = id < 99 ? id + 1 : false;

  const prevSql = "SELECT latin FROM `asmaul-husna` WHERE id=" + prev; // Query untuk mengambil data parameter sebelumnya
  const nextSql = "SELECT latin FROM `asmaul-husna` WHERE id=" + next; // Query untuk mengambil data parameter berikutnya

  db.query(prevSql, (prevError, prevResults) => {
    if (prevError) {
      console.error("Error retrieving previous data:", prevError);
    }

    db.query(nextSql, (nextError, nextResults) => {
      if (nextError) {
        console.error("Error retrieving next data:", nextError);
      }

      db.query(sql, (error, results) => {
        if (error) {
          return NotFound(404, "Data Tidak Ditemukan", res);
        }

        const paginationInfo = {
          prev: {
            id: prev,
            latin: prevResults[0] ? prevResults[0].latin : null,
          },
          next: {
            id: next,
            latin: nextResults[0] ? nextResults[0].latin : null,
          },
        };

        response(200, results, "Data Berhasil Ditemukan", res, paginationInfo);
      });
    });
  });
});

app.use((req, res) => {
  return response(404, null, "Endpoint not found", res);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
