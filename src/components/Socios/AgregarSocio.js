import React, { useState } from "react";
import styled from "styled-components";
import Modal from "../Modal";
import { setDoc, doc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { register } from "../../firebase/firebase";

export default function AgregarSocioModal({ getSocios }) {
  const [estadoModal, setEstadoModal] = useState(false);
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [dni, setDni] = useState("");
  const [dob, setDob] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errores, setErrores] = useState({
    nombre: false,
    apellido: false,
    dni: false,
    dob: false,
    /*email: false,
    password: false,*/
  });

  const formatearNombre = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const handleAddSocio = async () => {
    const newErrors = {};
    let valid = true;
    const nombreRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;

    if (nombre.trim() === "") {
      newErrors.nombre = "El nombre es requerido";
      valid = false;
    }
    else if (!nombreRegex.test(nombre.trim())) {
      newErrors.nombre = "El nombre solo puede contener letras y espacios";
      valid = false;
    }
    if (apellido.trim() === "") {
      newErrors.apellido = "El apellido es requerido";
      valid = false;
    }
    else if (!nombreRegex.test(apellido.trim())) {
      newErrors.apellido = "El nombre solo puede contener letras y espacios";
      valid = false;
    }
    if (!/^\d{8}$/.test(dni) || !dni.trim()) {
      newErrors.dni = "El DNI debe tener 8 dígitos";
      valid = false;
    }

    let fecha = new Date(dob);
    let hoy = new Date();
    let edad = hoy.getFullYear() - fecha.getFullYear();
    let mes = hoy.getMonth() - fecha.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < fecha.getDate())) {
      edad--;
    }

    if (dob === "") {
      newErrors.dob = "La fecha de nacimiento es requerida";
      valid = false;
    }
    else if(edad < 18) {
      newErrors.dob = "El socio debe ser mayor de 18 años";
      valid = false;
    }

    /*if (!email.trim()) {
      newErrors.email = "El email es requerido";
      valid = false;
    }

    if (password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
      valid = false;
    }*/

    if(valid) {
      await registerAndAddSocio();
    }else {
      setErrores(newErrors);
    }
  };

  const handleInputChange = (e, field) => {
    const value = e.target.value;
    if (field === "nombre") {
      setNombre(value);
    } else if (field === "apellido") {
      setApellido(value);
    } else if (field === "dni") {
      setDni(value);
    }
    else if (field === "dob") {
      setDob(value);
    }
    /*else if (field === "email") {
      setEmail(value);
    }
    else if (field === "password") {
      setPassword(value);
    }*/
    
    setErrores({ ...errores, [field]: "" });
  };

  const registerAndAddSocio = async () => {
    try {
      /*const user = await register(email, password);*/

      await setDoc(doc(db, "socios"), {
        apellido: formatearNombre(apellido.trim()),
        nombre: formatearNombre(nombre.trim()),
        dni: parseInt(dni),
        dob: new Date(dob).toISOString(),
        activo: true,
      });

      await setDoc(doc(db, "usuarios"), {
        nombre: formatearNombre(nombre.trim()),
        rol: "user",
      });

      clearInput();
      getSocios();
      setEstadoModal(false);
    } catch (error) {
      console.error("Error al agregar socio: ", error);
    }
  };

  const clearInput = () => {
    setNombre("");
    setApellido("");
    setDni("");
    setDob("");
    /*setEmail("");
    setPassword("");*/
    setErrores({
      nombre: false,
      apellido: false,
      dni: false,
      dob: false,
      /*email: false,
      password: false,*/
    });
  };

  return (
    <div>
      <button
        className="ml-4 bg-green-800 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full"
        onClick={() => setEstadoModal(true)}
      >
        + Agregar Socio
      </button>
      <Modal
        estado={estadoModal}
        cambiarEstado={setEstadoModal}
        titulo="Agregar Socio"
        mostrarHeader={true}
        mostrarOverlay={true}
        posicionModal={"center"}
        padding={"20px"}
        mostrarContenedor={true}
      >
        <Contenido>
          {errores.nombre && <ErrorText>{errores.nombre}</ErrorText>}
          <Input
            placeholder="Nombre"
            required={true}
            onChange={(e) => handleInputChange(e, "nombre")}
            value={nombre}
            type="text"
            isError={!!errores.nombre}
          />
          {errores.apellido && <ErrorText>{errores.apellido}</ErrorText>}
          <Input
            placeholder="Apellido"
            required={true}
            onChange={(e) => handleInputChange(e, "apellido")}
            value={apellido}
            isError={!!errores.apellido}
          />
          {errores.dni && <ErrorText>{errores.dni}</ErrorText>}
          <Input
            placeholder="DNI"
            type="number"
            required={true}
            onChange={(e) => handleInputChange(e, "dni")}
            value={dni}
            isError={!!errores.dni}
          />
          {errores.dob && <ErrorText>{errores.dob}</ErrorText>}
          <Input
            placeholder="Fecha de Nacimiento"
            type="date"
            required={true}
            onChange={(e) => handleInputChange(e, "dob")}
            value={dob}
            isError={!!errores.dob}
          />
          {/*errores.email && <ErrorText>{errores.email}</ErrorText>}
          <Input
            placeholder="Email"
            type="email"
            required={true}
            onChange={(e) => handleInputChange(e, "email")}
            value={email}
            isError={!!errores.email}
          />
          {errores.password && <ErrorText>{errores.password}</ErrorText>}
          <Input
            placeholder="Contraseña"
            type="password"
            required={true}
            onChange={(e) => handleInputChange(e, "password")}
            value={password}
            isError={!!errores.password}
          />*/}
          <BotonAgregarSocio onClick={handleAddSocio}>Agregar Socio</BotonAgregarSocio>
        </Contenido>
      </Modal>
    </div>
  );
}

const Contenido = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  h1 {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 15px;
    color: #22843d;
  }
`;

const Input = styled.input`
  margin-bottom: 15px;
  padding: 10px;
  border: 1px solid ${({ isError }) => (isError ? "#f00" : "#ccc")};
  border-radius: 4px;
  width: 100%;
  font-size: 14px;
  transition: border-color 0.3s ease;
  &:focus {
    outline: none;
    border-color: ${({ isError }) => (isError ? "#f00" : "#22843d")};
  }
`;

const ErrorText = styled.p`
  color: #f00;
  font-size: 12px;
  margin-top: 5px;
`;

const BotonAgregarSocio = styled.button`
  margin-right: 10px;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  color: #fff;
  background-color: #2DAD50;
  cursor: pointer;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: #22843D;
  }
`;
