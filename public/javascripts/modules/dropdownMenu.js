function dropdownMenu() {
  const navMenu = document.querySelector(".js-nav--menu");
  const navWrapper = document.querySelector(".js-nav--wrapper");
  
  
  navMenu.addEventListener("click", () => { 
    console.log("clicked");
    navWrapper.classList.toggle("js-is-open");
    navMenu.classList.toggle("js-highlight");
  }); 
}

export default dropdownMenu;
