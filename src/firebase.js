import firebase from 'firebase/app';

const firebaseConfig = {
    apiKey: "AIzaSyA-cwXgyniJWjQ5JU75V3cgf4_408XwCfo",
    authDomain: "cafein-d4561.firebaseapp.com",
    projectId: "cafein-d4561",
    storageBucket: "cafein-d4561.appspot.com",
    messagingSenderId: "680553235210",
    appId: "1:680553235210:web:5bccea0d7bf6d25e93f0f3"
  };

export const firebaseApp = firebase.initializeApp(firebaseConfig);
