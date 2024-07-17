import React, { useState, useEffect, useCallback } from "react";
import { db } from "../firebase/firebase";
import { collection, getDocs, addDoc } from "firebase/firestore";
import ModificarCobroPopup from "../components/Planes/ModificarCobro";
import AgregarCobroPopup from "../components/Planes/AgregarCobro";

export default function Cobros({ user }) {
  const [listCobros, setListCobros] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const getCobros = useCallback(async () => {
    setIsLoading(true);
    try {
      const lista = [];
      const querySnapshot = await getDocs(collection(db, "planes"));
      querySnapshot.forEach((doc) => {
        const obj = { ...doc.data(), id: doc.id };
        lista.push(obj);
      });
      setListCobros(lista);
    } catch (error) {
      console.error("Error getting documents: ", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    getCobros();
  }, [getCobros]);

  const addCobro = async (obj) => {
    try {
      await addDoc(collection(db, "planes"), obj);
      getCobros(); 
      setIsPopupOpen(false); 
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredCobros = listCobros.filter(cobro =>
    cobro.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
    {user.rol === 'user' ? <h1>Acceso denegado </h1> : (
    <div className="bg-green-100 w-full min-h-screen py-10 flex flex-col items-center">
      <div className="w-full max-w-4xl flex justify-between items-center mb-6 px-4">
        <input
          type="text"
          className="p-2 border border-green-800 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent w-1/2"
          placeholder="Buscar por nombre"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <button
          className="bg-green-800 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-full"
          onClick={() => setIsPopupOpen(true)}
        >
          + Agregar Cobro
        </button>
      </div>
      {isLoading ? (
        <p>Cargando...</p>
      ) : (
        <div className="w-full max-w-4xl overflow-x-auto">
          <table className="w-full text-center table-auto border-collapse">
            <thead className="bg-green-800 text-white">
              <tr>
                <th className="px-4 py-2 border border-green-900">Nombre</th>
                <th className="px-4 py-2 border border-green-900">Monto</th>
                <th className="px-4 py-2 border border-green-900">Descripción</th>
                <th className="px-4 py-2 border border-green-900">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-green-100">
              {filteredCobros.map((cobro) => (
                <tr className="bg-white hover:bg-green-200 transition-colors" key={cobro.id}>
                  <td className="border border-green-900 px-4 py-2">{cobro.nombre}</td>
                  <td className="border border-green-900 px-4 py-2">{cobro.monto}</td>
                  <td className="border border-green-900 px-4 py-2">{cobro.desc}</td>
                  <td className="border border-green-900 px-4 py-2">
                    <ModificarCobroPopup
                      cobroId={cobro.id}
                      getCobros={getCobros}
                      listCobros={listCobros}
                      setListCobros={setListCobros}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {isPopupOpen && (
        <AgregarCobroPopup
          onAddCobro={addCobro}
          onClose={() => setIsPopupOpen(false)}
        />
      )}
    </div>
    )}
    </div>
  );
}
