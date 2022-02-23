import {ValidationUtil} from "~/server/lib/util/ValidationUtil";

const delay = (ms : number) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

export default async (req: any, res: any) => {
    const emailAddresses = [
        "a@a.de",
        "a@a.d"
    ]
    
    emailAddresses.forEach(emailAddress => {
        console.log(ValidationUtil.isEmailAddress(emailAddress));
    });
    
    return {
        title: "empty 2"
    }
}