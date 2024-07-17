import React from "react";
import styled from "styled-components";
import Modal from "../Modal";
import { useState } from "react";
import { db } from "../../firebase/firebase";
import { collection, addDoc } from "firebase/firestore";
import SeleccionarCobro from "../Planes/SeleccionarCobro";
import { Plus } from "feather-icons-react";

export default function AgregarAdherente(props) {
  const [estadoModal, setEstadoModal] = useState(false);
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [dni, setDni] = useState("");
  const [dob, setDob] = useState("");
  const [idPlan, setIdPlan] = useState("");
  const [errores, setErrores] = useState({
    nombre: false,
    apellido: false,
    dni: false,
    dob: false,
  });

  const clearInput = () => {
    setApellido("");
    setNombre("");
    setDni("");
    setDob("");
    setIdPlan("");
  };

  const addAdherente = async () => {
    const obj = { nombre, apellido, dni, dob, idPlan };
    const intSocio = props.value;

    let nombreFormateado = capitalizarPrimeraLetra(nombre);
    let apellidoFormateado = capitalizarPrimeraLetra(apellido);

    const dbRef = await addDoc(collection(db, "adherentes"), {
      nombre: nombreFormateado,
      apellido: apellidoFormateado,
      dni: obj.dni,
      dob: obj.dob,
      activo: true,
      idSocio: intSocio,
      idPlan: obj.idPlan,
    });
    console.log(dbRef.id);
    clearInput();
    setEstadoModal(false);
  };

  const traerId = (id) => {
    setIdPlan(id);
  };

  const capitalizarPrimeraLetra = (cadena) => {
    return cadena.charAt(0).toUpperCase() + cadena.slice(1).toLowerCase();
  };

  const handleAddAdherente = () => {
    let valid = true;
    const newErrors = {};
    const nombreRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;

    if (!nombre.trim()) {
      newErrors.nombre = "El nombre es requerido";
      valid = false;
    }
    else if (!nombreRegex.test(nombre.trim())) {
      newErrors.nombre = "El nombre solo puede contener letras y espacios";
      valid = false;
    }

    if (!apellido.trim()) {
      newErrors.apellido = "El apellido es requerida";
      valid = false;
    }
    else if (!nombreRegex.test(apellido.trim())) {
      newErrors.apellido = "El nombre solo puede contener letras y espacios";
      valid = false;
    }

    if (!/^\d{8}$/.test(dni) || !dni.trim()) {
      newErrors.dni = "El dni debe tener 8 digitos";
      valid = false;
    }

    const fecha = new Date(dob);
    const hoy = new Date();
    const edad = hoy.getFullYear() - fecha.getFullYear();
    const mes = hoy.getMonth() - fecha.getMonth();
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

    if (valid) {
      addAdherente();
    } else {
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
    }else if (field === "dob") {
      setDob(value);
    }

    setErrores({ ...errores, [field]: "" });
  };

  return (
    <div>
      <Plus size={25} color="#2DAD50" onClick={() => setEstadoModal(true)} style={{ cursor: "pointer" }} />
      <Modal
        estado={estadoModal}
        cambiarEstado={setEstadoModal}
        titulo="Agregar Adherente"
        mostrarHeader={true}
        mostrarOverlay={true}
        posicionModal={"center"}
        padding={"20px"}
        mostrarContenedor={true}
      >
        <Contenido>
          <form className="w-full max-w-md bg-gray-50 p-6 rounded-lg shadow-md">
            {errores.nombre && <ErrorText>{errores.nombre}</ErrorText>}
            <Input
              placeholder="Nombre"
              type={"text"}
              onChange={(e) => handleInputChange(e, "nombre")}
              value={nombre}
              isError={!!errores.nombre}
            />
            {errores.apellido && <ErrorText>{errores.apellido}</ErrorText>}
            <Input
              placeholder="Apellido"
              onChange={(e) => handleInputChange(e, "apellido")}
              type={"text"}
              required={true}
              value={apellido}
              isError={!!errores.apellido}
            />
            {errores.dni && <ErrorText>{errores.dni}</ErrorText>}
            <Input
              placeholder="DNI"
              type={"number"}
              onChange={(e) => handleInputChange(e, "dni")}
              value={dni}
              isError={!!errores.dni}
            />
            {errores.dob && <ErrorText>{errores.dob}</ErrorText>}
            <Input
              placeholder="Fecha de Nacimiento"
              type={"date"}
              onChange={(e) => handleInputChange(e, "dob")}
              value={dob}
              isError={!!errores.dob}
            />
            <SeleccionarCobro traerId={traerId} defaultValue={idPlan}/>

            <Boton
              type="button"
              onClick={handleAddAdherente}>
              Agregar Adherente
            </Boton>
          </form>
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

const Boton = styled.button`
  display: inline-block;
  padding: 10px 20px;
  border-radius: 4px;
  color: #fff;
  border: none;
  background: #2DAD50;
  cursor: pointer;
  font-family: "Roboto", sans-serif;
  font-weight: 500;
  transition: 0.3s ease all;
  margin-left: 10px;
  &:hover {
    background: #22843D;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid ${({ isError }) => (isError ? "#f00" : "#ccc")};
  border-radius: 4px;
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

