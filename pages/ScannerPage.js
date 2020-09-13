import React from 'react';
import {View, ActivityIndicator} from 'react-native';

import NewScanner from '../src/newScanner';
import Amplitude from '../init/amplitideInit';


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
        Amplitude.logEvent('PageScannerLoad');
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
        <NewScanner navigation={this.props.navigation}/>);    
    }

}