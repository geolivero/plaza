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


export default class WhiteBtn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {

  }

  render() {
    return(
      <TouchableHighlight onPress={(e)=> this.props.onPress(e, this.props.label)}>
      <View style={[ styles.whiteBtn ]}>
        <Icon
          name={`fontawesome|${this.props.icon}`}
          size={16}
          color={colors.darkPink}
          style={styles.icon} />
        <Text style={[ DEFCSS.sansc, styles.label ]}>{this.props.label}</Text>
      </View>
      </TouchableHighlight>
    );
  }
}

var styles = StyleSheet.create({
  whiteBtn: {
    height: 50,
    backgroundColor: colors.white,
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    padding: 10,
    borderColor: colors.lightGray
  },
  icon: {
    width: 17,
    height: 17,
    marginTop: 4,
    marginRight: 5
  },
  label: {
    fontSize: 16,
    color: colors.darkBrown
  }
});
