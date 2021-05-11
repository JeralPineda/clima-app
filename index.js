require('dotenv').config();

const { leerInput, inquirerMenu, pausa, listarLugares } = require('./helpers/inquirer');
const Busquedas = require('./models/busquedas');

const main = async () => {
   const busquedas = new Busquedas();
   let opt = '';

   do {
      //    Mostrar el menu
      opt = await inquirerMenu();

      switch (opt) {
         case 1:
            // Mostrar mensaje
            const termino = await leerInput('Ciudad: ');

            // Buscar los lugares
            const lugares = await busquedas.ciudad(termino);

            // Seleccionar el lugar
            const id = await listarLugares(lugares);

            // Cuando queramos cancelar una procedimiento
            if (id === '0') continue; //sigue la iteracion del ciclo

            // obtenemos el lugar por id
            const lugarSel = lugares.find((l) => l.id === id);

            // Guardar en DB
            busquedas.agregarHistorial(lugarSel.nombre);

            // Clima
            const clima = await busquedas.climaLugar(lugarSel.lat, lugarSel.lng);

            // Mostrar resultados
            console.log('\nInformacion de la ciudad\n'.green);
            console.log('Ciudad: ', lugarSel.nombre.green);
            console.log('Lat: ', lugarSel.lat);
            console.log('Lng: ', lugarSel.lng);
            console.log('Temperatura: ', clima.temp);
            console.log('Mínima: ', clima.min);
            console.log('Máxima: ', clima.max);
            console.log('Como esta el clima: ', clima.desc.green);
            break;

         case 2:
            busquedas.historialCapitalizado.forEach((lugar, i) => {
               const idx = `${i + 1}.`.green;
               console.log(`${idx} ${lugar}`);
            });
            break;

         default:
            break;
      }

      //   Pausamos al elegir una opción
      if (opt !== 0) await pausa();
   } while (opt !== 0);
};

main();
