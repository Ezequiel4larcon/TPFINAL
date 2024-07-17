import React, { useState, useEffect } from "react";
import { db } from "../../firebase/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function SeleccionarCobro(props) {
  const [listCobros, setListCobros] = useState([]);
  const getCobros = async () => {
    let obj;
    let lista = [];
    const querySnapshot = await getDocs(collection(db, "planes"));
    querySnapshot.forEach((doc) => {
      obj = doc.data();
      obj.id = doc.id;
      if (obj.id !== "socio") {
        lista.push(obj);
      }
    });
    setListCobros(lista);
  };

  useEffect(() => {
    getCobros();
  }, []);

  return (
    <select 
    className="bg-green-180 border-2 border-green-700 rounded-md w-52 h-10 mb-5"
    onChange={(e) => props.traerId(e.target.value)}>
      {listCobros.map((item) => (
        <option value={item.id} key={item.id}>
          {item.nombre}
        </option>
      ))}
    </select>
  );
}


