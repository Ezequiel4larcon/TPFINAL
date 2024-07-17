import React, { useState } from "react";
import Modal from "../../components/Modal";
import styled from "styled-components";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { XCircle } from "feather-icons-react";

export default function BajaSocio({ value, listSocios, setListSocios }) {
  const [estadoModal, setEstadoModal] = useState(false);

  const bajaSocio = async () => {
    const ref = doc(db, "socios", value);
    await updateDoc(ref, {
      activo: false,
    });

    const updatedList = listSocios.map((socio) =>
      socio.id === value ? { ...socio, activo: false } : socio
    );
    setListSocios(updatedList);

    setEstadoModal(false);
  };

  return (
    <div>
      <IconoBaja onClick={() => setEstadoModal(true)}>
        <XCircle size={25} style={{ marginRight: "5px" }} />
      </IconoBaja>
      <Modal
        estado={estadoModal}
        cambiarEstado={setEstadoModal}
        titulo="Baja Socio"
        mostrarHeader={true}
        mostrarOverlay={true}
        posicionModal={"center"}
        padding={"20px"}
        mostrarContenedor={true}
      >
        <Contenido>
          <h1>¿Desea dar de baja al Socio?</h1>
          <ButtonContainer>
            <Button onClick={bajaSocio}>Confirmar</Button>
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
  h1 {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 15px;
    color: #FF4D4F; /* Color rojo similar */
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const Button = styled.button`
  padding: 10px 20px;
  margin-right: 10px;
  border: none;
  border-radius: 4px;
  color: #fff;
  background-color: #FF4D4F; /* Color rojo similar */
  cursor: pointer;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: #CF1322; /* Color rojo más oscuro */
  }
`;

const CancelButton = styled(Button)`
  background-color: #ccc;
  &:hover {
    background-color: #999;
  }
`;

const IconoBaja = styled.div`
  border: none;
  background-color: transparent;
  cursor: pointer;
  color: #2dad50;
  transition: color 0.3s ease;
  &:hover {
    color: #22843d;
  }
`;
