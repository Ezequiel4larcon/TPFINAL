import React, { useState, useEffect } from "react";
import Modal from "../Modal";
import styled, { keyframes, css } from "styled-components";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { Edit } from "feather-icons-react";

export default function ModificarSocio({ value, listSocios, setListSocios }) {
  const [estadoModal, setEstadoModal] = useState(false);
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [dni, setDni] = useState("");
  const [currentNombre, setCurrentNombre] = useState("");
  const [currentApellido, setCurrentApellido] = useState("");
  const [currentDni, setCurrentDni] = useState("");
  const [errores, setErrores] = useState({
    nombre: false,
    apellido: false,
    dni: false,
  });

  useEffect(() => {
    if (estadoModal && value) {
      traerSocio();
    }
  }, [estadoModal, value]);

  const traerSocio = async () => {
    try {
      const socioRef = doc(db, "socios", value);
      const docSnap = await getDoc(socioRef);
      if (docSnap.exists()) {
        const { nombre, apellido, dni } = docSnap.data();
        setCurrentNombre(nombre);
        setCurrentApellido(apellido);
        setCurrentDni(dni.toString());
        setNombre(nombre);
        setApellido(apellido);
        setDni(dni.toString());
      } else {
        console.log("¡El documento no existe!");
      }
    } catch (error) {
      console.error("Error fetching document: ", error);
    }
  };

  const modificarSocio = async () => {
    try {
      const nombreFormateado = formatearNombre(nombre);
      const apellidoFormateado = formatearApellido(apellido);

      const socioRef = doc(db, "socios", value);
      await updateDoc(socioRef, {
        nombre: nombreFormateado,
        apellido: apellidoFormateado,
        dni: parseInt(dni),
      });

      const updatedList = listSocios.map((socio) =>
        socio.id === value ? { ...socio, nombre: nombreFormateado, apellido: apellidoFormateado, dni: parseInt(dni) } : socio
      );
      setListSocios(updatedList);

      setEstadoModal(false);
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };
  
  const handleEditSocio = () => {
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

    if (valid) {
      modificarSocio();
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
    }

    setErrores({ ...errores, [field]: "" });
  };

  const formatearNombre = (nombre) => {
    return nombre.charAt(0).toUpperCase() + nombre.slice(1).toLowerCase();
  };

  const formatearApellido = (apellido) => {
    return apellido.charAt(0).toUpperCase() + apellido.slice(1).toLowerCase();
  };

  return (
    <div>
      <IconButton onClick={() => setEstadoModal(true)}>
        <Edit size={25} />
      </IconButton>
      <Modal
        estado={estadoModal}
        cambiarEstado={setEstadoModal}
        titulo="Modificar Socio"
        mostrarHeader={true}
        mostrarOverlay={true}
        posicionModal={"center"}
        padding={"20px"}
        mostrarContenedor={true}
      >
        <Contenido>
          <h1>Ingrese los nuevos datos</h1>
          {errores.nombre && <ErrorText>{errores.nombre}</ErrorText>}
          <Input
            type="text"
            value={nombre}
            onChange={(e) => handleInputChange(e, "nombre")}
            placeholder="Nombre"
            isError={!!errores.nombre}
          />
          {errores.apellido && <ErrorText>{errores.apellido}</ErrorText>}
          <Input
            type="text"
            value={apellido}
            onChange={(e) => handleInputChange(e, "apellido")}
            placeholder="Apellido"
            isError={!!errores.apellido}
          />
          {errores.dni && <ErrorText>{errores.dni}</ErrorText>}
          <Input
            type="number"
            value={dni}
            onChange={(e) => handleInputChange(e, "dni")}
            placeholder="DNI"
            isError={!!errores.dni}
          />
          <ButtonContainer>
            <Button onClick={handleEditSocio}>Confirmar</Button>
            <CancelButton onClick={() => setEstadoModal(false)}>Cancelar</CancelButton>
          </ButtonContainer>
        </Contenido>
      </Modal>
    </div>
  );
}

const IconButton = styled.button`
  border: none;
  background-color: transparent;
  cursor: pointer;
  color: #2dad50;
  transition: color 0.3s ease;
  &:hover {
    color: #22843d;
  }
`;

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

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
`;

const Button = styled.button`
  margin-right: 10px;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  color: #fff;
  background-color: #2dad50;
  cursor: pointer;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: #22843d;
  }
`;

const CancelButton = styled(Button)`
  background-color: #ccc;
  &:hover {
    background-color: #999;
  }
`;

const ErrorText = styled.p`
  color: #f00;
  font-size: 12px;
  margin-top: 5px;
`;
