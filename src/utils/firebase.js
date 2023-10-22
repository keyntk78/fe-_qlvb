import { initializeApp } from 'firebase/app';
import { getMessaging } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: 'AIzaSyCNg_D9C13zOb-nEuSDAfGDyLWm-woCb3Y',
  authDomain: 'abc-aaac2.firebaseapp.com',
  databaseURL: 'https://abc-aaac2.firebaseio.com',
  projectId: 'abc-aaac2',
  storageBucket: 'abc-aaac2.appspot.com',
  messagingSenderId: '480029881881',
  appId: '1:480029881881:web:fd433741c767b912b2dc88',
  measurementId: 'G-5P19BXDDF1'
};

export const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);
