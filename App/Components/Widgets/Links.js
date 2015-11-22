var React = require('react-native');
var DEFCSS = require('./../../Styles/Default');
var Settings = require('./../../../Settings');
//var WebIntent = require('react-native-webintent');

var {
  TouchableHighlight,
  View,
  Platform,
  TouchableOpacity,
  LinkingIOS,
  Text
} = React;


var styles = {
  link: {
    fontSize: 16,
    writingDirection: 'ltr',
    textAlign: 'left',
    lineHeight: 20,
    marginTop: 2,
    marginBottom: 2,
    letterSpacing: 0.1,
    textDecorationLine: 'underline',
    textDecorationStyle: 'dotted',
    textDecorationColor: Settings.colors.pink,
    color: Settings.colors.pink
  },
  label: {
    fontSize: 16,
    color: Settings.colors.darkBrown
  }
};


module.exports = React.createClass({

  getInitialState() {
    return {
      toggleLink: ''
    };
  },

  handleClick(e) {
    if (Platform.OS === 'ios') {
      LinkingIOS.openURL((this.props.type === 'http:' ? '' : this.props.type) + this.props.text);
    } else {
      //WebIntent.open((this.props.type === 'http:' ? '' : this.props.type) + this.props.text);
    }
  },

  fixLink(url) {
    if (!url) {
      return '';
    }
    if (this.props.type === 'http:') {
      if (url.indexOf('http') > -1) {
        return url;
      } else {
        return 'http://' + url;
      }
    } else {
      return url ? url.replace(/[http(s):\/\/]/g, '') : '';  
    }
  },

  getLabelText() {
    if (this.props.label) {
      return (
        <Text style={[styles.label, DEFCSS.sansc]}>
          {this.props.label}
        </Text>
      );  
    }
    return null;
  },

  render() {
    return(
      <TouchableOpacity onPress={(e) => { this.handleClick(e); } }>
        {this.getLabelText()}
        <Text style={[DEFCSS.sansc, styles.link]}>{this.fixLink(this.props.text)}</Text>
      </TouchableOpacity>
    );
  }
});