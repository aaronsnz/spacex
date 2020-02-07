
var nextLaunch = {
    date: Date,
    mission: String,
    customers: String,
    site: String
}

var pastLaunches = {}

var domStrings = {
    nextLaunchCountdown: document.querySelector('#launch-countdown'),
    nextLaunchMission: document.querySelector('#launch-mission'),
    nextLaunchCustomers: document.querySelector('#launch-customers'),
    nextLaunchSite: document.querySelector('#launch-site')
};

getNextLaunchInfo()
    .then(response => {         
        nextLaunch.date = new Date(response.launch_date_utc).getTime();
        nextLaunch.mission = response.mission_name;
        nextLaunch.site = response.launch_site.site_name_long;
        nextLaunch.customers = response.rocket.second_stage.payloads[0].customers;
        displayNextLaunchInfo();
    })
    .catch(error => console.log(error));

setInterval(function(){    
    displayNextLaunchInfo(calculateNextLaunchInfo());
}, 1000);

getPastLaunchesInfo()
    .then(data => {
        pastLaunches = data;
    })
    .catch( error => console.log(error));

function calculateNextLaunchInfo(){
    let currentDate = Date.now();
    let timeUntilNextLaunch =  nextLaunch.date - currentDate;    
    return formatDateToString(timeUntilNextLaunch);
}

function displayNextLaunchInfo(calculatedNextLaunchDate){      
    domStrings.nextLaunchCountdown.innerHTML = calculatedNextLaunchDate;
    domStrings.nextLaunchMission.innerHTML = nextLaunch.mission;
    domStrings.nextLaunchSite.innerHTML = nextLaunch.site;    
    domStrings.nextLaunchCustomers.innerHTML = nextLaunch.customers;    
    //console.log(`Next mission: ${nextLaunch.mission}. Next launch site: ${nextLaunch.site}`);
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

//DONE
async function getNextLaunchInfo(){
    const response = await fetch('https://api.spacexdata.com/v3/launches/next');       
    const data = await response.json();
    return data;
}

async function getPastLaunchesInfo(){
    const oneYear = 1000*60*60*24*365;
    
    let lastYear = new Date(new Date().getTime() - oneYear);            
    let formatedLastYear = `${lastYear.getFullYear()}-${lastYear.getMonth()+1}-${lastYear.getDate()}`;

    let currentDate = new Date;
    let formatedCurrentDate = `${currentDate.getFullYear()}-${currentDate.getMonth()+1}-${currentDate.getDate()}`;    

    const response = await fetch(`https://api.spacexdata.com/v3/launches/past?start=${formatedLastYear}&end=${formatedCurrentDate}`);
    const data = await response.json();
    return data;
}