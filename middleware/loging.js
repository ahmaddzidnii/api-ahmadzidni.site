const axios = require('axios') 
require('dotenv').config()



const logingRequest = (req, res, next) => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
  
    function formatNumber(date) {
      if (date < 10) {
        return `0${date}`;
      } else {
        return date;
      }
    }

    axios.get('https://ipinfo.io')
    .then(response => {
        const data = response.data;

        // Kirim pesan Log ke bot telegram
        const botToken = process.env.TOKEN_BOT_LOG
        const chatId = process.env.CHATID_BOT_LOG
        const message = `terjadi permintaan pada server pada jam server : ${formatNumber(hours)}:${formatNumber(minutes)}:${formatNumber(seconds)}, lokasi server = ${data.city}, ${data.region}`;
    
        axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`,{
          chat_id : chatId,
          text : message,
        })
        
        .then(() => {
          console.log("berhasil mengirim data ke bot telegram")
        })
    
        .catch(err => {
          console.log(err)
        })
    })
    .catch(error => {
        console.error('Gagal mendapatkan informasi lokasi server:', error);
    });

  
    next();
  }

  module.exports = logingRequest