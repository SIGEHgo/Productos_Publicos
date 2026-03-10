const ctx3 = document.getElementById('modalidad_grafica').getContext('2d');

let actualizador_modalidad_grafica = new Chart(ctx3, {
  type: 'bar',
  data: {
    labels: existe_modalidad_seleccionada().map(d => d.l),
    datasets: [
      {
        label: 'Frecuencia',
        data: existe_modalidad_seleccionada().map(d => d.v),
        backgroundColor: [
          "rgba(98, 17, 50, 1)",
          "rgba(232, 216, 195, 1)",
          "#c4c4c4",
          "#ebc7d0",
          "#254d50",
        ],
        borderColor: ['rgba(179, 142, 93, 1)'],
        borderWidth: 1
      }
    ]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "Colonias con mayor número de Modalidad Familiar",
        padding: { top: 0, bottom: 0 },
        font: {
          size: 24,
          weight: 'bold'
        }
      },
      subtitle: {
        display: true,
        text: "",
      }
    },

    scales: {
      y: {
        beginAtZero: true
      }
    }
  }
});