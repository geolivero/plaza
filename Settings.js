var Dimensions = require('Dimensions');
var windowSize = Dimensions.get('window');

module.exports.colors = {
  oDark: '#D9171313',
  brown: '#423535',
  oLight: '#80FFFFFF',
  lightPink: '#FFE2E2',
  darkBrown: '#1B1616',
  pink: '#CD8989',
  darkPink: '#CD8989',
  white: '#FFFFFF',
  lightGray: '#EAEAEA',
  darkGray: '#979797',
  green: '#4AE28F',
  sDarkBrown: '#423535',
  darkerPink: '#A35E5E'
};

module.exports.box = {
  width: windowSize.width,
  height: windowSize.height
}



module.exports.mapToken = 'sk.eyJ1IjoiZ2VvbGl2ZXJvIiwiYSI6ImNpZ2ZveGVqYjBza2N2d2tyNnF1bzRzcDEifQ.Dv7zNPmn7jTdEpthtKZnfA';

module.exports.adobessdk = {
  secret = ' 46e86c84-a93e-4da7-94e4-7c4138a3408d',
  clientid = '5fd2ef1c76f941cfa6f1880ed2f2cfd3'
};

module.exports.REST = {
  root: 'http://cakesplaza/en/'
};
