import {BookingLib} from "~/server/lib/BookingLib";
import {PoolConnection, RowDataPacket} from "mysql2/promise";

export default async () => {
    const connection : PoolConnection = await BookingLib.getDatabase().getConnection();
    const [rows, _] = await connection.execute<RowDataPacket[]>("SELECT * FROM court", []);
    await connection.release();
    
    return {
        courts: rows
    }
}