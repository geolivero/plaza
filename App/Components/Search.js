'user strict';

var React = require('react-native');
var Backbone = require('backbonereactnative');
var DEFCSS = require('./../Styles/Default');
var Helpers = require('./../Helpers');
var Settings = require('./../../Settings');
var { Icon, } = require('react-native-icons');
var CloseBtn = require('./Widgets/CloseBtn');
var MapboxGLMap = require('react-native-mapbox-gl');
var Dimensions = require('Dimensions');
var windowSize = Dimensions.get('window');
var Models = require('../Models/Baker');
var BakerCard = require('./Widgets/MapBakerCard');
var mapRef = 'mapRef';

var {
  View,
  Text,
  Image,
  AppRegistry,
  StyleSheet,
  TouchableHighlight,
  TouchableOpacity,
  StatusBarIOS,
  TextInput,
  ScrollView
} = React;



module.exports = React.createClass({
  mixins: [MapboxGLMap.Mixin],
  getInitialState: function () {
    return {
      center: {
        latitude: 52.370216,
        longitude: 4.895168
      },
      collection: [],
      model: {},
      showCard: false,
      geolocation: {},
      currentPage: 1,
      focus: false,
      isMap: false,
      toggleIcon: 'map',
      annotations: [],
      text: ''
    }
  },

  componentDidMount() {
    this.setState({
      collection: this.props.collection.page(this.state.currentPage)
    });
  },

  openBakersProfile(model) {

    this.props.navigator.push({
      id: 'bakersprofile', 
      model: model,
      collection: this.props.collection
    });
  },

  onScroll(e) {
    var scrollY = e.nativeEvent.contentOffset.y;
    var sW = windowSize.height - 50;
    var sC = (4 * (this.state.currentPage)) * (windowSize.width / 2);
    if (this.state.text.length > 0 || this.state.isMap) {
      return;
    }
    if (scrollY >= ((sW - sC) * -1)) {
      setTimeout(()=> {
        var currentPage  = this.state.currentPage + 1;
        this.setState({
          currentPage: currentPage,
          collection: this.props.collection.page(currentPage)
        });
        
      }, 300);
    }
  },

  goBack(){
    this.props.navigator.pop();
  },

  onRightAnnotationTapped(e) {
    var model =  this.props.collection.get(e.id);
    this.setState({
      model: model
    });
    this.gotoBaker();
  },

  listOfTiles() {
    return this.state.collection.map((model, i)=> {
      return (
        <TouchableHighlight key={model.get('uid')} onPress={() => this.openBakersProfile(model)}>
          <View key={'row_' + i} style={[styles.tile]}>
            <Image style={[styles.tileImage, DEFCSS.darkBg]} 
              source={{uri: model.get('cake_pic')}} 
              resizeMode={'cover'}
              capInsets={{left: 0, top: 0}} />
              <View style={[DEFCSS.oDarkBg, styles.labelWrap]}>
                <Text style={[DEFCSS.sansc, styles.label ]}>{model.get('name')}</Text>
              </View>
              
          </View>
        </TouchableHighlight>
      );
    })
  },

  createAnnotation(collection) {
    var annotations = [];


    collection.map((model, i) => {
      var logo = model.get('logo') ? {
        url: model.get('logo'),
        height: 40,
        width: 40
      } : {};


      if (model.get('lat')) {
        var annotation = {
          coordinates: [parseFloat(model.get('lat')), parseFloat(model.get('lng'))],
          type: 'point',
          title: (model.get('field_bedrijfsnaam_value') || model.get('name')  || model.get('field_naam_value')).toUpperCase(),
          model: model,
          /*annotationImage: {
            "url": "https://cldup.com/CnRLZem9k9.png",
            height: 38,
            width: 30
          },*/
          /*rightCalloutAccessory: {
            url: 'image!next_arrow.png',
            height: 30,
            width: 30
          },*/
          //annotationImage: logo,
          id: model.get('uid')
        }
        annotations.push(annotation);
      }
    });

    return annotations;
  },

  onAnnotationTapped(e) {
    var model = this.props.collection.get(e.id);
    this.setState({
      showCard: true,
      model: model
    });
  },

  gotoBaker() {
    this.props.navigator.push({
      id: 'bakersprofile', 
      model: this.state.model,
      collection: this.props.collection
    });
  },

  cancelCard() {
    this.setState({
      showCard: false
    });
  },

  listOnMap() {

    return (
      <View style={[styles.map]}>
        <MapboxGLMap
          style={styles.map}
          zoomLevel={8}
          zoomEnabled={true}
          userLocationVisible={true}
          rotateEnabled={false}
          scrollEnabled={true}
          ref={mapRef}
          userLocationVisible={true}
          showsUserLocation={true}
          annotations={this.state.annotations}
          centerCoordinate={this.state.center}
          accessToken={Settings.mapToken}
          onOpenAnnotation={(e)=> { this.onAnnotationTapped(e) }}
          onRegionChange={(e)=>{ this.cancelCard(e) }}
          styleURL='asset://styles/streets-v8.json' />
        <TouchableHighlight onPress={this.findMyLocation}>
          <View style={[styles.locationBtn, (this.state.showCard ? { bottom: 110 } : {})]}>
            <Icon
              name='fontawesome|location-arrow'
              size={25}
              color={Settings.colors.darkGray}
              style={[styles.btnLocation]} />
          </View>
        </TouchableHighlight>
        {()=>{
          if (this.state.showCard) {
            return <BakerCard type={'right'} model={this.state.model} onPress={this.gotoBaker} />
          }
        }()}
      </View>
    );
  },

  findMyLocation() {
    this.refs.searchField.setNativeProps({text: ''});

    navigator.geolocation.getCurrentPosition(
      (initialPosition) => { 

        this.setState({
          center: {
            latitude: initialPosition.coords.latitude,
            longitude: initialPosition.coords.longitude
          }
        });

        this.setState({
          collection: this.props.collection.querySearch(null, {
            lat: initialPosition.coords.latitude,
            long: initialPosition.coords.longitude
          })
        });

        setTimeout(()=> {
          this.addAnnotations(mapRef, this.createAnnotation(this.props.collection.querySearch(null, {
            lat: initialPosition.coords.latitude,
            long: initialPosition.coords.longitude
          })));
        }, 500);
        
      },
      (error) => alert(error.message + '\nPlease check your settings.'),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );
  },

  onFocus() {
    this.setState({
      focus: true
    });
  },

  onKeyPress(text) {
    this.setState({
      text: text,
      collection: this.props.collection.querySearch(text.replace(/\s/g, ''))
    });

    this.addAnnotations(mapRef, this.createAnnotation(this.props.collection.querySearch(text.replace(/\s/g, ''))));

  },

  onBlur() {
    this.setState({
      focus: false
    });
    
  },

  focusField() {
    this.refs.searchField.focus();
  },

  toggleViews() {
    if (this.state.isMap) {
      this.setState({
        isMap: false,
        toggleIcon: 'map',
        collection: this.props.collection.page(1)
      });
    } else {


      this.setState({
        isMap: true,
        toggleIcon: 'th-list',
        collection: this.props.collection.getWidthLocation()
      });
      
      setTimeout(()=> {
        this.addAnnotations(mapRef, this.createAnnotation(this.props.collection.getWidthLocation()));
      }, 500);
      
      
    }
  },

  render() {
    console.log(this.state.collection.length);

    return (
      <View style={[styles.container, DEFCSS.oDarkBg]}>
        <View style={[styles.header]}>
          <TouchableHighlight onPress={this.goBack}>
            <Icon
              name='fontawesome|angle-left'
              size={25}
              color={Settings.colors.darkGray}
              style={styles.btnLeft} />
          </TouchableHighlight>
          <TouchableHighlight onPress={this.focusField}>
            <Icon
              name='fontawesome|search'
              size={16}
              color={Settings.colors.darkGray}
              style={styles.btnLeft} />
          </TouchableHighlight>

          <TextInput
            placeholder='Zoek op soort, naam'
            ref='searchField'
            clearButtonMode='while-editing'
            clearTextOnFocus='true'
            style={[styles.inputField, DEFCSS.sans]}
            onChangeText={this.onKeyPress}
            onBlur={this.onBlur}
            onFocus={this.onFocus}
            value={this.state.text} />

          <TouchableHighlight onPress={this.toggleViews}>
            <Icon
              name={'fontawesome|' + this.state.toggleIcon}
              size={15}
              color={Settings.colors.darkGray}
              style={styles.btnLeft} />
          </TouchableHighlight>
        </View>
        <ScrollView 
            scrollEventThrottle={500}
            onScroll={ this.onScroll } 
            contentContainerStyle={DEFCSS.scrollContainer} 
            style={[ DEFCSS.whiteBg, styles.scroll ]}>
            <View style={[styles.grid, (this.state.isMap ? { height: windowSize.height - 50 } : {})]}>
            {
              ()=>{
                if (this.state.isMap) {
                  return this.listOnMap();
                } else {
                  return this.listOfTiles();
                }
              }()
            }
            </View>
          </ScrollView>
          {()=>{
            if (this.state.focus) {
              return(
                <View style={[styles.focus, DEFCSS.oDarkBg]} />
              );
            }
          }()}
      </View>
    );
  }
});

var styles = {
  container: {
    flex: 1,
    backgroundColor: Settings.colors.white
  },
  focus: {
    flex: 1,
    top: 50,
    position: 'absolute',
    left: 0,
    bottom: 0,
    right: 0
  },
  header: {
    height: 50,
    flexDirection: 'row',
    backgroundColor: Settings.colors.white
  },
  btnLeft: {
    width: 35,
    height: 50
  },
  inputField: {
    width: windowSize.width - (35 * 3),
    height: 50
  },
  grid: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  scroll: {
    flex: 1
  },
  btnLocation: {
    width: 30,
    height: 30
  },
  locationBtn: {
    backgroundColor: Settings.colors.white,
    width: 40,
    height: 40,
    position: 'absolute',
    right: 10,
    bottom: 10,
    borderColor: Settings.colors.darkBrown,
    borderRadius: 3,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  labelWrap: {
    position: 'absolute',
    left: 0,
    bottom: 5,
    flex: 1,
    height: 30
  },
  map: {
    flex: 1
  },
  label: {
    color: Settings.colors.white,
    margin: 5,
    fontSize: 15
  },
  tile: {
    width: windowSize.width / 2,
    height: windowSize.width / 2
  },
  tileImage: {
    flex: 1
  }
};
