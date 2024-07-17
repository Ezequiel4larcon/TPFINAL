import React, { useState } from "react";
import Modal from "../../components/Modal";
import styled from "styled-components";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { CheckCircle, XCircle } from "feather-icons-react"; 

export default function AltaSocio({ value, listSocios, setListSocios }) {
  const [estadoModal, setEstadoModal] = useState(false);

  const altaSocio = async () => {
    const ref = doc(db, "socios", value);
    await updateDoc(ref, { activo: true });

    const updatedList = listSocios.map((socio) =>
      socio.id === value ? { ...socio, activo: true } : socio
    );
    setListSocios(updatedList);

    setEstadoModal(false);
  };

  return (
    <div>
      <IconoActivacion onClick={() => setEstadoModal(true)}>
        <CheckCircle size={25} style={{ marginRight: "5px" }} />
      </IconoActivacion>
      <Modal
        estado={estadoModal}
        cambiarEstado={setEstadoModal}
        titulo="Alta Socio"
        mostrarHeader={true}
        mostrarOverlay={true}
        posicionModal={"center"}
        padding={"20px"}
        mostrarContenedor={true}
      >
        <Contenido>
          <h1>¿Desea dar de alta al Socio?</h1>
          <ButtonContainer>
            <Button onClick={altaSocio}>
              <CheckCircle size={18} style={{ marginRight: "5px" }} />
              Confirmar
            </Button>
            <CancelButton onClick={() => setEstadoModal(false)}>
              <XCircle size={18} style={{ marginRight: "5px" }} />
              Cancelar
            </CancelButton>
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
    color: #22843D;
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

const IconoActivacion = styled.div`
  border: none;
  background-color: transparent;
  cursor: pointer;
  color: #2dad50;
  transition: color 0.3s ease;
  &:hover {
    color: #22843d;
  }
`;
