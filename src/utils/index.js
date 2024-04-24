// Función para obtener el valor de una cookie específica
export function getCookieValue(cookieName) {
  // Separar todas las cookies en un array
  var cookies = document.cookie.split(';');

  // Iterar sobre cada cookie para encontrar la que coincida con el nombre proporcionado
  for (var i = 0; i < cookies.length; i++) {
    var cookie = cookies[i].trim(); // Eliminar espacios en blanco

    // Verificar si la cookie actual comienza con el nombre buscado
    if (cookie.indexOf(cookieName + '=') === 0) {
      // Si la cookie coincide, devolver su valor
      return cookie.substring(cookieName.length + 1); // +1 para eliminar el signo '='
    }
  }

  // Si no se encuentra la cookie, devolver null o lo que consideres adecuado
  return null;
}

// Obtener el valor de la cookie 'token'
