import React, { useState } from "react";
import styled, { keyframes, css } from "styled-components";

export default function AgregarCobroPopup({ onAddCobro, onClose }) {
  const [desc, setDesc] = useState("");
  const [monto, setMonto] = useState("");
  const [nombre, setNombre] = useState("");
  const [errors, setErrors] = useState({});

  const handleAddCobro = () => {
    let valid = true;
    const newErrors = {};

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
      onAddCobro({ desc, monto: parseInt(monto), nombre });
      setDesc("");
      setMonto("");
      setNombre("");
      onClose();
    } else {
      setErrors(newErrors);
    }
  };

  const handleInputChange = (e, field) => {
    const value = e.target.value;
    if (field === "nombre") {
      setNombre(value);
    } else if (field === "monto") {
      setMonto(value);
    } else if (field === "desc") {
      setDesc(value);
    }

    setErrors({ ...errors, [field]: "" });
  };

  return (
    <Overlay>
      <Content>
      {errors.nombre && <ErrorText>{errors.nombre}</ErrorText>}
        <h2 className="text-xl mb-4 text-green-800">Agregar Cobro</h2>
        <StyledInput
          placeholder="Nombre"
          isError={!!errors.nombre}
          onChange={(e) => handleInputChange(e, "nombre")}
          value={nombre}
        />
        {errors.monto && <ErrorText>{errors.monto}</ErrorText>}
        <StyledInput
          placeholder="Monto"
          type="number"
          isError={!!errors.monto}
          onChange={(e) => handleInputChange(e, "monto")}
          value={monto}
        />
        {errors.desc && <ErrorText>{errors.desc}</ErrorText>}
        <StyledInput
          placeholder="Descripción"
          isError={!!errors.desc}
          onChange={(e) => handleInputChange(e, "desc")}
          value={desc}
        />
        <ButtonContainer>
          <CancelButton onClick={onClose}>Cancelar</CancelButton>
          <Button onClick={handleAddCobro}>Agregar</Button>
        </ButtonContainer>
      </Content>
    </Overlay>
  );
}

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
`;

const Content = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  width: 320px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
`;


const StyledInput = styled.input`
  margin-bottom: 15px;
  padding: 10px;
  border: 1px solid ${({ isError }) => (isError ? "#f00" : "#ccc")};
  border-radius: 4px;
  width: 100%;
  font-size: 14px;
  transition: border-color 0.3s ease;
  &:focus {
    outline: none;
    border-color: ${({ isError }) => (isError ? "#f00" : "#22843d")}; /* Color verde similar */
  }
`;

const ErrorText = styled.p`
  color: #f00;
  font-size: 12px;
  margin-top: 5px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
`;

const Button = styled.button`
  margin-left: 10px;
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
