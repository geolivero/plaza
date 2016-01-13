'user strict';

import React from 'react-native';
import DEFCSS from './../../Styles/Default';
import Helpers from './../../Helpers';
import Settings from './../../../Settings';
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


export default class PinkBtn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {

  }

  render() {
    return(
      <TouchableOpacity onPress={()=> this.props.onPress}>
        <View style={styles.pinkBtn}>
          {()=> {
            if (this.props.icon) {
              return(
                <Icon
                  name={'fontawesome|' + this.props.icon}
                  size={16}
                  color={Settings.colors.darkBrown}
                  style={[styles.btnIcon]} />
              );
            }
          }()}
          <Text style={[DEFCSS.sansc, styles.txt]}>
            {this.props.label.toUpperCase()}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}

var styles = StyleSheet.create({
  pinkBtn: {
    backgroundColor: Settings.colors.lightPink,
    padding: 10,
    paddingLeft: 20,
    paddingRight: 20,
    flexDirection: 'row',
    height: 50,
    justifyContent: 'center'
  },
  btnIcon: {
    width: 20,
    position: 'relative',
    top: -3,
    marginRight: 10
  },
  txt: {
    color: Settings.colors.darkBrown,
    fontSize: 16
  }
});