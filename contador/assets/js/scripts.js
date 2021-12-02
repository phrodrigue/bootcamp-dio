
var contadores = {
    "normal": 0,
    "noNegatives": 0
}

const dec1 = document.getElementById("dec1")
const inc1 = document.getElementById("inc1")
const dec2 = document.getElementById("dec2")
const inc2 = document.getElementById("inc2")


dec1.addEventListener("click", () => {
    contadores.normal--
    document.getElementById("normal-cont").innerHTML = contadores.normal 
})

inc1.addEventListener("click", () => {
    contadores.normal++
    document.getElementById("normal-cont").innerHTML = contadores.normal 
})


dec2.addEventListener("click", () => {
    contadores.noNegatives--
    document.getElementById("no-neg-cont").innerHTML = contadores.noNegatives 
    if (contadores.noNegatives === 0) {
        dec2.disabled = true
    }
})

inc2.addEventListener("click", () => {
    dec2.disabled = false
    contadores.noNegatives++
    document.getElementById("no-neg-cont").innerHTML = contadores.noNegatives 
})