domStrings = {
    countDown: document.querySelector('#countdown'),
    missionName: document.querySelector('#mission-name'),    
    launchSite: document.querySelector('#launch-site'),
    missionContent: document.querySelector('#mission-content'),
    rocketName: document.querySelector('#rocket-name'),
    mainTitle: document.querySelector('#main-title')
}

async function getNextLaunch(){      
    const response = await fetch('https://api.spacexdata.com/v4/launches/next');         
    const data = await response.json();        
    return data;    
}
async function getLaunchPad(id){           
    const response = await fetch(`https://api.spacexdata.com/v4/launchpads/${id}`);
    const data = await response.json();
    return data;
}

async function getRocket(id){
    const response = await fetch(`https://api.spacexdata.com/v4/rockets/${id}`);
    const data = await response.json();
    return data;
}

function updateDom(nextLaunch, countDownString, launchPad, rocket){    
    countDownString ? domStrings.countDown.innerHTML = countDownString : domStrings.countDown.innerHTML = "N/A";
    nextLaunch.name ? domStrings.missionName.innerHTML = nextLaunch.name : domStrings.missionName.innerHTML = "N/A";
    launchPad.full_name ? domStrings.launchSite.innerHTML = launchPad.full_name : domStrings.launchSite.innerHTML = "N/A";
    nextLaunch.details ? domStrings.missionContent.innerHTML = nextLaunch.details : domStrings.missionContent.innerHTML = "N/A";
    rocket.name ? domStrings.rocketName.innerHTML = rocket.name : domStrings.rocketName.innerHTML = "N/A";

    //domStrings.countDown.innerHTML = countDownString;
    //domStrings.missionName.innerHTML = nextLaunch.name;
    //domStrings.launchSite.innerHTML = launchPad.full_name;    
    //domStrings.missionContent.innerHTML = nextLaunch.details;    //
    //domStrings.rocketName.innerHTML = rocket.name;

}

function initializeMap(launchPad){
    var mymap = L.map('mapid');
    mymap.setView([launchPad.latitude, launchPad.longitude],6);
    
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'pk.eyJ1IjoiYWFyb25zbiIsImEiOiJja2Vvb2hlaXQwcm8xMzF0NWNxcjFiYnR1In0.YyuRfMBfT_eyEGi9wKs0bg'
    }).addTo(mymap);
    
    var customIcon = L.icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
        
    })
    var marker = L.marker([launchPad.latitude, launchPad.longitude], {
        icon: customIcon
    }).addTo(mymap);    
}

function hideLoadingScreen(){
    let loadingPage = document.querySelector(".layout-loading-page");
    loadingPage.classList.toggle("is-active");
}

function formatDateToString(date){
    let days = Math.floor(date / (1000 * 60 * 60 * 24));
    let hours = Math.floor((date % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = Math.floor((date % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((date % (1000 * 60)) / 1000);  
    
    let countDownTimer = new Array();    
    days > 0 ? countDownTimer.push(`${days} days`) : countDownTimer.push('0 days');
    hours > 0 ? countDownTimer.push(`${hours} hours`) : countDownTimer.push( '0 hours') ; 
    minutes > 0 ? countDownTimer.push(`${minutes} minutes`) : countDownTimer.push('0 minutes');
    seconds > 0 ? countDownTimer.push(`${seconds} seconds`) : countDownTimer.push('0 seconds');           
    
    return countDownTimer.join(', ');
}

function makeCountDownTimerCountDown(timeUntilNextLaunch){    
    setInterval(function(){    
        timeUntilNextLaunch = timeUntilNextLaunch - 1000;        
        domStrings.countDown.innerHTML = formatDateToString(timeUntilNextLaunch);        
    }, 1000);
}

function makeCountDownTimerCountUp(timeSinceLastLaunch){
    setInterval(function(){    
            timeSinceLastLaunch = timeSinceLastLaunch + 1000;        
            let countDownString = formatDateToString(timeSinceLastLaunch)
            let auxString = "\n ago";            
            domStrings.countDown.innerHTML = countDownString + auxString;
    }, 1000);
}

async function displayNextLaunch(){
    let nextLaunch = await getNextLaunch();
    let launchPad = await getLaunchPad(nextLaunch.launchpad);    
    console.log(nextLaunch, launchPad);
    let rocket = await getRocket(nextLaunch.rocket);
    
    let nextLaunchDateUtc = new Date(nextLaunch.date_utc).getTime();    
    let currentDate = Date.now();
    let timeUntilNextLaunch =  nextLaunchDateUtc - currentDate;  

    //If launch was alredy made
    if(timeUntilNextLaunch < 0){
        makeCountDownTimerCountUp(timeUntilNextLaunch * -1);     
        domStrings.mainTitle.innerHTML = "Last launch happened: ";
    } else {        
        makeCountDownTimerCountDown(timeUntilNextLaunch);    
    }
    
    updateDom(nextLaunch, formatDateToString(timeUntilNextLaunch), launchPad, rocket);
    initializeMap(launchPad);
    hideLoadingScreen();
}

displayNextLaunch();