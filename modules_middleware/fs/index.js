/// <reference path="./index.d.ts" />
const fs = require('fs');
/**
 * @type {FileSystem}
 */
module.exports = new class FileSystem{
    list(dir){
        return new Promise((resolve, reject) => {
            fs.readdir(dir, (err, files) => {
                if(err) reject(err);
                else resolve(files)
            })
        })
    }
    read(file, options){
        return new Promise((resolve, reject) => {
            fs.readFile(file, options || {}, (err, data) => {
                if(err) reject(err);
                else resolve(data)
            })
        })
    }
    type(target){
        return new Promise((resolve, reject) => {
            fs.stat(target, (err, stats) => {
                if(err) reject(err);
                if(stats.isBlockDevice()) resolve('block device');
                else if(stats.isCharacterDevice()) resolve('character device');
                else if(stats.isDirectory()) resolve('directory');
                else if(stats.isFIFO()) resolve('FIFO');
                else if(stats.isFile()) resolve('file');
                else if(stats.isSocket()) resolve('socket');
                else if(stats.isSymbolicLink()) resolve('symbolic link');
            })
        })
    }
}
