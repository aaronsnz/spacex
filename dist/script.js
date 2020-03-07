var nextLaunch = {
    date: '10 days, 0 hours, 0 minutes, 0 seconds',
    mission: 'Starklink 4',
    customers: 'SpaceX',
    site: 'Cape Canaveral Air Force Station Space Launch Complex 40',
    details: 'Cape Canaveral Air Force Station Space Launch Complex 40'
}


var domStrings = {
    nextLaunchCountdown: document.querySelector('#launch-countdown'),
    nextLaunchMission: document.querySelector('#launch-mission'),
    nextLaunchCustomers: document.querySelector('#launch-customers'),
    nextLaunchSite: document.querySelector('#launch-site'),
    details: document.querySelector('#details')
};

domStrings.nextLaunchCountdown.innerHTML = nextLaunch.date;
domStrings.nextLaunchMission.innerHTML = nextLaunch.mission;
domStrings.nextLaunchSite.innerHTML = nextLaunch.site;    
domStrings.nextLaunchCustomers.innerHTML = nextLaunch.customers;  
domStrings.details.innerHTML = nextLaunch.details;    

var pastLaunches = {};

var missionsDate;

getNextLaunchInfo(nextLaunch);

getPastLaunchesInfo(pastLaunches).then(response => { 
    pastLaunches = response;
    chartPastLaunches();
});    

setInterval(function(){    
    displayNextLaunchInfo();
}, 1000);

function displayNextLaunchInfo(){      
    let currentDate = Date.now();
    let timeUntilNextLaunch =  nextLaunch.date - currentDate;    
    domStrings.nextLaunchCountdown.innerHTML = formatDateToString(timeUntilNextLaunch);
    domStrings.nextLaunchMission.innerHTML = nextLaunch.mission;
    domStrings.nextLaunchSite.innerHTML = nextLaunch.site;    
    domStrings.nextLaunchCustomers.innerHTML = nextLaunch.customers;  
    domStrings.details.innerHTML = nextLaunch.details;      
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

async function getNextLaunchInfo(nextLaunch){
    try{
        const response = await fetch('https://api.spacexdata.com/v3/launches/next');       
        const data = await response.json();
        console.log(data);

        nextLaunch.date = new Date(data.launch_date_utc).getTime();
        nextLaunch.mission = data.mission_name;
        nextLaunch.site = data.launch_site.site_name_long;
        nextLaunch.customers = data.rocket.second_stage.payloads[0].customers;   
        nextLaunch.details = data.details;     
        if(!nextLaunch.details){
            nextLaunch.details = 'No mission details available';
        }
        
        displayNextLaunchInfo();
    } catch(e) {
        console.log(e);
    }
}

async function getPastLaunchesInfo(){
    try{
        const oneYear = 1000*60*60*24*365;
        
        let lastYear = new Date(new Date().getTime() - oneYear);            
        let formatedLastYear = `${lastYear.getFullYear()}-${lastYear.getMonth()+1}-${lastYear.getDate()}`;
    
        let currentDate = new Date;
        let formatedCurrentDate = `${currentDate.getFullYear()}-${currentDate.getMonth()+1}-${currentDate.getDate()}`;    
    
        const response = await fetch(`https://api.spacexdata.com/v3/launches/past?start=${formatedLastYear}&end=${formatedCurrentDate}`);
        const data = await response.json();
        missionsDate = '(From ' + formatedLastYear + ' to ' + formatedCurrentDate + ')';        
        return data; 
    } catch(e) {
        console.log(e);
    }
}

function chartPastLaunches(){
    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July','August','September','October','November','December'];
    var pastLaunchesData = [0,0,0,0,0,0,0,0,0,0,0,0,0];    
    document.querySelector('#missions-date').innerHTML = missionsDate;           
    pastLaunches.forEach(launch => {
        lauchDate = new Date(launch.launch_date_utc);                
        pastLaunchesData[lauchDate.getMonth()] += 1;
    });
            
    var ctx = document.getElementById('myChart').getContext('2d');
    var chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'bar',
    
        // The data for our dataset
        data: {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July','August','September','October','November','December'],
            datasets: [{
                label: 'SpaceX launches',
                backgroundColor: 'rgb(100, 100, 100)',                
                data: pastLaunchesData
            }]
        },
    
        // Configuration options go here
        options: {}
    });
}