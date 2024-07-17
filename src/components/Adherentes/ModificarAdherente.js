import React, { useState, useEffect } from "react";
import Modal from "../Modal";
import styled, { keyframes, css } from "styled-components";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import SeleccionarCobro from "../Planes/SeleccionarCobro";
import { Edit } from "feather-icons-react";

export default function ModificarAdherente({ value, listAdherentes, setListAdherentes }) {
  const [estadoModal, setEstadoModal] = useState(false);
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [dni, setDni] = useState("");
  const [idPlan, setIdPlan] = useState("");
  const [currentNombre, setCurrentNombre] = useState("");
  const [currentApellido, setCurrentApellido] = useState("");
  const [currentDni, setCurrentDni] = useState("");
  const [currentIdPlan, setCurrentIdPlan] = useState("");
  const [errores, setErrores] = useState({
    nombre: false,
    apellido: false,
    dni: false,
  });

  useEffect(() => {
    if (estadoModal && value) {
      traerAdherente();
    }
  }, [estadoModal, value]);

  const traerAdherente = async () => {
    try {
      const docRef = doc(db, "adherentes", value);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const { nombre, apellido, dni, idPlan } = docSnap.data();
        setCurrentNombre(nombre);
        setCurrentApellido(apellido);
        setCurrentDni(dni);
        setCurrentIdPlan(idPlan);
        setNombre(nombre);
        setApellido(apellido);
        setDni(dni.toString());
        setIdPlan(idPlan);
      } else {
        console.log("¡El documento no existe!");
      }
    } catch (error) {
      console.error("Error al traer el documento: ", error);
    }
  };

  const modificarAdherente = async () => {
    try {
      const nombreFormateado = capitalizarPrimeraLetra(nombre);
      const apellidoFormateado = capitalizarPrimeraLetra(apellido);

      const adherenteRef = doc(db, "adherentes", value);
      await updateDoc(adherenteRef, {
        nombre: nombreFormateado,
        apellido: apellidoFormateado,
        dni: parseInt(dni),
        idPlan,
      });

      const updatedList = listAdherentes.map((adherente) =>
        adherente.id === value ? { ...adherente, nombre: nombreFormateado, apellido: apellidoFormateado, dni: parseInt(dni), idPlan } : adherente
      );
      setListAdherentes(updatedList);

      setEstadoModal(false);
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  const traerId = (id) => {
    setIdPlan(id);
  };

  const capitalizarPrimeraLetra = (cadena) => {
    return cadena.charAt(0).toUpperCase() + cadena.slice(1).toLowerCase();
  };

  const handleEditAdherente = () => {
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
      modificarAdherente();
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

  return (
    <div>
      <EditButton size={30} style={{ marginRight: "5px" }} onClick={() => setEstadoModal(true)} />
      <Modal
        estado={estadoModal}
        cambiarEstado={setEstadoModal}
        titulo="Modificar Adherente"
        mostrarHeader={true}
        mostrarOverlay={true}
        posicionModal={"center"}
        padding={"20px"}
        mostrarContenedor={true}
      >
        <Contenido>
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
          <SeleccionarCobro traerId={traerId} value={idPlan} />
          <ButtonContainer>
            <Button onClick={handleEditAdherente}>Confirmar</Button>
            <CancelButton onClick={() => setEstadoModal(false)}>Cancelar</CancelButton>
          </ButtonContainer>
        </Contenido>
      </Modal>
    </div>
  );
}

const Contenido = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const EditButton = styled(Edit)`
  border: none;
  background-color: transparent;
  cursor: pointer;
  color: #2dad50;
  transition: color 0.3s ease;
  &:hover {
    color: #22843d;
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


