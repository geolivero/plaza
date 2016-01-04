/*globals import:true*/

import React from 'react-native';
import DEFCSS from './../../Styles/Default';
import Helpers from './../../Helpers';
import Settings from './../../../Settings';
import { Icon, } from 'react-native-icons';
import TxtInput from './../Forms/Fields/TxtInput';
import Messages from './../Widgets/Message';
import { UIImagePickerManager, FileUpload } from 'NativeModules';
import ProfileAssets from '././../UI/ProfileAssets';
import FormAddress from './Address';
import ListPicker from './../UI/ListPicker';
import EditableBakeProduct from './../Widgets/EditableBakeProduct';


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


export default class User extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      shiftUp: new Animated.Value(Settings.box.height),
      text: '',
      step: 0,
      logoSource: false,
      username: this.props.model.get('name') || '',
      allowed: false,
      emailText: '',
      passwText: ''
    };
  }

  componentDidMount() {
    Animated.timing( 
      this.state.shiftUp,
      {
        toValue: 0
      }
    ).start();

    this.props.model.on('change', (model)=> {
      this.onModelChange(model);
    });

    Helpers.userToken.get((SESSIONDATA)=> {
      if (SESSIONDATA) {
        this.props.model.set(SESSIONDATA.user);

        console.log(this.props.model.attributes);
        this.setState({
          username: this.props.model.get('name'),
          logoSource: this.props.model.get('field_logo').length ? Helpers.getField(this.props.model.get('field_logo'))['0'].full_url : false
        });
      }
    });

    Helpers.userStep.get((STEP)=> {
      console.log(STEP);
      this.setState({
        step: STEP ? parseInt(STEP) : 0
      });
    });


  }

  onModelChange(model) {
    //console.log('model changed');
    //console.log(this.props.model);
  }

  next() {
    this.setState({
      showMessage: true
    });
    this.saveData();
  }

  onBack() {
    Animated.timing( 
      this.state.shiftUp,
      {
        toValue: Settings.box.height
      }
    ).start(() => {
      this.props.onUserClose();
    });
  }


  createUser() {
    this.setState({
      showMessage: true,
      isSaving: true
    });
  }

  onSuccess() {
    var step = parseInt(this.state.step) + 1;
    this.setState({
      showMessage: false,
      step: step
    });

    Helpers.userStep.save(step);
  }

  saveData() {
    //this.props.model.setURL('mnguser');

    switch(this.state.step) {
      case 0:
        // create new user
        Helpers.getToken((token)=> {
          this.props.model.setToken(token);

          this.props.model.save({}, {

            success: (model)=> {

              Helpers.login(token, {
                username: this.props.model.get('email'),
                password: this.state.passwText
              }, (model)=> {
                this.props.model.set(model.user);
                console.log(model);
                Helpers.userToken.save(model.token, model.session_name, model.sessid, model.user);
                this.setState({
                  passwText: null,
                  step: 1
                });
                this.hideLoadingMessage();
              });
            },

            error: (model, error)=> {
              console.log('error saving');
              console.log(error);
              //@todo: Create an error view
            }

          });
        });
      break; 

      default:
        this.setState({
          isSaving: true
        });


        Helpers.userToken.get((SESSIONDATA)=> {
          var fileName = this.props.model.get('name').replace(/\s/g, '') + '_avatar.jpg';
          console.log(SESSIONDATA);
          console.log(this.props.model);


          if (this.props.model.get('type') === 'userFoto') {

            FileUpload.upload(Helpers.setFileOptions(SESSIONDATA, [
              {
                filename: this.props.model.get('filename') + '.jpg',
                filepath: this.props.model.get('file'),
                filetype: 'image/jpeg', 
              }
            ]), (err, result) => {
              if (err) {
                console.log(err);
                //@todo: fix error messages
              } else {
                console.log(result.data);
                this.props.model.set({
                  avatar_fids: JSON.parse(result.data)
                });
                this.saveModel(SESSIONDATA);
              }
            });

          } else {
            this.saveModel(SESSIONDATA);
          }          
        });

          
        break;
    }
  }

  saveModel(SESSIONDATA) {
    this.props.model.save({}, {

      headers: Helpers.setHeaders(SESSIONDATA),

      success: (model)=> {
        console.log(model);
        Helpers.userToken.saveUser(SESSIONDATA, model.attributes);
        this.onSuccess();
        this.hideLoadingMessage();
      },

      error: (model, error)=> {
        console.log(error);
        //@todo: Create an error view
        this.hideLoadingMessage();
      }
    });
  }

  onOk() {
    switch(this.state.step) {
      case 0:
        this.setState({
          showMessage: false
        });
        if (this.state.validated) {
          this.createUser();
          this.saveData();
        }
        break;
    }
  }

  onAvatarReady(source) {
    console.log(source);
  }

  hideLoadingMessage() {
    this.setState({
      showMessage: false,
      isSaving: false
    });
  }

  showLoadingMessage() {
    return (
      <Messages
        type={'loader'}
        MessageContent={'Yes! Een moment aub.'}
        MessageHeader={'GEGEVENS BEWAREN!'}/>
    );
  }

  

  stepForm() {
    return [
        // create an user
      {
        render: () => {
          return (
            <View>
              <Text style={[ DEFCSS.sansc, styles.title ]}>JOUW EMAIL ADRES</Text>
              <Text style={[ DEFCSS.sansc, styles.title, styles.subTitle ]}>Begin met jouw bakkers account</Text>
              
              <TxtInput
                type={'email-address'}
                key='email'
                onChange={(e)=> { 
                  this.props.model.set({
                      email: e.text
                  });
                  this.setState({ 
                    emailText: e.text,
                    validated: e ? e.validated : false
                  });
                }}
                value={this.props.model.get('mail')}
                placeholder={'Vul je email adres'}/>


              <TxtInput
                type={'password'}
                key='password'
                onChange={(e)=> {

                  this.props.model.set({
                    pass: e.text
                  });
                  this.setState({ 
                    passwText: e.text,
                    validated: e ? e.validated : false
                  });
                }}
                value={this.props.model.get('pass')}
                placeholder={'Vul je wachtwoord in'}/>


            </View>
          );
        },
        messages: () => {
          return(
            <Messages 
              onOk={ ()=> this.onOk() }
              onCancel={ ()=> this.onOk() }
              MessageContent={this.state.validated ? this.state.emailText : 'Email adres niet correct, corrigeer dit eerst voordat je verder kan gaan.' }
              MessageHeader={this.state.validated ? 'Is jouw email correct?': 'Sorry!'}/>
          ); 
        }
      },

      {
        render: ()=> {
          return (
            <View>
              <Text style={[ DEFCSS.sansc, styles.title ]}>GEBRUIKERSNAAM</Text>
              <Text style={[ DEFCSS.sansc, styles.title, styles.subTitle ]}>Kies een makkelijke naam</Text>
              
              <TxtInput
                type={'default'}
                key='username'
                onChange={(e)=> { 
                  this.props.model.set({
                      type: 'username',
                      name: e.text,
                      field_name: e.text
                  });
                  this.setState({ 
                    validated: e ? e.validated : false
                  });
                }}
                value={this.state.username}
                placeholder={'Gebruikersnaam'}/>

            </View>
          );
        }

      },

      {
        render: ()=> {
          return (
            <View style={styles.formContainer}>
              <Text style={[ DEFCSS.sansc, styles.title ]}>JOUW FOTO OF LOGO</Text>
              <Text style={[ DEFCSS.sansc, styles.title, styles.subTitle ]}>Een foto toevoegen aan jouw profiel</Text>
              <ProfileAssets 
                type="avatar"
                defaultSource={{ uri: this.state.logoSource }}
                onReady={(source)=> {

                  this.props.model.set({
                    type: 'userFoto',
                    filename: this.props.model.get('name').replace(/\s\@\./g, '').toLowerCase() + '_logo',
                    file: source.fileSource.uri
                  });

                }} />
            </View>
          );
        }

      },

      {
        render: ()=> {
          return (
            <View>
              <Text style={[ DEFCSS.sansc, styles.title ]}>OVER JOUW</Text>
              <Text style={[ DEFCSS.sansc, styles.title, styles.subTitle ]}>Vertel meer wat je doet</Text>
              
              <TxtInput
                type={'default'}
                key='username'
                multiline={true}
                onChange={(e)=> { 
                  this.props.model.set({
                      type: 'bedrijf',
                      vertel_over_jouw_bedrijf: e.text
                  });
                  this.setState({ 
                    validated: e ? e.validated : false
                  });
                }}
                value={
                  this.props.model.get('field_vertel_over_jouw_bedrijf').length != 0 ? 
                  this.props.model.get('field_vertel_over_jouw_bedrijf').und['0'].value : ''
                }
                placeholder={'Over mij'}/>

            </View>
          );
        }

      },

      {
        render: ()=> {

          return(
            
              <FormAddress
                ref={'address'}
                onReady={(model)=> {
                  console.log(model);
                  console.log(this.props.model);
                }}
              model={this.props.model} />
            
          );
        }
      },
      {
        render: ()=> {

          return(
            <View>
              <Text style={[ DEFCSS.sansc, styles.title ]}>WAT BAK JE</Text>
              <ListPicker model={this.props.model} />
            </View>
          );
        }
      },
      {
        render: ()=> {

          return(
            <View>
              <Text style={[ DEFCSS.sansc, styles.title ]}>UPLOAD JOUW FOTO</Text>
              <EditableBakeProduct 
                onReady={()=>{}}
                scrollView={this.refs.mainScroller}
                title={'titel product'}/>
            </View>
          );
        }
      }
    ];
  }

  render() {
    
    return(
      <View style={[styles.wrapper]}>
        <Animated.View style={[
          styles.container,
            {
              transform: [{
                translateY: this.state.shiftUp
              }]
            }
          ]}>
          <View style={styles.arrowBtnBack}>
            <TouchableOpacity onPress={() => { this.onBack() }}>
              <Icon
                name='fontawesome|angle-left'
                size={22}
                color={Settings.colors.darkBrown}
                style={[styles.buttons]} />
            </TouchableOpacity>
          </View>

          <ScrollView
            ref={'mainScroller'}
            automaticallyAdjustContentInsets={false}
            style={styles.scrollView}>
            { this.stepForm()[this.state.step].render() }


          </ScrollView>

          <TouchableOpacity onPress={() => { this.next(); }}>
            <View style={[styles.largeBtn]}>
              <Text style={[ DEFCSS.sansc, styles.largeBtnTxt ]}>{'VOLGENDE'}</Text>
              <Icon
                name='fontawesome|angle-right'
                size={22}
                color={Settings.colors.white}
                style={[styles.buttons]} />
            </View>
          </TouchableOpacity>

        </Animated.View>

        {()=> {
          if (this.state.showMessage) {
            if (this.state.isSaving) {
              return this.showLoadingMessage();
            } else {
              if (this.stepForm()[this.state.step].messages) {
                return this.stepForm()[this.state.step].messages();
              }
            }
          }
        }()}
      </View>

    );
  }
}

var styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0)',
    left: 0,
    top: 0,
    bottom: 0,
    right: 0
  },
  formContainer: {
    flex: 1
  },
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
  cameraIcon: {
    width: 30,
    height: 30
  },
  largeBtn: {
    flex: 1,
    height: 60,
    flexDirection: 'row',
    alignSelf: 'flex-end',
    justifyContent: 'center',
    width: Settings.box.width / 2,
    alignItems: 'center',
    backgroundColor: Settings.colors.darkPink
  },
  largeBtnTxt: {
    color: Settings.colors.white,
    textAlign: 'center',
    fontSize: 20
  },
  scrollView: {
    flex: 1
  },
  title: {
    fontSize: 30,
    marginTop: 10,
    marginLeft: 5,
    marginRight: 5,
    marginBottom: 3,
    textAlign: 'center'
  },
  subTitle: {
    fontSize: 20,
    marginTop: 0,
    marginBottom: 10
  },
  field: {
    backgroundColor: Settings.colors.lightPink,
    height: 50,
    margin: 5,
    padding: 5
  },
  arrowBtnBack: {
    width: 30,
    height: 30
  },
  buttons: {
    width: 30,
    height: 30
  },
  container: {
    flex: 1,
    backgroundColor: Settings.colors.white,
    position: 'absolute',
    left: 0,
    top: 0,
    height: Settings.box.height,
    right: 0
  }
});