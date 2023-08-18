const express = require("express");
const app = express();
const port = 3000;
const db = require("./connection");
const path = require('path')
const response = require("./response");
const NotFound = require("./notfound");

const cors = require('cors')




// Middleware
const Logging = require('./middleware/loging');
const checkApiKey = require('./middleware/apiKey')
// const cors = require('./middleware/cors')
const kirimPesan = require('./middleware/kirimpesan')




// CORS
app.use(cors())
// AKHIR CORS

// Menyediakan direktori publik
app.use(express.static('public'));

app.get("/", (req, res) => {
  const filePath = path.join(__dirname, 'public', 'index.html');
  res.sendFile(filePath);
});

// Middleware Logging 
app.use(Logging)
//Akhir Middleware

// Middlleware API Key
app.use(checkApiKey);
// Middlleware API Key

// Mengizinkan Request Body Berupa JSON
app.use(express.json())
// Mengizinkan Request Body Berupa JSON

app.post("/api/kontak",kirimPesan)

app.get("/api/kisahnabi", (req, res) =>{
  const sqlKisahNabi = "SELECT * FROM kisahnabi"
  db.query(sqlKisahNabi, (error, results) =>{
    if (error){
      return response(500, null, "Internal Server Error", res)
    }
    response(200, results, "data berhasil diambil", res)
  })
})

app.get("/api/kisahnabi/:id", (req, res) => {
  const inputId = parseInt(req.params.id); // Mengubah ID dari string ke integer
  if (isNaN(inputId)) {
    return response(400, null, "Invalid ID format/ID harus Berupa ANGKA!!!", res);
  }
  
  const filterKisahNabiSql = `SELECT * FROM kisahnabi WHERE id = ${inputId};`;
  db.query(filterKisahNabiSql, (error, result) => {
    if (error) {
      return response(500, null, "Internal server error", res);
    }
    
    else if (result.length === 0) {
      return response(404, null, "Data not found", res);
    }
    
    else{
      response(200, result, "Data berhasil ditemukan", res);
    }
    
  });
});



app.get("/api/doaharian",(req, res)=>{
  const doasql = "SELECT * FROM doaharian"
  db.query(doasql, (error, results) =>{
    if (error) {
      return response(500, null, "Internal Server Error", res)
    }
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
    
    else if (result.length === 0) {
      return response(404, null, "Data not found", res);
    }
    
    else{
      response(200, result, "Data berhasil ditemukan", res);
    }
    
  });
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
