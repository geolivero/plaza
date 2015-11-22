var Settings = require('./../Settings');

module.exports = {
   getToken: function (callback) {

    fetch(Settings.REST.root + 'services/session/token')
      .then((response)=> {
        return response.text();
      })
      .then((response) => {
        callback(response);
      })
      .catch((error) => {
        console.log(error);
      });
  }
}