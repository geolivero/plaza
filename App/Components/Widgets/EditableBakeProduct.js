'user strict';

import React from 'react-native';
import DEFCSS from './../../Styles/Default';
import Helpers from './../../Helpers';
import Settings from './../../../Settings';
import { Icon, } from 'react-native-icons';
import EditableField from './../UI/EditableField';
import PictureAsset from './../UI/ProfileAssets';

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


export default class EditableBakeProduct extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pictureExist: false,
      picture: false
    };
  }

  componentDidMount() {

  }

  savePicture(source) {
    this.props.model.set({
      type: 'bakerproduct',
      product_file: this.state.title + '_foto',
      file: source.fileSource.uri
    });
  }

  onReady(data = { text: '' }, prop = '') {

    if (typeof data.text === 'string') {
      if (prop === 'title') {
        this.props.model.set({
          product_file: data.text.replace(/\s/g, '_').toLowerCase(),
        });
        this.props.validated(data.text.length > 0);
      }
      this.props.model.set({
        type: 'bakerproduct',
      });
      this.props.model.set('product_' + prop, this.props[prop] === data.text ? '' : data.text);
    }
  }

  render() {
    return(
      <View style={[styles.container]}>
        <View style={[styles.headerImage]}>
          <PictureAsset
            type="full"
            defaultSource={{ uri: this.state.picture }}
            onReady={(source)=> { this.savePicture(source) }} />
        </View>
        <EditableField
          name={'productTitle'}
          type={'title'}
          onChange={(data)=> {
            this.onReady(data, 'title');
          }}
          scrollView={this.props.scrollView}
          placeholder={this.props.title}
          content={this.props.model.get('product_title') || ''} />

        <EditableField
          name={'productContent'}
          multiline={true}
          scrollView={this.props.scrollView}
          onChange={(data)=> {
            this.onReady(data, 'description');
          }}
          placeholder={this.props.description}
          content={this.props.model.get('product_description') || ''} />

          <EditableField
            name={'productUnit'}
            scrollView={this.props.scrollView}
            content={this.props.model.get('product_unit') || ''}
            placeholder={this.props.unit}
            onChange={(data)=> {
              this.onReady(data, 'unit');
            }}/>

          <EditableField
            type={'price'}
            name={'productPrice'}
            onChange={(data)=> {
              this.onReady(data, 'price');
            }}
            scrollView={this.props.scrollView}
            placeholder={this.props.price}
            content={this.props.model.get('product_price') || ''} />
      </View>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1
  },
  camera: {
    width: 80,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: Settings.colors.darkGray,
    height: 80
  },
  headerImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: Settings.box.width,
    backgroundColor: Settings.colors.lightGray
  }
});
