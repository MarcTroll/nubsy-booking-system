import {randomBytes} from "crypto";
import argon2 from "argon2";
const {hash, argon2id, verify} = argon2;
import {NubsyError} from "~/server/lib/error/NubsyError";

export class CryptoUtil {
    
    static generateSessionID(): string {
        return randomBytes(40).toString("base64");
    }
    
    static async hash(password: string): Promise<string> {
        return await hash(password, {
            type: argon2id
        })
    }
    
    static async verify(hash: string, password: string): Promise<boolean> {
        if(!hash.startsWith("$argon2id$")) {
            throw new NubsyError("User tried to login, but saved hash is not an argon2id-hash. Not logging the user in!",
                "crypto.verify.databaseHash.invalid");
        }
        
        return await verify(hash, password);
    }
    
}
