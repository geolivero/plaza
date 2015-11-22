var React = require('react-native');
var DEFCSS = require('./../Styles/Default');

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
  }
});

var header = React.createClass({
  render: function() {
    return (
      <View style={[styles.pinkHeaderWrapper, DEFCSS.pinkBg]}>
        <Text style={[styles.pinkHeaderTitle, DEFCSS.sansc, DEFCSS.titleSize]}>{this.props.title}</Text>
        <Text style={[styles.pinkHeaderSubTitle, DEFCSS.sans, DEFCSS.subTitleSize]}>{this.props.subTitle}</Text>
      </View>
    );
  }
});


module.exports = header;