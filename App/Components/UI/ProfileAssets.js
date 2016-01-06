'user strict';

import React from 'react-native';
import DEFCSS from './../../Styles/Default';
import Helpers from './../../Helpers';
import Settings from './../../../Settings';
import { Icon, } from 'react-native-icons';
import { UIImagePickerManager, } from 'NativeModules';

var imageEditor = React.NativeModules.ImageEditor;

var {
  View,
  Image,
  Easing,
  StyleSheet,
  TouchableHighlight,
  TextInput,
  Animated,
  AlertIOS,
  Text,
  TouchableOpacity,
  CameraRoll
} = React;


export default class ProfileAssets extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      avatarSource: false,
      options: {
        title: null, // specify null or empty string to remove the title
        cancelButtonTitle: 'Annuleren',
        takePhotoButtonTitle: 'Maak een Photo...', // specify null or empty string to remove this button
        chooseFromLibraryButtonTitle: 'Kies foto...', // specify null or empty string to
        maxWidth: 800,
        maxHeight: 800,
        quality: 0.4,
        allowsEditing: false, // Built in iOS functionality to resize/reposition the image
        noData: false, // Disables the base64 `data` field from being generated (greatly improves performance on large photos)
        storageOptions: { // if this key is provided, the image will get saved in the documents directory (rather than a temporary directory)
          skipBackup: true, // image will NOT be backed up to icloud
          path: 'images' // will save image at /Documents/images rather than the root
        }
      }
    };
  }

  componentDidMount() {
    this.setState({
      avatarSource: this.props.defaultSource.uri || false
    });
  }


  editPic(src) {
    imageEditor.showEditor({
      image: src
    }, (cancelled, response) => {

      if (cancelled) {
        console.log('cancelled');
      } else {
        const sourceother = {
          uri: response.uri.replace('file://', ''),
          isStatic: true
        };
        const source = {
          uri: 'data:image/jpeg;base64,' + response.data
        };

        this.props.onReady({
          base64: 'data:image/jpeg;base64,' + response.data,
          fileSource:  sourceother
        });

        this.setState({
          avatarSource: sourceother
        });
      }
    });
  }

  upLoadPic() {

    var options = {};

    options = this.state.options;

    if (this.state.avatarSource.uri) {
      options.customButtons = {
        'Foto bewerken' : 'edit'
      };
    } else {
      options.customButtons = null;
    }

    UIImagePickerManager.showImagePicker(this.state.options, (didCancel, response) => {
        if (didCancel) {
          console.log('User cancelled image picker');
        } else {
          this.editPic(response.customButton ? this.state.avatarSource.uri: response.uri.replace('file://', ''));
        }
    });
  }

  getStyle() {
    switch (this.props.type) {
      case 'full':
        return [styles.fullscreen];
      default:
        return [styles.image];
    }
  }

  render() {
    return(
      ()=> {
        if (this.state.avatarSource.uri) {
          return (
            <TouchableOpacity onPress={() => { this.upLoadPic() }}>
              <Image resizeMode={this.props.type === 'full' ? 'cover' : 'contain'}
                style={this.getStyle()}
                source={{uri: this.state.avatarSource.uri }} />
            </TouchableOpacity>
          );
        } else {
            return (
              <TouchableOpacity onPress={() => { this.upLoadPic() }}>
                <View style={[styles.image]}>
                  <Icon
                    name='fontawesome|camera-retro'
                    size={30}
                    color={Settings.colors.pink}
                    style={[styles.cameraIcon]} />
                  <Text style={[ DEFCSS.sansc, styles.uploadFotoTxt]}>UPLOAD FOTO</Text>
                </View>
              </TouchableOpacity>
            );
        }
      }()
    );
  }
}



var styles = StyleSheet.create({
  image: {
    width: 150,
    height: 150,
    borderRadius: 75,
    alignSelf: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    margin: 10,
    borderColor: Settings.colors.darkPink,
    borderWidth: 1
  },
  fullscreen: {
    flex: 1,
    width: Settings.box.width,
    height: Settings.box.width
  },
  uploadFotoTxt: {
    color: Settings.colors.darkerPink
  },
  cameraIcon: {
    width: 30,
    height: 30
  }
});
