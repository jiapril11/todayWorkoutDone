import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  updateProfile,
  signOut,
} from "firebase/auth";
import {
  addDoc,
  collection,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FB_API_KEY,
  authDomain: process.env.REACT_APP_FB_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export const signUpWithFB = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
  }
};

export const updateUserProfile = async (displayName, photoURL) => {
  try {
    await updateProfile(auth.currentUser, {
      displayName,
      photoURL,
    });
  } catch (err) {}
};

export const saveUserInfo = async (userInfo) => {
  const userData = { ...userInfo };
  const collectionRef = collection(db, "users");
  await addDoc(collectionRef, userData);
};

export const signInWithFB = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
  }
};
export const watchAuthStateChange = (callback) => {
  onAuthStateChanged(auth, (user) => {
    callback(user);
  });
};

export const signOutWithFB = async () => {
  await signOut(auth);
};
