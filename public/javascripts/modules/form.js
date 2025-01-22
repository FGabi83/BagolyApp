document.addEventListener('DOMContentLoaded', function() {
  const dateInput = document.getElementById('shiftStart');
  const now = new Date();
  const noon = new Date();
  noon.setHours(12, 0, 0, 0); // Déli 12:00 időpontja

  // Ha déli 12:00 előtt van, állítsuk az előző napot, különben a mai napot
  const defaultDate = now < noon ? new Date(now.setDate(now.getDate() - 1)) : now;

  // Formázd az alapértelmezett dátumot yyyy-mm-dd formátumba
  const year = defaultDate.getFullYear();
  const month = (defaultDate.getMonth() + 1).toString().padStart(2, '0');
  const day = defaultDate.getDate().toString().padStart(2, '0');
  const formattedDate = `${year}-${month}-${day}`;
  if (dateInput) {
    dateInput.value = formattedDate;
  }

  // Küldés gomb kezelése
  const form = document.getElementById('dataForm');
  const submitButton = document.getElementById('submitButton');

  if (form) {
    form.addEventListener('submit', function() {
      // Gomb tiltása és szöveg frissítése
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = 'Küldés folyamatban...';
      }
    });
  }
});
