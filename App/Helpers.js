/*globals module:true, fetch:true, then:true, require:true*/
'use strict';

var Settings = require('./../Settings');
var React = require('react-native');
var {
  AsyncStorage
} = React;

var userToken,
  userRegisterSteps,
  ASYNCKEY = '@user:private',
  STEPSKEY = '@user:steps',
  model = {},
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

  destroy(cb) {

    AsyncStorage.removeItem(ASYNCKEY).
      then(cb);
  },

  get(cb) {

    AsyncStorage.getItem(ASYNCKEY)
      .then((value)=> {
        cb(JSON.parse(value));
    }).done();
  }
};


userRegisterSteps = {
  save(step) {
    console.log('step: ' + step);
    AsyncStorage.setItem(STEPSKEY, step.toString());
  },

  destroy(cb) {
    AsyncStorage.removeItem(STEPSKEY).
      then(cb);
  },

  get(cb) {
    AsyncStorage.getItem(STEPSKEY)
    .then((value)=> {
        cb(value);
    })
    .done();
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


module.exports.getField = function (model) {
  if (model) {
    return model.und || {'0': {}};
  } else {
    return {'0': {}};
  }
  
};

module.exports.userStep = userRegisterSteps;
module.exports.userToken = userToken;
module.exports.getToken = token;
module.exports.login = login;
module.exports.setHeaders = function (SESS) {
  return {
    'X-CSRF-Token': SESS.token,
    'authorization-key': SESS.sessionName + ':' + SESS.sessionId
  };
};

module.exports.getAddresses = function (options, callback) {
  var url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng={lat},{lng}&sensor=false',
    urlFormat = url.replace('{lat}', options.lat).replace('{lng}', options.lng);
  fetch(urlFormat)
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

module.exports.setFileOptions = function (SESS, files) {
  return {
    uploadUrl: Settings.REST.root + 'users/mnguser/create_raw',
    method: 'POST', // default 'POST',support 'POST' and 'PUT'
    headers: {
      'Accept': 'application/json',
      'X-CSRF-Token': SESS.token,
      'Authorization-key': SESS.sessionName + ':' + SESS.sessionId
    },
    fields: {
        'hello': 'world',
    },
    files: files
  };
};
