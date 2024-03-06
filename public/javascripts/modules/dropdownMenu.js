function dropdownMenu() {
  const navMenu = document.querySelector(".nav-menu");
  const navWrapper = document.querySelector(".nav--wrapper");
  const dropdownNavbar = document.querySelector(".nav");
  
  navMenu.addEventListener("click", () => { 
    dropdownNavbar.classList.toggle("show");
    navMenu.classList.toggle("highlight");
  }); 
}

export default dropdownMenu;
