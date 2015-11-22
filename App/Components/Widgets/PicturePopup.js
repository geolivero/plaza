'use strict';

var React = require('react-native');
var _ = require('underscore');
var Dimensions = require('Dimensions');
var windowSize = Dimensions.get('window');
var DEFCSS = require('./../../Styles/Default');
var CloseBtn = require('./../Widgets/CloseBtn');
var Settings = require('./../../../Settings');


var {
  AppRegistry,
  StyleSheet,
  StatusBarIOS,
  ScrollView,
  ListView,
  TouchableHighlight,
  Image,
  Text,
  Platform,
  ActivityIndicatorIOS,
  LayoutAnimation,
  Animated,
  View,
} = React;




module.exports = React.createClass({
  onPinch() {
    console.log('im pinching');
  },
  render() {
    return(
      <View style={[ DEFCSS.container, DEFCSS.darkBg, DEFCSS.pTop, styles.container ]}>
        <ScrollView 
          maximumZoomScale={2.0}
          automaticallyAdjustContentInsets={false} 
          style={[styles.scrollView, DEFCSS.darkBg]}>
          <View style={[styles.imageContainer]}>
            <Image 
                style={[styles.img]}
                onPinch={this.onPinch}
                resizeMode={ 'contain'}
                source={{uri: this.props.imgURL}} />
          </View>
        </ScrollView>
        <CloseBtn customStyle={styles.closeBtn} theme={'light'} onPress={this.props.onClose} />
      </View>
    );
  } 
});
//
//
/**/

var styles = {
  imageContainer: {
    width: windowSize.width,
    height: windowSize.height,
    justifyContent: 'center',
    alignItems: 'center'
  },
  scrollView: {
    flex: 1,
    width: windowSize.width,
    height: windowSize.height - 30,
    position: 'absolute',
    left: 0,
    top: 30
  },
  closeBtn: {
    position: 'absolute',
    color: Settings.colors.white,
    right: 20,
    zIndex: 10,
    backgroundColor: Settings.colors.darkBg,
    top: 20
  },
  img: {
    flex: 1,
    width: windowSize.width,
    height: windowSize.height
  }
}