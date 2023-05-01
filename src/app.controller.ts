import { Controller, Get, HttpException, HttpStatus, Param, Post, Req, Res, UploadedFile, UseInterceptors} from '@nestjs/common';
import { AppService } from './app.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer'
import { extname } from 'path';


import * as FS from 'fs';
import * as path from 'path'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('proccess')
  async ProccessPrelanding(@Req() request, @Res() response, ){

    let PreLandingName = request.body.folderName
    
    //Create output folder
    FS.mkdirSync(`${__dirname}/processed/${PreLandingName}`, {recursive: true});

    let files: Array<string> = [];
    this.appService.getDirectories(`${__dirname}/upload/${PreLandingName}`, files)



    // CSS in One File
    await this.appService.cssProcessing(files, PreLandingName);

    // JS in One File
    await this.appService.JsProccessing(files, PreLandingName);



    // HTML file proccessing
    await this.appService.HTMLProcessing(files, PreLandingName);
    

    // // Replace all js links to one formatted link file
    // htmlText = htmlText.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '<script src="./result.js"></script>')

    // //Replace all commented strings from file
    
    // htmlText = htmlText.replace(/<!--.*.-->/gi, '');

    

    //Replace all css links to one formatted link file
    
    // console.log('html -> \n', htmlText);


    return response.status(HttpStatus.OK).json({})

  }
}
