import { initializeApp } from "firebase/app";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const app = initializeApp({
  //  apiKey: "AIzaSyAF3bIMKaPnfUULyQnEtQbgeBc7-XfZv80",
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

  // apiKey: "AIzaSyBrUUxrvEmUl5KJ1DCoFxFDeuYVfKTIsww",
  // authDomain: "magic-post1.firebaseapp.com",
  // projectId: "magic-post1",
  // storageBucket: "magic-post1.appspot.com",
  // messagingSenderId: "318952366608",
  // appId: "1:318952366608:web:94a5c380dcac947e01a095"

  // apiKey: "AIzaSyBnBaKJk_zc01_XmgR5A_mjv5cKGWypY2I",
  // authDomain: "magic-post2.firebaseapp.com",
  // projectId: "magic-post2",
  // storageBucket: "magic-post2.appspot.com",
  // messagingSenderId: "746792341563",
  // appId: "1:746792341563:web:f3f3ede47e51bfa191cc1e"

  // apiKey: "AIzaSyBnBaKJk_zc01_XmgR5A_mjv5cKGWypY2I",
  // authDomain: "magic-post2.firebaseapp.com",
  // projectId: "magic-post2",
  // storageBucket: "magic-post2.appspot.com",
  // messagingSenderId: "746792341563",
  // appId: "1:746792341563:web:f3f3ede47e51bfa191cc1e"

  // apiKey: "AIzaSyCPZPPumFcXZ0CsWbWMAD1PIa_PfAv9yvY",
  // authDomain: "magic-post-pro.firebaseapp.com",
  // projectId: "magic-post-pro",
  // storageBucket: "magic-post-pro.appspot.com",
  // messagingSenderId: "709401592564",
  // appId: "1:709401592564:web:f79a05d0916ba0b58294a1"
  apiKey: "AIzaSyCH-TqqjjrgWJDTIkrb-M1NGPWphEGvKbM",
  authDomain: "test-76d97.firebaseapp.com",
  projectId: "test-76d97",
  storageBucket: "test-76d97.appspot.com",
  messagingSenderId: "986134292791",
  appId: "1:986134292791:web:eeba1c111f6e9f534392b2"

});

const fireDB = getFirestore(app);
const fireAuth = getAuth(app);

await setPersistence(fireAuth, browserLocalPersistence);

export { fireDB, fireAuth };