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


export default class TipSelector extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: []
    };
  }

  componentDidMount() {
    this.setState({
      list: this.props.list
    });
  }


  list() {
   return this.state.list.map((item, i)=> {
      return (
        <TouchableOpacity key={'touch_' + i} onPress={(e)=> { this.props.onSelected(i) }}>
          <Text style={[styles.btnlink, DEFCSS.sansc]} key={'item_' + i}>{item}</Text>
        </TouchableOpacity>
      );
      
    });
  }

  render() {
    return(
      <View style={[styles.tip]}>
        <View style={[styles.titleBar]}>
          <Text style={[DEFCSS.sansc, styles.title]}>KIES JOUW ADRES</Text>
          <Icon
              name='fontawesome|sort-desc'
              size={15}
              color={Settings.colors.darkPink}
              style={[styles.iconTitle]} />
        </View>
        {this.list()}
      </View>
    );
  }
}

var styles = StyleSheet.create({
  tip: {
    alignSelf: 'center',
    backgroundColor: Settings.colors.lightGray,
  },
  titleBar: {
    backgroundColor: Settings.colors.white,
    height: 50,
    flexDirection: 'row',
    width: Settings.box.width
  },
  iconTitle: {
    width: 20
  },
  title:  {
    color: Settings.colors.darkPink,
    padding: 10,
    fontSize: 20
  },
  tipTop: {
    position: 'relative',
    top: -5,
    alignSelf: 'center'
  },
  scrollView: {
    height: 130
  },
  btnlink: {
    backgroundColor: Settings.colors.white,
    marginBottom: 1,
    width: Settings.box.width,
    padding: 10
  }
});