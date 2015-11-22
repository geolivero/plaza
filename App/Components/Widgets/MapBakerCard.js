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


module.exports = React.createClass({
  
  render() {  
    var color = (this.props.theme === 'light') ? Settings.colors.white : Settings.colors.darkGray;
    
    return (
      <TouchableHighlight onPress={this.props.onPress}>
      <View style={[styles.bakerBox]}>
        
        {()=>{
          if (this.props.type !== 'right') {
            return (
              <Icon
                  name='fontawesome|angle-left'
                  size={20}
                  color={Settings.colors.darkBrown}
                  style={styles.buttons} />
            );
          }
        }()}

        <Image style={[styles.miniCakeImg]} 
            source={{uri: this.props.model.get('cake_pic')}}
            resizeMode={'cover'}
            capInsets={{left: 0, top: 0}} />
        <Text style={[styles.title, DEFCSS.sansc, DEFCSS.darkColor]}>{(this.props.model.get('field_bedrijfsnaam_value') || this.props.model.get('field_naam_value')).toUpperCase()}</Text>
        {()=>{
          if (this.props.type === 'right') {
            return (
              
              <Icon
                  name='fontawesome|angle-right'
                  size={20}
                  color={Settings.colors.darkBrown}
                  style={[styles.buttons, styles.rightbtn]} />
              
            );
          }
        }()}
      </View>
      </TouchableHighlight>
    );
  }
});


var styles = {
  title: {
    fontSize: 20,
    marginLeft: 5
  },
  bakerBox: {
    position: 'absolute',
    bottom: 0,
    left: 10,
    right: 10,
    height: 100,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Settings.colors.white
  },
  buttons: {
    flexDirection: 'column',
    margin: 5,
    width: 20,
    height: 100
  },
  miniCakeImg: {
    width: 76,
    height: 76,
    borderRadius: 40,
    marginLeft: 10,
    borderColor: Settings.colors.lightPink,
    borderWidth: 5
  }
};