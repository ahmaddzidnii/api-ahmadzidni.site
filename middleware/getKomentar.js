const db = require('../connectionpool.js');

const getKomentar = async (req, res) => {
    try {
        // Query untuk menghitung jumlah data
        const countQuery = `
        SELECT COUNT(*) AS totalCount FROM kontak;
        `;

        // Query untuk mengambil data aktual
        const dataQuery = `
            SELECT * FROM kontak
        `;

        // Eksekusi query perhitungan jumlah data
         db.query(countQuery, (countError, countResult) => {
            if (countError) {
                res.status(500).json({
                    error: "Error while counting data"
                });
            } else {
                const totalCount = countResult[0].totalCount;

                // Eksekusi query mengambil data aktual
                db.query(dataQuery, (dataError, dataResult) => {
                    if (dataError) {
                        res.status(500).json({
                            error: "Error while fetching data"
                        });
                    } else {
                        res.status(200).json({
                            totalCount: totalCount,
                            data: dataResult
                        });
                    }
                });
            }
        });
    } catch (error) {
        res.status(500).json({
            error: "An error occurred"
        });
    }
};

module.exports = getKomentar;
