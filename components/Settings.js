import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  Keyboard,
  Alert,
  Switch,
} from 'react-native';

import Header from './Header';
import UserContext from './UserContext';
//import {getSettings} from '../src/RetailAPI';

import Fontisto from 'react-native-vector-icons/Fontisto';
import MaterialCom from 'react-native-vector-icons/MaterialCommunityIcons';
import DeviceInfo from 'react-native-device-info';
import AsyncStorage from '@react-native-community/async-storage';
import DocumentPicker from 'react-native-document-picker';
//import {Calculator} from 'react-native-calculator';

export default function Settings({navigation}) {
  const [valLocation, setLocation] = useState('');
  const [valUserName, setUserName] = useState('');
  const [valMastFile, setMastFile] = useState('');
  const deviceId = DeviceInfo.getDeviceId();

  //reference to textinput fields
  const location = React.createRef();
  const username = React.createRef();
  const mastfile = React.createRef();

  const {clearData, setClearData} = useContext(UserContext);

  useEffect(() => {
    console.log('Rendering Settings component');
    getSettings();
  }, []);

  const toggleClearData = () => {
    setClearData(!clearData);
  };
  const getSettings = async () => {
    const aSettings = await AsyncStorage.getItem('SETUP');
    if (aSettings != null) {
      JSON.parse(aSettings).map(setup => {
        setLocation(setup.Location);
        setUserName(setup.UserName);
        setMastFile(setup.MastFile);
        let lClearData = setup.ClearDta == 'true' ? true : false;
        setClearData(lClearData);
      });
    }
  };

  const SingleFilePicker = async () => {
    try {
      const res = await DocumentPicker.pick({
        //options .allFiles .images .audio .pdf .plainText
        type: [DocumentPicker.types.allFiles],
      });
      setMastFile(res.name);
      //return file;
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        setMastFile(valMastFile);
        //return ''
      } else {
        Alert.alert('Unknown Error: ' + JSON.stringify(err));
        throw err;
      }
    }
  };

  const saveSettings = async () => {
    if (valLocation.length < 4 || valLocation == 'undefined') {
      alert('Store name must have minimum of 4 and maximum of 10 chars');
      location.current.focus();
      return;
    }
    if (valUserName.length < 4 || valUserName == 'undefined') {
      alert('User name must have minimum of 4 and maximum of 10 chars');
      username.current.focus();
      return;
    }
    if (valMastFile.length < 10 || valMastFile == 'undefined') {
    }
    await AsyncStorage.setItem(
      'SETUP',
      JSON.stringify([
        {
          Location: valLocation,
          UserName: valUserName,
          MastFile: valMastFile,
          ClearDta: clearData ? 'true' : 'false',
        },
      ]),
    )
      .then(
        alert(
          'Settings data is saved' +
            '\n\n' +
            'Exit and run Retail for changes to effect.',
        ),
      )
      .catch(err => alert(err));
    Keyboard.dismiss();
  };

  return (
    <>
      <Header
        navigation={navigation}
        title={'Settings'}
        iconName={'settings'}
      />
      <SafeAreaView style={styles.container}>
        <ImageBackground
          source={require('../images/abstract_dark_drops.png')}
          style={styles.imgBackground}
          imageStyle={styles.imgStyle}
        />
        <ScrollView style={styles.scrollView}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Text style={styles.text}>Store: </Text>
            <TextInput
              ref={location}
              style={{...styles.textInput, ...styles.textStore}}
              placeholder="store name..."
              autoCapitalize="characters"
              maxLength={20}
              onSubmitEditing={() => {
                username.current.focus();
              }}
              value={valLocation}
              onChangeText={val => setLocation(val)}
            />
          </View>
          <Text //Line
            style={styles.line}>
            {' '}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              paddingTop: 5,
              alignItems: 'center',
            }}>
            <Text style={styles.text}>User Name: </Text>
            <TextInput
              ref={username}
              style={{...styles.textInput, ...styles.textStore}}
              placeholder="user name..."
              autoCapitalize="characters"
              maxLength={20}
              onSubmitEditing={() => {
                mastfile.current.focus();
              }}
              value={valUserName}
              onChangeText={val => setUserName(val)}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              paddingTop: 5,
              alignItems: 'center',
            }}>
            <Text style={styles.text}>Device Id: </Text>
            <TextInput
              style={{...styles.textInput, ...styles.textStore}}
              showSoftInputOnFocus={false}
              onFocus={() => Keyboard.dismiss()}
              value={deviceId}
            />
          </View>
          <Text //Line
            style={styles.line}>
            {' '}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              paddingTop: 5,
              alignItems: 'center',
            }}>
            <Text style={styles.text}>Masterfile: </Text>
            <TextInput
              ref={mastfile}
              style={{...styles.textInput, ...styles.textMastFile}}
              placeholder="masterfile..."
              value={valMastFile}
              onChangeText={val => setMastFile(val)}
            />
            <MaterialCom.Button
              style={{
                color: 'white',
                borderWidth: 1,
                borderColor: 'white',
                borderRadius: 8,
                paddingLeft: 5,
                marginLeft: 0,
                //                width: 100,
              }}
              size={18}
              backgroundColor="#333"
              onPress={() => {
                SingleFilePicker();
              }}
              name={Platform.OS === 'android' ? 'json' : 'json'}>
              <Text
                style={{
                  color: 'white',
                  fontFamily: 'Arial',
                  paddingLeft: 0,
                  fontSize: 12,
                }}>
                json
              </Text>
            </MaterialCom.Button>
          </View>
          <Text //Line
            style={styles.line}>
            {' '}
          </Text>

          <View
            style={{
              flexDirection: 'row',
              paddingTop: 5,
              alignItems: 'center',
            }}>
            <View style={{flexDirection: 'column'}}>
              <Text style={styles.longText}>Delete data on Export:</Text>
              {/* <Text
                style={{
                  position: 'absolute',
                  marginLeft: 5,
                  marginBottom: 2,
                  height: 12,
                  width: 12,
                  borderRadius: 12,
                  alignSelf: 'flex-end',
                  backgroundColor: clearData
                    ? 'rgba(300,0,0,.5)'
                    : 'rgba(0,200,0,.5)',
                }}>
                {''}
              </Text> */}
            </View>
            <Text
              onPress={toggleClearData}
              style={{
                paddingLeft: 8,
                color: 'white',
                fontStyle: 'italic',
                fontFamily: 'serif',
              }}>
              No
            </Text>
            <Switch
              trackColor={{false: '#767577', true: '#767577'}}
              thumbColor={clearData ? 'red' : 'lawngreen'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleClearData}
              value={clearData}
              style={{
                //paddingLeft: 10,
                padding: 5,
                transform: [{scaleX: 1}, {scaleY: 1}],
              }}
            />
            <Text
              onPress={toggleClearData}
              style={{
                paddingLeft: 8,
                color: 'white',
                fontStyle: 'italic',
                fontFamily: 'serif',
              }}>
              Yes
            </Text>
          </View>

          <Text //Line
            style={styles.line}>
            {' '}
          </Text>

          {/* <Text style={{color: 'red'}}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </Text> */}
        </ScrollView>
        <View style={styles.bottomMenu}>
          <Fontisto.Button
            style={{color: 'white'}}
            size={20}
            backgroundColor="#00000000"
            onPress={() => {
              saveSettings();
            }}
            name={Platform.OS === 'android' ? 'save' : 'save'}>
            <Text
              style={{
                color: 'white',
                fontFamily: 'Arial',
                fontSize: 12,
              }}>
              Save
            </Text>
          </Fontisto.Button>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imgBackground: {
    width: '100%',
    height: '100%',
    alignSelf: 'center',
    backgroundColor: '#333',
    position: 'absolute', // covers the whole SafeAreaView
  },
  imgStyle: {
    resizeMode: 'stretch',
    opacity: 0.4,
  },
  scrollView: {
    backgroundColor: '#00000000',
    backgroundColor: 'rgba(0,0,0,.4)',
    //    marginHorizontal: 10,
    padding: 10,
  },
  textItem: {
    fontSize: 12,
    color: 'white',
  },
  textStore: {
    width: 150,
  },
  textMastFile: {
    marginRight: 10,
    width: 170,
  },
  textInput: {
    backgroundColor: 'rgba(250,250,250,.7)',
    padding: 10,
    fontSize: 12,
    borderWidth: 0.5,
    borderRadius: 8,
    height: 40, //TextBox height
  },

  line: {
    width: '100%',
    marginTop: 10,
    marginBottom: 0,
    //backgroundColor: 'blue',
    borderTopColor: 'rgba(250,250,250,.5)',
    height: 10,
    borderTopWidth: 1,
  },

  text: {
    fontSize: 14,
    color: 'white',
    width: 90,
  },
  longText: {
    fontSize: 14,
    color: 'white',
    paddingRight: 10,
  },

  bottomMenu: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    padding: 2,
    margin: 5,
    marginLeft: 0,
    borderWidth: 0.8,
    borderColor: 'white',
    backgroundColor: '#333',
  },
});
