export class CourtUtil {
    
    static getDayBoundaries(courts: [{openTime: number; closeTime: number}], dayBaseTime: number = 0) {
        if(!courts || !Array.isArray(courts)) {
            throw new Error("Courts must be defined and an array.")
        }
    
        let minStartTime = 86400;
        let maxEndTime = 0;
        
        for(let court of courts) {
            if(court.openTime < minStartTime) {
                minStartTime = court.openTime;
            }
            if(court.closeTime > maxEndTime) {
                maxEndTime = court.closeTime;
            }
        }
    
        return {
            minStartTime: minStartTime + dayBaseTime,
            maxEndTime: maxEndTime + dayBaseTime
        };
    }
    
}