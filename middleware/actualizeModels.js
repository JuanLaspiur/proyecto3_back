const path = require('path');
const User = require(path.join(__dirname, '..', 'models', 'nosql', 'users'));
const Area = require(path.join(__dirname, '..', 'models', 'nosql', 'area'));

/* 
    * Esta función es la encargada de actualizar ciertos usuarios en la base de datos
    * para adjuntarle nuevos campos que se han agregado al modelo, sin necesidad de borrar la BDD.
    * Esta función se ejecuta al inicio de la aplicación, y se ejecuta una sola vez.
*/

const actualizeModels = async () => {
    // * Cambiar este código con la adición de nuevos campos en los modelos.

    const updated = await Area.updateMany({
        activities: { $exists: false }
    }, { 
       activities: []
    });

    if(updated.nModified > 0) {
        console.log('Actualización de areas completada');
    }
}

module.exports = actualizeModels;