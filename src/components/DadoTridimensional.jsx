import React from 'react';
import { CONFIGURACION_CARAS } from '../services/servicioJuego.js';

// ==========================================
// dibuja el esqueleto y la escena del dado
// ==========================================
export function DadoEstructura({ rotacion, girando, alHacerClic, children }) {
  return (
    <div
      className={`dado-escena ${girando ? 'dado-escena--rebote' : ''}`}
      onClick={alHacerClic}
      title="¡Haz clic para lanzar el dado!"
      style={{ pointerEvents: girando ? 'none' : 'auto' }}
    >
      <div
        className="dado-cubo"
        style={{
          transform: `rotateX(${rotacion.x}deg) rotateY(${rotacion.y}deg) rotateZ(${rotacion.z}deg)`,
        }}
      >
        {children}
      </div>
    </div>
  );
}

// ==========================================
// Solo se encarga de usar .map() para pintar las caras y puntos
// ==========================================
export function DadoListasCaras() {
  return (
    <>
      {CONFIGURACION_CARAS.map(({ numero, puntos }) => (
        <div key={numero} className={`dado-cara dado-cara--${numero}`}>
          {puntos.map((posicion, indice) => (
            <span key={indice} className={`dado-punto ${posicion}`} />
          ))}
        </div>
      ))}
    </>
  );
}