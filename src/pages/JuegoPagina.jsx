// ==========================================
// 1. IMPORTS Y CONFIGURACIÓN INICIAL
// ==========================================
import React from 'react';
import { DadoEstructura, DadoListasCaras } from '../components/DadoTridimensional.jsx';
import { FichaEstructura, FichaDatosDinamicos } from '../components/FichaJugador.jsx';
import { usarJuegoDado } from '../js/usarJuegoDado.js';
import '../css/estilos.css';


// ==========================================
// 2. CONSTANTES ESTÁTICAS Y DATOS FIJOS
// ==========================================
// (Vacías aquí, porque los textos dinámicos de UI viajan estructurados desde el JSON a través del Puente)


// ==========================================
// 3. EXTRACCIÓN DEL PUENTE (LÓGICA VISUAL)
// ==========================================
export function JuegoPagina() {
    const { 
        jugador, 
        errorValidacion, 
        dado, 
        girando, 
        rotacion, 
        textosInterfaz, // <-- Recibimos los textos del JSON
        manejarCambioEntrada, 
        lanzarDado, 
        resultado 
    } = usarJuegoDado();

    const { nombre, apellido, edad } = jugador;
    const tieneDatosJugador = Boolean(nombre || apellido || edad);


// ==========================================
// 4. RETORNO VISUAL (JSX) / EXPORTACIÓN
// ==========================================
    return (
        <div className="contenedor-app">
            <h1 className="titulo-app">{textosInterfaz.tituloApp}</h1>
            
            <div className="rejilla-app">
                
                {/* PANEL IZQUIERDO */}
                <div className="panel panel--izquierda">
                    <div className="caja-formulario">
                        <h3 className="caja-formulario__titulo">{textosInterfaz.tituloFormulario}</h3>
                        
                        <div className="caja-formulario__entradas">
                            <div className="grupo-entrada">
                                <label className="grupo-entrada__etiqueta">{textosInterfaz.etiquetaNombre}</label>
                                <input className="grupo-entrada__campo" type="text" name="nombre" placeholder={textosInterfaz.placeholderNombre} value={nombre} onChange={manejarCambioEntrada} maxLength={25} />
                            </div>

                            <div className="grupo-entrada">
                                <label className="grupo-entrada__etiqueta">{textosInterfaz.etiquetaApellido}</label>
                                <input className="grupo-entrada__campo" type="text" name="apellido" placeholder={textosInterfaz.placeholderApellido} value={apellido} onChange={manejarCambioEntrada} maxLength={25} />
                            </div>

                            <div className="grupo-entrada">
                                <label className="grupo-entrada__etiqueta">{textosInterfaz.etiquetaEdad}</label>
                                <input className="grupo-entrada__campo" type="number" name="edad" placeholder={textosInterfaz.placeholderEdad} value={edad} onChange={manejarCambioEntrada} min="1" max="120" />
                            </div>
                        </div>

                        {errorValidacion && <div className="caja-formulario__error">{errorValidacion}</div>}
                    </div>

                    {tieneDatosJugador && !errorValidacion && (
                        <FichaEstructura>
                            <FichaDatosDinamicos nombre={nombre} apellido={apellido} edad={edad} />
                        </FichaEstructura>
                    )}
                </div>

                {/* PANEL DERECHO */}
                <div className="panel panel--derecha">
                    <div className="escenario-dado">
                        <DadoEstructura rotacion={rotacion} girando={girando} alHacerClic={lanzarDado}>
                            <DadoListasCaras />
                        </DadoEstructura>
                        <div className={`sombra-dado ${girando ? 'sombra-dado--animada' : ''}`} />
                    </div>

                    <div className="panel-acciones">
                        <div className="panel-acciones__resultado">
                            {girando ? 'Resultado: ?' : `Número obtenido: ${dado}`}
                        </div>
                        <button className="boton-accion" onClick={lanzarDado} disabled={girando}>
                            {girando ? 'Lanzando...' : 'Lanzar Dado 🐾'}
                        </button>
                        <div className={`mensaje-juego ${resultado.clase}`}>
                            {resultado.texto}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}