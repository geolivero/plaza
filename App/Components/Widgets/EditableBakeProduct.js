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

  render() {
    return(
      <View style={[styles.container]}>
        <View style={[styles.headerImage]}>
          <PictureAsset
            type="full"
            defaultSource={{ uri: this.state.picture }}
            onReady={(source)=> {
              this.props.model.set({
                type: 'userFoto',
                product_file: this.state.title + '_foto',
                file: source.fileSource.uri
              });
            }} />
        </View>
        <EditableField
          onKeyPress={
            (e)=> {
              console.log(e);
            }
          }
          name={'productTitle'}
          type={'title'}
          onChange={(text)=> {
            this.setState({
              title: text.replace(/\s/g, '_').toLowerCase()
            });
            this.props.model.set({
              pruduct_title: text
            });
          }}
          scrollView={this.props.scrollView}
          content={this.props.title} />

        <EditableField
          name={'productContent'}
          multiline={true}
          scrollView={this.props.scrollView}
          onChange={(text)=> {
            this.props.model.set({
              pruduct_content: text
            });
          }}
          onKeyPress={
            (e)=> {
              console.log(e);
            }
          }
          content={this.props.description} />

          <EditableField
            onKeyPress={
              (e)=> {
                console.log(e);
              }
            }
            name={'productUnit'}
            scrollView={this.props.scrollView}
            onReady={()=> this.onReady('unit')}
            content={this.props.unit} />
            onChange={(text)=> {
              this.props.model.set({
                pruduct_unit: text
              });
            }}
            <EditableField
              onKeyPress={
                (e)=> {
                  console.log(e);
                }
              }
              type={'price'}
              name={'productPrice'}
              onChange={(text)=> {
                this.props.model.set({
                  pruduct_price: text
                });
              }}
              scrollView={this.props.scrollView}
              onReady={()=> this.onReady('price')}
              content={this.props.price} />
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
