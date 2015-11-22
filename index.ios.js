'use strict';


var React = require('react-native');
var Home = require('./App/Components/Home');
var BakersProfile = require('./App/Components/Bakersprofile');
var Dimensions = require('Dimensions');
var windowSize = Dimensions.get('window');
var PicturePopup = require('./App/Components/Widgets/PicturePopup');
var BakersMap = require('./App/Components/Map');
var Search = require('./App/Components/Search');
var BakersDemo = require('./App/Components/Demo/DemoBaker');
var NewUserAccount = require('./App/Components/NewUser');

var {
  AppRegistry,
  StyleSheet,
  Navigator,
  StatusBarIOS,
  View,
  TouchableOpacity,
  Text,
  NavigatorIOS
} = React;

var styles = StyleSheet.create({
  navContainer: {
    flex: 1
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    color: 'white',
  }
});


var Dimensions = require('Dimensions');
var PixelRatio = require('PixelRatio');
var buildStyleInterpolator = require('buildStyleInterpolator');
var FlatFloatFromRight = Object.assign({}, Navigator.SceneConfigs.FloatFromRight);
var FlatFadeToTheLeft = {
  transformTranslate: {
    from: {x: 0, y: 0, z: 0},
    to: {x: -Math.round(Dimensions.get('window').width * 0.3), y: 0, z: 0},
    min: 0,
    max: 1,
    type: 'linear',
    extrapolate: true,
    round: PixelRatio.get(),
  },
  opacity: {
    from: 1,
    to: 1,
    min: 0,
    max: 1,
    type: 'linear',
    extrapolate: false,
    round: 100,
  },
  translateX: {
    from: 0,
    to: -Math.round(Dimensions.get('window').width * 0.3),
    min: 0,
    max: 1,
    type: 'linear',
    extrapolate: true,
    round: PixelRatio.get(),
  },
};
FlatFloatFromRight.animationInterpolators.out = buildStyleInterpolator(FlatFadeToTheLeft);

var CP = React.createClass({
  renderScene(route, nav) {
    StatusBarIOS.setHidden(false);
    switch(route.id) {
      case 'home':
        return <Home navigator={nav} />
      break;
      case 'bakersprofile':
        return <BakersProfile collection={route.collection} model={route.model} navigator={nav} />
      break;
      case 'bakersgalerie':
        return <PicturePopup onClose={route.onClose} imgURL={route.imgURL} navigator={nav} />
      break;
      case 'bakersmap':
        StatusBarIOS.setHidden(true);
        return <BakersMap onClose={route.onClose} model={route.model} collection={route.collection} navigator={nav} />
      break;
      case 'search':
        StatusBarIOS.setHidden(true);
        return <Search collection={route.collection} navigator={nav} />
      break;
      case 'demobaker':
        StatusBarIOS.setHidden(true);
        return <BakersDemo navigator={nav} />
      break;
      case 'createNewUserAccount':
        StatusBarIOS.setHidden(true);
        return <NewUserAccount navigator={nav} type={route.type} />
      break;
      
    }
  },
  configureScene() {
    return FlatFloatFromRight;
  },

  render() {
    return (
      <Navigator
        style={styles.navContainer}
        initialRoute={{id: 'home'}}
        configureScene={this.configureScene}
        renderScene={this.renderScene} />
    );
  }

});
AppRegistry.registerComponent('plaza', () => CP);