import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ChartDataLabels
  );

export const Resultados = ({datosGrafica}) => {
    
    const opciones = {
      plugins: {
        datalabels: {
          display: true,
          color: "black",
          align: "end",
          anchor: "end",
          font: { size: "14" }
        }
      },
      legend: {
        display: false
      },
      responsive: true,
  };

  return (<div className='contenedor-resultados'>
        { datosGrafica.labels && 
            <Bar options={opciones} data={datosGrafica} />
        }
  </div>);
};
