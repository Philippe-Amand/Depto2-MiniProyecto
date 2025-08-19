import { useEffect, useRef } from 'react';
import { useAuth } from '../context/hooks';

function IdleTimer() {
  const { logoutUser } = useAuth();
  
  // useRef para mantener una referencia al temporizador a través de los renders
  const timerRef = useRef(null);

  const INACTIVITY_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutos

  // Función para reiniciar el temporizador
  const resetTimer = () => {
    // Limpia el temporizador anterior
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    
    // Inicia un nuevo temporizador
    timerRef.current = setTimeout(() => {
      // Cuando el temporizador se completa, cierra la sesión
      console.log("Cerrando sesión por inactividad.");
      logoutUser();
    }, INACTIVITY_TIMEOUT_MS);
  };

  useEffect(() => {
    // Lista de eventos que consideraremos como "actividad"
    const events = ['mousemove', 'keypress', 'click', 'scroll'];

    // Inicia el temporizador cuando el componente se monta
    resetTimer();

    // Añade los event listeners a la ventana
    events.forEach(event => {
      window.addEventListener(event, resetTimer);
    });

    // Función de limpieza: se ejecuta cuando el componente se desmonta
    return () => {
      // Limpia el temporizador
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      // Elimina los event listeners para evitar fugas de memoria
      events.forEach(event => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, []); // El array vacío asegura que este efecto se ejecute solo una vez

  // Este componente no renderiza nada en la UI
  return null;
}

export default IdleTimer;