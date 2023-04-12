importScripts("https://www.gstatic.com/firebasejs/8.6.5/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.6.5/firebase-messaging.js");

firebase.initializeApp({
  apiKey: "AIzaSyDD8yQGg0eCkimf1NdLZjMMlD_LRi5niRY",
  authDomain: "rx-apps.firebaseapp.com",
  databaseURL: "https://rx-apps-default-rtdb.firebaseio.com",
  projectId: "rx-apps",
  storageBucket: "rx-apps.appspot.com",
  messagingSenderId: "842853573806",
  appId: "1:842853573806:web:a9f4f0d4f37d219784f93f",
  measurementId: "G-8MM2S2TJD3",
});

const messaging = firebase.messaging();
