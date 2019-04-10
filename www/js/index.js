// Author: Luis Souza
// REVIEWR - just a simple Android app with Cordova on Windows
// that allows the user to take a picture of anything and review it.

'use strict'

let app = {
  reviews: [],
  pages: [],
  setStar: -1,
  init: function () {
    document.addEventListener('deviceready', app.ready, false);
  },
  ready: function () {
    app.addListeners();
  },
  imgCapture: function (capturedIMG) {
    console.log("Capture OK");
    app.loadPage(2);
    document.querySelector("#rv-img").src = capturedIMG;
    app.clearRating();
  },
  wtf: function (err) {
    console.warn('Failure: Camera aborted');
  },
  addListeners: function () {
    document.addEventListener('pause', () => {
      console.log('system paused');
    });
    document.addEventListener('resume', () => {
      console.log('system resumed');
    });
    document.querySelector("#fab").addEventListener('click', app.takePicture);
    document.querySelector("#del-btn").addEventListener('click', app.delReview);
    document.querySelector("#cancel-btn").addEventListener('click', app.cancelAdd);
    document.querySelector("#save-btn").addEventListener('click', app.saveLS);
    document.querySelector("#bck-btn").addEventListener('click', app.cancelRvw);
    let spans = document.querySelectorAll("div.det-add-rating > span");
    for (let i = 0; i < spans.length; i++) {
      spans[i].addEventListener('click', app.setRating);
    };
    spans = document.querySelectorAll("div.det-rating > span");
    for (let i = 0; i < spans.length; i++) {
      spans[i].addEventListener('click', app.setRating);
    };
    app.loadEvents();
  },
  loadEvents: function () {
    app.loadPage(0);
    app.loadLS();
  },
  cancelAdd: function () {
    document.querySelector("#add-ttl").value = "";
    app.clearRating();
    app.loadEvents();
  },
  cancelRvw: function () {
    app.updReview();
    document.querySelector("#det-ttl").value = "";
    app.clearRating();
    app.loadEvents();
  },
  delReview: function (e) {
    let lsReviews = localStorage.getItem("Reviews");
    app.reviews = JSON.parse(lsReviews);
    for (let i = 0; i < app.reviews.length; i++) {
      if (app.reviews[i]["id"] == e.target.data_id) {
        app.reviews.splice(app.reviews.indexOf(i), 1);
        localStorage.setItem("Reviews", JSON.stringify(app.reviews));
      }
    }
    app.loadEvents();
  },
  detReview: function (e) {
    let dataLoaded = {};
    let lsReviews = localStorage.getItem("Reviews");
    app.reviews = JSON.parse(lsReviews);
    for (let i = 0; i < app.reviews.length; i++) {
      if (app.reviews[i]["id"] == e.target.id) {
        dataLoaded = {
          id: app.reviews[i]["id"],
          title: app.reviews[i]["title"],
          rating: app.reviews[i]["rating"],
          img: app.reviews[i]["img"]
        };
        app.setStar = dataLoaded.rating;
        break;
      }
    }
    document.querySelector("#detail-img").src = dataLoaded.img;
    document.querySelector("#det-ttl").value = dataLoaded.title;
    document.querySelector("#del-btn").data_id = dataLoaded.id;
    let rating = document.querySelectorAll("div.det-rating > span");
    for (let i = 0; i <= dataLoaded.rating; i++) {
      rating[i].classList.add("checked");
    }
    app.loadPage(1);
  },
  takePicture: function () {
    let opts = {
      allowEdit: false,
      correctOrientation: true,
      quality: 80,
      destinationType: Camera.DestinationType.FILE_URI,
      sourceType: Camera.PictureSourceType.CAMERA,
      mediaType: Camera.MediaType.PICTURE,
      encodingType: Camera.EncodingType.PNG,
      cameraDirection: Camera.Direction.BACK,
      targetHeight: 400,
      targetWidth: 380
    };
    navigator.camera.getPicture(app.imgCapture, app.wtf, opts);
  },
  loadLS: function () {
    let dataLoaded = {};
    let lsReviews = localStorage.getItem("Reviews");
    if (lsReviews != null) {
      app.reviews = JSON.parse(lsReviews);
      let ulList = document.querySelector(".rv-list");
      ulList.innerHTML = "";
      for (let i = 0; i < app.reviews.length; i++) {
        dataLoaded = {
          id: app.reviews[i]["id"],
          title: app.reviews[i]["title"],
          rating: app.reviews[i]["rating"],
          img: app.reviews[i]["img"]
        };
        let listLine = document.createElement("li");
        listLine.setAttribute("class", "rv-item");
        listLine.setAttribute("id", dataLoaded.id);

        let listImg = document.createElement("img");
        listImg.setAttribute("class", "rv-img");
        listImg.setAttribute("src", dataLoaded.img);

        let listTitle = document.createElement("h3");
        listTitle.setAttribute("class", "rv-title");
        listTitle.textContent = dataLoaded.title;

        let listDiv = document.createElement("div");
        listDiv.setAttribute("class", "rv-rating");

        let listChk = document.createElement("h3");
        listChk.setAttribute("class", "checked");
        for (let i = 0; i <= dataLoaded.rating; i++) {
          listChk.textContent += "★";
        }
        ulList.appendChild(listLine);
        listLine.appendChild(listImg);
        listLine.appendChild(listTitle);
        listLine.appendChild(listDiv);
        listDiv.appendChild(listChk);
        if (dataLoaded.rating < 4) {
          let listUnChk = document.createElement("h3");
          for (let i = 1; i <= 4 - dataLoaded.rating; i++) {
            listUnChk.textContent += "★";
          }
          listDiv.appendChild(listUnChk);
        }
        // <li class="rv-item" id="">
        //   <img class="rv-img" src="" />
        //   <h3 class="rv-title">Just a TITLE</h3>
        //   <div class="rv-rating">
        //     <h3 class="checked">★★★</h3>
        //     <h3>★★</h3>
        //   </div>
        // </li>
        listLine.addEventListener('click', app.detReview);
      };
      console.log(localStorage['Reviews']);
    }
  },
  updReview: function () {
    let updReview = {
      id: new Date().getTime(),
      title: document.querySelector("#det-ttl").value,
      rating: app.setStar,
      img: document.querySelector("#detail-img").src
    };
    if (localStorage['Reviews']) {
      let _id = document.querySelector("#del-btn").data_id;
      app.reviews = JSON.parse(localStorage['Reviews']);
      for (let i = 0; i < app.reviews.length; i++) {
        if (app.reviews[i]["id"] == _id) {
          app.reviews.splice(app.reviews.indexOf(i), 1);
        }
      }
    }
    app.reviews.push(updReview);
    localStorage.setItem("Reviews", JSON.stringify(app.reviews));
    console.log(localStorage['Reviews']);
  },
  saveLS: function () {
    let newReview = {
      id: new Date().getTime(),
      title: document.querySelector("#add-ttl").value,
      rating: app.setStar,
      img: document.querySelector("#rv-img").src
    };
    if (localStorage['Reviews']) {
      app.reviews = JSON.parse(localStorage['Reviews']);
    }
    if (app.reviews != null) {
      app.reviews.push(newReview);
    } else {
      app.reviews = [newReview];
    }
    localStorage.setItem("Reviews", JSON.stringify(app.reviews));
    console.log(localStorage['Reviews']);
    app.cancelAdd();
  },
  loadPage: function (page) {
    let pages = document.querySelectorAll(".pages");
    for (let i = 0; i < pages.length; i++) {
      if (i == page) {
        pages[i].classList.toggle("hide");
      } else {
        pages[i].classList.remove("hide");
        pages[i].classList.add("hide");
      }
    }
    document.querySelector(".footer").classList.toggle("hide");
  },
  setRating: function (e) {
    const clearAll = document.querySelectorAll("div." + e.target.parentNode.className + " > span");
    [...clearAll].forEach(star => {
      star.classList.remove("checked");
    });
    for (let i = 0; i <= e.target.id; i++) {
      clearAll[i].classList.add("checked");
    }
    app.setStar = e.target.id;
  },
  clearRating: function () {
    const clearAll = document.querySelectorAll("span.fa");
    [...clearAll].forEach(star => {
      star.classList.remove("checked");
    });
  }
};

app.init();
