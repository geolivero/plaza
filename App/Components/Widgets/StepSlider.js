'user strict';

var React = require('react-native');
var DEFCSS = require('./../../Styles/Default');
var Helpers = require('./../../Helpers');
var Settings = require('./../../../Settings');
var { Icon, } = require('react-native-icons');


var {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableHighlight,
  TouchableOpacity,
  ScrollView
} = React;


module.exports = React.createClass({

  getInitialState() {

    return {
      current: 0,
      steps: this.props.children.length,
      totalWidth: this.props.children.length * Settings.box.width
    };
  },

  componentDidMount() {
    
  },

  onScroll(e) {
    var theEvent = e.nativeEvent;
    clearTimeout(this.timer);
    var perc = (theEvent.contentOffset.x / (this.state.totalWidth - Settings.box.width)) * 100;

    if (!this.first) {
      this.first = true;
      this.props.onStart();
    }


    this.timer = setTimeout(()=>{
      var current = Math.floor((this.state.steps * perc / 100));
      current = current > this.state.steps - 1 ? this.state.steps - 1 : current;
      current = current < 0 ? 0 : current;
      this.setState({
        current: current
      });
      this.props.onReady(current);
      this.first = false;
    }, 300);
  },

  changeBackground(index) {
    return {
      backgroundColor: this.state.current === index ?  Settings.colors.darkPink : Settings.colors.darkBrown
    }
  },

  render() { 
    return (
      <View style={[styles.container]}>
        <ScrollView
          automaticallyAdjustContentInsets={true}
          showsHorizontalScrollIndicator={false}
          pagingEnabled={true}
          horizontal={true}
          bounces={false}
          scrollEventThrottle={200}
          onScroll={this.onScroll}
          style={[styles.container]}>

          {this.props.children}
          
          

        </ScrollView>
        <View style={[styles.paginator]}>
          {()=>{
            return this.props.children.map((child, i)=> {
              return (
                <View key={'bull_' + i} 
                  style={[ styles.bullets, this.changeBackground(i) ]}></View>
              );
            });
          }()}
        </View>
        <View style={[styles.toolbar]}>

          <TouchableOpacity onPress={this.props.onBack}>  
            <Icon
              name='fontawesome|angle-left'
              size={22}
              color={Settings.colors.darkBrown}
              style={[styles.arrowBtnBack, styles.buttons]} />
          </TouchableOpacity>

          <TouchableOpacity onPress={this.props.onSkip}>  
            <View style={[styles.skipperBox]}>
                <Text style={[DEFCSS.sansc, styles.skipper]}>SKIP</Text>
                <Icon
                  name='fontawesome|angle-right'
                  size={22}
                  color={Settings.colors.darkBrown}
                  style={styles.arrowBtn, styles.buttons} />
            </View>
          </TouchableOpacity>

        </View>
        
      </View>
    );
  }
});

/*

<TouchableHighlight onPress={}></TouchableHighlight>

 */

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Settings.colors.lightPink,
    width: Settings.box.width,
    height: Settings.box.height
  },
  arrowBtn: {

  },
  toolbar: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    top: 0,
    height: 40,
    flex: 1
  },
  skipperBox: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    flex: 0.8
  },
  buttons: {
    width: 20,
    height: 40
  },
  arrowBtnBack: {
    flex: 0.2
  },
  skipper: {
    fontSize: 25,
    marginTop: 3
  },
  paginator:  {
    position: 'absolute',
    left: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    width: Settings.box.width,
    height: 40
  },
  bullets: {
    width: 10,
    height: 10,
    backgroundColor: Settings.colors.darkBrown,
    borderRadius: 5,
    marginLeft: 5,
    marginRight: 5
  }
});