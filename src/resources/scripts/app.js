import {NextLaunch} from "./NextLaunch";

export const run = (nextLaunchService) => {        
        console.log(`%c app.js started!%c`,'color:green;');   
        console.log(`%cFetching next launch data...%c`, 'color:cyan;');                    
        nextLaunchService.getNextLaunch()
            .then(response => {                
                console.log(`%c Next launch data fetched!%c`,'color:green;');                   
                let nextLaunch = new NextLaunch(
                    response.launch_date_utc,
                    response.mission_name,
                    response.rocket.second_stage.payloads[0].customers,
                    response.launch_site);
                nextLaunch.displayNextLaunch();
            })
            .catch(error => {
                console.log(`%cError: ${error}%c`,'color: red;');
            });        
}