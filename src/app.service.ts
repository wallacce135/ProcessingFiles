import { Injectable } from '@nestjs/common';
import * as FS from 'fs';
import { readdir } from 'fs';
import path, * as Path from 'path'

import { PythonShell } from 'python-shell';
// import uglifycss from 'uglifycss'
const uglifycss = require('uglifycss');
const uglifyjs = require('uglify-js');


@Injectable()
export class AppService {

  generatePassword(minLength, maxLength) {
    var charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        password = "",
        length = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;
    for (var i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
  }

  cssProcessing(files: Array<string>, output: string){
    
    const cssFiles = files.filter((item: string) => item.includes('.css'));

    let cssText: string = "";
    cssFiles.forEach((item: string) => cssText += FS.readFileSync(item));
    cssText = cssText.replace('/\n/', '');


    const uglified = uglifycss.processString(cssText, { maxLineLen: 500, expandVars: true });

    FS.writeFile(`${__dirname}\\processed\\${output}\\style.css`, uglified, 'utf-8', (err) => {
      if (err) console.log(err);
    });

  }

  JsProccessing(files: Array<string>, output: string) {

    const JSFiles = files.filter((item: string) => item.includes('.js'));
    let jsText: string = "";
    JSFiles.forEach((item: string) => jsText += `\n${FS.readFileSync(item)}`);

    const uglified = uglifyjs.minify(jsText)

    FS.writeFile(`${__dirname}\\processed\\${output}\\main.js`, uglified.code, 'utf-8', (err) => {
      if (err) console.log('error -> ', err.message);
    });

  }

  HTMLProcessing(files: Array<string>, output: string){

    console.log('output -> ', output);

    const HTMLFiles = files.filter((item: string) => item.includes('.html'));
    let htmlText: string = "";
    HTMLFiles.forEach((item: string) => htmlText += FS.readFileSync(item));

    htmlText = htmlText.replace(/<!--.*.-->/gi, '');
    let photoPathArr: Array<string> = htmlText.match(/<img.*.>/gi);

    let ImgArr = this.photoProcessing(photoPathArr, files, output);

    // console.log('ImgArr -> ', ImgArr);

    ImgArr.forEach((item) => {
      htmlText = htmlText.replaceAll(item.item, item.outputPath);
    })

    
    const jsLinks: string[] = htmlText.match(/<script.*.<\/script>/gi);
    
    console.log('jsLinks -> ', jsLinks);
    
    jsLinks.forEach((item, index) => {
      if(index === jsLinks.length - 1){
        // console.log('item -> ', item)
        htmlText = htmlText.replace(item, '<script src="./main.js"></script>')
      }
      else {
        htmlText = htmlText.replace(item, '')
      }
    })



    const cssLinks: string[] = htmlText.match(/<link rel="stylesheet".*.>/gi);

    cssLinks.forEach((item, index) => {
      if(index === cssLinks.length - 1){
        // console.log('item -> ', item);
        htmlText = htmlText.replace(item, '<link rel="stylesheet" type="text/css" href="./style.css">');
      }
      else {
        htmlText = htmlText.replace(item, '');
      }
    })

    FS.writeFile(`${__dirname}\\processed\\${output}\\index.html`, htmlText, 'utf-8', (err) => {
      if(err) console.log('error -> ', err.message);
    })
    
  }

  photoProcessing(photoPathArr: string[], files: string[], output: string){
    let newPaths: any = [];


    photoPathArr = [...new Set(photoPathArr)]

    let item: string = "";
    let outputPath: string = ""

    photoPathArr.forEach((item, index) => {
      let src = item.match(/<img\s.*?src=(?:'|")([^'">]+)(?:'|")/)
      let oldSrc = item.match(/<img.*.>/)[0]
      console.log(oldSrc);
      item = src[1];

      item = item.split('/')[1];

      let hashCode = this.generatePassword(10, 15);
      let hashedName =  hashCode + '.jpg';

      // console.log('item -> ', item);

      let inputPath = files.filter((fileItem) => fileItem.includes(item))[0];

      
      
      outputPath = __dirname + `\\processed\\${output}\\${hashedName}`;
      
      
      // Запись картинок в папку с файлами

      let ImageData = FS.readFileSync(inputPath);
      // FS.writeFileSync(outputPath, ImageData);



      newPaths = [...newPaths, { item: photoPathArr[index], outputPath: `<img src="${outputPath}" alt="" />` }]
      
    })
    return newPaths;
  }

  getDirectories = (source, files) =>
    FS.readdirSync(source).forEach(File => {
      const Absolute = Path.join(source, File);
      if (FS.statSync(Absolute).isDirectory()) return this.getDirectories(Absolute, files);
      else return files.push(Absolute);
  });

}

