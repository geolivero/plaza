import React from 'react-native';
import DEFCSS from './../../Styles/Default';
import Helpers from './../../Helpers';
import { colors } from './../../../Settings';
import { Icon, } from 'react-native-icons';


var {
  View,
  Text,
  Image,
  Easing,
  StyleSheet,
  TouchableHighlight,
  TextInput,
  Animated,
  AlertIOS,
  TouchableOpacity,
  CameraRoll,
  ScrollView
} = React;


export default class EditBtn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }


  render() {
    if (this.props.editable) {
      return(
        <TouchableHighlight onPress={(e)=> this.props.onPress(e)}>
          <View style={[ styles.btn, this.props.style ]}>
            <Icon
              name={`fontawesome|${this.props.icon}`}
              size={16}
              color={colors.white}
              style={styles.icon} />
            <Text style={[ DEFCSS.sansc, styles.label ]}>Edit</Text>
          </View>
        </TouchableHighlight>
      );
    }
  }
}

var styles = StyleSheet.create({
  btn: {
    height: 30,
    backgroundColor: colors.oDarkGray,
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    padding: 3,
    paddingLeft: 10,
    paddingRight: 10,
    position: 'absolute',
    right: 0,
    top: 0,
    borderColor: colors.white,
    borderRadius: 15
  },
  icon: {
    width: 17,
    height: 17,
    marginTop: 4,
    marginRight: 5
  },
  label: {
    fontSize: 16,
    color: colors.white
  }
});
