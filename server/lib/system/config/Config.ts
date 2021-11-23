import {existsSync, readFileSync} from "fs";
import * as path from "path";

export class Config {
    
    private configOptions : any;
    
    constructor() {
        this.readFile();
    }
    
    private readFile() {
        let filePath = path.resolve(process.cwd(), "config.json")
        if(existsSync(filePath)) {
            let contents: string = readFileSync(filePath, 'utf-8');
            this.configOptions = JSON.parse(contents);
        } else {
            console.log("Cannot find file config.json.");
        }
    }
    
    public getDatabaseConfigOptions() {
        return this.configOptions.database;
    }
    
}