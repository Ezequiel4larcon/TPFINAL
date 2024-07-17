import React, { useState, useEffect } from "react";
import { db } from "../firebase/firebase";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import AgregarSocioModal from "../components/Socios/AgregarSocio";
import AgregarAdherente from "../components/Adherentes/AgregarAdherente";
import BajaSocio from "../components/Socios/BajaSocio";
import AltaSocio from "../components/Socios/AltaSocio";
import ModificarSocio from "../components/Socios/ModificarSocio";
import MostrarCobro from "../components/Planes/MostrarCobro";

export default function Socios( {user} ) {
  const [listSocios, setListSocios] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const getSocios = async () => {
    setIsLoading(true);
    try {
      const lista = [];
      const querySnapshot = await getDocs(collection(db, "socios"));
      querySnapshot.forEach((doc) => {
        const obj = { ...doc.data(), id: doc.id };
        lista.push(obj);
      });
      setListSocios(lista);
    } catch (error) {
      console.error("Error getting documents: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getSocios();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredSocios = listSocios.filter(
    (socio) =>
      socio.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      socio.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      socio.dni.toString().includes(searchTerm)
  );

  return (
    <div>
    {user.rol === 'user' ? <h1>Acceso denegado</h1> : (
    <div className="bg-green-100 w-full min-h-screen py-10 flex flex-col items-center">
      <div className="w-full max-w-4xl flex items-center justify-between mb-6">
        <div className="flex-1 mr-4">
          <input
            type="text"
            className="p-2 w-full border border-green-800 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
            placeholder="Buscar por nombre, apellido o DNI"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <AgregarSocioModal
          listSocios={listSocios}
          setListSocios={setListSocios}
           getSocios={getSocios}
        />
      </div>
      {isLoading ? (
        <p>Cargando...</p>
      ) : (
        <div className="w-full max-w-4xl overflow-x-auto">
          <table className="w-full text-center table-auto border-collapse">
            <thead className="bg-green-800 text-white">
              <tr>
                <th className="px-4 py-2 border border-green-900">Nombre</th>
                <th className="px-4 py-2 border border-green-900">Apellido</th>
                <th className="px-4 py-2 border border-green-900">DNI</th>
                <th className="px-4 py-2 border border-green-900">Socio Activo</th>
                <th className="px-4 py-2 border border-green-900">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-green-100">
              {filteredSocios.map((socio) => (
                <tr
                  className="bg-white hover:bg-green-200 transition-colors"
                  key={socio.id}
                >
                  <td className="border border-green-900 px-4 py-2">
                    {socio.nombre}
                  </td>
                  <td className="border border-green-900 px-4 py-2">
                    {socio.apellido}
                  </td>
                  <td className="border border-green-900 px-4 py-2">
                    {socio.dni}
                  </td>
                  <td className="border border-green-900 px-4 py-2">
                    {socio.activo ? "✔️" : "❌"}
                  </td>
                  <td className="border border-green-900 px-4 py-2">
                    <div className="flex justify-center space-x-2">
                      <AgregarAdherente 
                      value={socio.id} 
                      listSocios={listSocios}
                      setListSocios={setListSocios}
                      />
                      <BajaSocio 
                      value={socio.id} 
                      listSocios={listSocios}
                      setListSocios={setListSocios}
                      />
                      <AltaSocio 
                      value={socio.id} 
                      listSocios={listSocios}
                      setListSocios={setListSocios}
                      />
                      <ModificarSocio 
                      value={socio.id}
                      listSocios={listSocios}
                      setListSocios={setListSocios}
                       />
                      <MostrarCobro 
                      value={socio.id} 
                      listSocios={listSocios}
                      setListSocios={setListSocios}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
    )}
    </div>
    )};
    </div>
  
    );
}
