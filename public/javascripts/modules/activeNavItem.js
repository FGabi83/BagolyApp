function activeNavItem() {
  let path = window.location.pathname;
  let links = document.querySelectorAll('.nav--item');
  links.forEach(function(link) {
    if (link.getAttribute('href') === path) {
      link.classList.add('nav--item__active');
    } else {
      link.classList.remove('nav--item__active');
    }
  });
}

export default activeNavItem;