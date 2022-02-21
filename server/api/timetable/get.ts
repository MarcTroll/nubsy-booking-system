import {BookingLib} from "~/server/lib/BookingLib";
import {PoolConnection, RowDataPacket} from "mysql2/promise";
import {IncomingMessage, ServerResponse} from "http";
import {useMethod, useQuery} from "h3";
import {CourtUtil} from "~/server/lib/util/court/CourtUtil";

// TODO: Shouldn't be hard coded. Maybe read this from the database as well or save it in a config
const slotLength : number = 30*60;

export default async (req : IncomingMessage, res : ServerResponse) => {
    if(useMethod(req) !== "GET") {
        res.statusCode = 405;
        res.end("Method not allowed");
        
        return;
    }
    
    const query = <{unixTime?: number}>useQuery(req);
    
    if(!query.unixTime) {
        query.unixTime = Date.now();
    } else {
        query.unixTime = query.unixTime * 1000;
    }
    
    const tmpDay = new Date(query.unixTime);
    
    const date = new Date(Date.UTC(tmpDay.getUTCFullYear(), tmpDay.getUTCMonth(), tmpDay.getUTCDate(), 0, 0, 0, 0));
    const dateBaseTime = date.getTime() / 1000;
    
    const connection : PoolConnection = await BookingLib.getDatabase().getConnection();
    const [courts, _1] = await connection.execute<RowDataPacket[]>("SELECT * FROM court", [
    
    ]);
    const [reservations, _2] = await connection.execute<RowDataPacket[]>("SELECT * FROM reservation WHERE startTime > ? AND endTime < ?", [
        dateBaseTime,
        dateBaseTime + 86400
    ]);
    await connection.release();
    
    let timetableGrid = {};
    let timetableBoundaries = CourtUtil.getDayBoundaries(<[{openTime: number; closeTime: number}]>courts, dateBaseTime);
    
    for(let timeSlot = timetableBoundaries.minStartTime; timeSlot < timetableBoundaries.maxEndTime; timeSlot += 30*60) {
        timetableGrid[timeSlot] = {
            timeID: timeSlot,
            courts: {}
        };
        for (let court of courts) {
            timetableGrid[timeSlot].courts[court.courtID] = {
                courtID: court.courtID
            }
            // court not opened yet
            if(timeSlot < dateBaseTime + court.openTime) {
                if(timetableBoundaries.minStartTime === timeSlot) {
                    timetableGrid[timeSlot].courts[court.courtID].closed = true;
                    timetableGrid[timeSlot].courts[court.courtID].rowspan = ((dateBaseTime + court.openTime) - timetableBoundaries.minStartTime) / slotLength;
                } else {
                    timetableGrid[timeSlot].courts[court.courtID].display = false;
                }
                
                continue;
            }
    
            // court already closed
            if(timeSlot >= dateBaseTime + court.closeTime) {
                if(dateBaseTime + court.closeTime === timeSlot) {
                    timetableGrid[timeSlot].courts[court.courtID].closed = true;
                    timetableGrid[timeSlot].courts[court.courtID].rowspan = (timetableBoundaries.maxEndTime - (dateBaseTime + court.closeTime)) / slotLength;
                } else {
                    timetableGrid[timeSlot].courts[court.courtID].display = false;
                }
        
                continue;
            }
    
            // add Reservation
            let filterReservation = reservations.filter(reservation => reservation.courtID === court.courtID && reservation.startTime <= timeSlot && timeSlot < reservation.endTime);
    
            if(filterReservation.length > 0) {
                let reservation = filterReservation[0];
                
                if(reservation.startTime === timeSlot) {
                    timetableGrid[timeSlot].courts[court.courtID].reservation = true;
                    timetableGrid[timeSlot].courts[court.courtID].rowspan = (reservation.endTime - reservation.startTime) / slotLength;
                } else {
                    timetableGrid[timeSlot].courts[court.courtID].reservation = true;
                    timetableGrid[timeSlot].courts[court.courtID].display = false;
                }
                continue;
            }
            
            if(!timetableGrid[timeSlot].courts[court.courtID]) {
                timetableGrid[timeSlot].courts[court.courtID].display = true;
            }
        }
    }
    
    return {
        courts,
        timetableGrid
    }
}