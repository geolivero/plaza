'user strict';

import React from 'react-native';
import DEFCSS from './../../Styles/Default';
import Helpers from './../../Helpers';
import Settings from './../../../Settings';
import { Icon, } from 'react-native-icons';
import TxtInput from './../Forms/Fields/TxtInput';
import Messages from './../Widgets/Message';
import { UIImagePickerManager, FileUpload } from 'NativeModules';
import ProfileAssets from '././../UI/ProfileAssets';
import TipList from './../UI/TipList';
import _ from 'underscore';


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


export default class Address extends React.Component {
  constructor(props) {
    super(props);
    this.timer = null;
    this.state = {
      list: [],
      values: {},
      addresses: [],
      newAddress: {
        country: '',
        locality: '',
        postal_code: '',
        route: '',
        street_number: ''
      }
    };
  }

  componentDidMount() {
    
  }

  getLocation(e) {

    navigator.geolocation.getCurrentPosition(
      (position) => {
        var initialPosition = JSON.stringify(position);
        console.log(position.coords);
        Helpers.getAddresses({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }, (addresses)=> {
          console.log(addresses);
          this.setState({
            list: _.pluck(addresses.results, 'formatted_address'),
            addresses: addresses.results
          });
        });
      },
      (error) => alert(error.message),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );

  }

  fillForm(index) {
    
    var location = this.state.addresses[index],
      n,
      newLocation = {};

    _.each(location.address_components, (item, i)=> {
      
      newLocation[item.types[0]] = item.long_name;
    });

    this.setState({
      newAddress: newLocation,
      list: []
    });

    this.refs['straat'].updateField();
    this.refs['huisnr'].updateField();
    this.refs['postcode'].updateField();
    this.refs['plaats'].updateField();

    console.log(newLocation);
  }


  render() {
    return(
      <View>

        {()=>{
          if (this.state.list.length) {
            return (
              <TipList onSelected={(i)=> { this.fillForm(i) }} list={this.state.list} />
            );
          } else {
            return(
              <TouchableOpacity onPress={() => { this.getLocation(); }}>
                <View style={[styles.largeBtn]}>
                  <Text style={[ DEFCSS.sansc, styles.largeBtnTxt ]}>{'Geef mijn locatie door'}</Text>
                  <Icon
                    name='fontawesome|location-arrow'
                    size={15}
                    color={Settings.colors.darkGray}
                    style={[styles.iconLocation]} />
                </View>
              </TouchableOpacity>
            );
          }
        }()}
        <Text style={[ DEFCSS.sansc, styles.of]}>{'-of-'}</Text>
        <TxtInput
              type={'default'}
              key='straat'
              notRequired={true}
              onChange={(e)=> { 
                if (e.text.length) {
                  this.props.model.set({
                    type: 'adres',
                    straat:  e.text
                  });
                  this.props.onReady(this.props.model);
                }
              }}
              ref={'straat'}
              value={this.state.newAddress.route}
              placeholder={'Straat'}/>
        <TxtInput
              type={'default'}
              key='huisnummer'
              value={this.state.newAddress.street_number}
              notRequired={true}
              onChange={(e)=> { 
                if (e.text.length) {
                  this.props.model.set({
                    type: 'adres',
                    huisnummer:  e.text
                  });
                  this.props.onReady(this.props.model);
                }
              }}
              ref={'huisnr'}
              placeholder={'Huisnummer'}/>
        <TxtInput
              type={'default'}
              key='postcode'
              value={this.state.newAddress.postal_code}
              notRequired={true}
              onChange={(e)=> { 
                if (e.text.length) {
                  this.props.model.set({
                    type: 'adres',
                    postcode:  e.text
                  });
                  this.props.onReady(this.props.model);
                }
              }}
              ref={'postcode'}
              placeholder={'Postcode'}/>
        <TxtInput
              type={'default'}
              key='plaats'
              value={this.state.newAddress.locality}
              notRequired={true}
              onChange={(e)=> { 
                if (e.text.length) {
                  this.props.model.set({
                    type: 'adres',
                    plaats:  e.text
                  });

                  this.props.onReady(this.props.model);
                }
              }}
              ref={'plaats'}
              placeholder={'Plaats'}/>
        
      </View>
    );
  }
}


var styles = StyleSheet.create({
  largeBtn: {
    height: 40,
    backgroundColor: Settings.colors.lightGray,
    width: 180,
    margin: 4,
    alignSelf: 'center',
    borderRadius: 3,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    padding: 10
  },
  largeBtnTxt: {
    fontSize: 18
  },
  of:  {
    height: 30,
    fontSize: 18,
    alignItems: 'center',
    textAlign: 'center',
    justifyContent: 'center'
  },
  iconLocation: {
    width: 20,
    height: 20
  }
});