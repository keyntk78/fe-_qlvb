importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js');

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

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// messaging.onBackgroundMessage((payload) => {
//   console.log('[firebase-messaging-sw.js] Received background message ', payload);
//   const notificationTitle = payload.notification.title;
//   const notificationOptions = {
//     body: payload.notification.body,
//     icon: payload.notification.image
//   };

//   self.registration.showNotification(notificationTitle, notificationOptions);
// });
