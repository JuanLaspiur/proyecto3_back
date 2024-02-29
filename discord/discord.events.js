const path = require('path');
const fileLoader = require(path.join(__dirname,  'fileLoader.js'));
const ascii = require('ascii-table');
const table = new ascii().setHeading('Event', 'Status');

const loadEvents = async (client) => {
    const files = await fileLoader('events');
    await client.removeAllListeners();

    files.forEach(file => {
        const events = require(path.join(file));

        for (let i = 0; i < events.length; i++) {
            const event = events[i];
            const execute = (...args) => event.execute(client, ...args);
            client.events.set(event.name, execute);

            if (event.rest) {
                if (event.once) client.rest.once(event.name, execute);
                else client.rest.on(event.name, execute);
            } else {
                if (event.once) client.on(event.name, execute);
                else client.on(event.name, execute);
            }

            table.addRow(event.name, '  ✅');
        }
    });

    return console.log(table.toString(), '\n Events loaded!');
}

module.exports = {
    loadEvents
}

