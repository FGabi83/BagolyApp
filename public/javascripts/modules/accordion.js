function accordion() {
    const button = document.querySelector('.accordion-btn');
    const content = document.querySelector('.accordion-content');
    
    function toggleText() {
      if (button.textContent === 'Tovább') {
        button.textContent = 'Vissza';
      } else {
        button.textContent = 'Tovább';
      }
    }

    button.addEventListener('click', () => {
      content.classList.toggle('active');
      toggleText();
    });
  };
  
  export default accordion;