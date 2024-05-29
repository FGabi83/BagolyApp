function accordion() {
  const button = document.querySelector('.js-accordion--btn');
  const content = document.querySelector('.js-accordion--content');
  
  function toggleText() {
    if (button.textContent === 'Tovább') {
      button.textContent = 'Vissza';
    } else {
      button.textContent = 'Tovább';
    }
  }

  button.addEventListener('click', () => {
    console.log('click');
    content.classList.toggle('js-active');
    toggleText();
  });

  
};

export default accordion;