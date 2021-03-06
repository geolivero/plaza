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
        onChange={(data)=> {
          this.props.onChange(data)
        }}
        onKeyPress={(e)=> {
          if (this.props.onKeyPress) {
            this.props.onKeyPress(e)
          }
        }}
        clearButton={true}
        autoFocus={true}
        type={this.props.type}
        onDone={(text)=> this.doneEditing(text) }
        multiline={this.props.multiline}
        name={this.props.name}
        scrollView={this.props.scrollView}
        value={this.state.content || this.state.placeholder}
        placeholder={this.state.placeholder} />
    );
  }

  doneEditing(text) {
    this.setState({
      editable: false,
      content: text
    });
  }

  getStyles() {
    switch (this.props.type) {
      case 'title':
        return [styles.title, DEFCSS.sansc];
    }
  }



  renderText() {
    return (
      <TouchableOpacity onPress={(e)=> { this.editText(e); }}>
        <View style={[styles.rowText]}>
          {()=>{
            if (this.props.type === 'price') {
              return (
                <Text style={[DEFCSS.sans, styles.contentField, styles.euro]}>
                  €
                </Text>
              );
            }
          }()}
          <Text style={[DEFCSS.sans, this.getStyles(), styles.contentField]}>
            {( this.props.type === 'title' ? (this.state.content || this.props.placeholder ).toUpperCase() : (this.state.content || this.props.placeholder ) )}
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
    flex: 0.1,
    marginLeft: 5
  },
  euro: {
    marginRight: 5,
    flex: 0.05
  },
  title: {
    fontSize: 20
  },
  rowText: {
    padding: 10,
    flexWrap: 'wrap',
    flexDirection: 'row'
  },
  contentField: {
    flex: 0.85,
    flexWrap: 'wrap'
  },
  row: {

  }
});
