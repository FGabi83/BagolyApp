function dropdownMenu() {
  const navMenu = document.querySelector(".nav-menu");
  const navWrapper = document.querySelector(".nav--wrapper");
  const dropdownNavbar = document.querySelector(".nav");
  
  navMenu.addEventListener("click", () => { 
    navWrapper.classList.toggle("is-open");
    navMenu.classList.toggle("highlight");
  }); 
}

export default dropdownMenu;
