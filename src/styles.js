import {StyleSheet, Dimensions} from "react-native";

export default StyleSheet.create({
    container: {
        flex:1,
        flexDirection:'column',
        justifyContent:'flex-end',
    },
    scanScreenMessage:{
        fontSize:20,
        color: 'white',
        textAlign:'center',
        alignItems:'center',
        justifyContent:'center',

    },
    buttonText:{
        textAlign:'center',
        alignItems:'center',
        justifyContent:'center'

    },
    linkText:{
        color:'blue',
    }, 
    scanButton:{
        position:"absolute",
        bottom:10,
        left:125,
    }


});