import React from "react";
import { Route, Routes } from "react-router-dom";
import Adherentes from "../pages/Adherentes";
import Cobros from "../pages/Cobros";
import Home from "../pages/Home";
import Socios from "../pages/Socios";
import Barra from "./Barra";
import RequiereAuth from "./RequiereLogin"

export default function Layout({ user }) {


  return (
    <div className="w-full h-12 bg-green-800 mx-auto">
      <Barra user={user}/>
      <Routes>
        <Route path="" element={<RequiereAuth><Home/></RequiereAuth>} />
        <Route path="home" element={<RequiereAuth><Home user={user} /></RequiereAuth>} />
        <Route path="socios" element={<RequiereAuth><Socios user={user} /></RequiereAuth>} />
        <Route path="adherentes" element={<RequiereAuth><Adherentes user={user} /></RequiereAuth>} />
        <Route path="cobros" element={<RequiereAuth><Cobros user={user} /></RequiereAuth>} />
      </Routes>
    </div>
  );
}
