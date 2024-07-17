import React, { useState } from "react";
import useAuth from "../hooks/useAuth.js";

export default function Login() {
  const { email, setEmail, password, setPassword, login } = useAuth();
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  return (
    <div
      className="text-black h-screen flex justify-center items-center bg-cover bg-center"
      style={{
        backgroundImage: "url('https://media.licdn.com/dms/image/C4D1BAQG1oHvOwK9XfA/company-background_10000/0/1582908101021/sanatorio_adventista_del_plata_cover?e=2147483647&v=beta&t=WBgFdcRQJIy3XXMXXF-MhcAmHkPpRftR6x-CGA7JuA8')",
      }}
    >
      <div className="bg-slate-800 border border-slate-400 rounded-md p-8 shadow-lg backdrop-filter backdrop-blur-sm bg-opacity-60 w-11/12 sm:w-96">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Iniciar Sesión</h2>

        <div className="relative my-4">
          <input
            className="block w-full py-2.5 px-0 text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:border-green-600 focus:outline-none placeholder-transparent"
            type="email"
            placeholder={emailFocused ? "" : "Email"}
            value={email}
            onFocus={() => setEmailFocused(true)}
            onBlur={() => setEmailFocused(false)}
            onChange={(e) => setEmail(e.target.value)}
          />
          {!emailFocused && !email && (
            <label className="absolute top-2 left-0 text-gray-400 pointer-events-none">
              Email
            </label>
          )}
        </div>

        <div className="mb-4 relative">
          <input
            className="block w-full py-2.5 px-0 text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:border-green-600 focus:outline-none placeholder-transparent"
            type="password"
            placeholder={passwordFocused ? "" : "Contraseña"}
            value={password}
            onFocus={() => setPasswordFocused(true)}
            onBlur={() => setPasswordFocused(false)}
            onChange={(e) => setPassword(e.target.value)}
          />
          {!passwordFocused && !password && (
            <label className="absolute top-2 left-0 text-gray-400 pointer-events-none">
              Contraseña
            </label>
          )}
        </div>

        <button
          className="w-full text-[18px] mt-6 rounded-full bg-white text-green-800 hover:bg-green-800 hover:text-white py-2 transition-colors duration-300"
          onClick={login}
        >
          Iniciar sesión
        </button>
      </div>
    </div>
  );
}
