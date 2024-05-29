function activeNavItem() {
  let path = window.location.pathname;
  let links = document.querySelectorAll('.js-nav--item');
  links.forEach(function(link) {
    if (link.getAttribute('href') === path) {
      link.classList.add('js-nav--item__active');
    } else {
      link.classList.remove('js-nav--item__active');
    }
  });
}

export default activeNavItem;