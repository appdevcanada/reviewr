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
            app.pages[0].classList.add('active');
            app.getLSData();
            /*             app.pages.forEach( page => {
                page.querySelector('h1').addEventListener('click', app.navigate);
            });
 */        });
    },
/*     navigate: function(ev){
        ev.preventDefault();
        let tapped = ev.currentTarget; //the clicked h1
        console.log(tapped);
        document.querySelector('.active').classList.remove('active');
        //hide the only active page
        let target = tapped.getAttribute('data-target');
        document.getElementById(target).classList.add('active');
        app.getLSData();
    },
 */    getLSData: function(ev){
        // First see if data exists in local storage
        if (localStorage.length > 0) {
            // Keys exist in local storage so let's get their values
            localStorage.forEach( key => {
                let idTag = JSON.parse(localStorage.getItem(idKey));
                let titleTag = document.getElementById("titletag");
                let ratingTag = document.getElementById("ratingtag");
                let imgTag = document.getElementById("imgtag");
                
                titleTag.value = JSON.parse(localStorage.getItem(titleKey));
                ratingTag.value = JSON.parse(localStorage.getItem(ratingKey));
                imgTag.value = JSON.parse(localStorage.getItem(imgKey));
    
            })

        } else {
            //data doesn't exist in local storage
            let slider = document.getElementById("sliderating");
            let output = document.getElementById("lblvalue");
            output.innerHTML = slider.value;
            slider.oninput = function() {
                output.innerHTML = this.value;
            }
            app.pages[0].classList.remove('active');
            app.pages[2].classList.add('active');
            console.log("Data not saved in Local Storage");
            }   
        }   
};
app.init();
