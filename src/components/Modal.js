import React from 'react';
import styled from 'styled-components';

const Modal = ({
  children,
  estado,
  cambiarEstado,
  titulo = 'Alerta',
  mostrarHeader = true,
  mostrarOverlay = true,
  posicionModal = 'center',
  padding = '20px',
  mostrarContenedor = true
}) => {
  return (
    <>
      {estado && 
        <Overlay mostrarOverlay={mostrarOverlay}>
          <ContenedorModal posicionModal={posicionModal} padding={padding} mostrarContenedor={mostrarContenedor}>
            {mostrarHeader && 
              <EncabezadoModal>
                <Titulo>{titulo}</Titulo>
                <BotonCerrar onClick={() => cambiarEstado(false)}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x" viewBox="0 0 16 16">
                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                  </svg>
                </BotonCerrar>
              </EncabezadoModal>
            }
            {children}
          </ContenedorModal>
        </Overlay>
      }
    </>
  );
}
 
export default Modal;

const Overlay = styled.div`
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
`;

const ContenedorModal = styled.div`
  width: 80%;
  max-width: 500px;
  background: #F0F9F4; /* Verde suave */
  border-radius: 8px;
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.1);
  padding: ${props => props.padding};
`;

const EncabezadoModal = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  border-bottom: 1px solid #D1E9DD; 
`;

const Titulo = styled.h3`
  font-weight: 600;
  font-size: 18px;
  color: #22843D; 
  margin: 0;
`;

const BotonCerrar = styled.button`
  width: 30px;
  height: 30px;
  background: none;
  border: none;
  cursor: pointer;
  transition: background 0.3s ease;
  color: #22843D;
  &:hover {
    background: #25AB4B;
    border-radius: 50%;
  }
  svg {
    width: 100%;
    height: 100%;
  }
`;
