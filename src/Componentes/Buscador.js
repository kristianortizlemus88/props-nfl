import React, { useState } from 'react';
import { busquedaJugador } from '../api/props';

export const Buscador = ( { seleccionJugador } ) => {
  const [nombreJugador, setNombreJugador] = useState('');
  const [equipo, setEquipo] = useState('');
  const [foto, setFoto] = useState();
  const [resultados, setResultados] = useState([]);

  const lanzaBusqueda = async ( textoConsulta ) => {
    const datos = await busquedaJugador(textoConsulta);
    setResultados(
        datos.results[0].contents
    );
  };

  const seleccionarJugador = resultado => {
    setResultados([]);
    seleccionJugador(resultado);
    setNombreJugador(resultado.displayName);
    setEquipo(resultado.subtitle);
    setFoto(resultado.image.default);
  };

  return <div className='buscador' >
      { foto &&  <img className='foto' src={foto} /> }
            <input  type='text' 
                    className='caja-jugador'
                    placeholder='Nombre del jugador'
                    value={nombreJugador} 
                    onChange={(e) => {
                        const valorBusqueda = e.target.value;
                            setNombreJugador(valorBusqueda);
                            if( valorBusqueda && valorBusqueda !== '' && valorBusqueda.length > 2){
                                lanzaBusqueda(e.target.value);
                            }else{
                                setResultados([]);
                            }
                        }
                    } />
            {   resultados.length > 0 &&  <div className='resultados-busqueda'>
                    {
                        resultados.filter( resultadoNFL => resultadoNFL/*.defaultLeagueSlug === 'nfl'*/ ).map( resultado => (
                                <div key={`fila-jugador-${resultado.displayName}`}
                                    className='fila-resultado-jugador'
                                    onClick={() => { seleccionarJugador(resultado); }}>
                                        {resultado.displayName}
                                </div>
                            ) 
                        )
                    }
                </div>
            }
            <div className='nombre-equipo'>
                {equipo}
            </div>

        </div>
};
