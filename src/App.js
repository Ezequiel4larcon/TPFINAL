import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Login from "./pages/Login";
import Layout from "./components/Layout";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "./firebase/firebase"; 

export default function App() {
  const [userData, setUserData] = useState({ nombre: "", rol: "", uid: "" });

  useEffect(() => {
    const fetchUserData = async (uid) => {
      const userDoc = doc(db, "usuarios", uid);
      const userSnapshot = await getDoc(userDoc);
      if (userSnapshot.exists()) {
        setUserData(
          {
            nombre: userSnapshot.data().nombre,
            rol: userSnapshot.data().rol,
            uid: uid,
          }
        );
      }
      console.log(userData);
    };

    onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserData(user.uid);
      }
    });
  }, []);

  return (
    <div className="h-screen select-none">
      <Routes>
        <Route path="*" element={<Navigate to="/"/>} />
        <Route path="/" element={<Login />} />
        <Route path="/app/*" element={<Layout user={userData}/>} />
      </Routes>
    </div>
  );
}
