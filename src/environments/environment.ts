// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: true,
  apiRoot: "https://www.rx-eg.com/api/v1",
  // apiUrl: "https://www.rx-eg.com/api/v1/",
  apiUrl: "https://rx-egy.com/api/v1/",
  firebaseConfig : {
    apiKey: "AIzaSyDD8yQGg0eCkimf1NdLZjMMlD_LRi5niRY",
    authDomain: "rx-apps.firebaseapp.com",
    databaseURL: "https://rx-apps-default-rtdb.firebaseio.com",
    projectId: "rx-apps",
    storageBucket: "rx-apps.appspot.com",
    messagingSenderId: "842853573806",
    appId: "1:842853573806:web:a9f4f0d4f37d219784f93f",
    measurementId: "G-8MM2S2TJD3"
  },
  // assetUrl : "https://www.rx-eg.com",
  assetUrl : "https://rx-egy.com",
  agora :{
    AppID:""
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
