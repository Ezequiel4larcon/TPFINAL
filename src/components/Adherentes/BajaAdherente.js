import React, { useState } from "react";
import Modal from "../Modal";
import styled from "styled-components";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { XCircle, Slash } from "feather-icons-react";

export default function BajaAdherente({ value, listAdherentes, setListAdherentes }) {
  const [estadoModal, setEstadoModal] = useState(false);

  const bajaAdherente = async () => {
    const ref = doc(db, "adherentes", value);
    await updateDoc(ref, { activo: false });

    const updatedList = listAdherentes.map((adherente) =>
      adherente.id === value ? { ...adherente, activo: false } : adherente
    );
    setListAdherentes(updatedList);

    setEstadoModal(false);
  };

  return (
    <div>
      <button
        onClick={() => setEstadoModal(true)}
      >
        <BajaButton size={30} style={{ marginRight: "5px" }} />
      </button>
      <Modal
        estado={estadoModal}
        cambiarEstado={setEstadoModal}
        titulo="Baja Adherente"
        mostrarHeader={true}
        mostrarOverlay={true}
        posicionModal={"center"}
        padding={"20px"}
        mostrarContenedor={true}
      >
        <Content>
          <h1>¿Desea dar de baja al Adherente?</h1>
          <ButtonContainer>
            <Button onClick={bajaAdherente}>
              <Slash size={18} style={{ marginRight: "5px" }} />
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
    color: #D32F2F;
  }
`;

const BajaButton = styled(XCircle)`
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
  background-color: #D32F2F;
  cursor: pointer;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: #B71C1C;
  }
`;

const CancelButton = styled(Button)`
  background-color: #ccc;
  &:hover {
    background-color: #999;
  }
`;
