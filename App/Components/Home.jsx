

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
    setTimeout(() => {
      this.refs.bakerHeader.measure(this.getBakerHeaderPos);
    }, 1);

    /*Helpers.getToken((token)=> {
      fetch('http://cakesplaza/users/mnguser/1798', {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-CSRF-Token': 'l5pTqm-k3SmTvmCYfH0c_cRI8Xjqu8vz43sy2uzrWg4',
          'Authorization': 'SESSe9eab616218dc47e56c8af2fff93fe5d:xsjrzsSkDCG1bocfZBUmMXIv-c9pW4mTVQCdOhv_S9Q'
        },
        credentials: 'include',
        body: JSON.stringify({
          "name":"Cakery"
        })
      })
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {  
          return Promise.resolve(response)  
        } else {  
          console.log(response);
          return Promise.reject(new Error(JSON.parse(response._bodyText)))  
        }
      })
      .then((response) => response.json())
      .then((responseText) => {
        console.log(responseText);
      })
      .catch((error) => {
        console.log(error);
      });

    });
*/

   /* Helpers.getToken((token)=> {
      fetch('http://cakesplaza/users/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': token,
        },
        body: JSON.stringify({
          username: 'Cakeruker',
          password: 'test1234'
        })
      })
      .then((response) => response.json())
      .then((responseText) => {
        console.log(responseText);
      })
      .catch((error) => {
        console.log(error);
      });

    });
*/

    /// DELETE
    /// 
    /// 
    /// 
    /// 
    
    //Helpers.userToken.destroy();
    /*Helpers.getToken((token)=> {

      console.log();
      var data = {
        email: 'geo@geo.com', 
        pass:'passw'
      };
      data = JSON.stringify(data);
      fetch('http://cakesplaza/users/mnguser', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-CSRF-Token': token
        },
        body: data
      })
      .then((response) => response.json())
      .then((responseText) => {
        console.log(responseText);
      })
      .catch((error) => {
        console.log(error);
      });

    });*/

    /*console.log('imhere');

    fetch('http://cakesplaza/users/mnguser', {
      headers: { 
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-CSRF-Token': 'AaA-Ekzj_AeK_VT4oWMgdqcoiFEQuSWxRVDOIXRK9vg'
      },
      method: 'POST',
      body: JSON.stringify({
        mail: 'geo@geo.nl',
        pass: 'test1234'
      })
    })
    .then((response)=> {
      console.log(response);
      return response.json();
    })
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.log(error);
    });*/


    /// \DELETE
    
  },
  setHomeCollection: function () {
    //this.state.homeCollection.cloneWithRows(this.state.collection.getUsersHome());
    this.setState({
      homeCollection: this.state.homeCollection.cloneWithRows(this.state.collection.getUsersHome())
    })
  },
  fetchCollection: function () {
    if (fetch && !this.state.collection.length) {

      fetch(this.state.collection.url).then((response)=> {
        return response.json();
      }).then((jsonData) => {
        this.state.collection.set(jsonData);
        //console.log(jsonData);
        this.setHomeCollection();
        this.setState({
          dataLoaded: true
        })
      }).catch((error) => {
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

  render: function() {
    return (
      <View contentContainerStyle={styles.scrollContainer} style={[ styles.container, DEFCSS.floatCenter]}>
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
        <Toolbar title={''} collection={this.state.collection} navigator={this.props.navigator}/>
      </View>
    );
  }
});

module.exports = home;