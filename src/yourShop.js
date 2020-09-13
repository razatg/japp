import React from 'react';
import {View, ActivityIndicator, Linking} from 'react-native';
import * as SecureStore from 'expo-secure-store'

import { Container, Header, Content, Card, Text, CardItem, Left,Title, Body } from 'native-base';
import { Ionicons } from '@expo/vector-icons'; 
import { AppLoading } from 'expo';


import firebase from '../init/firebaseinit';
import Amplitude from '../init/amplitideInit';
import styles from '../src/styles'



export default class YourShop extends React.Component{

    constructor(props){
        super(props);
        this.state ={
            enitityExists:false,
            mobileNum:null,
            entityDetails:[],
            loading:"flex",
            isReady:false,
        }
    }

    componentDidMount(){
        SecureStore.getItemAsync('mobileLocal').then(
            (ssObj) => {
                if(ssObj != null){
                    ssJSON = JSON.parse(ssObj);
                    
                    this.setState({
                        enitityExists:ssJSON.entityExists,
                        mobileNum:ssJSON.mobile,
                    });
                    this.getEntityDetails();
                    this.setState({isReady:true});
                    console.log(this.state.mobileNum);
                }
            }
        ).catch((error) => console.log(error));
    }

    getEntityDetails(){

        firebase.database().ref('entity/'+this.state.mobileNum).once('value', (snapshot) =>{
            if(snapshot.val() != ""){
                entityDetails = snapshot.val();
                const key = Object.keys(entityDetails);
                this.setState({entityDetails:entityDetails[key[0]], loading:"none"});
                //console.log(this.state.entityDetails);

            }
           
        });

    }

    render(){
        
        if(this.state.enitityExists){
            return (
                <Container>
                    <View style={{display:this.state.loading, width:'100%', height: '100%', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' }}>
                        <ActivityIndicator
                            animating = {true}
                            color = "blue"
                            size = "large"
                        />
                    </View>
                    <Header >
                        <Body>
                        <Title>Jiffy: The JiffShop Builder</Title>
                        </Body>
                    </Header>
                    <Content>
                    {this.state.entityDetails.webURL 
                    ?
                    <Card>
                        <CardItem header bordered>
                        <Left>
                          <Ionicons name = 'md-cart' size = {25}/>
                          <Text>Your Online Shop Details</Text>
                        </Left>
                        </CardItem>
                        <CardItem>
                            <Text>More Shares = More Orders. Share here: <Text style={styles.linkText} onPress ={() => {Linking.openURL('https://wa.me/?text=Here%20I%20come%202020.%20I%20am%20online%20at%3A%20'+this.state.entityDetails.webURL);
                                                                                                                                       Amplitude.logEvent('ShopUrlClicked');                                                          
                        }}
                            > WhatsApp Now!</Text>.</Text>
                        </CardItem>
                    </Card>
                    :
                    <Card>
                        <CardItem header bordered>
                        <Left>
                          <Ionicons name = 'md-cart' size = {25}/>
                          <Text>Your Online Shop Details</Text>
                        </Left>
                        </CardItem>
                        <CardItem>
                            <Text>Congratulations! We have all the details we need. Sit back and relax 🍭 Your shop is being created. </Text>
                        </CardItem>
                    </Card>
                    
                      
                     }
                    
                 
    
                     
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
                                            Amplitude.logEvent('ShopHelpClicked');
                             }}>WhatsApp </Text>
                              for any issues or suggestions.</Text>
                        </CardItem>
                    </Card>
                  </Content>
                </Container>
                   ); 
            
        }else {
           return (
            <Container>
            <Header >
                <Body>
                <Title>Jiffy: The JiffShop Builder</Title>
                </Body>
            </Header>
            <Content>
                <Card>
                    <CardItem header bordered>
                    <Left>
                      <Ionicons name = 'md-information-circle-outline' size = {25}/>
                      <Text>Your Online Shop Details</Text>
                    </Left>
                    </CardItem>
                    <CardItem>
                        <Text>Please fill in the Info of your Shop and Scan Bardcodes of your products for your shop Details to show here.</Text>
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
                             onPress={() => {Linking.openURL('https://wa.me/919810329329/?text=Hi!%20Have%20something%20on%20the%20Jiffy%20App')}}>WhatsApp </Text>
                              for any issues or suggestions.</Text>
                    </CardItem>
                </Card>
            </Content>
        </Container>
           );
        }
        
    }
}