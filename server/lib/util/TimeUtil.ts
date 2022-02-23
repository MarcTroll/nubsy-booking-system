export class TimeUtil {
    
    static getUnixTime() {
        return Math.floor(new Date().getTime() / 1000);
    }
    
}
