'use strict';

var React = require('react-native');
var _ = require('underscore');
var DEFCSS = require('./../Styles/Default');
var Toolbar = require('./../UI/Toolbar');
var PinkHeader = require('./../UI/PinkHeaders');
var GalerieList = require('./../Models/BakersProfile');
var Dimensions = require('Dimensions');
var windowSize = Dimensions.get('window');
var Arrow = require('./../Widgets/Arrow');
var Settings = require('./../../Settings');
var Helpers = require('./../Helpers');
var LoaderBar = require('./../Widgets/Loaderbar');
//var Swiper = require('react-native-swiper');
var Price = require('format-price');
var Contact = require('./Bakers/Contact');
var Beschrijving = require('./Bakers/Beschrijving');
var CakeTypes = require('./Bakers/Caketypes');
var PicturePopup = require('./../Components/Widgets/PicturePopup');
var { Icon, } = require('react-native-icons');

var {
  AppRegistry,
  StyleSheet,
  StatusBarIOS,
  ScrollView,
  ListView,
  TouchableHighlight,
  Image,
  Text,
  Platform,
  ActivityIndicatorIOS,
  LayoutAnimation,
  Animated,
  View,
} = React;



var bakers = React.createClass({
  goBack: function () {
    this.props.navigator.pop();
  },
  getInitialState: function () {
    return {
      contentLoaded: false,
      hasContent: false,
      scrollBack: 0,
      imageURL: false,
      popup: '',
      collection: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2
      })
    }
  },
  createCollection: function () {
    var lists = this.model.attributes,
      galerieList = [];

    if (lists) {
      _.each(lists, (list) => {
        if (typeof(list) === 'object') {
          galerieList.push(list);
        }  
      });
    }
    this.collection.reset(galerieList);
    this.setState({
      collection: this.state.collection.cloneWithRows(this.collection.models)
    });
    
  },
  onPopUpClose() {
    this.setState({
      popup: false
    });
  },
  openBakersDetails: function (popupType) {
    this.setState({
      popup: popupType
    });

  },
  componentDidMount: function () {
    var uid = this.props.model.get('uid');
    this.model = new GalerieList.model();
    this.collection = new GalerieList.collection();
    
    Helpers.getToken((token)=> {
      this.model.setToken(token);
      this.model.set({id: uid, uid: uid });
      this.model.fetch({
        success: (response)=> {
          this.createCollection();
          this.refs.loaderBar.stop();
          this.setState({
            contentLoaded: true
          });
        }
      });
    });
  },


  renderPrice(model) {
    if (model.get('field_price_value')) {
      
      return (
        
        <View style={[ styles.priceContainer ]}>
          <Text style={[DEFCSS.sansc, styles.priceLabel, DEFCSS.darkColor]}>
            {model.get('field_price_type_value')}
          </Text>
          <Text style={[DEFCSS.sansc, styles.price, DEFCSS.darkColor]}>
            {Price.format('nl-NL', 'EUR', model.get('field_price_value'))}
          </Text>
        </View>
      );
    }
    return null;
  },

  getPopUps() {
    switch(this.state.popup) {
      case 'contact':
        return <Contact onClose={()=> this.onPopUpClose()} model={this.props.model} />;
        break;
      case 'overmij':
        return <Beschrijving onClose={()=> this.onPopUpClose()} model={this.props.model} />;
        break;
      case 'caketypes':
        return <CakeTypes onClose={()=> this.onPopUpClose()} model={this.props.model} />;
        break;

    }
    return null;
  },

  renderProduct: function (model) {
    return (
        <View key={model.get('nid')} style={[DEFCSS.whiteBg]}>
        
        <ScrollView 
          contentContainerStyle={DEFCSS.scrollContainer}
          pagingEnabled={true} 
          style={[ styles.productRow ]}
          horizontal={true} >

          <View key={model.get('nid')} style={[DEFCSS.whiteBg]}>
              <Text style={[styles.rowBakerTxt, DEFCSS.whiteBg, DEFCSS.sansc ]}>{model.get('title')}</Text>
              <TouchableHighlight onPress={() => this.openImageGalerie(model.get('cake_pic'))}>
                <Image style={[DEFCSS.darkBg, styles.cakeImg]} 
                  source={{uri: model.get('cake_pic')}}
                  resizeMode={'cover'}
                  capInsets={{left: 0, top: 0}} />
              </TouchableHighlight>
          </View>
          <View style={styles.slide2}>
            <View style={[DEFCSS.rowBakerLogo, DEFCSS.darkBg, {alignSelf: 'center', marginTop: 10}]}>
              <Image style={[styles.miniCakeImg]} 
                source={{uri: model.get('cake_pic')}}
                resizeMode={'cover'}
                capInsets={{left: 0, top: 0}} />
            </View>

            <ScrollView 
              contentContainerStyle={DEFCSS.scrollContainer} 
              style={[ styles.descripContainer ]}>
                <Text style={[styles.bakersContent, DEFCSS.sansc, DEFCSS.darkColor ]}>{model.get('plain_text')}</Text>
            </ScrollView>
          </View>

        </ScrollView>

        
          
        {this.renderPrice(model)}

        </View>
    );
  },

  openImageGalerie(imgURL) {
    this.props.navigator.push({
      id: 'bakersgalerie',
      onClose: this.closeImageGalerie,
      imgURL: imgURL
    });
  },


  closeImageGalerie() {
    this.props.navigator.pop();
  },

  renderBasicProduct(model) {
    return(
        <View key={model.get('nid')} style={[DEFCSS.whiteBg, styles.row]}>
          <Text style={[styles.rowBakerTxt, DEFCSS.whiteBg, DEFCSS.sansc ]}>{model.get('title')}</Text>
            <TouchableHighlight onPress={() => this.openImageGalerie(model.get('cake_pic'))}>
            <Image style={[DEFCSS.darkBg, styles.cakeImg]} 
              source={{uri: model.get('cake_pic')}} 
              resizeMode={'cover'}
              capInsets={{left: 0, top: 0}} />
            </TouchableHighlight>
        </View>
    );
  },

  closeBakersMap() {

  },

  openMap() {
    this.props.navigator.push({
      id: 'bakersmap',
      onClose: this.closeBakersMap,
      model: this.props.model
    });
  },

  getProduct: function (model) {
    if (model.get('plain_text')) {
      return this.renderProduct(model);
    } else {
      return this.renderBasicProduct(model);
    }
  },

  getBakersCompanyName: function () {
    return (this.props.model.get('field_bedrijfsnaam_value') || this.props.model.get('name')).toUpperCase();
  },

  renderArrow: function () {
    if (this.state.contentLoaded) {
      return <Arrow ref={'theArrow'} />;
    }
  },

  renderFooter: function () {
    if (!this.state.contentLoaded) {
      return null;
    }
    return (
          <View style={[ styles.lastContainer, DEFCSS.oDarkBgLight ]}>
            <Image 
              style={[DEFCSS.rowBakerLogo, styles.bakersLogo , styles.logoFooter]}
              source={{uri: this.props.model.get('logo')}}  />
            <Text style={[DEFCSS.sansc, DEFCSS.whiteColor, styles.footerTitle ]}>{this.getBakersCompanyName()}</Text>
          </View>
    );
  },

  renderBgImage(model) {
    if (this.props.model.get('bgimage')) {
      return (<Image 
          style={[styles.bakers_bg]} 
          resizeMode={'cover'}
          source={{uri: this.props.model.get('bgimage')}} />
        );
    }
    return (<Image 
        style={[styles.bakers_bg]}
        resizeMode={'cover'}
        source={require('../../images/defaultpic.png')} />);
  },

  render: function() {
    console.log(this.props.model);
    console.log(this.props.model.get('field_bedrijfsnaam_value'));
    console.log('======');
    return (
      <View style={[styles.container]}>
        {this.renderBgImage(this.props.model)}
        
        <ScrollView 
          contentContainerStyle={DEFCSS.scrollContainer} 
          style={[ DEFCSS.contentContainer, DEFCSS.contentScroller ]}>

          <View style={DEFCSS.bgSpacer} />
          <PinkHeader 
            title={(this.props.model.get('field_bedrijfsnaam_value') || this.props.model.get('field_naam_value')).toUpperCase()} 
            subTitle={'get your cake on!'} />

          <View>
          <View style={[DEFCSS.rowBakerLogoPlaceHolder, styles.bakersLogo]}>
            <Image 
            style={[DEFCSS.rowBakerLogo]} 
            source={{uri: this.props.model.get('logo')}} />
            </View>
          </View>
          
          {this.renderArrow()}
          <ListView 
            scrollEnabled={false} 
            style={[DEFCSS.whiteBg]}
            automaticallyAdjustContentInsets={false}
            dataSource={this.state.collection} renderRow={this.getProduct} />
          <LoaderBar ref={'loaderBar'} />
          {this.renderFooter()}
          
        </ScrollView>


        <Toolbar 
          showBackBtn={true} 
          onPress={this.goBack}
          collection={this.props.collection}
          navigator={this.props.navigator}
          title={this.getBakersCompanyName()} />
        <View ref={'toolBar'} style={[ DEFCSS.oWhiteBg, styles.toolBar]}>

          
          {()=> {
            if (this.props.model.get('lat') && this.props.model.get('lng')) {            
              return (
                <TouchableHighlight onPress={ this.openMap }>
                  <Icon
                    name='fontawesome|map-marker'
                    size={22}
                    color={Settings.colors.darkPink}
                    style={styles.buttons} />
                </TouchableHighlight>
              )
            }
          }()}
          
          
          <TouchableHighlight onPress={() => this.openBakersDetails('contact')}>
          <Icon
              name='fontawesome|book'
              size={22}
              color={Settings.colors.darkPink}
              style={styles.buttons} />
          </TouchableHighlight>
          <TouchableHighlight onPress={() => this.openBakersDetails('overmij')}>
            <Icon
              name='fontawesome|info-circle'
              size={22}
              color={Settings.colors.darkPink}
              style={styles.buttons} />
          </TouchableHighlight>
          <TouchableHighlight onPress={() => this.openBakersDetails('caketypes')}>
          <Icon
              name='material|cake'
              size={22}
              color={Settings.colors.darkPink}
              style={styles.buttons} />
          </TouchableHighlight>
          <TouchableHighlight onPress={() => this.openBakersDetails()}>
          <Icon
              name='fontawesome|heart'
              size={22}
              color={Settings.colors.darkPink}
              style={styles.buttons} />
          </TouchableHighlight>
        </View>
        {this.getPopUps()}
      </View>
    );
  }
});






//
module.exports = bakers;




var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  bakers_bg: {
    flex: 1,
    left: 0,
    width: windowSize.width,
    backgroundColor: 'white',
    opacity: 0.6,
    right: 0,
    top: 0
  },
  bakersLogo: {
    bottom: Platform.OS === 'ios' ? 90 : 120
  },
  lastContainer: {
    height: windowSize.height,
    width: windowSize.width,
    justifyContent: 'flex-end',
    alignItems: 'flex-end'
  },
  row: {
   flex: 1
  },
  productRow: {
    width: windowSize.width
  },
  toolBar: {
    top: 60,
    left: 0,
    width: windowSize.width,
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: 50
  },
  buttons: {
    flexDirection: 'column',
    margin: 10,
    width: 24,
    height: 18
  },
  cakeImg: {
    width: windowSize.width,
    height:  windowSize.width,
    top: 0
  },
  
  rowBakerTxt: {
    fontSize: 20,
    margin: 10
  },
  bakersContent: {
    margin: 20,
    fontSize: 16
  },
  footerTitle: {
    fontSize: 40,
    paddingRight: 20,
    paddingLeft: 20,
    paddingTop: 20,
    textAlign: 'right',
    paddingBottom: 20,
  },
  logoFooter: {
    width: 100,
    height: 100,
    position: 'relative',
    left: 0,
    bottom: 0,
    marginRight: 20,
    borderRadius: 50
  },
  slide2: {
    width: windowSize.width
  },
  miniCakeImg: {
    width: 76,
    height: 76,
    borderRadius: 40,
    borderColor: Settings.colors.lightPink,
    borderWidth: 5
  },
  price: {
    fontSize: 30,
    backgroundColor: Settings.colors.lightPink,
    padding: 15
  },
  descripContainer: {
    height: windowSize.width - 130
  },
  priceLabel: {
    fontSize: 18,
    padding: 15,
    paddingTop: 5,
    paddingBottom: 5
  },
  priceContainer: {
    alignSelf: 'flex-start' 
  }
});