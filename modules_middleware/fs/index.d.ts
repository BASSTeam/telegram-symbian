declare class FileSystem{
    list(dir:String):Promise<Array<String>>
    read(file:String):Promise<Buffer>
    read(file:String, encoding:String):Promise<String>
    read(file:String, options:{encoding:String,flag?:String}):Promise<String>
    read(file:String, options:{flag:String}):Promise<Buffer>
    type(target:String):Promise<'block device'|'character device'|'directory'|'FIFO'|'file'|'socket'|'symbolic link'>
}
