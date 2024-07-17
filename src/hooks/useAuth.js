import { useState } from "react";
import * as firebase from "../firebase/firebase";
import { useNavigate } from "react-router-dom";

export default function useAuth() {
  const [user, setUser] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  async function login() {
    try {
      const u = await firebase.login(email, password);
      setUser(u);
      navigate("/app/home");
    } catch (error) {
      if (error.code === "auth/invalid-email") {
        alert("Email inválido");
      } else if (error.code === "auth/user-not-found") {
        alert("Usuario no encontrado");
      } else if (error.code === "auth/wrong-password") {
        alert("Contraseña incorrecta");
      } else if (error.code === "auth/too-many-requests") {
        alert("Demasiados intentos fallidos. Intente más tarde");
      } else {
        alert(error.message);
      }
    }
  }

  return {
    user,
    email,
    password,
    setEmail,
    setPassword,
    login,
  };
}
