document.addEventListener("DOMContentLoaded", function () {

    // ==========================================
    // 1. CONFIGURARE ȘI LOGICĂ EMAILJS (FORMULAR)
    // ==========================================
    const EMAILJS_PUBLIC_KEY = "MRoo7XtTyOEChmZfQ"; 
    const EMAILJS_SERVICE_ID = "service_zgjta79"; 
    const EMAILJS_TEMPLATE_ID = "template_iv8dw9b";

    // Inițializare EmailJS
    emailjs.init(EMAILJS_PUBLIC_KEY);

    const bookingForm = document.getElementById("booking-form");
    const statusMessage = document.getElementById("form-status");
    const submitBtn = document.getElementById("submit-btn");

    // Setare date minime pentru calendar (începând de azi)
    const today = new Date().toISOString().split("T")[0];
    const checkinInput = document.getElementById("checkin");
    const checkoutInput = document.getElementById("checkout");

    if (checkinInput) checkinInput.setAttribute("min", today);
    if (checkoutInput) checkoutInput.setAttribute("min", today);

    if (bookingForm) {
        bookingForm.addEventListener("submit", function (event) {
            event.preventDefault(); // Oprește reîncărcarea paginii

            const checkinDate = document.getElementById("checkin").value;
            const checkoutDate = document.getElementById("checkout").value;
            const fullName = document.getElementById("name").value.trim();
            const phoneNumber = document.getElementById("phone").value.trim();

            // Validare simplă: data de plecare trebuie să fie după data sosirii
            if (new Date(checkoutDate) <= new Date(checkinDate)) {
                statusMessage.textContent = "Eroare: Data plecării trebuie să fie după data sosirii!";
                statusMessage.className = "status-message status-error";
                return;
            }

            // Blocăm butonul pentru a preveni trimiterile multiple
            submitBtn.disabled = true;
            submitBtn.textContent = "Se trimite...";
            statusMessage.textContent = "";

            const templateParams = {
                name: fullName,
                checkin: checkinDate,
                checkout: checkoutDate,
                phone: phoneNumber
            };

            emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
                .then(function (response) {
                    console.log("Succes EmailJS:", response);
                    statusMessage.textContent = "Solicitarea a fost trimisă cu succes! Te vom contacta în curând.";
                    statusMessage.className = "status-message status-success";
                    bookingForm.reset();
                })
                .catch(function (error) {
                    console.error("Eroare EmailJS:", error);
                    statusMessage.textContent = "Eroare tehnică: " + (error.text || JSON.stringify(error));
                    statusMessage.className = "status-message status-error";
                })
                .finally(function () {
                    // Reactivează butonul la final
                    submitBtn.disabled = false;
                    submitBtn.textContent = "Trimite solicitarea";
                });
        });
    }

    // ==========================================
    // 2. FUNCȚIONALITATE GALERIE FOTO (MODAL)
    // ==========================================
    const modal = document.getElementById("imageModal");
    const modalImg = document.getElementById("img01");
    const captionText = document.getElementById("caption");
    const closeBtn = document.getElementsByClassName("close-modal")[0];
    const images = document.querySelectorAll(".gallery-item");

    if (modal && modalImg && closeBtn) {
        // Deschide modalul la click pe orice poză din galerie
        images.forEach(img => {
            img.addEventListener("click", function () {
                modal.style.display = "block";
                modalImg.src = this.src;
                if (captionText) {
                    captionText.innerHTML = this.alt; // Preia textul din atributul 'alt'
                }
            });
        });

        // Închide modalul la apăsarea butonului 'X'
        closeBtn.onclick = function () {
            modal.style.display = "none";
        };

        // Închide modalul și la click pe fundalul întunecat
        modal.onclick = function (event) {
            if (event.target === modal) {
                modal.style.display = "none";
            }
        };
    }

});