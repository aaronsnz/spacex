export class NextLaunchService {
    constructor(){        
        this.url = 'https://api.spacexdata.com/v3/launches/next';
    }

    async getNextLaunch(){
        const response = await fetch(this.url);
        const data = await response.json();
        return data;
    }
}