import React from 'react';

export const Filtros = ( { categorias, categoria, setCategoria, propiedades, propiedad, setPropiedad, linea, setLinea, verGrafica } ) => {
  return <div className='filtros'>
            <select className='filtro-categoria' value={categoria} onChange={(e)=> {setCategoria(e.target.value)}}>
            <option value="" disabled selected>Categoria</option>
            {
              categorias.map( cat => 
                (
                  <option value={cat.name}>{cat.displayName}</option>
                )
              )
            }
            </select>
            <br/>
            <select className='filtro-propiedad' placeholder='Propiedad' value={propiedad} onChange={(e)=> {setPropiedad(e.target.value)}}>
            <option value="" disabled selected>Propiedad</option>
            {
              propiedades.map( prop => 
                (
                  <option value={prop.name}>{prop.displayName}</option>
                )
              )
            }
            </select>
            <br/>
            <input className='caja-linea' placeholder='Valor de la línea' type='text' value={linea} onChange={(e) => {setLinea(e.target.value)}} />
            <br/>
            <button className='boton-grafica' onClick={verGrafica} > Ok </button>
        </div>;
};
