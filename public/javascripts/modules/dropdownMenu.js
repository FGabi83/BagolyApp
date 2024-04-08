function dropdownMenu() {
  const navMenu = document.querySelector(".nav-menu");
  const navWrapper = document.querySelector(".nav--wrapper");
  
  
  navMenu.addEventListener("click", () => { 
    console.log("clicked");
    navWrapper.classList.toggle("is-open");
    navMenu.classList.toggle("highlight");
  }); 
}

export default dropdownMenu;
