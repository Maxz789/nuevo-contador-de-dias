document.addEventListener("DOMContentLoaded", () => {
    renderRegiones();
});

function renderRegiones() {

    const regiones = [
        { id: "arica", nombre: "Arica y Parinacota" },
        { id: "tarapaca", nombre: "Tarapacá" },
        { id: "antofagasta", nombre: "Antofagasta" },
        { id: "atacama", nombre: "Atacama" },
        { id: "coquimbo", nombre: "Coquimbo" },
        { id: "valparaiso", nombre: "Valparaíso" },
        { id: "metropolitana", nombre: "Metropolitana" },
        { id: "ohiggins", nombre: "O’Higgins" },
        { id: "maule", nombre: "Maule" },
        { id: "nuble", nombre: "Ñuble" },
        { id: "biobio", nombre: "Biobío" },
        { id: "araucania", nombre: "La Araucanía" },
        { id: "rios", nombre: "Los Ríos" },
        { id: "lagos", nombre: "Los Lagos" },
        { id: "aysen", nombre: "Aysén" },
        { id: "magallanes", nombre: "Magallanes" }
    ];

    let html = `
        <div class="row mb-3">
            <div class="col-12">
                <div class="region-card active" data-region="cl">
                    <img src="img/regiones/cl.jpg">
                    <div class="overlay"></div>
                    <div class="region-name">Todo Chile</div>
                </div>
            </div>
        </div>
        <div class="row g-3">
    `;

    html += regiones.map(r => `
        <div class="col-6 col-md-3">
            <div class="region-card" data-region="${r.id}">
                <img src="img/regiones/${r.id}.jpg">
                <div class="overlay"></div>
                <div class="region-name">${r.nombre}</div>
            </div>
        </div>
    `).join("");

    html += "</div>";

    document.getElementById("regionContainer").innerHTML = html;

    activarSelector();
}

function activarSelector() {
    document.querySelectorAll(".region-card").forEach(card => {
        card.addEventListener("click", () => {
            document.querySelectorAll(".region-card")
                .forEach(c => c.classList.remove("active"));

            card.classList.add("active");
        });
    });
}

function obtenerRegionSeleccionada() {
    return document.querySelector(".region-card.active").dataset.region;
}

function esFeriado(fechaStr, region) {
    if (FERIADOS_NACIONALES.includes(fechaStr)) return true;
    if (FERIADOS_REGIONALES[region]) {
        return FERIADOS_REGIONALES[region].includes(fechaStr);
    }
    return false;
}

function esDiaValido(fecha, tipo, region) {
    const dia = fecha.getDay();
    const fechaStr = fecha.toISOString().split("T")[0];

    if (tipo === "corridos") return true;
    if (esFeriado(fechaStr, region)) return false;

    if (tipo === "habiles") return dia !== 0;
    if (tipo === "administrativos") return dia !== 0 && dia !== 6;

    return true;
}

function calcularFecha(fechaInicial, dias, tipo, region) {
    let fecha = new Date(fechaInicial);
    let contador = 0;
    let dir = dias >= 0 ? 1 : -1;

    let feriados = 0;
    let noHabiles = 0;

    while (contador < Math.abs(dias)) {
        fecha.setDate(fecha.getDate() + dir);

        if (!esDiaValido(fecha, tipo, region)) {
            if (esFeriado(fecha.toISOString().split("T")[0], region)) feriados++;
            else noHabiles++;
            continue;
        }

        contador++;
    }

    return { fecha, feriados, noHabiles };
}

function calcular() {
    const fechaInput = document.getElementById("fechaInicio").value;
    const dias = parseInt(document.getElementById("dias").value);
    const tipo = document.getElementById("tipo").value;
    const region = obtenerRegionSeleccionada();

    if (!fechaInput || isNaN(dias)) {
        alert("Completa los campos");
        return;
    }

    const res = calcularFecha(fechaInput, dias, tipo, region);

    const fechaInicial = new Date(fechaInput).toLocaleDateString("es-CL");
    const fechaFinal = res.fecha.toLocaleDateString("es-CL");

    // Tipo texto
    let tipoTexto = "";
    if (tipo === "corridos") tipoTexto = "días corridos";
    if (tipo === "habiles") tipoTexto = "días hábiles";
    if (tipo === "administrativos") tipoTexto = "días administrativos";

    // Región texto
    const regionTexto = region === "cl"
        ? "en todo Chile"
        : "en la región seleccionada";

    const accion = dias >= 0 ? "Sumando" : "Restando";

    const mensaje = `La fecha final es ${fechaFinal} ${accion} ${Math.abs(dias)} ${tipoTexto} desde el ${fechaInicial} ${regionTexto}. `;

    const resultadoBox = document.getElementById("resultado");
    const detalleBox = document.getElementById("detalle");
    const btn = document.getElementById("btnCalcular");

    // Mostrar resultado
    resultadoBox.classList.remove("d-none");
    detalleBox.classList.remove("d-none");

    resultadoBox.innerText = mensaje;
    detalleBox.innerText =
        `Se excluyeron ${res.feriados} feriados y ${res.noHabiles} días no hábiles`;

    // Animación
    resultadoBox.classList.add("updated");
    setTimeout(() => resultadoBox.classList.remove("updated"), 300);

    // Cambiar botón
    btn.innerText = "Volver";
    btn.classList.remove("btn-primary");
    btn.classList.add("btn-secondary");
    btn.onclick = volver;
}

function volver() {
    const resultadoBox = document.getElementById("resultado");
    const detalleBox = document.getElementById("detalle");
    const btn = document.getElementById("btnCalcular");

    // Ocultar resultado
    resultadoBox.classList.add("d-none");
    detalleBox.classList.add("d-none");

    // Restaurar botón
    btn.innerText = "Calcular";
    btn.classList.remove("btn-secondary");
    btn.classList.add("btn-primary");
    btn.onclick = calcular;
}