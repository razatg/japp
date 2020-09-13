import React from 'react';
import {View, ActivityIndicator} from 'react-native';

import YourShop from '../src/yourShop';
import Amplitude from '../init/amplitideInit'


export default class ScannerScreen extends React.Component{

    constructor(props){
        super(props);

        this.state ={
            isFocused:false,
        };
    }

    componentDidMount(){
        this.focusListner = this.props.navigation.addListener('didFocus',
        () => this.setState({isFocused:true})
        );
        this.blurListner = this.props.navigation.addListener('willBlur',
        () => this.setState({isFocused:false})
        )
        Amplitude.logEvent('PageYourShopLoad');
    }

    componentWillUnmount(){
        this.focusListner.remove();
        this.blurListner.remove();
    }

    render(){

        if (!this.state.isFocused){
            return <View></View>
        }
        return (   
        <YourShop navigation={this.props.navigation}/>);    
    }

}