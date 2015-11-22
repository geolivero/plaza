'user strict';

var React = require('react-native');
var DEFCSS = require('./../../Styles/Default');
var Helpers = require('./../../Helpers');
var Settings = require('./../../../Settings');
var { Icon, } = require('react-native-icons');
var StepSlider = require('./../Widgets/StepSlider');


var {
  View,
  Text,
  Image,
  Easing,
  StyleSheet,
  TouchableHighlight,
  Animated,
  TouchableOpacity,
  ScrollView
} = React;


module.exports = React.createClass({

  getInitialState: function () {
    return {
      scaleEl: new Animated.Value(0.01),
      opacity: 0
    };
  },

  stop() {
    
    this.setState({
      opacity: 0
    });
  },

  start() {

    this.setState({
      scaleEl: new Animated.Value(0.01),
    });

    


    setTimeout(()=> {
      this.setState({
        opacity: 1
      });

      Animated.timing(
        this.state.scaleEl, 
        { 
          toValue: 1,
          duration: 500,
          easing: Easing.elastic(1.1) 
        }
      ).start();

    }, 100);
    
  },

  getAnimStyle() {
    return StyleSheet.create({
      avatar: {
        transform: [{
          scale: this.state.scaleEl
        }]
      }
    });
  },

  render() {

    return (
      <Animated.Image style={[this.getAnimStyle().avatar , { opacity: this.state.opacity }]} 
              source={this.props.image} />
    );
  }
});

