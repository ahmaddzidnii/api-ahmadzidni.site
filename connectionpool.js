const mysql = require("mysql");
const axios = require("axios");
require("dotenv").config();

// Buat pool koneksi
const pool = mysql.createPool({
  connectionLimit: 5, // Jumlah maksimal koneksi dalam pool
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  multipleStatements: true, // Mengizinkan penggunaan beberapa pernyataan SQL dalam satu koneksi
});

// Fungsi untuk mencoba koneksi ulang
function attemptReconnect() {
  pool.getConnection((reconnectErr, connection) => {
    if (reconnectErr) {
      console.error("Error reconnecting:", reconnectErr);
    } else {
      console.log("Reconnected to database");

      const botToken = process.env.TOKEN_BOT_DATABASE;
      const chatId = process.env.CHATID_BOT_DATABASE;
      const message = `Database reconnected`;

      // Mengirim pesan menggunakan Axios
      axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        chat_id: chatId,
        text: message,
      });

      // Lanjutkan operasi dengan koneksi yang baru
      // ...

      // Setelah selesai, lepaskan koneksi
      connection.release();
    }
  });
}

// Dapatkan koneksi dari pool
pool.getConnection((err, connection) => {
  if (err) {
    console.error("Error getting database connection:", err);
    throw err; // Sebaiknya lemparkan kesalahan untuk menghentikan aplikasi jika gagal mendapatkan koneksi
  }
  console.log("Connected to database");
  const botToken = process.env.TOKEN_BOT_DATABASE;
  const chatId = process.env.CHATID_BOT_DATABASE;
  const message = `Database connect`;

  // Mengirim pesan menggunakan Axios
  axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    chat_id: chatId,
    text: message,
  });

  // Gunakan koneksi
  // ...

  // Setelah selesai, lepaskan koneksi
  connection.release();
});

// Tangani kesalahan koneksi pool
pool.on("error", (err) => {
  console.error("Database pool error:", err);
  if (err.code === "PROTOCOL_CONNECTION_LOST") {
    const botToken = process.env.TOKEN_BOT_DATABASE;
    const chatId = process.env.CHATID_BOT_DATABASE;
    const message = `Database Reconnecting...`;

    // Mengirim pesan menggunakan Axios
    axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      chat_id: chatId,
      text: message,
    });
    console.log("Connection lost. Reconnecting...");
    attemptReconnect();
  } else {
    throw err; // Lepaskan kesalahan lainnya
  }
});

module.exports = pool;
