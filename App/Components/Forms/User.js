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


    Helpers.userToken.get((SESSIONDATA)=> {
      if (SESSIONDATA) {
        this.props.model.set(SESSIONDATA.user);

        console.log(this.props.model.attributes);
        this.setState({
          username: this.props.model.get('name'),
          logoSource: this.props.model.get('field_logo').length ?
            Helpers.getField(this.props.model.get('field_logo'))['0'].full_url :
            false
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



  /**
   * calcPerc - Set the state of the UI that shows the user signup progress
   *
   * @return {type}  null
   */
  calcPerc() {
    let total = this.stepForm().length;
    let step = (this.state.step + 1) * (Settings.box.width / total);
    let X = step - 45;
    this.setState({
      percWidth: step,
      percValue: `stap ${(this.state.step + 1)} / ${total}`,
      percLabelX: this.state.step === 0 ? 0 : X,
      stepEnd: this.state.step === (total - 1)
    });
  }





  /**
   * onBack - Exit registration form
   *
   * @return {type}  null
   */
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


  /**
   * onSuccess - after information saved on the server  set the step of the form en disable the message
   *
   * @return {type}  null
   */
  onSuccess() {
    var step = parseInt(this.state.step) + 1;
    this.setState({
      showMessage: false,
      isSaving: false,
      step: step
    });

    Helpers.  userStep.save(step);
    this.calcPerc();
  }

  /**
   * next - Goto the next step in de registration
   *
   * @return {type}  null
   */
  next() {
    this.setState({
      showMessage: true
    });
    this.saveData();
  }


  /**
   * saveData - Save data to the server, you can the current step to change the save behaivior
   *
   * @return {type}  null
   */
  saveData() {
    //this.props.model.setURL('mnguser');

    switch(this.state.step) {
      case 0:
        // create new user
        Helpers.getToken((token)=> {
          this.props.model.setToken(token);

          this.props.model.save({}, {

            success: (model)=> {
              this.setState({
                validated: false
              });
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
                this.removeLoadingMessage();
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

          this.setState({
            showMessage: true,
            isSaving: true
          });


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
                this.saveToServer(SESSIONDATA);
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
                this.saveToServer(SESSIONDATA);
              }
            });
          } else {
            this.saveToServer(SESSIONDATA);
          }
        });


        break;
    }
  }


  /**
   * saveToServer - Save data to the server
   *
   * @param  {type} SESSIONDATA the current SESSION object dat is saved on disk
   * @return {type}             null
   */
  saveToServer(SESSIONDATA) {
    this.props.model.save({}, {

      headers: Helpers.setHeaders(SESSIONDATA),

      success: (model)=> {
        console.log(model);
        this.setState({
          validated: false
        });

        Helpers.userToken.saveUser(SESSIONDATA, model.attributes);
        this.onSuccess();
        this.removeLoadingMessage();
      },

      error: (model, error)=> {
        console.log(error);
        //@todo: Create an error view
        this.removeLoadingMessage();
      }
    });
  }


  /**
   * onOk - Action to take after form fields validation
   *
   * @return {type}  null
   */
  onOk() {
    switch(this.state.step) {
      case 0:
        this.setState({
          showMessage: false
        });
        if (this.state.validated) {
          this.setState({
            showMessage: true,
            isSaving: true
          });
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


  /**
   * removeLoadingMessage - Sets the state voor the loading widget to remove it from view
   *
   * @return {type}  null
   */
  removeLoadingMessage() {
    this.setState({
      showMessage: false,
      isSaving: false
    });
  }


  /**
   * renderLoadingMessage - render the loader widget
   *
   * @return {type}  null
   */
  renderLoadingMessage() {
    return (
      <Messages
        type={'loader'}
        MessageContent={'Yes! Een moment aub.'}
        MessageHeader={'GEGEVENS BEWAREN!'} />
    );
  }



  /**
   * stepForm - Create the wizard form elements array in combination with the message component
   *
   * @return {Array}  Render array width objects containing de form en the messages
   */
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
                key='bedrijf'
                multiline={true}
                scrollView={this.refs.mainScroller}
                name={'bedrijf'}
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
                scrollView={this.refs.mainScroller}
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




  /**
   * render - Render the application
   *
   * @return {Component}  The view component
   */
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
            if (this.state.stepEnd === false) {
              console.log('render me');
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
            if (this.state.stepEnd === false) {
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
            <Text style={[DEFCSS.sansc, styles.percLabel, { left: this.state.percLabelX }]}>{`${this.state.percValue}`}</Text>
          </View>

        </Animated.View>

        {()=> {
          if (this.state.showMessage) {
            if (this.state.isSaving) {
              return this.renderLoadingMessage();
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



/**
 * The styles of the views
 *
 */
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
    backgroundColor: Settings.colors.darkPink
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
    height: 30,
    marginTop: 20
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
