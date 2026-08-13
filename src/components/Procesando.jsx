import React from "react";
import logo from "../img/loading.gif"; // Ajusta la ruta según la ubicación real de tu imagen

function Procesando({ visible = false }) {
  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        zIndex: 5000,
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "linear-gradient(90deg, rgba(17,17,17,0.9) 0%, rgba(68,68,68,0.8) 50%, rgba(34,34,34,0.9) 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column"
      }}
    >
      <img
        src={logo}
        alt="Logo Keskplay"
        style={{
          width: "120px",
          height: "120px",
          animation: "pulse 1.2s infinite"
        }}
      />
      <style>
        {`
          @keyframes pulse {
            0% { transform: scale(1);}
            50% { transform: scale(1.15);}
            100% { transform: scale(1);}
          }
        `}
      </style>
    </div>
  );
}

export default Procesando;