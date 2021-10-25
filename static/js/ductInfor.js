function descriptionRow() {
    let status = document.getElementById("description-row").style.display;
    if (status == "none") {
        document.getElementById("description-row").style.display = "";
    } else {
        document.getElementById("description-row").style.display = "none";
    }
}