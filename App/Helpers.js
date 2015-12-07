'use strict';

var Settings = require('./../Settings');
var React = require('react-native');
var {
  AsyncStorage
} = React;

var userToken,
  ASYNCKEY = '@user:private',
  login,
  token;

userToken = {

  save: (token, sessionName, sessionId, user) => {
    AsyncStorage.setItem(ASYNCKEY, JSON.stringify({
      token: token,
      sessionName: sessionName,
      sessionId: sessionId,
      user: user
    }));
  },

  saveUser(SESS, User) {
    AsyncStorage.setItem(ASYNCKEY, JSON.stringify({
      token: SESS.token,
      sessionName: SESS.sessionName,
      sessionId: SESS.sessionId,
      user: User
    }));
  },

  destroy: (cb) => {

    AsyncStorage.removeItem(ASYNCKEY).
      then(cb);
  },

  get: (cb)=> {

    AsyncStorage.getItem(ASYNCKEY)
      .then((value)=> {
        cb(JSON.parse(value));
    }).done();
  }
};

token = function(callback) {

  userToken.get((session)=> {
    if (session) {
      callback(session.token);
    } else {
      fetch(Settings.REST.root + 'users')
        .then((response) => {
          return response.text();
        })
        .then((response) => {
          callback(response);
        })
        .catch((error) => {
          console.log(error);
      });
    }
  });
};


login = function (token, data, callback) {
  console.log(JSON.stringify(data));
  fetch(Settings.REST.root + 'users/user/login', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-CSRF-Token': token
      },
      method: 'POST',
      body: JSON.stringify(data)
    })
    .then((response) => {
      return response.text();
    })
    .then((response) => {
      callback(JSON.parse(response));
    })
    .catch((error) => {
      console.warn(error);
  });
};

module.exports.userToken = userToken;
module.exports.getToken = token;
module.exports.login = login;
module.exports.setHeaders = function (SESS) {
  return {
    'X-CSRF-Token': SESS.token,
    'Authorization-key': SESS.sessionName + ':' + SESS.sessionId
  };
};
