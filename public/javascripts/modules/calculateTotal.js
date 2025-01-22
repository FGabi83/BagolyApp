function calculateTotal() {
  const rows = document.querySelectorAll('.denomination-row input');
  let total = 0;
  rows.forEach(row => {
    const value = parseFloat(row.dataset.denomination) || 0;
    const count = parseInt(row.value) || 0;
    total += value * count;
  });
  document.getElementById('countedAmount').value = total;
  document.getElementById('total-display').textContent = `${total} Ft`;
}

// Globális scope-ba helyezés
window.calculateTotal = calculateTotal;
