function detectarTema() {
    const guardado = localStorage.getItem("theme");

    if (guardado) {
        document.documentElement.setAttribute("data-bs-theme", guardado);
    } else {
        const oscuro = window.matchMedia("(prefers-color-scheme: dark)").matches;
        document.documentElement.setAttribute("data-bs-theme", oscuro ? "dark" : "light");
    }
}

function toggleTheme() {
    const actual = document.documentElement.getAttribute("data-bs-theme");
    const nuevo = actual === "dark" ? "light" : "dark";

    document.documentElement.setAttribute("data-bs-theme", nuevo);
    localStorage.setItem("theme", nuevo);
}

detectarTema();