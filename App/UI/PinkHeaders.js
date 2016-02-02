var React = require('react-native');
var DEFCSS = require('./../Styles/Default');
var Arrow = require('./../Widgets/Arrow');
var {
  AppRegistry,
  StyleSheet,
  Image,
  Text,
  View,
} = React;


var styles = StyleSheet.create({
  pinkHeaderWrapper: {
    height: 100,
    position: 'relative',
    flex: 1
  },
  pinkHeaderTitle: {
    left: 10,
    top: 10
  },
  pinkHeaderSubTitle: {
    left: 10,
    position: 'relative',
    top: 0
  },
  arrow: {
    top: -30,
    backgroundColor: 'none'
  }
});

var header = React.createClass({

  renderArrow() {
    if (this.props.arrow) {
      return (
        <Arrow ref={'theArrow'} style={[ styles.arrow ]} />
      );
    }
  },

  render() {
    return (
      <View style={[styles.pinkHeaderWrapper, DEFCSS.pinkBg]}>
        <Text style={[styles.pinkHeaderTitle, DEFCSS.sansc, DEFCSS.titleSize]}>{this.props.title}</Text>
        <Text style={[styles.pinkHeaderSubTitle, DEFCSS.sans, DEFCSS.subTitleSize]}>{this.props.subTitle}</Text>
        {this.renderArrow()}
        {this.props.children}
      </View>
    );
  }
});


module.exports = header;
