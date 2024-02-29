const path = require('path');
const fileLoader = require(path.join(__dirname,  'fileLoader.js'));
const ascii = require('ascii-table');
const table = new ascii().setHeading('Command', 'Status');

module.exports = async (client) => {
    client.commands.clear();
    const files = await fileLoader('commands');

    let commandsArray = [];

    files.forEach(file => {
        const commands = require(path.join(file));

        for (let i = 0; i < commands.length; i++) {
            const command = commands[i];
            client.commands.set(command.data.name, command);

            commandsArray.push(command.data.toJSON());

            table.addRow(command.data.name, '  ✅');
        }
    });

    await client.application.commands.set(commandsArray);

    return console.log(table.toString(), '\n Commands loaded!');
}