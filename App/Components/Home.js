var React = require('react-native');
var DEFCSS = require('./../Styles/Default');
var Toolbar = require('./../UI/Toolbar');
var PinkHeader = require('./../UI/PinkHeaders');
var Dimensions = require('Dimensions');
var windowSize = Dimensions.get('window');
var Arrow = require('./../Widgets/Arrow');
var Settings = require('./../../Settings');
var Bakers = require('./../Models/Baker');
var Baker = require('./../Widgets/Baker');
var BakersProfile = require('./../Components/Bakersprofile');
var Links = require('./Widgets/Links');
var Helpers = require('./../../App/Helpers');
var Dashboard = require('./User/Dashboard');



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



var home = React.createClass({

  getInitialState: function () {
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return {
      mImgScale: 1,
      mImgTop: 0,
      mLogoTop: 0,
      fixedTop: false,
      bakerHeaderTop: 0,
      bakerHeaderY: 0,
      dataLoaded: false,
      userModel: false,
      loggedIn: false,
      dataSource: ds.cloneWithRows(['row 1', 'row 2']),
      collection: new Bakers.collection(),
      homeCollection: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2
      })
    };
  },
  onScroll: function (e) {
    if (Platform.OS === 'android') {
      return;
    }
    var scrollY = e.nativeEvent.contentOffset.y;
    //LayoutAnimation.spring();
    //console.log(scrollY >= this.state.bakerHeaderTop + 50);
    if (scrollY >= this.state.bakerHeaderTop - 50) {
      /*this.setState({
        fixedTop: true
      });

      this.setState({
        bakerHeaderY: this.state.bakerHeaderTop + scrollY
      });*/
    } else {
      this.setState({
        fixedTop: false
      });
    }
    if (scrollY > 0) {
      this.setState({
        mImgTop: (scrollY / 5) * -1,
        mLogoTop: (scrollY / 3) * -1
      });
    } else {
      this.setState({
        mImgScale: (((scrollY * -1) / 100) / 5) + 1
      });
    }
  },
  getBakerHeaderPos: function (ox, oy, width, height, px, py) {
    this.setState({
      bakerHeaderTop: oy,
      bakerHeaderY: oy
    });
  },
  componentDidMount: function () {
    if (Platform.OS === 'ios') {
        StatusBarIOS.setStyle('light-content');
    }

    //Helpers.userToken.destroy();
    //Helpers.userStep.destroy();

    this.fetchCollection();
    //To cancel the arrow animation
    //this.refs['theArrow'].stopAnimation();
    if (this.state.loggedIn) {
      setTimeout(() => {
        this.refs.bakerHeader.measure(this.getBakerHeaderPos);
      }, 1);
    }



    Helpers.userStep.get((STEP)=> {
      Helpers.userToken.get((SESSIONDATA)=> {
        console.log(STEP);
        if (STEP && parseInt(STEP) === 7 && SESSIONDATA) {
          this.setState({
            loggedIn: true,
            userModel: SESSIONDATA.user
          });
        }
      });
    });

  },

  setHomeCollection: function () {
    //this.state.homeCollection.cloneWithRows(this.state.collection.getUsersHome());
    this.setState({
      homeCollection: this.state.homeCollection.cloneWithRows(this.state.collection.getUsersHome())
    });
  },

  fetchCollection: function () {

    if (fetch && !this.state.collection.length) {
      console.log(this.state.collection.url);
      fetch(this.state.collection.url).then((response)=> {
        return response.json();
      }).then((jsonData) => {
        console.log('called json');
        this.state.collection.set(jsonData);
        //console.log(jsonData);
        console.log('json');
        if (!this.state.loggedIn) {
          this.setHomeCollection();
        }

        this.setState({
          dataLoaded: true
        });
      }).catch((error) => {
        //@todo: Make error field
        console.log(error);
      });
    } else {
      this.setHomeCollection();
    }
  },
  componentWillUnmount: function () {
    backboneReact.off(this);
  },
  renderBaker: function (model) {
    return (
      <Baker model={model} onPress={()=> this.openBakersProfile(model)} />
    );
  },

  openBakersProfile: function (model) {

    this.props.navigator.push({
      id: 'bakersprofile',
      model: model,
      collection: this.state.collection
    });
  },

  renderWhiteHeader: function (fixed) {
    return(
      <View ref={(!fixed ? 'bakerHeader' : '')}
        style={[
          styles.whiteHeader,
          DEFCSS.whiteBg,
          (fixed ? styles.whiteHeaderFixed : null ),
          (this.state.fixedTop ? {
            position: 'absolute',
            left: 0,
            top: this.state.bakerHeaderTop
          }: null)
        ]}>
        <Text style={[ DEFCSS.sansc, styles.btnTitle, DEFCSS.darkColor, DEFCSS.titleSize, { marginTop: 10 } ]}>{'ONZE FAVORITE BAKKERS'}</Text>
        <Text style={[ DEFCSS.sans, DEFCSS.darkColor, styles.btnSubTitle, DEFCSS.subTitleSize, { textAlign: 'center', marginLeft: 20, marginRight: 20} ]}>{'wij hebben alvast leuke bakkers geselecteerd'}</Text>
      </View>
    );
  },

  openDemoBaker() {
    this.props.navigator.push({
      id: 'demobaker'
    });
  },

  renderHomeNotLoggedIn() {
    return (
      <View style={[styles.container]}>
        <Image style={[styles.mainImage, { top: this.state.mImgTop, transform: [{ scale: this.state.mImgScale }] } ]}
          source={require('../../images/bgHome.png')} />
        <Image onClick={()=> alert('clicked')} style={[styles.logo, {
          transform: [
            { translateY: this.state.mLogoTop }
          ]
        }]} source={require('../../images/logo.png')} />


        <ScrollView scrollEventThrottle={2} onScroll={ this.onScroll } contentContainerStyle={styles.scrollContainer} style={[ DEFCSS.contentContainer, DEFCSS.contentScroller ]}>
          <View style={DEFCSS.bgSpacer} />
          <PinkHeader title={'BEGIN HIER'} subTitle={'start met ervaren'} />
          <Arrow ref={'theArrow'} />

          <TouchableHighlight onPress={this.openDemoBaker}>
            <View style={[styles.chooseBlock, DEFCSS.darkBg]}>
              <View style={[styles.circle, DEFCSS.brownBg, DEFCSS.floatCenter]}>
                <Image style={styles.icon_cake} source={require('../../images/icon_cake.png')} />
              </View>
              <Text style={[ DEFCSS.sansc, styles.btnTitle, DEFCSS.pinkColor ]}>{'IK WIL TAART'}</Text>
              <Text style={[ DEFCSS.sans, DEFCSS.pinkColor, styles.btnSubTitle ]}>{'zoek of vraag offertes by bakkers'}</Text>
            </View>
          </TouchableHighlight>

          <TouchableHighlight onPress={this.openDemoBaker}>
            <View style={[styles.chooseBlock, DEFCSS.brownBg]}>
              <View style={[styles.circle, DEFCSS.darkBg, DEFCSS.floatCenter]}>
                <Image source={require('../../images/icon_roller.png')} />
              </View>
              <Text style={[ DEFCSS.sansc, styles.btnTitle, DEFCSS.pinkColor ]}>{'IK BAK TAART'}</Text>
              <Text style={[ DEFCSS.sans, DEFCSS.pinkColor, styles.btnSubTitle ]}>{'Ik verkoop of toon mijn taarten'}</Text>
            </View>
          </TouchableHighlight>

          {this.renderWhiteHeader()}
          <ActivityIndicatorIOS
            hidesWhenStopped={true}
            animating={!this.state.dataLoaded}
            style={[styles.centering, DEFCSS.whiteBg, DEFCSS.indicator ]} />
          <ListView scrollEnabled={false} style={[DEFCSS.whiteBg]} dataSource={this.state.homeCollection} renderRow={this.renderBaker} />
        </ScrollView>
      </View>

    );
  },

  renderHomeLoggedIn() {
    return (
      <Dashboard model={this.state.userModel} />
    );
  },

  renderHome() {
    if (this.state.loggedIn) {
      return this.renderHomeLoggedIn();
    } else {
      return this.renderHomeNotLoggedIn();
    }
  },

  render: function() {
    return (
      <View contentContainerStyle={styles.scrollContainer} style={[ styles.container, DEFCSS.floatCenter]}>
        {this.renderHome()}
        <Toolbar title={''} collection={this.state.collection} navigator={this.props.navigator}/>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1
  },
  mainImage: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: windowSize.width,
    height: windowSize.height
  },
  logo: {
    width: 111,
    backgroundColor: 'transparent',
    resizeMode: 'contain',
    height: 122
  },
  scrollContainer: {
    paddingVertical: 0
  },
  chooseBlock: {
    height: 230,
    alignItems: 'center'
  },
  circle:  {
    width: 95,
    height: 95,
    borderRadius: 48,
    marginTop: 30,
    marginBottom: 10
  },
  btnTitle: {
    fontSize: 20
  },
  whiteHeader: {
    height: 120,
    alignItems: 'center'
  },
  rowBaker: {
    height: 355,
    alignItems: 'center'
  },
  rowBakerImg: {
    width: windowSize.width,
    height: 260
  },
  rowBakerLogo: {
    width: 76,
    height: 76,
    borderRadius: 38,
    position: 'absolute',
    borderColor: 'white',
    borderWidth: 4,
    left: (windowSize.width / 2) - (76 / 2),
    bottom: 70
  },
  whiteHeaderFixed: {
    position: 'absolute',
    width: windowSize.width,
    left: 0,
    top: 0,
    height: 160,
    paddingTop: 60
  },
  icon_cake: {
    width: 29,
    height: 32
  },
  rowBakerTxt: {
    height: 95,
    left: 0,
    width: windowSize.width,
    fontSize: 25,
    textAlign: 'center',
    paddingTop: 30
  }
});

module.exports = home;
