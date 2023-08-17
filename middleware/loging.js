const loging = (req, res, next) => {
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
  
    console.log(`terjadi permintaan pada server pada jam ${formatNumber(hours)}:${formatNumber(minutes)}:${formatNumber(seconds)}`);
  
  
    next();
  }

  module.exports = loging