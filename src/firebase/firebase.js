import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore } from "firebase/firestore"

export const firebaseConfig = {
  apiKey: "AIzaSyC8OKNBWRfv1kQhobnOdtES4VmLzgj--l0",
  authDomain: "tp-final-prog3.firebaseapp.com",
  databaseURL: "https://tp-final-prog3-default-rtdb.firebaseio.com",
  projectId: "tp-final-prog3",
  storageBucket: "tp-final-prog3.appspot.com",
  messagingSenderId: "253341748100",
  appId: "1:253341748100:web:1b38b1c832a8a0e0a66bd1",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);


export async function login(email, password) {
  const userCredentials = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );
  return userCredentials.user;
}

export async function register(email, password) {
  const userCredentials = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  return userCredentials.user;
}

export const logout = async (navigate) => {
  const auth = getAuth(app);
  try {
    await signOut(auth);
    console.log("Deslogueo exitoso");
    navigate("/login");
  } catch (error) {
    console.error("Error al desloguearse:", error);
  }
};