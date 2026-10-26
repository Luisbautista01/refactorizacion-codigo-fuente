const formulario = document.querySelector("#formulario");
const campoNumeros = document.querySelector("#numeros");
const mensaje = document.querySelector("#mensaje");
const cantidadDatos = document.querySelector("#cantidad-datos");
const cuerpoTabla = document.querySelector("#estadisticas");
const botonLimpiar = document.querySelector("#boton-limpiar");
const espacioMathML = "http://www.w3.org/1998/Math/MathML";
const formatoNumero = new Intl.NumberFormat("es-CO", {
    maximumFractionDigits: 4
});

function elementoMath(etiqueta, ...hijos) {
    const elemento = document.createElementNS(espacioMathML, etiqueta);
    hijos.forEach(hijo => elemento.append(
        typeof hijo === "string" ? document.createTextNode(hijo) : hijo
    ));
    return elemento;
}

function identificador(valor) {
    return elementoMath("mi", valor);
}

function operador(valor) {
    return elementoMath("mo", valor);
}

function numeroMath(valor) {
    return elementoMath("mn", formatoNumero.format(valor));
}

function fila(...hijos) {
    return elementoMath("mrow", ...hijos);
}

function fraccion(numerador, denominador) {
    return elementoMath("mfrac", numerador, denominador);
}

function raiz(contenido) {
    return elementoMath("msqrt", contenido);
}

function matematicas(expresion) {
    return elementoMath("math", fila(expresion));
}

function sumaNumeros(numeros) {
    const terminos = [];
    numeros.forEach((numero, indice) => {
        if (indice > 0) terminos.push(operador("+"));
        terminos.push(numeroMath(numero));
    });
    return fila(...terminos);
}

function crearPaso(titulo, expresion) {
    const paso = document.createElement("div");
    paso.className = "formula-paso";

    const etiqueta = document.createElement("span");
    etiqueta.className = "formula-etiqueta";
    etiqueta.textContent = titulo;

    const ecuacion = document.createElement("div");
    ecuacion.className = "formula-ecuacion";
    ecuacion.append(matematicas(expresion));

    paso.append(etiqueta, ecuacion);
    return paso;
}

function crearFila(numero, indicador, formula, aplicacion, resultado) {
    const filaTabla = document.createElement("tr");

    const numeroCelda = document.createElement("td");
    numeroCelda.className = "fila-numero";
    numeroCelda.textContent = String(numero);

    const indicadorCelda = document.createElement("th");
    indicadorCelda.scope = "row";
    indicadorCelda.className = "indicador";
    indicadorCelda.textContent = indicador;

    const formulaCelda = document.createElement("td");
    formulaCelda.className = "formula";
    formulaCelda.append(crearPaso("Fórmula", formula));

    const aplicacionCelda = document.createElement("td");
    aplicacionCelda.className = "aplicacion";
    aplicacionCelda.append(crearPaso("Aplicación", aplicacion));

    const resultadoCelda = document.createElement("td");
    resultadoCelda.className = "resultado-celda";
    const resultadoBadge = document.createElement("span");
    resultadoBadge.className = "resultado-badge";
    resultadoBadge.textContent = formatoNumero.format(resultado);
    resultadoCelda.append(resultadoBadge);

    filaTabla.append(
        numeroCelda,
        indicadorCelda,
        formulaCelda,
        aplicacionCelda,
        resultadoCelda
    );
    return filaTabla;
}

function formulaMedia(numeros, resultado) {
    const formula = fila(
        identificador("x̄"),
        operador("="),
        fraccion(
            fila(operador("Σ"), elementoMath("msub", identificador("x"), identificador("i"))),
            identificador("n")
        )
    );
    const aplicacion = fila(
        identificador("x̄"),
        operador("="),
        fraccion(sumaNumeros(numeros), elementoMath("mn", String(numeros.length))),
        operador("="),
        numeroMath(resultado)
    );
    return { formula, aplicacion };
}

function formulasMediana(numerosOrdenados, resultado) {
    const cantidad = numerosOrdenados.length;
    if (cantidad % 2 === 0) {
        const formula = fila(
            identificador("Me"),
            operador("="),
            fraccion(
                fila(
                    elementoMath("msub", identificador("x"), fraccion(identificador("n"), elementoMath("mn", "2"))),
                    operador("+"),
                    elementoMath(
                        "msub",
                        identificador("x"),
                        fila(
                            fraccion(identificador("n"), elementoMath("mn", "2")),
                            operador("+"),
                            elementoMath("mn", "1")
                        )
                    )
                ),
                elementoMath("mn", "2")
            )
        );
        const aplicacion = fila(
            identificador("Me"),
            operador("="),
            fraccion(
                fila(
                    numeroMath(numerosOrdenados[cantidad / 2 - 1]),
                    operador("+"),
                    numeroMath(numerosOrdenados[cantidad / 2])
                ),
                elementoMath("mn", "2")
            ),
            operador("="),
            numeroMath(resultado)
        );
        return { formula, aplicacion };
    }

    const formula = fila(
        identificador("Me"),
        operador("="),
        elementoMath(
            "msub",
            identificador("x"),
            fraccion(
                fila(identificador("n"), operador("+"), elementoMath("mn", "1")),
                elementoMath("mn", "2")
            )
        )
    );
    const aplicacion = fila(
        identificador("Me"),
        operador("="),
        numeroMath(numerosOrdenados[Math.floor(cantidad / 2)]),
        operador("="),
        numeroMath(resultado)
    );
    return { formula, aplicacion };
}

function formulasDesviacion(numeros, media, resultado) {
    const terminos = [];
    numeros.forEach((numero, indice) => {
        if (indice > 0) terminos.push(operador("+"));
        terminos.push(elementoMath(
            "msup",
            fila(
                operador("("),
                numeroMath(numero),
                operador("−"),
                numeroMath(media),
                operador(")")
            ),
            elementoMath("mn", "2")
        ));
    });

    const formula = fila(
        identificador("σ"),
        operador("="),
        raiz(fraccion(
            fila(
                operador("Σ"),
                elementoMath(
                    "msup",
                    fila(identificador("x"), operador("−"), identificador("x̄")),
                    elementoMath("mn", "2")
                )
            ),
            identificador("N")
        ))
    );
    const aplicacion = fila(
        identificador("σ"),
        operador("="),
        raiz(fraccion(
            fila(...terminos),
            elementoMath("mn", String(numeros.length))
        )),
        operador("="),
        numeroMath(resultado)
    );
    return { formula, aplicacion };
}

function mostrarFilaVacia(texto) {
    const filaVacia = document.createElement("tr");
    const celda = document.createElement("td");
    celda.colSpan = 5;
    celda.className = "tabla-vacia";
    celda.textContent = texto;
    filaVacia.append(celda);
    cuerpoTabla.replaceChildren(filaVacia);
}

botonLimpiar.hidden = campoNumeros.value.trim() === "";

formulario.addEventListener("submit", evento => {
    evento.preventDefault();
    mensaje.textContent = "";
    mensaje.className = "mensaje";
    cantidadDatos.textContent = "Sin datos";
    mostrarFilaVacia("No hay resultados para mostrar.");
    botonLimpiar.hidden = campoNumeros.value.trim() === "";

    try {
        const valores = campoNumeros.value.split(",").map(valor => valor.trim());
        if (valores.some(valor => valor === "")) {
            throw new Error("Revisa la lista: no dejes espacios vacíos entre comas.");
        }

        const numeros = valores.map(Number);
        const resultado = window.Estadisticas.obtenerEstadisticas(numeros);
        const ordenados = [...numeros].sort((a, b) => a - b);
        const media = formulaMedia(numeros, resultado.media);
        const mediana = formulasMediana(ordenados, resultado.mediana);
        const desviacion = formulasDesviacion(
            numeros,
            resultado.media,
            resultado.desviacionEstandar
        );

        cuerpoTabla.replaceChildren(
            crearFila(
                1,
                "Media aritmética",
                media.formula,
                media.aplicacion,
                resultado.media
            ),
            crearFila(
                2,
                "Mediana",
                mediana.formula,
                mediana.aplicacion,
                resultado.mediana
            ),
            crearFila(
                3,
                "Desviación estándar poblacional",
                desviacion.formula,
                desviacion.aplicacion,
                resultado.desviacionEstandar
            )
        );

        cantidadDatos.textContent = `${numeros.length} datos`;
        mensaje.textContent = "Cálculo realizado correctamente.";
        mensaje.classList.add("exito");
    } catch (error) {
        mensaje.textContent = error.message;
        mensaje.classList.add("error");
    }
});

botonLimpiar.addEventListener("click", () => {
    formulario.reset();
    mensaje.textContent = "";
    mensaje.className = "mensaje";
    cantidadDatos.textContent = "Sin datos";
    mostrarFilaVacia("Introduce una lista de números para ver los resultados.");
    botonLimpiar.hidden = true;
    campoNumeros.focus();
});

campoNumeros.addEventListener("input", () => {
    botonLimpiar.hidden = campoNumeros.value.trim() === "";
});