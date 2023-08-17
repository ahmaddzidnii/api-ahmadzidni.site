const db = require('../connection')
const createPesan = (body) => {
    const querySql = `INSERT INTO kontak ( '${body.nama}', 'email', 'pesan') VALUES ('AHMA', 'ahmad@gmail.com', 'test');`

    return db.execute(querySql)
}

module.exports = createPesan