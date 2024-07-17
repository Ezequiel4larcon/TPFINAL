import React from "react";
import { NavLink } from "react-router-dom";
import { logout } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import { LogOut } from "feather-icons-react";

export default function Barra({ user }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(navigate);
  };

  return (
    <div className="w-full flex flex-col sm:flex-row justify-between items-center h-auto sm:h-16 bg-green-800 p-2">
      <div className="flex items-center w-full sm:w-auto">
        <img
          className="max-h-12"
          src="https://sanatorioadventista.org.ar/assets/img/footer_logo_sap.png"
          alt="Logo"
        />
        <h2 className="text-white font-bold text-1/3xl px-4">¡Bienvenido {user.nombre}!</h2>
      </div>

      <div className="w-full sm:w-auto mt-2 sm:mt-0 flex flex-col sm:flex-row items-center">
        <NavLink 
          to={"/app/home"} 
          className={({ isActive }) =>
            isActive 
              ? "bg-green-700 text-white font-bold py-1 px-4 rounded ml-0 sm:ml-2 w-full sm:w-auto shadow-lg transform -translate-y-1"
              : "bg-green-800 text-white font-bold py-1 px-4 rounded ml-0 sm:ml-2 w-full sm:w-auto hover:bg-green-700 hover:shadow-lg transition duration-300 transform hover:-translate-y-1"
          }
        >
          Home
        </NavLink>
        {user.rol !== 'user' && (
          <>
            <NavLink 
              to={"/app/socios"} 
              className={({ isActive }) =>
                isActive 
                  ? "bg-green-700 text-white font-bold py-1 px-4 rounded ml-0 sm:ml-2 w-full sm:w-auto shadow-lg transform -translate-y-1"
                  : "bg-green-800 text-white font-bold py-1 px-4 rounded ml-0 sm:ml-2 w-full sm:w-auto hover:bg-green-700 hover:shadow-lg transition duration-300 transform hover:-translate-y-1"
              }
            >
              Socios
            </NavLink>
            <NavLink 
              to={"/app/adherentes"} 
              className={({ isActive }) =>
                isActive 
                  ? "bg-green-700 text-white font-bold py-1 px-4 rounded ml-0 sm:ml-2 w-full sm:w-auto shadow-lg transform -translate-y-1"
                  : "bg-green-800 text-white font-bold py-1 px-4 rounded ml-0 sm:ml-2 w-full sm:w-auto hover:bg-green-700 hover:shadow-lg transition duration-300 transform hover:-translate-y-1"
              }
            >
              Adherentes
            </NavLink>
            <NavLink 
              to={"/app/cobros"} 
              className={({ isActive }) =>
                isActive 
                  ? "bg-green-700 text-white font-bold py-1 px-4 rounded ml-0 sm:ml-2 w-full sm:w-auto shadow-lg transform -translate-y-1"
                  : "bg-green-800 text-white font-bold py-1 px-4 rounded ml-0 sm:ml-2 w-full sm:w-auto hover:bg-green-700 hover:shadow-lg transition duration-300 transform hover:-translate-y-1"
              }
            >
              Cobros
            </NavLink>
          </>
        )}
        <button
          onClick={handleLogout}
          className="text-white font-bold ml-0 sm:ml-2 w-full sm:w-auto hover:shadow-lg transition duration-300 transform hover:-translate-y-1 mt-2 sm:mt-0"
          style={{ background: 'transparent' }}
        >
          <LogOut />
        </button>
      </div>
    </div>
  );
}
