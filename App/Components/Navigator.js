import React from 'react-native';
import Home from './App/Components/Home';
import BakersProfile from './App/Components/Bakersprofile';
import PicturePopup from './App/Components/Widgets/PicturePopup';
import BakersMap from './App/Components/Map';
import Search from './App/Components/Search';
import BakersDemo from './App/Components/Demo/DemoBaker';
import NewUserAccount from './App/Components/NewUser';
import Helpers from './App/Helpers';
import { box } from './../../Settings';
import PixelRatio from 'PixelRatio';
import buildStyleInterpolator from 'buildStyleInterpolator';

var {
  Navigator
} = React;



var buildStyleInterpolator = require('buildStyleInterpolator');
var FlatFloatFromRight = Object.assign({}, Navigator.SceneConfigs.FloatFromRight);
var FlatFadeToTheLeft = {
  transformTranslate: {
    from: {x: 0, y: 0, z: 0},
    to: {x: -Math.round(box.width * 0.3), y: 0, z: 0},
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
    to: -Math.round(box.width * 0.3),
    min: 0,
    max: 1,
    type: 'linear',
    extrapolate: true,
    round: PixelRatio.get(),
  },
};
FlatFloatFromRight.animationInterpolators.out = buildStyleInterpolator(FlatFadeToTheLeft);


export default class MainNavigator {
  constructor(props) {
    super(props);
  }

  renderScene(route, nav) {
    StatusBarIOS.setHidden(false);
    this.navigator = nav;

    switch(route.id) {
      case 'home':
        return <Home navigator={nav} />;
      case 'bakersprofile':
        return <BakersProfile editable={route.editable} collection={route.collection} model={route.model} navigator={nav} />;
      case 'bakersgalerie':
        return <PicturePopup onClose={route.onClose} imgURL={route.imgURL} navigator={nav} />;
      case 'bakersmap':
        StatusBarIOS.setHidden(true);
        return <BakersMap onClose={route.onClose} model={route.model} collection={route.collection} navigator={nav} />;
      case 'search':
        StatusBarIOS.setHidden(true);
        return <Search collection={route.collection} navigator={nav} />;
      case 'demobaker':
        StatusBarIOS.setHidden(true);
        return <BakersDemo navigator={nav} />;
      case 'createNewUserAccount':
        StatusBarIOS.setHidden(true);
        return <NewUserAccount navigator={nav} type={route.type} />;
    }
  }

  create() {
    this.nav = (
      <Navigator
      ref="navigator"
      style={styles.navContainer}
      initialRoute={{id: 'home' }}
      configureScene={()=> configureScene()}
      renderScene={this.renderScene} />
    );

    return this.nav
  }

  get() {
    return this.nav;
  }
}
