const JSZip = require('jszip'),
    fs = require('modules_middleware/fs');
/**
 * @param {JSZip} zip
 * @param {String} targetDir
 * @return {JSZip}
 */
async function addDir(zip, targetDir){
    var _ = await fs.list(targetDir);
    _.forEach((file, i) => {
        _[i] = (async () => {
            const target = `${targetDir}/${file}`,
                type = await fs.type(target);
            if(type == 'directory'){
                await addDir(zip.folder(file), target)
            } else if(type == 'file'){
                zip.file(file, await fs.read(target));
                console.log(`Added ${target}`)
            }
        })()
    });
    await Promise.all(_);
    return zip
}
/**
 * @param {String} targetDir
 * @return {Promise<Buffer>}
 */
module.exports = async targetDir => {
    return await (await addDir(new JSZip(), targetDir)).generateAsync({type : 'nodebuffer'})
}
