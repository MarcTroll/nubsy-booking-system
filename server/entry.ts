import '#polyfill';
import { Server } from 'http';
import destr from 'destr';
// @ts-ignore
import { handle } from '@nuxt/nitro/dist/runtime/server';
import {BookingLib} from "~/server/lib/BookingLib";
import * as http from "http";

const port = (destr(process.env.NUXT_PORT || process.env.PORT) || 3000) as number;
const hostname = process.env.NUXT_HOST || process.env.HOST || 'localhost';

let server : Server;

BookingLib.init().then(() => {
    server = new Server(handle);
}).catch((error) => {
    // TODO: error handling
    server = http.createServer((req, res) => {
        res.statusCode = 200;
        res.end("Database-Connection failed. Please check your setup: \n" + error.message);
    });
}).finally(() => {
    // @ts-ignore
    server.listen(port, hostname, (err) => {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        console.log(`Listening on http://${hostname}:${port}`);
    });
});

export default {}