'user strict';

var React = require('react-native');
var DEFCSS = require('./../../Styles/Default');
var Helpers = require('./../../Helpers');
var Settings = require('./../../../Settings');
var { Icon, } = require('react-native-icons');
var StepSlider = require('./../Widgets/StepSlider');
var AnImg = require('./../Widgets/AnimImage');

var {
  View,
  Text,
  Image,
  Easing,
  StyleSheet,
  TouchableHighlight,
  Animated,
  TouchableOpacity,
  ScrollView
} = React;


module.exports = React.createClass({

  getInitialState: function () {
    return {
      scaleEl: new Animated.Value(0.01),
      stopped: false,
      currentSlide: 'slideImage_1',
      index: 0,
      opacity: 0
    };
  },

  onSlideReady(index) {
    var slide = 'slideImage_' + (index + 1);
    this.setState({
      currentSlide: slide
    });
    this.refs[slide].start();
  },

  onStart() {
    this.refs[this.state.currentSlide].stop();
  },

  componentDidMount: function () {
    this.refs[this.state.currentSlide].start();
  },

  getCircleAnim(index) {
    console.log(this.state.index, index);
    if (this.state.index === index) {
      return StyleSheet.create({
        avatar: {
          transform: [{
            scale: this.state.scaleEl
          }]
        }
      });
    } else {
      return {};
    }
  },

  onSkip() {
    this.props.navigator.push({
      id: 'createNewUserAccount',
      type: 'baker'
    });
  },

  onBack() {
    this.props.navigator.pop();
  },

  render() {
    

    return (
      <StepSlider onStart={this.onStart} onSkip={this.onSkip} onBack={this.onBack} onReady={this.onSlideReady}>
        <View style={[styles.container]}>
           <View style={[styles.panel]}>
            <AnImg ref={'slideImage_1'} image={require('../../../images/baker_slide_1.png')}/>
            <Text style={[DEFCSS.sansc, styles.titleText]}>SOCIAL PLEK VOOR JOUW</Text>
            <Text style={[DEFCSS.sans, styles.subText]}>verkoop ervaar, laat ervaren</Text>
           </View>
        </View>
        <View style={[styles.container]}>
           <View style={[styles.panel]}>
            <AnImg ref={'slideImage_2'} image={require('../../../images/baker_slide_2.png')}/>
            <Text style={[DEFCSS.sansc, styles.titleText]}>JE KAN BEST VEEL DOEN ALS
BAKKER BIJ CAKESPLAZA</Text>
            <Text style={[DEFCSS.sans, styles.subText]}>Toon al je creatieve baksel. Deel jouw baksels laat iedereen zien wat je kan.
Reageren op offertes…</Text>
           </View>
        </View>
        <View style={[styles.container]}>
           <View style={[styles.panel]}>
            <AnImg ref={'slideImage_3'} image={require('../../../images/baker_slide_3.png')}/>
            <Text style={[DEFCSS.sansc, styles.titleText]}>VUL ALLES IN</Text>
            <Text style={[DEFCSS.sans, styles.subText]}>Een goed gevuld account straalt vertrouwen. Zo maak je meer kans om te slagen bij Cakesplaza</Text>
           </View>
        </View>
      </StepSlider>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    backgroundColor: Settings.colors.lightPink,
    width: Settings.box.width,
    height: Settings.box.height,
    alignItems: 'center',
    justifyContent: 'center'
  },
  titleText: {
    color: Settings.colors.darkBrown,
    fontSize: 25,
    textAlign: 'center'
  },
  subText: {
    textAlign: 'center',
    color: Settings.colors.darkerPink
  },
  panel: {
    width: 220,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column'
  }
});
