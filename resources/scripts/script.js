
console.log('Testing');
var nextLaunchDate = Date.now();
var currentDate = Date.now();


var domStrings = {
    nextLaunchCountdown: document.querySelector('#launch-countdown'),
    nextLaunchMission: document.querySelector('#launch-mission'),
    nextLaunchCustomers: document.querySelector('#launch-customers'),
    nextLaunchSite: document.querySelector('#launch-site')
};

setInterval(function(){
    currentDate += 1000;
    calculateNextLaunchInfo();
    displayNextLaunchInfo(calculateNextLaunchInfo(), domStrings);
}, 1000);

console.log('fetching next launch information');

getNextLaunchInfo()
    .then(response => { 
        nextLaunchDate = new Date(response.launch_date_utc).getTime();
        displayNextLaunchInfo(nextLaunchDate, domStrings);
    })
    .catch(error => console.log(error));

getPastLaunchesInfo()
    .then(data => console.log(data))
    .catch( error => console.log(error));

function calculateNextLaunchInfo(){
    let timeUntilNextLaunch =  nextLaunchDate - currentDate;    
    let days = Math.floor(timeUntilNextLaunch / (1000 * 60 * 60 * 24));
    let hours = Math.floor((timeUntilNextLaunch % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = Math.floor((timeUntilNextLaunch % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((timeUntilNextLaunch % (1000 * 60)) / 1000);  
    
    let countDownTimer = new Array();
    //let counDownTimerObject = {
    //    daysString: days > 0 ? `${days} days` : `0 days`,
    //    hoursString: days > 0 ? `${days} hours` : `0 hours`,
    //    minutesString: days > 0 ? `${days} minutes` : `0 minutes`,
    //    secondsString: days > 0 ? `${days} seconds` : `0 seconds`
    //};
    //console.log(`counDownTimerObject.daysString: ${counDownTimerObject.daysString}`);
    days > 0 ? countDownTimer.push(`${days} days`) : countDownTimer.push('0 days');
    hours > 0 ? countDownTimer.push(`${hours} hours`) : countDownTimer.push( '0 hours') ; 
    minutes > 0 ? countDownTimer.push(`${minutes} minutes`) : countDownTimer.push('0 minutes');
    seconds > 0 ? countDownTimer.push(`${seconds} seconds`) : countDownTimer.push('0 seconds');       
    console.log(`Final countdownTimer: ${countDownTimer.join('\b')}`);
    
    return countDownTimer;
}

function displayNextLaunchInfo(nextLaunch, domStrings){            
    domStrings.nextLaunchCountdown.innerHTML = nextLaunch;
    //domStrings.nextLaunchMission
    //domStrings.nextLaunchCustomers
    //domStrings.nextLaunchSite
    
}

//nextLaunchCountdown: document.querySelector('#launch-countdown'),
//nextLaunchMission: document.querySelector('#launch-mission'),
//nextLaunchCustomers: document.querySelector('#launch-customers'),
//nextLaunchSite: document.querySelector('#launch-site')

async function getNextLaunchInfo(){
    const response = await fetch('https://api.spacexdata.com/v3/launches/next');       
    const data = await response.json();
    return data;
}

async function getPastLaunchesInfo(){
    const currentDate = new Date();
    const lastYear = currentDate.getFullYear() - 1;      
    const currentDateString = `${currentDate.getFullYear()} - ${currentDate.getMonth()+1} - ${currentDate.getDate()}`;    
    const response = await fetch(`https://api.spacexdata.com/v3/launches/past?start=${lastYear}-01-01&end=${currentDateString}`);
    const data = await response.json();
    return data;
}

