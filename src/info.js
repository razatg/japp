import React from 'react';
import {Alert} from 'react-native';
import { Container, Header, Content, Form, Item, Input, Picker, Card, Text, CardItem, Button, Left,Title, Body } from 'native-base';

import {AppLoading, Linking} from 'expo';
import * as SecureStore from 'expo-secure-store';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons'; 

import firebase from '../init/firebaseinit';
import Amplitude from '../init/amplitideInit';
import styles from './styles';


export default class Info extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            entity:{
                mobile:'',
                shopName:'',
                shopAddress:'',
                city:'',
                pinCode:'',
                webURL:'',
                appURL:'',
                category:'',
            },
            isReady:false,
            isFormSubmited:false,
            featuredShop:[]
        }
    }

   getFeaturedShop(){
     firebase.database().ref('/featuredShop').once('value', (snapshot) =>{
       if (snapshot.val != null){
         featuredShopDetails = snapshot.val();
         this.setState({featuredShop:featuredShopDetails});
       }
     }

     );
   }


    async componentDidMount(){
        await Font.loadAsync({
          'Roboto': require('../node_modules/native-base/Fonts/Roboto.ttf'),
          'Roboto_medium': require('../node_modules/native-base/Fonts/Roboto_medium.ttf'),
          ...Ionicons.font,
          });
          this.setState({isReady:true});
          SecureStore.getItemAsync('mobileLocal').then(
            (ssObj) => {
                if (ssObj != null){
                    ssJSON = JSON.parse(ssObj);
                    //console.log('ssJSON', ssJSON);
                    entityExists = ssJSON.entityExists;
                    if (entityExists){
                        this.setState({isFormSubmited:true});
                    }
                }
                
                else {
                    console.log('ssObj','isnull');
                }
            }
        ).catch((error) => console.log(error));
        this.getFeaturedShop();
        Amplitude.logEvent('PageInfoLoad');
    }


    posEnitityDetails(entity){
        if(this.state.entity != null && this.state.entity.mobile != '' && this.state.entity.mobile.length===10){
            firebase.database().ref('entity').child(this.state.entity.mobile).push(this.state.entity)
              .then((data) => console.log(data))
              .catch((error) => console.log(error));
              this.setState({isFormSubmited:true});
              mobileNum = this.state.entity.mobile;
              SecureStore.setItemAsync('mobileLocal', JSON.stringify({mobile:mobileNum, entityExists:true}));
              Amplitude.setUserId(mobileNum);
              Amplitude.logEvent('InfoButtonSubmit-Success');
            
        }else{
            Alert.alert(
                'Oops !',
                'There seems to be an issue with your mobile number. Please try again',[
                 {text: 'OK', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},],
                { cancelable: false });
                Amplitude.logEvent('InfoButtonSubmit-Issue');
        }
        

    }



    render() {
        
        if (!this.state.isReady){
            return  <AppLoading/>;
        }
        return (
            <Container>
                <Header >
                <Body>
                  <Title>Jiffy: The JiffShop Builder</Title>
                </Body>
                
                </Header>
                <Content enableOnAndroid>
                {this.state.isFormSubmited ?
                  <Card>
                      <CardItem header bordered>
                        <Left>
                          <Ionicons name = 'md-cart' size = {25}/>
                          <Text>Your Online Shop has been Created</Text>
                        </Left>
                    
                      </CardItem>
                      <CardItem>
                        <Text>Start Scanning the Barcodes of your products and with just the Barcodes
                         we will add them to your shop with complete details including an image by Magic :)</Text>
                      </CardItem>
                  </Card>
                  :
                  <Card>
                <CardItem header bordered>
                    <Left>
                      <Ionicons name = 'md-information-circle-outline' size = {25}/>
                      <Text>Enter Your Shop Details</Text>
                    </Left>
                </CardItem>
                <Form>
                    <Item inlineLabel>
                    <Input placeholder="Mobile Number" onChangeText={(mobile) => this.state.entity.mobile=mobile} />
                    </Item>
                    <Item inlineLabel >
                    <Input placeholder="Shop Name" onChangeText={(shopName) => this.state.entity.shopName=shopName} />
                    </Item>
                    <Item inlineLabel>
                    <Input placeholder="Address" onChangeText={(shopAddress) => this.state.entity.shopAddress=shopAddress}/>
                    </Item>
                    <Item inlineLabel>
                    <Input placeholder="City" onChangeText={(city) => this.state.entity.city=city}/>
                    </Item>
                    <Item inlineLabel last>
                    <Input placeholder="Pin/Zip Code" onChangeText={(pinCode) => this.state.entity.pinCode=pinCode} />
                    </Item>
                    <Button info
                           style={styles.buttonText}
                           onPress = {()=> {
                               this.posEnitityDetails(this.state.entity);
                               }
                               }>
                            <Text >Submit</Text>
                           </Button>
                    
                    {/* <Item picker>
                    <Picker mode="dropdown" placeholder="Select your Shop Category">
                        <Picker.Item label="Groccery" value="groc"/>
                        <Picker.Item label="Stationary" value="stat" />
                        <Picker.Item label="Durables" value="dura" />
                    </Picker>>
                    </Item> */}
                </Form>
                </Card>
                  
                  }
                  <Card>
                    <CardItem header bordered>
                    <Left>
                      <Ionicons name = 'md-cart' size = {25}/>
                      <Text>Featured Shop</Text>
                    </Left>
                    </CardItem>
                    <CardItem>
                    <Text>Check out one of our Featured Shop, <Text style={styles.linkText}
                             onPress={() => {Linking.openURL(this.state.featuredShop.shopUrl);
                                              Amplitude.logEvent('InfoFeaturedShopClick');
                             }}>{this.state.featuredShop.shopName}</Text>
                             . Just scan bar code/QR of the products and get your Shop Online in a Jiffy!</Text>
                    </CardItem>
                  </Card>
                  <Card>
                    <CardItem header bordered>
                    <Left>
                      <Ionicons name = 'md-help-circle-outline' size = {25}/>
                      <Text>Contact us</Text>
                    </Left>
                    </CardItem>
                    <CardItem>
                    <Text>Please contact us here on <Text style={styles.linkText}
                             onPress={() => {Linking.openURL('https://wa.me/919810329329/?text=Hi!%20Have%20something%20on%20the%20Jiffy%20App');
                                              Amplitude.logEvent('InfoHelpClick');
                             }}>WhatsApp </Text>
                              for any issues or suggestions.</Text>
                    </CardItem>
                  </Card>
                
                </Content>
            </Container>
            );
    }
}