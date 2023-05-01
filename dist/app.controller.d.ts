import { AppService } from './app.service';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    ProccessPrelanding(request: any, response: any): Promise<any>;
}
