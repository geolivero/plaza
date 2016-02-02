import React from 'react-native';
import { userToken, setFileOptions } from './../Helpers';
import { UIImagePickerManager, FileUpload } from 'NativeModules';

var imageEditor = React.NativeModules.ImageEditor;
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


export default class PhotoPicker {

  constructor() {

    this.currentURL = {};
    this.options = {
        title: null,
        cancelButtonTitle: 'Annuleren',
        takePhotoButtonTitle: 'Maak een Photo...',
        chooseFromLibraryButtonTitle: 'Kies foto...',
        maxWidth: 800,
        maxHeight: 800,
        quality: 0.4,
        allowsEditing: false,
        noData: false,
        storageOptions: {
          skipBackup: true,
          path: 'images'
        }
    };
  }

  getFile() {
    return new Promise((resolve, reject)=> {
      UIImagePickerManager.showImagePicker(this.options, (didCancel, response) => {
        //let src = response.customButton ? this.currentURL.uri : response.uri.replace('file://', '');
        let src = response.uri.replace('file://', '');

        imageEditor.showEditor({
          image: src
        }, (cancelled, response) => {

          if (cancelled) {
            console.log('cancelled');
          } else {
            this.currentURL = {
              uri: response.uri.replace('file://', ''),
              isStatic: true
            };
            // trigger when user is finished editing the image
            resolve(this.currentURL);
          }
        });
      });
    });
  }


  async uploadTheFile() {
    try {
      let file = await this.getFile();

      return new Promise((resolve, reject)=> {
        userToken.get((SESSIONDATA)=> {
          console.log(SESSIONDATA);
          FileUpload.upload(setFileOptions(SESSIONDATA, [
            {
              filename: this.filename + '.jpg',
              filepath: file.uri,
              filetype: 'image/jpeg',
            }
          ]), (err, result) => {
            console.log(err, result);
            if (err) {
              console.log(err);
              //@todo: fix error messages
            } else {

              resolve({
                file: file,
                model: JSON.parse(result.data)
              });
            }
          });
        });
      });
    } catch(error) {
        console.error(error);
    }
  }

  async upLoadPic(filename) {
    if (!filename) {
      throw 'file name not set';
    }
    this.filename = filename;
    try {
      return await this.uploadTheFile();
    } catch(error) {
      console.error(error);
    }
  }

}
