const db = require('../connection')
const axios = require('axios')
require('dotenv').config()


const kirimPesan = (req, res) => {
    const body = req.body;
    const nama = body.nama;
    const email = body.email;
    const pesan = body.pesan;

       // Validasi nama lebih dari 1 karakter
       if (nama.length <= 1) {
        return res.status(400).json({
            message: "Nama harus memiliki lebih dari 1 karakter"
        });
    }

    // Validasi email format yang valid
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            message: `Format email ${email} tidak valid`
        });
    }

    // Validasi pesan tidak kosong
    if (pesan.trim() === "") {
        return res.status(400).json({
            message: "Pesan tidak boleh kosong"
        });
    }

    const QuerySql = 'INSERT INTO `kontak` (`Tanggal`, `nama`, `email`, `pesan`) VALUES (?, ?, ?, ?)';
    const unixEpoch = Date.now();
    db.query(QuerySql, [unixEpoch, nama, email, pesan], (err, result) => {
        if (err) {
            res.status(500).json({
                message: "data gagal dikirim"
            });
        } else {

            const botToken = process.env.TOKEN_BOT_DATABASE
            const chatId = process.env.CHATID_BOT_DATABASE
            const message = `Seseorang Berkomentar dan telah ditambahkan di database anda.\n\nDetail data yang baru telah ditambahkan:\nNama: ${nama}\nEmail: ${email}\nPesan: ${pesan}`;

             // Mengirim pesan menggunakan Axios
        axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            chat_id: chatId,
            text: message,
        }).then(() => {
            res.status(200).json({
                message: "data berhasil dikirim"
            });
        }).catch(error => {
            console.error(error);
            res.status(500).json({
                message: "data berhasil dikirim, tetapi pemberitahuan gagal"
            });
        });
        }
    });
};

module.exports = kirimPesan