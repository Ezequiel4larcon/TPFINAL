import React, { useEffect, useState } from "react";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../firebase/firebase";
import axios from "axios";
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react'

initMercadoPago('APP_USR-682b7a57-3c3b-4b5c-b8b6-c4ceff7b8244',{
  locale: 'es-AR'
});

export default function Home({ user }) {
  const [listAdherentes, setListAdherentes] = useState([]);
  const [listPlanes, setListPlanes] = useState([]);
  const [montoSocioTitular, setMontoSocioTitular] = useState(0);
  const [preferenceId, setPreferenceId] = useState(null);

  const getAdherentesBySocioId = async (idSocio) => {
    let obj;
    let lista = [];
    const querySnapshot = await getDocs(collection(db, "adherentes"));
    querySnapshot.forEach((doc) => {
      obj = doc.data();
      obj.id = doc.id;
      if (obj.idSocio === idSocio) {
        lista.push(obj);
      }
    });
    setListAdherentes(lista);
  };

  const getPlanes = async () => {
    let obj;
    let lista = [];
    const querySnapshot = await getDocs(collection(db, "planes"));
    querySnapshot.forEach((doc) => {
      obj = doc.data();
      obj.id = doc.id;
      lista.push(obj);
    });
    setListPlanes(lista);
  };

  const getMontoPlan = (isActive, idPlan) => {
    let monto = 0;
    if (isActive) {
      listPlanes.forEach((plan) => {
        if (plan.id === idPlan) {
          monto = plan.monto;
        }
      });
    }
    return monto;
  };

  const getMontoTotal = () => {
    let monto = montoSocioTitular;
    listAdherentes.forEach((adherente) => {
      monto += getMontoPlan(adherente.activo, adherente.idPlan);
    });
    return monto;
  };

  const getMontoSocioTitular = async () => {
    const querySnapshot = await getDocs(collection(db, "planes"));
    querySnapshot.forEach((doc) => {
      const plan = doc.data();
      if (plan.nombre === "Socio") {
        setMontoSocioTitular(plan.monto);
      }
    });
  };

  const crearPreferencia = async () => {
    try {
      const montoTotal = getMontoTotal();
      const response = await axios.post("http://localhost:3001/create_preference", {
        description: "Pago mensual de socio",
        amount: montoTotal,
      });
      const { id } = response.data;
      return id;
    } catch (error) {
      console.error("Error al crear pago:", error);
    }
  };

  const handlePayment = async () => {
    const id = await crearPreferencia();
    if(id) {
      setPreferenceId(id);
    }
  }

  useEffect(() => {
    getMontoSocioTitular();
    getAdherentesBySocioId(user.uid);
    getPlanes();
  }, [user.uid]);

  return (
    <div>
      {user.rol === "user" && (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl p-6">
            <div className="flex flex-col items-center">
              <h2 className="text-2xl font-bold mb-4">Lista de Adherentes</h2>
              <div className="overflow-auto w-full">
                <table className="min-w-full border-collapse table-auto">
                  <thead className="bg-gray-200 sticky top-0">
                    <tr>
                      <th className="px-4 py-2 border border-gray-300 text-left">Nombre</th>
                      <th className="px-4 py-2 border border-gray-300 text-left">Apellido</th>
                      <th className="px-4 py-2 border border-gray-300 text-left">D.N.I.</th>
                      <th className="px-4 py-2 border border-gray-300 text-left">Fecha de Nacimiento</th>
                      <th className="px-4 py-2 border border-gray-300 text-left">Adherente Activo</th>
                      <th className="px-4 py-2 border border-gray-300 text-left">Monto</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-gray-100">
                      <td className="px-4 py-2 border border-gray-300">Socio Titular</td>
                      <td className="px-4 py-2 border border-gray-300">-</td>
                      <td className="px-4 py-2 border border-gray-300">-</td>
                      <td className="px-4 py-2 border border-gray-300">-</td>
                      <td className="px-4 py-2 border border-gray-300">✔️</td>
                      <td className="px-4 py-2 border border-gray-300">${montoSocioTitular}</td>
                    </tr>
                    {listAdherentes.map((adherente, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-2 border border-gray-300">{adherente.nombre}</td>
                        <td className="px-4 py-2 border border-gray-300">{adherente.apellido}</td>
                        <td className="px-4 py-2 border border-gray-300">{adherente.dni}</td>
                        <td className="px-4 py-2 border border-gray-300">{adherente.dob}</td>
                        <td className="px-4 py-2 border border-gray-300">{adherente.activo ? "✔️" : "❌"}</td>
                        <td className="px-4 py-2 border border-gray-300">${getMontoPlan(adherente.activo, adherente.idPlan)}</td>
                      </tr>
                    ))}
                    <tr>
                      <td colSpan="6" className="px-4 py-2 text-center font-bold border border-gray-300 bg-gray-200">
                        Total: ${getMontoTotal()}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <button
                onClick={handlePayment}
                className="mt-4 bg-green-600 text-white font-bold py-2 px-6 rounded hover:bg-green-700 transition duration-300"
              >
                Pagar Monto
              </button>
              {preferenceId && <Wallet initialization={{ preferenceId: preferenceId }} customization={{ texts:{ valueProp: 'smart_option'}}} />}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
