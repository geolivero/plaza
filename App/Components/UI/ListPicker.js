import React from 'react-native';
import DEFCSS from './../../Styles/Default';
import Helpers from './../../Helpers';
import Settings from './../../../Settings';
import { Icon, } from 'react-native-icons';
import TypesModel from './../../Models/BakeTypes';
import LoaderWidget from './../../Widgets/Loaderbar';
import InvertibleScrollView from 'react-native-invertible-scroll-view';

var {
  View,
  Text,
  Image,
  Easing,
  StyleSheet,
  ListView,
  TouchableHighlight,
  TouchableWithoutFeedback,
  TextInput,
  LayoutAnimation,
  Animated,
  AlertIOS,
  TouchableOpacity,
  CameraRoll,
  ScrollView
} = React;


export default class ListPicker extends React.Component {
  constructor(props) {
    super(props);

    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    this.state = {
      types: [],
      currentValue: '',
      collection: [],
      isLoading: true,
      dataSource: ds.cloneWithRows(['row 1', 'row 2']),
      isError: false,
      curIndex: null
    };
  }

  componentDidMount() {
    TypesModel.collection.fetch({
      success: (collection)=> {
        console.log('fetch', collection);
        this.setState({
          collection: TypesModel.collection,
          isLoading: false,
          dataSource: this.state.dataSource.cloneWithRows(collection.models)
        });
      },
      error: (error, model)=> {
        console.log(error, model);
      }
    });
  }


  destroy(i) {
    
    this.state.types.splice(i, 1);

    this.setState({
      types: this.state.types
    });
  }

  save() {
    if (this.state.currentValue.length > 0 && this.state.types.indexOf(this.state.currentValue.toLowerCase()) < 0) {
      this.state.types.push(this.state.currentValue.toLowerCase());

      this.setState({
        types: this.state.types,
        currentValue: ''
      });
      this.props.model.set({
        caketypes: this.state.types,
        type: 'caketypes'
      });
    }
  }

  getList(name, i) {
    
    if (this.state.types.length > 0) {
      return(
        
        <View style={[styles.tagRow]} key={'par_' + i}>
          <TouchableOpacity onPress={()=> this.destroy(i)}>
            <Icon
              name='fontawesome|times'
              size={10}
              color={Settings.colors.white}
              style={[styles.closeBtn]} />
          </TouchableOpacity>
          <Text 
            style={[
              DEFCSS.sansc, styles.types
            ]}
            key={'tag_' + i}>{name}</Text>
        </View>
        
      );      
    }
    
  }

  addType(type) {
    this.setState({
      currentValue: type
    });
    this.save();
  }

  renderRow(type) {
    return(
      <TouchableOpacity onPress={()=> this.addType(type.get('name')) }>
      <View style={[styles.row]}>
        <Text>{type.get('name')}</Text>
      </View>
      </TouchableOpacity>
    );
  }


  render() {
    return(
      <View style={[styles.mainContainer]}>
        {()=>{
          if (this.state.types.length) {
            return(
              <InvertibleScrollView
                inverted
                automaticallyAdjustContentInsets={false}
                style={styles.scrollView}>
                <View style={[styles.container]}>
                  {this.state.types.map((item, i)=> this.getList(item, i) )}
                </View>
              </InvertibleScrollView>
            ); 
          }
        }()}
        
        <View style={[styles.searchRow]}>
          <TextInput style={[styles.field, DEFCSS.sansc]} 
            placeholder={'Zoek of maak een nieuw soort'}
            clearButtonMode={'always'}
            onChangeText={(text) => this.setState({
              currentValue: text,
              dataSource: this.state.dataSource.cloneWithRows(TypesModel.collection.search(text).models),
              isError: this.state.types.indexOf(text.toLowerCase()) > -1
            })}
            value={this.state.currentValue}/>
            <TouchableOpacity onPress={()=> { this.save(); }}>
              <Text style={[DEFCSS.sansc, styles.saveBtn]}>OPSLAAN</Text>
            </TouchableOpacity>
        </View>
        {()=> {
          if (this.state.isError) {
            return(
              <View style={[styles.messageError]}>
                <Icon
                    name='fontawesome|exclamation-triangle'
                    size={10}
                    color={Settings.colors.white}
                    style={[styles.errorIcon]} />
                <Text style={[DEFCSS.sansc, styles.errorTxt]}>De type bestaat al!</Text>
              </View>
            );
          }

        }()}
        {()=> {
          console.log('called');
          if (this.state.isLoading) {
            return(
              <LoaderWidget inBox={true} />
            );
          } else {
            if (this.state.collection.length && this.state.currentValue.length) {
              console.log('collection', this.state.collection);
              return(
                <ListView
                  style={styles.typeList}
                  dataSource={this.state.dataSource}
                  renderRow={this.renderRow.bind(this)} />
              );
            }
          }
        }()}
      </View>
    );
  }
}



var styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    borderTopWidth: 1,
    borderTopColor: Settings.colors.lightGray
  },
  messageError: {
    backgroundColor: Settings.colors.red,
    justifyContent: 'center',
    flexDirection: 'row',
    padding: 5
  },
  errorIcon: {
    width: 20,
    height: 20
  },
  scrollView: {
    height: 100,
    flex: 1
  },
  row: {
    flex: 1,
    justifyContent: 'center',
    padding: 10
  },
  errorTxt: {
    color: Settings.colors.white,
    paddingLeft: 5
  },
  saveBtn: {
    height: 40,
    width: 80,
    fontSize: 20,
    paddingTop: 4,
    backgroundColor: Settings.colors.darkPink,
    color: Settings.colors.white,
    textAlign: 'center'
  },
  closeBtn: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    backgroundColor: Settings.colors.darkBrown
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 3
  },
  searchRow: {
    height: 40,
    flex: 1,
    position: 'relative',
    backgroundColor: Settings.colors.lightPink,
    flexDirection: 'row'
  },
  field: {
    height: 40,
    width: Settings.box.width - 80,
    padding: 5
  },
  activeTag: {
    backgroundColor: Settings.colors.brown,
    paddingLeft: 3,
    paddingRight: 3,
    borderRadius: 2,
    justifyContent: 'center',
    color: Settings.colors.white
  },
  container: {
    flexDirection: 'row',
    flex: 1,
    flexWrap: 'wrap'
  },
  types: {
    color: Settings.colors.white,
    backgroundColor: Settings.colors.brown,
    textAlign: 'center',
    flexWrap: 'wrap',
    flexDirection: 'column',
    fontSize: 18,
    paddingLeft: 5,
    paddingRight: 5,
    height: 30
  }
});