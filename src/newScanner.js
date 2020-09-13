import * as React from 'react';
import { Text, View, StyleSheet, Button, Alert, ToastAndroid } from 'react-native';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import * as SecureStore from 'expo-secure-store'

import { BarCodeScanner } from 'expo-barcode-scanner';

import firebase from '../init/firebaseinit';
import Amplitude from '../init/amplitideInit';

export default class NewScanner extends React.Component {
  state = {
    hasCameraPermission: null,
    scanned: false,
    mobileNum:null,
    scannedItem:{
      type:null,
      data:null,
      timeStamp:null,
      isLive:false,
      cta:'',
      ctaURL:'',
      imgSrc:'',
      productTitle:'',
      productDesc:'',
      mrp:'',
      dealPrice:'',
    },
  };

  async componentDidMount() {
    this.getPermissionsAsync();
    SecureStore.getItemAsync('mobileLocal').then(
      (ssObj) => {
          if (ssObj != null){
              ssJSON = JSON.parse(ssObj);
              console.log('ssJSON', ssJSON);
              mobileNum = ssJSON.mobile;
              console.log(mobileNum);
              this.setState({mobile:mobileNum});
          }else {
              console.log('ssObj','isnull');
          }
        }).catch((error) => console.log(error));
  }

  getPermissionsAsync = async () => {
    const {status} = await Permissions.askAsync(Permissions.CAMERA);
        if (status !== "granted") {
          Alert.alert('Permission Needed', 'We need Camera Permission for the Bar Code Scanner to Work!', [
            { text: 'Ok', onPress: () => this.getPermissionsAsync() }
          ], { cancelable: false });
        };
        if ( status === "granted"){
            this.setState({ hasCameraPermission: status === "granted" });
        }
  }


  render() {
    const { hasCameraPermission, scanned } = this.state;

    if (hasCameraPermission === null) {
      return <Text>Requesting for camera permission</Text>;
    }
    if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    }
    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'flex-end',
        }}>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : this.handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
    

        {scanned && (
          <Button
            title={'Tap to Scan Again'}
            onPress={() => {this.setState({ scanned: false });
                            Amplitude.logEvent('ScanAgainClick');          
          }
          }
          />
        )}
      </View>
    );
  }

  handleBarCodeScanned = ({ type, data }) => {

    this.setState({scanned:true});
    if ((type === this.state.scannedItem.type && data === this.state.scannedItem.data) || data === null){
      console.log('same barcode again!');
      ToastAndroid.showWithGravity('You have alreday scanned this product. Please scan some other product!',
      ToastAndroid.SHORT,
      ToastAndroid.CENTER);
      Amplitude.logEvent('ScanRepeatMsg');
      return;
    }
    
    if(this.state.mobile != null){
      const scannedItem = {...this.state.scannedItem};
      scannedItem.type = type;
      scannedItem.data = data;
      scannedItem.timeStamp = Date.now();
      this.state.scannedItem = scannedItem;
      firebase.database().ref('shop').child(this.state.mobile).push(this.state.scannedItem).then(
          (data) => console.log('shop data pushed',data)
      ).catch((error) => console.log('shop data error',error));
      alert(`Bar code with data ${data} has been scanned!`);
      Amplitude.logEvent('ScanSuccessMsg');
  }else{
      Alert.alert('Info Needed',"Please fill in your Details first on the Info screen",[{
          text:'Ok', onPress: (navigator) => this.props.navigation.navigate('Info')}],{cancelable:false});
      Amplitude.logEvent('ScanFillDetailsMsg');    
        }
  };


}
