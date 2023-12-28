import { initializeApp } from "firebase/app";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const app = initializeApp({
   // apiKey: "AIzaSyAF3bIMKaPnfUULyQnEtQbgeBc7-XfZv80",
  // authDomain: "upload-file-demo-d1beb.firebaseapp.com",
  // projectId: "upload-file-demo-d1beb",
  // storageBucket: "upload-file-demo-d1beb.appspot.com",
  // messagingSenderId: "456204958602",
  // appId: "1:456204958602:web:e1cb5712a2db746dcda673"

  // apiKey: "AIzaSyAF3bIMKaPnfUULyQnEtQbgeBc7-XfZv80",
  // authDomain: "upload-file-demo-d1beb.firebaseapp.com",
  // projectId: "upload-file-demo-d1beb",
  // storageBucket: "upload-file-demo-d1beb.appspot.com",
  // messagingSenderId: "456204958602",
  // appId: "1:456204958602:web:e1cb5712a2db746dcda673"

  // apiKey: "AIzaSyB4iOWmclb_p_YVm8QdUIO9o6RECiXYsvo",
  // authDomain: "magicpost-224ab.firebaseapp.com",
  // projectId: "magicpost-224ab",
  // storageBucket: "magicpost-224ab.appspot.com",
  // messagingSenderId: "439957681033",
  // appId: "1:439957681033:web:e686930222e6e3e9d0e758",
  // measurementId: "G-9VLC22ZD47"

  apiKey: "AIzaSyBrUUxrvEmUl5KJ1DCoFxFDeuYVfKTIsww",
  authDomain: "magic-post1.firebaseapp.com",
  projectId: "magic-post1",
  storageBucket: "magic-post1.appspot.com",
  messagingSenderId: "318952366608",
  appId: "1:318952366608:web:94a5c380dcac947e01a095"

});

const fireDB = getFirestore(app);
const fireAuth = getAuth(app);

await setPersistence(fireAuth, browserLocalPersistence);

export { fireDB, fireAuth };