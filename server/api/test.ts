const delay = (ms : number) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

import {BookingLib} from "~/server/lib/BookingLib";

export default async (req: any, res: any) => {
    console.log(BookingLib);
    
    return {
        title: "empty 2"
    }
}