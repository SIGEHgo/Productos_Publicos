var modal = document.getElementById('myModal');
var modalImg = document.getElementById("img01");
var captionText = document.getElementById("caption");


document.addEventListener('click', function (e) {
    var img = e.target.closest('#myImg');
    if (!img) return;

    modal.style.display = "block";
    modalImg.src = img.src;
    modalImg.alt = img.alt;
    captionText.innerHTML = img.alt;
});

modal.onclick = function () {
    modalImg.className += " out";
    setTimeout(function () {
        modal.style.display = "none";
        modalImg.className = "modal-content";
    }, 400);
};