// Función para verificar el estado de los servicios
function checkServiceStatus() {
  // Realiza una solicitud para obtener el estado del servicio desde una URL externa
  fetch('https://api.allorigins.win/get?url=https://bitingenieria.com.ar/silex/feafip_prod/fe_dummy')
    .then(response => response.json()) // Convierte la respuesta a formato JSON
    .then(data => {
      const responseText = data.contents; // Obtiene el contenido JSON de la respuesta
      const jsonResponse = JSON.parse(responseText); // Analiza el JSON en un objeto

      const success = jsonResponse.success; // Extrae el valor de exito del servicio
      const servers = jsonResponse.dummyResults; // Extrae los resultados de los servidores

      // Verifica si cada uno de los servidores está en estado OK
      const isAppServerOK = servers.AppServer === 'OK';
      const isDbServerOK = servers.DbServer === 'OK';
      const isAuthServerOK = servers.AuthServer === 'OK';

      // Verifica si al menos uno de los servidores está en estado NO OK
      const isAnyServiceDown = !isAppServerOK || !isDbServerOK || !isAuthServerOK;

      // Actualiza la interfaz del usuario para cada servicio llamando a la función updateSemaforo
      updateSemaforo('appServer', isAppServerOK);
      updateSemaforo('dbServer', isDbServerOK);
      updateSemaforo('authServer', isAuthServerOK);
      updateSemaforo('afipService', !isAnyServiceDown); // Actualiza el servicio AFIP

    })
    .catch(error => {
      console.error('Error al obtener el estado del servicio:', error); // Manejo de errores
    });
}

// Función para actualizar el semáforo y el mensaje de estado
function updateSemaforo(serviceName, isOK) {
  const semaforo = document.getElementById(`${serviceName}Semaforo`); // Obtiene el elemento del semáforo por su ID
  const statusMessage = document.getElementById(`${serviceName}Status`); // Obtiene el elemento del mensaje de estado por su ID

  if (isOK) {
    semaforo.style.backgroundColor = 'green'; // Cambia a verde si el servicio está OK
    statusMessage.textContent = 'El servicio está OK'; // Muestra el mensaje de estado
  } else {
    semaforo.style.backgroundColor = 'red'; // Cambia a rojo si el servicio está caído
    statusMessage.textContent = 'El servicio está DOWN'; // Muestra el mensaje de estado
  }
}

// Realiza la verificación inicial y establece el intervalo de actualización cada 30 segundos
checkServiceStatus();
setInterval(checkServiceStatus, 30000);
