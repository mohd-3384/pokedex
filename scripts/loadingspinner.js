/**
 * 
 * function to show the spinner
 */
function showSpinner() {
    document.querySelector(".spinner").style.display = "block";
    document.querySelector(".spinner-title").textContent = "Pokémon-Daten werden geladen...";
}

/**
 *
 * function to hide the spinner
 */
function hideSpinner() {
    document.querySelector(".spinner").style.display = "none";
    document.querySelector(".spinner-title").style.display = "none";
}