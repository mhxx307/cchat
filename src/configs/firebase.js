import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: 'AIzaSyADNbJAS0obqkPYpHd18i096UQ8DXThUW4',
    authDomain: 'cong-nghe-moi-firebase.firebaseapp.com',
    projectId: 'cong-nghe-moi-firebase',
    storageBucket: 'cong-nghe-moi-firebase.appspot.com',
    messagingSenderId: '773462491468',
    appId: '1:773462491468:web:4239a3d10e641326230fe9',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
