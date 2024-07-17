import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { DollarSign } from "feather-icons-react";

export default function MostrarCobro(props) {
  const [estadoPopup, setEstadoPopup] = useState(false);
  const [listAdherentes, setListAdherentes] = useState([]);
  const [listPlanes, setListPlanes] = useState([]);

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

  const getMontoTotal = () => {
    let monto = 0;
    listAdherentes.forEach((adherente) => {
      monto += getMontoPlan(adherente.activo, adherente.idPlan);
    });
    return monto;
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

  useEffect(() => {
    getAdherentesBySocioId(props.value);
    getPlanes();
  }, []);

  return (
    <div>
      <button
        onClick={() => setEstadoPopup(!estadoPopup)}
        className="border-none bg-transparent cursor-pointer text-green-600 transition duration-300 ease-in-out hover:text-green-700"
      >
        <DollarSign size={25} style={{ marginRight: "5px" }} />
      </button>
      {estadoPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl max-h-80 overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-700">Mostrar Cobro</h2>
              <button
                onClick={() => setEstadoPopup(false)}
                className="text-gray-400 hover:text-gray-600 transition duration-300 ease-in-out"
              >
                ✖
              </button>
            </div>
            <div className="flex flex-col items-center p-4 overflow-y-auto max-h-64">
              <div className="w-full overflow-auto">
                <table className="min-w-full border-collapse table-auto">
                  <thead className="bg-gray-100 sticky top-0">
                    <tr>
                      <th className="px-4 py-2 border border-gray-200 text-left">Nombre</th>
                      <th className="px-4 py-2 border border-gray-200 text-left">Apellido</th>
                      <th className="px-4 py-2 border border-gray-200 text-left">D.N.I.</th>
                      <th className="px-4 py-2 border border-gray-200 text-left">Fecha de Nacimiento</th>
                      <th className="px-4 py-2 border border-gray-200 text-left">Adherente Activo</th>
                      <th className="px-4 py-2 border border-gray-200 text-left">Monto</th>
                    </tr>
                  </thead>
                  <tbody>
                    {listAdherentes.map((adherente, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-2 border border-gray-200">{adherente.nombre}</td>
                        <td className="px-4 py-2 border border-gray-200">{adherente.apellido}</td>
                        <td className="px-4 py-2 border border-gray-200">{adherente.dni}</td>
                        <td className="px-4 py-2 border border-gray-200">{adherente.dob}</td>
                        <td className="px-4 py-2 border border-gray-200">{adherente.activo ? "✔️" : "❌"}</td>
                        <td className="px-4 py-2 border border-gray-200">${getMontoPlan(adherente.activo, adherente.idPlan)}</td>
                      </tr>
                    ))}
                    <tr>
                      <td colSpan="6" className="px-4 py-2 text-center font-bold border border-gray-200 bg-gray-100">
                        Total: ${getMontoTotal()}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
