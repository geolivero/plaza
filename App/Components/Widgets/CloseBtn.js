'user strict';

var React = require('react-native');
var DEFCSS = require('./../../Styles/Default');
var Settings = require('./../../../Settings');
var { Icon, } = require('react-native-icons');

var {
  View,
  Text,
  Image,
  TouchableHighlight,
  TouchableOpacity,
  ScrollView
} = React;

var styles = {
  closeBtn: {
    marginTop: 5,
    width: 8,
    height: 8
  }
};

module.exports = React.createClass({
  
  render() {  
    var color = (this.props.theme === 'light') ? Settings.colors.white : Settings.colors.darkGray;
    
    return (
      <TouchableHighlight onPress={this.props.onPress}>
        <Icon
          name='ion|ios-close-empty'
          size={30}
          color={color}
          style={ [styles.closeBtn, this.props.customStyle ] } />
      </TouchableHighlight>
    );
  }
});