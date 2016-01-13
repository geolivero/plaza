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
import PinkBtn from './../UI/PinkButton';


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
      percValue: 0,
      percWidth: 0,
      logoSource: false,
      username: this.props.model.get('name') || '',
      allowed: false,
      emailText: '',
      finished: '',
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

      this.calcPerc();
    });

    

  }

  onModelChange(model) {
    //console.log('model changed');
    //console.log(this.props.model);
  }

  calcPerc() {
    let total = this.stepForm().length - 1;
    let step = this.state.step * (Settings.box.width / total);
    let X = step - 35;
    this.setState({
      percWidth: step,
      percValue: Math.ceil((this.state.step / total) * 100),
      percLabelX: this.state.step === 0 ? 0 : X,
      stepEnd: this.state.step === total
    });
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
    this.calcPerc();
  }

  saveData() {
    //this.props.model.setURL('mnguser');

    switch(this.state.step) {
      case 0:
        // create new user
        Helpers.getToken((token)=> {
          console.log('get a nre token, ', token);
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
          isSaving: false
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
          } else if(this.props.model.get('type') === 'bakerproduct') {
            FileUpload.upload(Helpers.setFileOptions(SESSIONDATA, [
              {
                filename: this.props.model.get('product_file') + '.jpg',
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
                  product_fid: JSON.parse(result.data)
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
      default:
        if(this.props.model.get('type') === 'bakerproduct') {
          if (this.state.validated) {
            this.saveData();
          }
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
        MessageHeader={'GEGEVENS BEWAREN!'} />
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
              <Text style={[ DEFCSS.sansc, styles.title ]}>DIENST INFORMATIE</Text>

              <EditableBakeProduct
                onReady={()=>{}}
                model={this.props.model}
                validated={(validated)=> {
                  this.setState({
                    validated: validated
                  });
                }}
                scrollView={this.refs.mainScroller}
                description={'Dienst beschrijving'}
                unit={'Dienst eenheid'}
                price={'Dienst prijs'}
                title={'Titel dienst'}/>
            </View>
          );
        },
        messages: () => {
          return(
            <Messages
              onOk={ ()=> this.onOk() }
              onCancel={ ()=> this.onOk() }
              MessageContent={'Dienst naam is verplicht'}
              MessageHeader={'Dienst!'}/>
          );
        }
      },
      {
        render: ()=> {

          return(
            <View style={[styles.finish]}>
            <Image
                style={styles.successIcon}
                source={require('./../../../images/boot_icon.png')}/>
              <Text style={[ DEFCSS.sansc, styles.title ]}>
                GEFELICITEERD
              </Text>
              <Text style={[
                DEFCSS.paragraph, 
                {textAlign: 'center', marginBottom: 20 }
                ]}>
                Je hebt alle belanrijke velden ingevuld
ga snel en bekijk jouw account en ga verder met pimpen!
              </Text>
              <PinkBtn 
                onPress={()=> this.gotoUserAccount(this.props.model)} 
                label={'Bekijk jouw account'}
                icon={'eye'} />
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
          
          
          

          {()=>{
            if (!this.state.stepEnd) {
              return(
                <View style={styles.arrowBtnBack}>
                  <TouchableOpacity onPress={() => { this.onBack() }}>
                    <Icon
                      name='fontawesome|angle-left'
                      size={22}
                      color={Settings.colors.darkBrown}
                      style={[styles.buttons]} />
                  </TouchableOpacity>
                </View>
              );
            }
          }()}

          <ScrollView
            ref={'mainScroller'}
            automaticallyAdjustContentInsets={false}
            style={styles.scrollView}>
            { this.stepForm()[this.state.step].render() }


          </ScrollView>
          {()=>{
            if (!this.state.stepEnd) {
              return(
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
              );
            }
          }()}

          <View style={styles.percentageUI}>
            <View style={[styles.percentageBar, { width: this.state.percWidth }]} />
            <Text style={[DEFCSS.sansc, styles.percLabel, { left: this.state.percLabelX }]}>{`${this.state.percValue}%`}</Text>
          </View>

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
  finish: {
    alignItems: 'center',
    padding: 20
  },
  successIcon: {
    width: 166,
    height: 166,
    marginBottom: 20,
    marginTop: 30,
    alignSelf: 'center'
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
  percentageBar: {
    height: 5,
    position: 'relative',
    backgroundColor: Settings.colors.green
  },
  percLabel: {
    position: 'absolute',
    left: 0,
    top: 5,
    color: Settings.colors.darkBrown
  },
  percentageUI: {
    position: 'absolute',
    left: 0, top: 0,
    right: 0,
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
    flex: 1,
    position: 'relative',
    top: 10,
    left: 0
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
