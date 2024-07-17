import React, { useState } from "react";
import Modal from "../Modal";
import styled from "styled-components";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { CheckCircle, XCircle } from "feather-icons-react";

export default function AltaAdherente({ value, listAdherentes, setListAdherentes }) {
  const [estadoModal, setEstadoModal] = useState(false);

  const altaAdherente = async () => {
    const ref = doc(db, "adherentes", value);
    await updateDoc(ref, { activo: true });

    const updatedList = listAdherentes.map((adherente) =>
      adherente.id === value ? { ...adherente, activo: true } : adherente
    );
    setListAdherentes(updatedList);

    setEstadoModal(false);
  };

  return (
    <div>
      <button
        onClick={() => setEstadoModal(true)}
      >
        <AltaButton size={30} style={{ marginRight: "5px" }} />
      </button>
      <Modal
        estado={estadoModal}
        cambiarEstado={setEstadoModal}
        titulo="Alta Adherente"
        mostrarHeader={true}
        mostrarOverlay={true}
        posicionModal={"center"}
        padding={"20px"}
        mostrarContenedor={true}
      >
        <Content>
          <h1>¿Desea dar de alta al Adherente?</h1>
          <ButtonContainer>
            <Button onClick={altaAdherente}>
              <CheckCircle size={18} style={{ marginRight: "5px" }} />
              Confirmar
            </Button>
            <CancelButton onClick={() => setEstadoModal(false)}>
              <XCircle size={18} style={{ marginRight: "5px" }} />
              Cancelar
            </CancelButton>
          </ButtonContainer>
        </Content>
      </Modal>
    </div>
  );
}

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  h1 {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 15px;
    color: #22843D;
  }
`;

const AltaButton = styled(CheckCircle)`
  border: none;
  background-color: transparent;
  cursor: pointer;
  color: #2dad50;
  transition: color 0.3s ease;
  &:hover {
    color: #22843d;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
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

const CancelButton = styled(Button)`
  background-color: #ccc;
  &:hover {
    background-color: #999;
  }
`;
