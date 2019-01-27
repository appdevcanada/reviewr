// Main JS

let app = {
    pages: null,
    init: function () {
        if(window.hasOwnProperty("cordova")){
            console.log("You're on a mobile device");
        }
        let isReady = (window.hasOwnProperty("cordova"))?'deviceready':'DOMContentLoaded';
        document.addEventListener(isReady, ()=>{
            app.pages = document.querySelectorAll('.page');
            app.pages[1].classList.add('active');
            app.pages.forEach( page => {
                page.querySelector('h1').addEventListener('click', app.navigate);
            });
        });
    },
    navigate: function(ev){
        ev.preventDefault();
        let tapped = ev.currentTarget; //the clicked h1
        console.log(tapped);
        document.querySelector('.active').classList.remove('active');
        //hide the only active page
        let target = tapped.getAttribute('data-target');
        document.getElementById(target).classList.add('active');
    }
};
app.init();
