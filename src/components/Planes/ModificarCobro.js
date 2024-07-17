import React, { useState, useEffect } from "react";
import Modal from "../Modal";
import styled, { keyframes, css } from "styled-components";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { Edit } from "feather-icons-react";

const ModificarCobroPopup = ({ cobroId, listCobros, setListCobros }) => {
  const [estadoModal, setEstadoModal] = useState(false);
  const [desc, setDesc] = useState("");
  const [monto, setMonto] = useState("");
  const [nombre, setNombre] = useState("");

  const [currentDesc, setCurrentDesc] = useState("");
  const [currentMonto, setCurrentMonto] = useState("");
  const [currentNombre, setCurrentNombre] = useState("");
  const [errors, setErrors] = useState({});

  const traerCobro = async () => {
    try {
      const ref = doc(db, "planes", cobroId);
      const document = await getDoc(ref);
      const obj = document.data();
      setCurrentDesc(obj.desc);
      setCurrentMonto(obj.monto.toString());
      setCurrentNombre(obj.nombre);
      setDesc(obj.desc);
      setMonto(obj.monto.toString());
      setNombre(obj.nombre);
    } catch (error) {
      console.error("Error fetching document: ", error);
    }
  };

  const modificarCobro = async () => {
    const obj = { desc, monto, nombre };
    const ref = doc(db, "planes", cobroId);
    try {
      await updateDoc(ref, {
        desc: obj.desc.length === 0 ? currentDesc : obj.desc,
        monto:
          obj.monto.length === 0 ? parseInt(currentMonto) : parseInt(obj.monto),
        nombre: obj.nombre.length === 0 ? currentNombre : obj.nombre,
      });

      const updatedList = listCobros.map((cobro) => {
        if (cobro.id === cobroId) {
          return {
            ...cobro,
            desc: obj.desc.length === 0 ? currentDesc : obj.desc,
            monto:
              obj.monto.length === 0 ? parseInt(currentMonto) : parseInt(obj.monto),
            nombre: obj.nombre.length === 0 ? currentNombre : obj.nombre,
          };
        }
        return cobro;
      });
      setListCobros(updatedList);

      setEstadoModal(false);
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  useEffect(() => {
    if (estadoModal) {
      traerCobro();
    }
  }, [estadoModal]);

  const handleInputChange = (e, field) => {
    const value = e.target.value;
    if (field === "nombre") {
      setNombre(value);
    } else if (field === "monto") {
      setMonto(value);
    } else if (field === "desc") {
      setDesc(value);
    }

    // Limpiar error al empezar a escribir
    setErrors({ ...errors, [field]: "" });
  };

  const handleAddCobro = () => {
    let valid = true;
    const newErrors = {};

    // Validación de campos requeridos y monto mayor a 0
    if (!nombre.trim()) {
      newErrors.nombre = "El nombre es requerido";
      valid = false;
    }

    if (!desc.trim()) {
      newErrors.desc = "La descripción es requerida";
      valid = false;
    }

    if (!monto || parseInt(monto) <= 0 || isNaN(parseInt(monto))) {
      newErrors.monto = "El monto debe ser mayor a 0";
      valid = false;
    }

    if (valid) {
      modificarCobro();
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <>
      <EditButton onClick={() => setEstadoModal(true)} />
      <Modal
        estado={estadoModal}
        cambiarEstado={setEstadoModal}
        titulo="Modificar Plan"
        mostrarHeader={true}
        mostrarOverlay={true}
        posicionModal={"center"}
        padding={"20px"}
        mostrarContenedor={true}
      >
        <Content>
          {errors.nombre && <ErrorText>{errors.nombre}</ErrorText>}
          <Input
            onChange={(e) => handleInputChange(e, "nombre")}
            value={nombre}
            placeholder="Nombre"
            isError={!!errors.nombre}
          />
          {errors.monto && <ErrorText>{errors.monto}</ErrorText>}
          <Input
            type="number"
            onChange={(e) => handleInputChange(e, "monto")}
            value={monto}
            placeholder="Monto"
            isError={!!errors.monto}
          />
          {errors.desc && <ErrorText>{errors.desc}</ErrorText>}
          <Input
            onChange={(e) => handleInputChange(e, "desc")}
            value={desc}
            placeholder="Descripción"
            isError={!!errors.desc}
          />
          <ButtonContainer>
            <Button onClick={handleAddCobro}>Confirmar</Button>
            <CancelButton onClick={() => setEstadoModal(false)}>Cancelar</CancelButton>
          </ButtonContainer>
        </Content>
      </Modal>
    </>
  );
};

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

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  h1 {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 15px;
    color: #1766dc;
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
  justify-content: center;
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

export default ModificarCobroPopup;
