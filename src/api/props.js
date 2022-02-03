import axios from "axios";

const busqueda = 'https://site.api.espn.com/apis/search/v2?region=mx&lang=es&limit=10&page=1&query={textoConsulta}&dtciVideoSearch=true&type=player';

export const busquedaJugador = async ( textoConsulta ) => {
    const resultadoBusqueda = await axios.get(busqueda.replace('{textoConsulta}', textoConsulta));
    return resultadoBusqueda.data;
};

const bitacoraJuegos = 'https://site.web.api.espn.com/apis/common/v3/sports/{deporte}/{liga}/athletes/{idJugador}/gamelog?region=mx&lang=es&contentorigin=deportes&season={anio}';
const eventos = 'https://sports.core.api.espn.com/v2/sports/{deporte}/leagues/{liga}/seasons/{anio}/athletes/{idJugador}/eventlog?region=mx&lang=es';
const estadistico = 'https://sports.core.api.espn.com/v2/sports/{deporte}/leagues/{liga}/events/{idEvento}/competitions/{idEvento}/competitors/{idEquipo}/roster/{idJugador}/statistics/0?lang=es&region=mx'

export const bitacoraJugador = async ( idJugador, deporte, liga ) => {
    const anio = anioPorLiga(liga);
    const resultadoBusqueda = await axios.get(
            bitacoraJuegos.replace('{idJugador}', idJugador)
                          .replace('{deporte}', deporte)
                          .replace('{liga}', liga)
                          .replace('{anio}', anio)
        );
    const eventosBusqueda = await axios.get(
            eventos.replace('{idJugador}', idJugador)
            .replace('{deporte}', deporte)
            .replace('{liga}', liga)
            .replace('{anio}', anio)
        );
  
    const estadisticas = await Promise.all(
        Object.entries(resultadoBusqueda.data.events).map( async evento => {
            const estadistica = await axios.get( 
                estadistico.replace('{idJugador}', idJugador)
                           .replace(/{idEvento}/g, evento[1].id)
                           .replace('{idEquipo}', evento[1].team.id)
                           .replace('{deporte}', deporte)
                           .replace('{liga}', liga)
            );
            return estadistica.data;
        })
    );

    return { bitacora: resultadoBusqueda.data, eventos: eventosBusqueda.data, estadisticas };
};

const anioPorLiga = ( liga ) => {
    const anio = new Date().getFullYear();
    switch (liga) {
        case 'nfl':
            return anio - 1;
        case 'nba':
            return anio;
        default:
            return anio;
    }
};