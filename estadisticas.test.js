const assert = require("node:assert/strict");
const {
    obtenerMedia,
    obtenerMediana,
    obtenerDesviacionEstandar,
    obtenerEstadisticas
} = require("./estadisticas");

const numeros = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const resultado = obtenerEstadisticas(numeros);

assert.equal(resultado.media, 5.5);
assert.equal(resultado.mediana, 5.5);
assert.ok(Math.abs(resultado.desviacionEstandar - 2.872281323) < 0.000001);
assert.equal(obtenerMedia([2, 4, 6]), 4);
assert.equal(obtenerMediana([1, 3, 5]), 3);
assert.equal(obtenerMediana([1, 4]), 2.5);
assert.equal(obtenerDesviacionEstandar([4, 4, 4]), 0);

assert.throws(() => obtenerMedia([]), /al menos dos números/);
assert.throws(() => obtenerEstadisticas([7]), /al menos dos números/);
assert.throws(() => obtenerMediana([1, "dos", 3]), /números válidos/);
assert.throws(() => obtenerEstadisticas([1, Infinity]), /números válidos/);

console.log("Todas las pruebas finalizaron correctamente.");
