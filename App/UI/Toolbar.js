var React = require('react-native');
var DEFCSS = require('./../Styles/Default');

var {
  AppRegistry,
  StyleSheet,
  Image,
  Platform,
  TouchableHighlight,
  Text,
  View,
} = React;




module.exports = React.createClass({

  getInitialState() {
    return {
      collection: []
    };
  },

  openSearch() {
    this.props.navigator.push({
      id: 'search', 
      collection: this.props.collection
    });
  },
  openMenu() {

  },

  componentDidMount() {
    this.setState({
      collection: this.props.collection
    });
  },

  render() {
    var backBtn;
    if (this.props.showBackBtn) {
      backBtn = <TouchableHighlight onPress={this.props.onPress}><View  style={[ styles.height, styles.align, styles.btnLeft ]}><Image style={[styles.backBtn]} source={require('../../images/back_arrow.png')} /></View></TouchableHighlight>;
    }
    return (
      <View style={[styles.bar, DEFCSS.oDarkBg ]}>
        { backBtn }
        <Text style={[ DEFCSS.sansc, styles.align, styles.height, styles.title, DEFCSS.whiteColor ]}>{this.props.title.toUpperCase()}</Text>
        {
          ()=>{
            if (this.state.collection.length > 0) {
              return (
                  <TouchableHighlight onPress={ this.openSearch }>
                    <View style={[ styles.height, styles.align, styles.topBtns ]}>
                      <Image style={styles.btnSearch} source={require('../../images/search_icon.png')} />
                    </View>
                  </TouchableHighlight>
              );
            }
          }()
        }
        <TouchableHighlight onPress={ this.openMenu }>
          <View style={[ styles.height, styles.align, styles.topBtns ]}>
            <Image style={styles.btnMenu} source={require('../../images/hamb_icon.png')} />
          </View>
        </TouchableHighlight>
      </View>
    );
  }
});



var styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    height: 60,
    top: 0,
    paddingLeft: 5,
    paddingRight: 5,
    flexDirection: 'row',
    left: 0,
    right: 0,
    paddingTop: Platform.OS === 'ios' ? 20 : 0
  },
  height: {
    alignItems: 'center'
  },
  title:  {
    height: 27,
    fontSize: 20,
    flex: 2,
    alignSelf: 'center'
  },
  btnLeft: {
    justifyContent: 'flex-start',
    flexDirection: 'row',
    marginRight: 10, 
    top: Platform.OS === 'ios' ? 15 : 25
  },
  backBtn: {
    width: 10,
    height: 15
  },
  btnSearch: {
    width: 21,
    height: 20
  },
  btnMenu: {
    width: 21,
    height: 17
  },
  align: {
    justifyContent: 'center'
  },
  topBtns: {
    padding: 5 
  }
});