const db = require('../connection')

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

    const QuerySql = 'INSERT INTO `kontak` (`nama`, `email`, `pesan`) VALUES (?, ?, ?)';

    db.query(QuerySql, [nama, email, pesan], (err, result) => {
        if (err) {
            res.status(500).json({
                message: "data gagal dikirim"
            });
        } else {
            res.status(200).json({
                message: "data berhasil dikirim"
            });
        }
    });
};

module.exports = kirimPesan