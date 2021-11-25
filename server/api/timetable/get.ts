import {BookingLib} from "~/server/lib/BookingLib";
import {PoolConnection, RowDataPacket} from "mysql2/promise";
import {IncomingMessage, ServerResponse} from "http";
import {useBody, useQuery} from "h3";

export default async (req : IncomingMessage, res : ServerResponse) => {
    console.log("method: ", req.method);
    console.log("query", useQuery(req));
    const connection : PoolConnection = await BookingLib.getDatabase().getConnection();
    const [courts, _] = await connection.execute<RowDataPacket[]>("SELECT * FROM court", []);
    await connection.release();
    
    return {
        courts: courts,
        timetable: []
    }
}