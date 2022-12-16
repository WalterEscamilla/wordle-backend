import "reflect-metadata"
import { AppDataSource } from "./db";

import App from './app';
import { routes } from "./routes";
async function main() {
    try {
        
    await AppDataSource.initialize();
    const app = new App(routes, 3001,);
       
      app.listen();
    
    } catch (error) {
        console.error(error)
    }
}
main();