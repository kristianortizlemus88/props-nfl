import React, { useState, useEffect } from 'react';
import { bitacoraJugador, busquedaJugador } from '../api/props';
import { Buscador } from './Buscador';
import { Filtros } from './Filtros';
import { Resultados } from './Resultados';
import '../App.css';

export const PropsNflApp = () => {
    const [datosJugador, setDatosJugador] = useState({});
    const [categorias, setCategorias] = useState([]);
    const [categoria, setCategoria] = useState('');
    const [propiedades, setPropiedades] = useState([]);
    const [propiedad, setPropiedad] = useState('');
    const [linea, setLinea] = useState();
    const [datosGrafica, setDatosGrafica] = useState({});

    const valoresUnicosPor = ( lista, llave) => [...new Map(lista.map(item => [item[llave], item])).values()];

    const seleccionJugador = async jugador => {
        setCategorias([]);
        setPropiedades([]);
        setCategoria();
        setPropiedad();
        setLinea('');
        const expresion = /_\/id\/([0-9]*)\//i;
        const idJugador = jugador.link.web.match(expresion);
        const bitacora = await bitacoraJugador( idJugador[1], jugador.sport, jugador.defaultLeagueSlug );
        setDatosJugador(bitacora);
        const listaCategorias = bitacora.estadisticas.filter( estadistica => estadistica ).flatMap( estadisticaDato => estadisticaDato.splits.categories.map( categoriaSeleccionada => ({ name: categoriaSeleccionada.name, displayName: categoriaSeleccionada.displayName }) ));    
        const categoriasUni = valoresUnicosPor(listaCategorias, 'name');
        setCategorias(categoriasUni);
    };

    useEffect(() => {
        if(categoria){
            const listaPropiedades = datosJugador.estadisticas.filter( estadistica => estadistica ).flatMap( estadisticaDato => estadisticaDato.splits.categories.filter( categoriaFiltro => categoriaFiltro.name === categoria ).flatMap( categoriaSeleccionada => categoriaSeleccionada.stats.map( stat => ({ name: stat.name, displayName: stat.displayName }) ) ));
            const propiedadesUni = valoresUnicosPor(listaPropiedades, 'name');
            setPropiedades(propiedadesUni);
        }
    }, [categoria]);

    const obtenerEstadisticaEventoCategoriaPropiedad = ( idEvento, categoria, propiedad ) => {
        const estadisticasEvento = datosJugador.estadisticas.find( estadistica => estadistica && estadistica.$ref.includes(idEvento) );
        if( estadisticasEvento ){
            const categoriaEvento = estadisticasEvento.splits.categories.find( categoriaEv => categoriaEv.name === categoria );
            if( categoriaEvento ) {
                const estadisticaEvento = categoriaEvento.stats.find( stat => stat.name === propiedad );
                return estadisticaEvento;
            }else{
                return null;
            }
        }else{
            return null;
        }
        
    };

    const verGrafica = () => {
        const rojo = 'red';
        const verde = 'green';
        const gris = 'gray';

        let vsEquipo = [];
        let fechaPartido = [];
        let datos = [];
        let colores = [];

        const eventos = Object.entries(datosJugador.bitacora.events).map( evento => evento[1]);
        const eventosOrdenados = eventos.sort( (eventoA, eventoB) => new Date( eventoA.gameDate ) - new Date( eventoB.gameDate ) );
        eventosOrdenados.map( evento => {
            const fecha = new Date(evento.gameDate);
            const formatoFecha = fecha.toISOString().split('T')[0].split('-');
            vsEquipo.push([`${evento.opponent.abbreviation}`, `${formatoFecha[1]}-${formatoFecha[2]}`]);
            const estadisticaPropiedad = obtenerEstadisticaEventoCategoriaPropiedad(evento.id, categoria, propiedad);
            if( estadisticaPropiedad ){
                datos.push(estadisticaPropiedad.value);
                if( linea ){
                    colores.push( Number(estadisticaPropiedad.value) >= Number(linea) ? verde : rojo)
                }else{
                    colores.push( gris )
                }
            }else{
                datos.push(0);
                colores.push( gris );
            }
        });

        vsEquipo = vsEquipo.slice( -10 );
        datos = datos.slice( -10 );
        colores = colores.slice( -10 );
        
        const data = {
            labels: vsEquipo,
            datasets: [
            {
                label: propiedad,
                data: datos,
                backgroundColor: colores,
            },
            ],
        };
        setDatosGrafica(
            data
        );
    };
    

    return <div id='props-nfl-app'> 
            <h2>Mis Props</h2>
            <Buscador seleccionJugador={seleccionJugador} />
            <Filtros 
                categorias={categorias} 
                categoria={categoria} 
                setCategoria={setCategoria} 
                propiedades={propiedades} 
                propiedad={propiedad} 
                setPropiedad={setPropiedad}
                linea={linea}
                setLinea={setLinea}
                verGrafica={verGrafica} />
            <Resultados datosGrafica={datosGrafica} />
        </div>
};
