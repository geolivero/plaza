import React from 'react-native';
import DEFCSS from './../../Styles/Default';
import { userToken } from './../../Helpers';
import { box, colors } from './../../../Settings';
import Models from './../../Models/User';
import { Icon, } from 'react-native-icons';
import PinkHeader from './../../UI/PinkHeaders';
import Arrow from './../../Widgets/Arrow';
import WhiteBtn from './../UI/WhiteBtn';

var {
  View,
  Text,
  Image,
  Easing,
  StyleSheet,
  TouchableHighlight,
  TextInput,
  Animated,
  AlertIOS,
  TouchableOpacity,
  CameraRoll,
  ScrollView
} = React;


export default class Dashboard extends React.Component {
  constructor(props) {
    super(props);


    this.state = {
      model: false
    };
  }

  componentDidMount() {
    var model = new Models.model(this.props.session.user);
    model.setURL(`user/${model.get('uid')}`);

    this.setState({
      model: model
    });
    model.fetch();
    model.on('change', (model)=> {
      this.setState({
        model: model
      });
      userToken.saveUser(this.props.session, model.attributes);
    });

    console.log(this.props.navigator);
  }

  getLogoImg() {
    if (this.state.model.get('field_logo').und) {
      console.log(this.state.model.get('field_logo').und[0]);
      return (
        <Image
          style={styles.logo}
          source={{ uri: this.state.model.get('field_logo').und[0].full_url }} />
      );
    }
  }


  onPress(e, label) {
      console.log(label);
    switch (label) {
      case 'MIJN PAGINA WIJZGIGEN':
          this.props.navigator.push({
            id: 'bakersprofile',
            editable: true,
            model: this.state.model,
            collection: this.props.collection
          });
        break;
      default:
        break;
    }
  }

  render() {
    if (this.state.model) {
      return (
        <View style={[styles.container]}>
          <View style={[styles.header]}>
            <Image
              style={styles.partyGarland}
              source={require('./../../../images/party_ornaments.png')} />
            {this.getLogoImg()}
            <Text style={[ DEFCSS.sansc, styles.mainTitle ]}>WELKOM</Text>
            <Text style={[ DEFCSS.sansc, styles.subTitle ]}>{this.state.model.get('name')}</Text>

          </View>
          <ScrollView
            scrollEventThrottle={2}
            contentContainerStyle={styles.scrollContainer}
            style={[ DEFCSS.contentContainer, DEFCSS.contentScroller ]}>
            <View style={[ styles.headerBox ]}/>
            <PinkHeader title={'BEGIN HIER'} arrow subTitle={'it\'s party time'} />

            <WhiteBtn
              label='MIJN PAGINA WIJZGIGEN'
              icon='pencil'
              onPress={(e, l)=> this.onPress(e, l)}/>

            <WhiteBtn
              label='BEKIJK MIJN BESTELLINGEN'
              icon='inbox'
              onPress={(e, l)=> this.onPress(e, l)}/>

            <WhiteBtn
              label='VRAAG STELLEN AAN DE COMMUNITY'
              icon='comments'
              onPress={(e, l)=> this.onPress(e, l)}/>

            <WhiteBtn
              label='MIJN PERSOONLIJKE GEGEVENS WIJZIGEN'
              icon='user'
              onPress={(e, l)=> this.onPress(e, l)}/>

          </ScrollView>
        </View>
      );
    } else {
      return (
        <View></View>
      );
    }

  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    width: box.width,
    backgroundColor: '#AAE7E4'
  },
  headerBox: {
    height: 300
  },
  scrollContainer: {
    paddingVertical: 0,
    position: 'absolute',
    width: box.width,
    flex: 1,
    left: 0,
    top: 0
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 10,
    borderRadius: 50,
    borderWidth: 5,
    borderColor: colors.white
  },
  mainTitle: {
    fontSize: 25,
    color: colors.darkBrown
  },
  subTitle: {
    fontSize: 15,
    color: colors.darkBrown
  },
  header: {
    paddingTop: 100,
    alignItems: 'center'
  },
  partyGarland: {
    position: 'absolute',
    left: 0,
    top: 0
  }
});
