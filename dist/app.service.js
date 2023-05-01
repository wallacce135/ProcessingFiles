"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
const FS = require("fs");
const Path = require("path");
const uglifycss = require('uglifycss');
const uglifyjs = require('uglify-js');
let AppService = class AppService {
    constructor() {
        this.getDirectories = (source, files) => FS.readdirSync(source).forEach(File => {
            const Absolute = Path.join(source, File);
            if (FS.statSync(Absolute).isDirectory())
                return this.getDirectories(Absolute, files);
            else
                return files.push(Absolute);
        });
    }
    generatePassword(minLength, maxLength) {
        var charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", password = "", length = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;
        for (var i = 0; i < length; i++) {
            password += charset.charAt(Math.floor(Math.random() * charset.length));
        }
        return password;
    }
    cssProcessing(files, output) {
        const cssFiles = files.filter((item) => item.includes('.css'));
        let cssText = "";
        cssFiles.forEach((item) => cssText += FS.readFileSync(item));
        cssText = cssText.replace('/\n/', '');
        const uglified = uglifycss.processString(cssText, { maxLineLen: 500, expandVars: true });
        FS.writeFile(`${__dirname}\\processed\\${output}\\style.css`, uglified, 'utf-8', (err) => {
            if (err)
                console.log(err);
        });
    }
    JsProccessing(files, output) {
        const JSFiles = files.filter((item) => item.includes('.js'));
        let jsText = "";
        JSFiles.forEach((item) => jsText += `\n${FS.readFileSync(item)}`);
        const uglified = uglifyjs.minify(jsText);
        FS.writeFile(`${__dirname}\\processed\\${output}\\main.js`, uglified.code, 'utf-8', (err) => {
            if (err)
                console.log('error -> ', err.message);
        });
    }
    HTMLProcessing(files, output) {
        console.log('output -> ', output);
        const HTMLFiles = files.filter((item) => item.includes('.html'));
        let htmlText = "";
        HTMLFiles.forEach((item) => htmlText += FS.readFileSync(item));
        htmlText = htmlText.replace(/<!--.*.-->/gi, '');
        let photoPathArr = htmlText.match(/<img.*.>/gi);
        let ImgArr = this.photoProcessing(photoPathArr, files, output);
        ImgArr.forEach((item) => {
            htmlText = htmlText.replaceAll(item.item, item.outputPath);
        });
        const jsLinks = htmlText.match(/<script.*.<\/script>/gi);
        console.log('jsLinks -> ', jsLinks);
        jsLinks.forEach((item, index) => {
            if (index === jsLinks.length - 1) {
                htmlText = htmlText.replace(item, '<script src="./main.js"></script>');
            }
            else {
                htmlText = htmlText.replace(item, '');
            }
        });
        const cssLinks = htmlText.match(/<link rel="stylesheet".*.>/gi);
        cssLinks.forEach((item, index) => {
            if (index === cssLinks.length - 1) {
                htmlText = htmlText.replace(item, '<link rel="stylesheet" type="text/css" href="./style.css">');
            }
            else {
                htmlText = htmlText.replace(item, '');
            }
        });
        FS.writeFile(`${__dirname}\\processed\\${output}\\index.html`, htmlText, 'utf-8', (err) => {
            if (err)
                console.log('error -> ', err.message);
        });
    }
    photoProcessing(photoPathArr, files, output) {
        let newPaths = [];
        photoPathArr = [...new Set(photoPathArr)];
        let item = "";
        let outputPath = "";
        photoPathArr.forEach((item, index) => {
            let src = item.match(/<img\s.*?src=(?:'|")([^'">]+)(?:'|")/);
            let oldSrc = item.match(/<img.*.>/)[0];
            console.log(oldSrc);
            item = src[1];
            item = item.split('/')[1];
            let hashCode = this.generatePassword(10, 15);
            let hashedName = hashCode + '.jpg';
            let inputPath = files.filter((fileItem) => fileItem.includes(item))[0];
            outputPath = __dirname + `\\processed\\${output}\\${hashedName}`;
            let ImageData = FS.readFileSync(inputPath);
            newPaths = [...newPaths, { item: photoPathArr[index], outputPath: `<img src="${outputPath}" alt="" />` }];
        });
        return newPaths;
    }
};
AppService = __decorate([
    (0, common_1.Injectable)()
], AppService);
exports.AppService = AppService;
//# sourceMappingURL=app.service.js.map