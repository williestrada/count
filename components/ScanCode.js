//This is an example code to Scan QR code//
import React, {useState} from 'react';
//import react in our code.
import {
  Text,
  View,
  Linking,
  TouchableHighlight,
  PermissionsAndroid,
  Platform,
  StyleSheet,
} from 'react-native';

import {CameraKitCameraScreen} from 'react-native-camera-kit';

export default function ScanCode({setOtherCde}) {
  //variable to hold the qr value
  const [qrvalue, setQrValue] = useState('');
  const [opneScanner, setOpenScanner] = useState(true); //false

  onOpenlink = () => {
    //Function to open URL, If scanned
    Linking.openURL(qrvalue);
    //Linking used to open the URL in any browser that you have installed
  };
  onBarcodeScan = qrvalue => {
    //called after te successful scanning of QRCode/Barcode
    setQrValue(qrvalue);
    setOpenScanner(false);
    setOtherCde(qrvalue);
  };
  onOpneScanner = () => {
    //To Start Scanning
    if (Platform.OS === 'android') {
      async function requestCameraPermission() {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
            {
              title: 'Camera Scanner Permission',
              message: 'Camera Scanner needs access to your camera ',
            },
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            //If CAMERA Permission is granted
            setQrValue('');
            setOpenScanner(true);
            setOtherCde('');
          } else {
            alert('CAMERA permission denied');
          }
        } catch (err) {
          alert('Camera permission err', err);
          console.warn(err);
        }
      }
      //Calling the camera permission function
      requestCameraPermission();
    } else {
      setQrValue('');
      setOpenScanner(true);
      setOtherCde('');
    }
  };

  let displayModal;
  //If qrvalue is set then return this view
  if (!opneScanner) {
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>React Native Code Example</Text>
        <Text style={styles.simpleText}>
          {qrvalue ? 'Scanned Code: ' + qrvalue : ''}
        </Text>
        {qrvalue.includes('http') ? (
          <TouchableHighlight
            onPress={() => onOpenlink()}
            style={styles.button}>
            <Text style={{color: '#FFFFFF', fontSize: 12}}>Open Link</Text>
          </TouchableHighlight>
        ) : null}
        <TouchableHighlight
          onPress={() => onOpneScanner()}
          style={styles.button}>
          <Text style={{color: '#FFFFFF', fontSize: 12}}>Open Scanner</Text>
        </TouchableHighlight>
      </View>
    );
  }
  return (
    <View style={{flex: 1}}>
      <CameraKitCameraScreen
        showFrame={false}
        //Show/hide scan frame
        scanBarcode={true}
        //Can restrict for the QR Code only
        laserColor={'blue'}
        //Color can be of your choice
        frameColor={'yellow'}
        //If frame is visible then frame color
        colorForScannerFrame={'black'}
        //Scanner Frame color
        onReadCode={event => onBarcodeScan(event.nativeEvent.codeStringValue)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#2c3539',
    padding: 10,
    width: 300,
    marginTop: 16,
  },
  heading: {
    color: 'black',
    fontSize: 24,
    alignSelf: 'center',
    padding: 10,
    marginTop: 30,
  },
  simpleText: {
    color: 'black',
    fontSize: 20,
    alignSelf: 'center',
    padding: 10,
    marginTop: 16,
  },
});
