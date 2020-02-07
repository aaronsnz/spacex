export class NextLaunch{
    constructor(date, mission, customers, site){
        this.date = date;
        this.mission = mission;
        this.customers = customers;
        this.site = site;
        
        this.nextLaunchCountdown = document.querySelector('#launch-countdown');
        this.nextLaunchMission = document.querySelector('#launch-mission');
        this.nextLaunchCustomers = document.querySelector('#launch-customers');
        this.nextLaunchSite = document.querySelector('#launch-site');
    }

    displayNextLaunch(){
        if(this.date){
            setInterval(function(){
                let nextLaunchString;

                let currentDate = Date.now();
                let timeUntilNextLaunch =  this.date - currentDate;    
                
                let days = Math.floor(timeUntilNextLaunch / (1000 * 60 * 60 * 24));
                let hours = Math.floor((timeUntilNextLaunch % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                let minutes = Math.floor((timeUntilNextLaunch % (1000 * 60 * 60)) / (1000 * 60));
                let seconds = Math.floor((timeUntilNextLaunch % (1000 * 60)) / 1000);      
                let countDownTimer = new Array();    
                days > 0 ? countDownTimer.push(`${days} days`) : countDownTimer.push('0 days');
                hours > 0 ? countDownTimer.push(`${hours} hours`) : countDownTimer.push( '0 hours') ; 
                minutes > 0 ? countDownTimer.push(`${minutes} minutes`) : countDownTimer.push('0 minutes');
                seconds > 0 ? countDownTimer.push(`${seconds} seconds`) : countDownTimer.push('0 seconds');           
                let countDownTimerString = countDownTimer.join(', ');

                this.nextLaunchCountdown.innerHTML = countDownTimerString;
                this.nextLaunchMission.innerHTML = this.mission;
                this.nextLaunchCustomers.innerHTML = this.customers;
                this.nextLaunchSite.innerHTML = this.site;
                console.log(`%cdisplayNextLaunch() called!%c`, 'color: cyan;');
            },1000);
        }
    }

    /*calculateNextLaunchInfo(){
        let currentDate = Date.now();
        let timeUntilNextLaunch =  this.date - currentDate;    
        return timeUntilNextLaunch;
    }

    formatDateToString(date){
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
    }*/
}