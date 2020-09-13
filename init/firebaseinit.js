import * as firebase from 'firebase';   

const cofig = {
    apiKey:"AIzaSyA-uigrGYz4GXAcj1536guoR-DEiEHLuV4",
    authDomain:"jiffstore-5b6c1.firebaseapp.com",
    databaseURL:"https://jiffstore-5b6c1.firebaseio.com/",
    projectId:"jiffstore-5b6c1",
    storageBucket:"jiffstore-5b6c1.appspot.com",
    messagingSenderId:"1042584987670",
    appID:"1:1042584987670:android:32d6ae91c3494f0074ad37",

}

firebase.initializeApp(cofig);

export default !firebase.apps.length ? firebase.initializeApp(config) : firebase.app();