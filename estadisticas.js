/* Valida la lista de números. */
function validarNumeros(numeros) {
    if (!Array.isArray(numeros) || numeros.length < 2) {
        throw new Error("Se deben ingresar al menos dos números.");
    }

    if (!numeros.every(numero =>
        typeof numero === "number" && Number.isFinite(numero)
    )) {
        throw new Error("Todos los elementos deben ser números válidos.");
    }
}

/* Calcula la media aritmética. */
function obtenerMedia(numeros) {
    validarNumeros(numeros);

    return numeros.reduce((total, numero) => total + numero, 0)
        / numeros.length;
}

/* Calcula la mediana. */
function obtenerMediana(numeros) {
    validarNumeros(numeros);

    const ordenados = [...numeros].sort((a, b) => a - b);
    const mitad = Math.floor(ordenados.length / 2);

    return ordenados.length % 2 === 0
        ? (ordenados[mitad - 1] + ordenados[mitad]) / 2
        : ordenados[mitad];
}

/* Calcula la desviación estándar poblacional. */
function obtenerDesviacionEstandar(numeros, media = obtenerMedia(numeros)) {
    validarNumeros(numeros);

    const varianza = numeros.reduce(
        (total, numero) => total + (numero - media) ** 2, 0
    ) / numeros.length;

    return Math.sqrt(varianza);
}

/* Obtiene las estadísticas de una lista. */
function obtenerEstadisticas(numeros) {
    validarNumeros(numeros);

    const media = obtenerMedia(numeros);

    return {
        media,
        mediana: obtenerMediana(numeros),
        desviacionEstandar: obtenerDesviacionEstandar(numeros, media)
    };
}

const funcionesEstadisticas = {
    validarNumeros,
    obtenerMedia,
    obtenerMediana,
    obtenerDesviacionEstandar,
    obtenerEstadisticas
};

if (typeof module !== "undefined" && module.exports) {
    module.exports = funcionesEstadisticas;
} else {
    window.Estadisticas = funcionesEstadisticas;
}
