import React from 'react';
import {createAppContainer} from 'react-navigation';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import { Ionicons } from '@expo/vector-icons';  

import ScannerPage from '../pages/ScannerPage';
import Info from '../src/info';
import YourShopPage from '../pages/YourShopPage';



const BottomNavigator = createBottomTabNavigator({
        Info: Info,
        AddProduct: ScannerPage,
        YourShop: YourShopPage,
    },
    {
        defaultNavigationOptions: ({navigation}) => ({
            tabBarIcon: ({focused, horizontal, tintColor}) => {
                const {routeName} = navigation.state;
                let IconComponent = Ionicons;
                let iconName;
                if (routeName === 'Info'){
                    iconName = 'md-information-circle-outline';
                }
                else if (routeName === 'AddProduct'){
                    iconName = 'md-qr-scanner';
                }
                else if ((routeName) === 'YourShop'){
                    iconName = 'md-cart';
                }
                return <IconComponent name = {iconName} size = {25} color = {tintColor}/>;

            }
        }),
        tabBarOptions:{
            activeTintColor:'tomato',
            inactiveTintColor: 'gray'

        },
    },
    );
    
export default createAppContainer(BottomNavigator);
