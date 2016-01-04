'user strict';

import React from 'react-native';
import DEFCSS from './../../Styles/Default';
import Helpers from './../../Helpers';
import Settings from './../../../Settings';
import { Icon, } from 'react-native-icons';
import TextField from './../Forms/Fields/TxtInput';


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


export default class EditableField extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editable: false,
      content: this.props.content,
      fields: {

      }
    };
  }

  componentDidMount() {

  }

  editText() {
    this.setState({
      editable: true
    });
  }

  renderField() {
    return (
      <TextField
        onChange={(text)=> {

        }}
        onKeyPress={(e)=> {
          if (this.props.onKeyPress) {
            this.props.onKeyPress(e)
          }
        }}
        onDone={(text)=> this.doneEditing(text) }
        multiline={this.props.multiline}
        name={this.props.name}
        scrollView={this.props.scrollView}
        value={this.state.content}
        placeholder={this.state.content} />
    );
  }

  doneEditing(text) {
    this.setState({
      editable: false,
      content: text
    });
  }

  renderText() {
    return (
      <TouchableOpacity onPress={(e)=> { this.editText(e); }}>
        <View style={[styles.rowText]}>
          <Text style={[DEFCSS.sans, styles.contentField]}>
            {this.state.content}
          </Text>
          <Icon
                name='fontawesome|pencil'
                size={15}
                color={Settings.colors.darkGray}
                style={[styles.editable]} />
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    return(
      <View style={[styles.row]}>
        {()=> {
          if (this.state.editable) {
            return this.renderField();
          } else {
            return this.renderText();
          }
        }()}
      </View>
    );
  }
}

var styles = StyleSheet.create({
  editable: {
    width: 20,
    height: 20,
    flex: 0.2,
    marginLeft: 5
  },
  rowText: {
    padding: 10,
    flexWrap: 'wrap',
    flexDirection: 'row'
  },
  contentField: {
    flex: 0.8,
    flexWrap: 'wrap'
  },
  row: {

  }
});
