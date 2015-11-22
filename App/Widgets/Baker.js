'use strict';

var React = require('react-native');

var DEFCSS = require('./../Styles/Default');
var Dimensions = require('Dimensions');
var windowSize = Dimensions.get('window');



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



var styles = StyleSheet.create({
  rowBaker: {
    height: 355,
    alignItems: 'center'
  },
  rowBakerImg: {
    width: windowSize.width,
    height: 260
  },
  rowBakerLogo: {
    width: 76,
    height: 76,
    borderRadius: 38,
    position: 'absolute',
    borderColor: 'white',
    borderWidth: 4,
    left: (windowSize.width / 2) - (76 / 2),
    bottom: 70
  },
  icon_cake: {
    width: 29,
    height: 32
  },
  rowBakerTxt: {
    height: 95,
    left: 0,
    width: windowSize.width,
    paddingTop: 30
  }
});

var baker = React.createClass({
  render() {
    return(
      <TouchableHighlight key={this.props.model.get('uid')} onPress={() => this.props.onPress(this.props.model)}>
        <View key={this.props.model.get('uid')} style={[styles.rowBaker, DEFCSS.whiteBg]}>
          <Image style={[styles.rowBakerImg, DEFCSS.darkBg]} 
            source={{uri: this.props.model.get('cake_pic')}} 
            resizeMode={'cover'}
            capInsets={{left: 0, top: 0}} />
            <View style={[styles.rowBakerTxt, DEFCSS.pinkBg]}>
              <Text style={[DEFCSS.sansc, {fontSize: 25, textAlign: 'center'}]}>{(this.props.model.get('field_bedrijfsnaam_value') || this.props.model.get('name')).toUpperCase()}</Text>
            </View>
            
            <View style={[DEFCSS.rowBakerLogoPlaceHolder]}>
              <Image style={[DEFCSS.rowBakerLogo]} source={{uri: this.props.model.get('logo')}} />
            </View>
        </View>
      </TouchableHighlight>
    );
  }
});

module.exports = baker;