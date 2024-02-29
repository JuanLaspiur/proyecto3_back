const fs = require('fs');
const { promisify } = require('util');
const path = require('path');

module.exports = async (folder) => {
    const readdir = promisify(fs.readdir);
    const files = await readdir('./discord/' + folder);
    
    files.map(async (file) => {
        delete require.cache[path.join(__dirname, file)];

        if(!file.endsWith('.js')) return;
        if(file.endsWith('.map')) return;
    });

    /* Add the path to the file to the array */
    files.map((file) => {
        files[files.indexOf(file)] = path.join(__dirname, folder, file);
    });

    return files
}