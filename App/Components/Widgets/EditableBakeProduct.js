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

// {()=> {
//   if (this.state.pictureExist) {
//     return (
//       <Image
//         style={styles.icon_cake}
//         source={{uri: this.state.pictureURL}} />
//     );
//   } else {
//     return (
//       <Icon
//         name='fontawesome|camera'
//         size={22}
//         color={Settings.colors.darkGray}
//         style={[styles.camera]} />
//     );
//   }
// }()}

export default class EditableBakeProduct extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pictureExist: false,
      picture: ''
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
              // this.props.model.set({
              //   type: 'userFoto',
              //   filename: this.props.model.get('name').replace(/\s\@\./g, '').toLowerCase() + '_logo',
              //   file: source.fileSource.uri
              // });
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
          scrollView={this.props.scrollView}
          onReady={()=> this.onReady('title')}
          content={this.props.title} />

        <EditableField
          onReady={()=> this.onReady('title')}
          name={'productContent'}
          multiline={true}
          scrollView={this.props.scrollView}
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

            <EditableField
              onKeyPress={
                (e)=> {
                  console.log(e);
                }
              }
              type={'price'}
              name={'productPrice'}
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
