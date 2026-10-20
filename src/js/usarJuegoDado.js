// ==========================================
// 1. IMPORTS
// ==========================================
import { useState, useEffect, useRef, useMemo } from 'react';
import reglasData from '../services/reglasJuego.json';
import { 
    calcularTextoLimpio, 
    validarRangoEdad, 
    validarFormularioJugador, 
    calcularNumeroAleatorioDado, 
    calcularCoordenadasRotacion, 
    obtenerReglaResultado 
} from '../services/servicioJuego.js';

// Parámetros de tiempo fijos que controlan la duración de las animaciones del componente.
const TIEMPO_GIRO = reglasData.configuracion.tiempoGiro;
const TIEMPO_REBOTE = reglasData.configuracion.tiempoRebote;


// ==========================================
// HOOK
// ==========================================
export function usarJuegoDado() {

    // Almacenamiento local para los datos del usuario, validaciones, estados del dado y transformaciones 3D.
    const [jugador, establecerJugador] = useState({ nombre: '', apellido: '', edad: '' });
    const [errorValidacion, establecerErrorValidacion] = useState('');
    const [dado, establecerDado] = useState(1);
    const [girando, establecerGirando] = useState(false);
    const [rebotando, establecerRebotando] = useState(false);
    const [rotacion, establecerRotacion] = useState({ x: 0, y: 0, z: 0 });

    // Referencias mutables para mantener el historial de rotación y controlar la concurrencia de temporizadores.
    const vueltasAcumuladasRef = useRef({ x: 0, y: 0, z: 0 });
    const estaGirandoRef = useRef(false);
    const temporizadorGiroRef = useRef(null);
    const temporizadorReboteRef = useRef(null);

    // Cálculo optimizado del resultado actual en base al valor del dado y su estado de animación.
    const resultado = useMemo(() => {
        return obtenerReglaResultado(dado, girando);
    }, [girando, dado]);


    // --- B. Acciones ---
    // Procesa y sanitiza la entrada de los campos del formulario asegurando datos limpios.
    const manejarCambioEntrada = (e) => {
        const { name, value } = e.target;
        establecerErrorValidacion('');

        if (name === 'nombre' || name === 'apellido') {
            const limpio = calcularTextoLimpio(value);
            establecerJugador((previo) => ({ ...previo, [name]: limpio }));
        } else if (name === 'edad' && validarRangoEdad(value)) {
            establecerJugador((previo) => ({ ...previo, [name]: value }));
        }
    };

    // Ejecuta la validación del usuario, calcula la tirada aleatoria y coordina las animaciones tridimensionales.
    const lanzarDado = () => {
        if (estaGirandoRef.current || girando) return;

        const error = validarFormularioJugador(jugador);
        if (error) {
            establecerErrorValidacion(error);
            return;
        }

        establecerErrorValidacion('');
        estaGirandoRef.current = true;
        establecerGirando(true);
        establecerRebotando(false);

        if (temporizadorGiroRef.current) clearTimeout(temporizadorGiroRef.current);
        if (temporizadorReboteRef.current) clearTimeout(temporizadorReboteRef.current);

        const numeroFinal = calcularNumeroAleatorioDado();
        establecerDado(numeroFinal);

        const { nuevasVueltas, nuevaRotacion } = calcularCoordenadasRotacion(numeroFinal, vueltasAcumuladasRef.current);
        vueltasAcumuladasRef.current = nuevasVueltas;
        establecerRotacion(nuevaRotacion);

        temporizadorGiroRef.current = setTimeout(() => {
            establecerGirando(false);
            establecerRebotando(true);
            estaGirandoRef.current = false;

            temporizadorReboteRef.current = setTimeout(() => {
                establecerRebotando(false);
            }, TIEMPO_REBOTE);
        }, TIEMPO_GIRO);
    };


    // Asegura la destrucción de los temporizadores activos al desmontar el componente para evitar fugas de memoria.
    useEffect(() => {
        return () => {
            if (temporizadorGiroRef.current) clearTimeout(temporizadorGiroRef.current);
            if (temporizadorReboteRef.current) clearTimeout(temporizadorReboteRef.current);
        };
    }, []);

    // Se empaquetan y exponen todos los estados, manejadores y recursos textuales listos para la interfaz (UI)
    return {
        jugador,
        errorValidacion,
        dado,
        girando,
        rebotando,
        rotacion,
        textosInterfaz: reglasData.interfaz,
        manejarCambioEntrada,
        lanzarDado,
        resultado,
    };
}