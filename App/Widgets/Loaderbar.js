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
  Platform,
  View,
} = React;



var loaderBar = React.createClass({

  getInitialState: function () {
    return {
      transX: new Animated.Value(0),
      stopped: false
    };
  },
  render: function() {
    var styles = StyleSheet.create({
      loaderBar: {
        top: windowSize.height - (Platform.OS === 'ios' ? 5 : 30),
        position: 'absolute',
        left: 0,
        height: 5,
        width: (windowSize.width * 2),
        transform: [{
          translateX: this.state.transX
        }]
      },
      loaderBarBox: {
        bottom: 0,
        position: 'absolute',
        left: 0,
        right: 0,
        height: 5,
        flex: 1,
        transform: [{
          translateX: this.state.transX
        }]
      }
    });
    if (this.state.stopped) {
      return null;
    }
    return (
      <Animated.Image style={ (this.props.inBox ? styles.loaderBarBox : styles.loaderBar )  }
       source={require('../../images/loader_bar.png')} />
    );
  },
  stop: function () {
    clearTimeout(this.timer);
    this.anim.stop();
    this.setState({
      stopped: true
    });
  },
  start: function () {
    var self = this;
    this.anim = Animated.timing(
      this.state.transX, { toValue: (windowSize.width * -1) }
    );


    this.anim.start((e) => {
      
        //this.start();

      if (e.finished) {
        this.setState({
          transX: new Animated.Value(0)
        });
        this.timer = setTimeout(()=> {
          this.start();
        }, 1);

        /*this.anim = Animated.timing(this.state.transX, { toValue: 0 });
        this.anim.start(()=> {
          this.start();
        });*/ 
      }
    });    
  },
  componentDidMount: function () {
    var self = this;
    this.start();
  },
  componentWillUnmount: function () {
    clearTimeout(this.timer);
  }
});


module.exports = loaderBar;