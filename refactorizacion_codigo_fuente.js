const { obtenerEstadisticas } = require("./estadisticas");

function principal() {
    const numeros = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const estadisticas = obtenerEstadisticas(numeros);

    console.log(`Media: ${estadisticas.media}`);
    console.log(`Mediana: ${estadisticas.mediana}`);
    console.log(`Desviación estándar: ${estadisticas.desviacionEstandar}`);
}

if (require.main === module) {
    principal();
}

module.exports = { principal };