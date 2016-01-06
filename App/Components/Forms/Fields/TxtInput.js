'user strict';

import React from 'react-native';
import DEFCSS from './../../../Styles/Default';
import Helpers from './../../../Helpers';
import Settings from './../../../../Settings';
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
  DeviceEventEmitter,
  TouchableOpacity,
  ScrollView
} = React;


export default class TxtInput extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      txt: '',
      notRequired: true,
      passSwapper: true
    };
  }

  componentDidMount() {
    console.log(this.props.value);
    this.setState({
      txt: this.props.value || '',
      notRequired: this.props.notRequired
    });

    DeviceEventEmitter.addListener('keyboardWillHide', this.keyboardWillHide.bind(this));
  }

  onChange() {
    if (this.props.onChange) {
      this.props.onChange();
    }
  }

  validated() {
    var ok = false;
    switch(this.props.type) {
      case 'email-address':
        var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
        ok = re.test(this.state.txt);
        break;
      default:
        ok  = this.state.txt.length > 0;
        break;
    }

    return ok;
  }

  swapPassword() {
    this.setState({
      passSwapper: !this.state.passSwapper
    });
  }

  keyboardWillHide() {
    if (this.props.onDone) {
      this.props.onDone(this.state.txt);
    }
  }

  getMessage() {

    if (this.props.type === 'password') {
      return (
        <TouchableOpacity onPress={()=> { this.swapPassword() }}>
          <View style={styles.feedback}>
            <Icon
              name={'fontawesome|' + (this.state.passSwapper ? 'eye' : 'eye-slash')}
              size={16}
              color={Settings.colors.darkGray}
              style={[styles.icon]} />
          </View>
        </TouchableOpacity>
      );
    }

    if (!this.state.notRequired) {
      if (this.state.txt && this.state.txt.length > 0 && this.validated()) {

        if (!this.props.multiline) {
          return (
            <View style={[styles.feedback]}>
              <Icon
                name='fontawesome|check'
                size={16}
                color={Settings.colors.green}
                style={[styles.icon]} />
            </View>
          );
        } else {
          return (
            <TouchableOpacity onPress={()=> { this.hideKeyBoard() }}>
              <View style={[styles.feedback, styles.doneBtn]}>
                  <Icon
                    name='fontawesome|check'
                    size={16}
                    color={Settings.colors.green}
                    style={[styles.iconBtn]} />
                  <Text style={[DEFCSS.sans, styles.doneTxt, { color: Settings.colors.darkBrown }]}>KLAAR</Text>

            </View>
            </TouchableOpacity>
          );
        }

      } else {
        return (
          <View style={styles.feedback}>
            <Icon
              name='fontawesome|exclamation-triangle'
              size={16}
              color={Settings.colors.darkPink}
              style={[styles.icon]} />
          </View>
        );
      }
    }
  }

  updateField() {
    this.setState({
      txt: this.props.value
    });
  }

  getType() {
    if (this.props.type === 'password') {
      return 'default';
    }
    if (this.props.type === 'price') {
      return 'numbers-and-punctuation';
    }
  }

  inputFocused () {
    setTimeout(() => {
      let scrollResponder = this.props.scrollView.getScrollResponder();
      scrollResponder.scrollResponderScrollNativeHandleToKeyboard(
        React.findNodeHandle(this.refs[this.props.name]),
        50, //additionalOffset
        true
      );
    }, 50);
  }

  render() {
    return(
      <View style={styles.row}>
      <TextInput
        style={[styles.field, DEFCSS.sans, (this.props.multiline ? styles.fieldMulti : {})]}
        multiline={this.props.multiline}
        secureTextEntry={ this.props.type === 'password' ? this.state.passSwapper : false }
        autoFocus={this.props.autoFocus}
        autoCapitalize={(this.props.type === 'title') ? 'characters' : 'none'}
        onChangeText={(text) => {
          this.setState({ txt: text.toLowerCase() });
          //this.onChange();
          this.props.onChange({
            text: text.toLowerCase(),
            validated: this.validated()
          });
        }}
        ref={this.props.name}
        onFocus={this.inputFocused.bind(this)}
        onKeyPress={
          (e)=> {
            console.log(e);
            if (this.props.onKeyPress) {
              this.props.onKeyPress(e);
            }
          }
        }
        onBlur={(e) => {
          e.text = this.state.txt;
          e.validated = this.validated();
          this.props.onChange(e);
        }}
        placeholder={this.props.placeholder}
        keyboardType={this.getType()}
        value={this.state.txt} />

      {this.getMessage()}
      </View>

    );
  }
}

var styles = StyleSheet.create({
  feedback: {

  },
  doneBtn: {
    flexDirection: 'row',
    flex: 0.3,
    height: 30,
    backgroundColor: Settings.colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    marginRight: 10,
    paddingRight: 10,
    marginTop: 10
  },
  row: {
    position: 'relative',
    backgroundColor: Settings.colors.lightPink,
    flexDirection: 'row',
    marginBottom: 10
  },

  icon: {
    width: 30,
    height: 30,
    flex: 0.2,
    margin: 5,
    borderRadius: 15,
    backgroundColor: Settings.colors.white
  },
  iconBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Settings.colors.white
  },
  fieldMulti: {
    height: 150
  },
  field: {
    height: 50,
    flex: 0.7,
    margin: 5,
    padding: 5
  }
});
