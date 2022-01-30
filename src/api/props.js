import axios from "axios";

const busqueda = 'https://site.api.espn.com/apis/search/v2?region=mx&lang=es&limit=10&page=1&query={textoConsulta}&dtciVideoSearch=true&type=player';

export const busquedaJugador = async ( textoConsulta ) => {
    const resultadoBusqueda = await axios.get(busqueda.replace('{textoConsulta}', textoConsulta));
    return resultadoBusqueda.data;
};

const bitacoraJuegos = 'https://site.web.api.espn.com/apis/common/v3/sports/football/nfl/athletes/{idJugador}/gamelog?region=mx&lang=es&contentorigin=deportes&season=2021';
const eventos = 'https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/seasons/2021/athletes/{idJugador}/eventlog?region=mx&lang=es';

export const bitacoraJugador = async ( idJugador ) => {
    const resultadoBusqueda = await axios.get(bitacoraJuegos.replace('{idJugador}', idJugador));
    const eventosBusqueda = await axios.get(eventos.replace('{idJugador}', idJugador));
    const estadisticas = await Promise.all(
        eventosBusqueda.data.events.items.map( async evento => {
            if( evento.played && evento.statistics ){
                const estadistica = await axios.get( evento.statistics.$ref );
                return estadistica.data;
            }
        })
    );
    return { bitacora: resultadoBusqueda.data, eventos: eventosBusqueda.data, estadisticas };
};