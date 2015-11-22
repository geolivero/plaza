'use strict';

var React = require('react-native');
var DEFCSS = require('./../Styles/Default');
var MapboxGLMap = require('react-native-mapbox-gl');
var Settings = require('./../../Settings');
var { Icon, } = require('react-native-icons');
var BakerCard = require('./Widgets/MapBakerCard');
var mapRef = 'mapRef';
//MAP TOKEN sk.eyJ1IjoiZ2VvbGl2ZXJvIiwiYSI6ImNpZ2I4OWgzYjAzbnF3MW0wZGN2bzFoYzMifQ.xDN6xkjidWb33aDIErU9aQ

var {
  MapView,
  StyleSheet,
  TouchableHighlight,
  Text,
  StatusBarIOS,
  TextInput,
  Image,
  View,
} = React;


var map = React.createClass({

  getInitialState() {
    return {
      center: {
        latitude: parseFloat(this.props.model.get('lat')),
        longitude: parseFloat(this.props.model.get('lng'))
      },
      annotations: [{
        coordinates: [parseFloat(this.props.model.get('lat')), parseFloat(this.props.model.get('lng'))],
        'type': 'point',
        title: this.props.model.get('field_bedrijfsnaam_value') || this.props.model.get('field_naam_value'),
       /* annotationImage: {
          url: 'http://www.cakesplaza.com/sites/all/themes/respon/images/marker_cake@2x.png',
          height: 38,
          width: 30
        },*/
        id: 'marker1'
      }]
    }
  },

  componentDidMount() {
    
  },

  goBack() {
    //StatusBarIOS.setHidden(false);
    this.props.navigator.pop();
  },


  render() {
    //StatusBarIOS.setHidden(true);
    return (
      <View style={[ DEFCSS.container, DEFCSS.darkBg, DEFCSS.pTop, styles.container ]}>
        <MapboxGLMap
            style={styles.map}
            zoomLevel={8}
            zoomEnabled={true}
            userLocationVisible={true}
            rotateEnabled={false}
            scrollEnabled={true}
            userLocationVisible={true}
            showsUserLocation={true}
            annotations={this.state.annotations}
            centerCoordinate={this.state.center}
            accessToken={Settings.mapToken}
            styleURL='asset://styles/streets-v8.json' />
          <BakerCard model={this.props.model} onPress={(e)=> { this.goBack(e); }} />
        </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    paddingTop: 0,
    top: 0,
    flex: 1
  },

  title: {
    fontSize: 20,
    marginLeft: 5
  },

  map: {
    flex: 1
  },
  text: {
    padding: 3
  }
});

module.exports = map;