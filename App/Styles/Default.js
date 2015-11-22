'use strict';
var React = require('react-native');
var Dimensions = require('Dimensions');
var windowSize = Dimensions.get('window');
var Settings = require('./../../Settings');

var {
  StyleSheet,
  Platform
} = React;



module.exports = StyleSheet.create({
  darkBg: { 
    backgroundColor: Settings.colors.darkBrown
  },
  brownBg: {
    backgroundColor: Settings.colors.brown
  },
  lightgrayBg: {
    backgroundColor: Settings.colors.lightGray
  },
  oDarkBg: { 
    backgroundColor: 'rgba(42, 34, 34, 0.8)',
  },
  oDarkBgLight: { 
    backgroundColor: 'rgba(42, 34, 34, 0.2)',
  },
  oWhiteBg: { 
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  darkColor: {
    color: Settings.colors.darkBrown
  },
  bgLightGray: {
    backgroundColor: Settings.colors.lightGray
  },
  smallHeader: {
    fontSize: 20,
    padding: 10,
    color: Settings.colors.brown
  },
  titleSize: {
    fontSize: 35
  },
  subTitleSize: {
    fontSize: 15
  },
  contentScroller: {
    position: 'absolute',
    left: 0,
    top: 0,
    backgroundColor: 'transparent',
    width: windowSize.width,
    height: windowSize.height
  },
  pinkBg: { 
    backgroundColor: Settings.colors.lightPink,
  },
  whiteBg: { 
    backgroundColor: 'white',
  },
  indicator:  {
    width: windowSize.width,
    height: 40
  },
  scrollContainer: {
    paddingVertical: 0
  },
  pinkColor: {
    color: Settings.colors.lightPink
  },
  bgSpacer: {
    flex: 1,
    height: windowSize.height - 100
  },
  whiteColor: {
    color: Settings.colors.white
  },
  container: {
    flex: 1,
    padding: 0,
    margin: 0,
    backgroundColor: Settings.colors.white
  },
  contentContainer: {
    padding: 0,
    margin: 0
  },
  floatCenter: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  sansc: {
    fontFamily: Platform.OS === 'ios' ? 'OpenSans-CondensedLight': 'sans-serif-condensed',
    color: Settings.colors.darkBrown
  },
  sans: {
    fontFamily: Platform.OS === 'ios' ? 'OpenSans-Light' : 'sans-serif-light',
    color: Settings.colors.darkBrown
  },
  pTop: {
    paddingTop: Platform.OS === 'ios' ? 20 : 0
  },
  rowBakerLogo: {
    width: 76,
    height: 76,
    borderRadius: 38
  },
  rowBakerLogoPlaceHolder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    left: (windowSize.width / 2) - (80 / 2),
    position: 'absolute',
    bottom: 70
  }
});