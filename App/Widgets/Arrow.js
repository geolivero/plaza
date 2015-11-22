var React = require('react-native');
var DEFCSS = require('./../Styles/Default');
var Dimensions = require('Dimensions');
var windowSize = Dimensions.get('window');

var {
  AppRegistry,
  StyleSheet,
  Image,
  Animated,
  Text,
  View,
} = React;


var arrow = React.createClass({

  getInitialState: function () {
    return {
      transY: new Animated.Value(0)
    };
  },
  render: function() {
    var styles = StyleSheet.create({
      arrow: {
        top: windowSize.height - 160,
        position: 'absolute',
        width: 17,
        height: 55,
        right: 20,
        transform: [{
          translateY: this.state.transY
        }]
      }
    });

    return (
      <Animated.Image style={ styles.arrow }
       source={require('../../images/arrow_icon.png')} />
    );
  },
  stopAnimation: function () {
    this.anim.stop();
  },
  moveArrow: function () {
    var self = this;
    this.anim = Animated.timing(
      this.state.transY, { toValue: 20 }
    );

    this.anim.start(function (e) {
      if (e.finished) {
        self.anim = Animated.timing(self.state.transY, { toValue: 0 });
        self.anim.start(function () {
          self.moveArrow();
        }); 
      }
    });    
  },
  componentDidMount: function () {
    var self = this;
    this.moveArrow();
  }
});


module.exports = arrow;
