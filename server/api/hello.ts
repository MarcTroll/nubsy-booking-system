import type { IncomingMessage, ServerResponse } from "http";

import {BookingLib} from "~/server/lib/BookingLib";
import {PoolConnection, QueryError, RowDataPacket} from "mysql2/promise";

export default async (req: IncomingMessage, res: ServerResponse) => {
	const connection : PoolConnection = await BookingLib.getDatabase().getConnection();
	const rows = await connection.execute<RowDataPacket[]>("SELECT * FROM table", []);
	console.log(rows);
	
	return {
		title: "empty"
	}
}