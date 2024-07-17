import React, { useState, useEffect, useCallback } from "react";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../firebase/firebase";
import BajaAdherente from "../components/Adherentes/BajaAdherente";
import AltaAdherente from "../components/Adherentes/AltaAdherente";
import ModificarAdherente from "../components/Adherentes/ModificarAdherente";

export default function Adherentes({ user }) {
  const [listAdherentes, setListAdherentes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const getAdherentes = useCallback(async () => {
    try {
      const lista = [];
      const querySnapshot = await getDocs(collection(db, "adherentes"));
      querySnapshot.forEach((doc) => {
        const obj = { ...doc.data(), id: doc.id };
        lista.push(obj);
      });
      setListAdherentes(lista);
    } catch (error) {
      console.error("Error getting documents: ", error);
    }
  }, []);

  useEffect(() => {
    getAdherentes();
  }, [getAdherentes]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredAdherentes = listAdherentes.filter((adherente) =>
    adherente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    adherente.apellido.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
    {user.rol === 'user' ? <h1>Acceso denegado</h1> : (
    <div className="bg-green-100 w-full min-h-screen py-10 flex flex-col items-center">
      <div className="w-full max-w-6xl flex justify-between items-center mb-6 px-4">
        <input
          type="text"
          className="p-2 border border-green-800 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent w-1/2"
          placeholder="Buscar por nombre o apellido"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>
      <div className="w-full max-w-6xl overflow-x-auto">
        <table className="w-full text-center table-auto border-collapse">
          <thead className="bg-green-800 text-white">
            <tr>
              <th className="px-4 py-2 border border-green-900">Nombre</th>
              <th className="px-4 py-2 border border-green-900">Apellido</th>
              <th className="px-4 py-2 border border-green-900">D.N.I.</th>
              <th className="px-4 py-2 border border-green-900">Adherente Activo</th>
              <th className="px-4 py-2 border border-green-900">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-green-100">
            {filteredAdherentes.map((adherente, index) => (
              <tr className="bg-white hover:bg-green-200 transition-colors" key={index}>
                <td className="border border-green-900 px-4 py-2">{adherente.nombre}</td>
                <td className="border border-green-900 px-4 py-2">{adherente.apellido}</td>
                <td className="border border-green-900 px-4 py-2">{adherente.dni}</td>
                <td className="border border-green-900 px-4 py-2">{adherente.activo ? "✔️" : "❌"}</td>
                <td className="border border-green-900 px-4 py-2">
                  <div className="flex justify-center">
                    <BajaAdherente
                      value={adherente.id}
                      listAdherentes={listAdherentes}
                      setListAdherentes={setListAdherentes}
                    />
                    <AltaAdherente
                      value={adherente.id}
                      listAdherentes={listAdherentes}
                      setListAdherentes={setListAdherentes}
                    />
                    <ModificarAdherente
                      value={adherente.id}
                      listAdherentes={listAdherentes}
                      setListAdherentes={setListAdherentes}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    )};
    </div>
  );
}
