function fullpageHeader() {
    const body = document.body;
    const toggleClass = "is-sticky";
    
    window.addEventListener("scroll", () => {
      const currentScroll = window.scrollY;
      if (currentScroll > 0) {
        body.classList.add(toggleClass);
      } else {
        body.classList.remove(toggleClass);
      }
    }); 

}


export default fullpageHeader;
