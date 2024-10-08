// script.js

// Variável para ajustar o tempo entre cada medição (em milissegundos)
const measurementInterval = 1000; // Altere este valor conforme necessário

let latencyData = [];
let jitterData = [];
let timeLabels = [];
let chart;

// Inicializa o gráfico com dois datasets: um para latência e outro para jitter
function initializeChart() {
    const ctx = document.getElementById('jitterChart').getContext('2d');
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: timeLabels,
            datasets: [
                {
                    label: 'Latência (ms)',
                    data: latencyData,
                    fill: false,
                    borderColor: 'rgb(75, 192, 192)', // Cor da linha de latência
                    tension: 0.1
                },
                {
                    label: 'Jitter (ms)',
                    data: jitterData,
                    fill: false,
                    borderColor: 'rgb(192, 75, 75)', // Cor da linha de jitter
                    tension: 0.1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Tempo (s)'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Valor (ms)'
                    }
                }
            }
        }
    });
}

function measureLatency() {
    let startTime = performance.now();
    fetch('/latency')
        .then(response => response.json())
        .then(data => {
            let latency = performance.now() - startTime;
            latencyData.push(latency);

            // Atualiza o texto da latência na página
            document.getElementById('latency').textContent = `Latência: ${latency.toFixed(2)} ms`;

            // Calcula o jitter se tivermos pelo menos duas medições
            if (latencyData.length >= 2) {
                let lastLatency = latencyData[latencyData.length - 1];
                let previousLatency = latencyData[latencyData.length - 2];
                let jitter = Math.abs(lastLatency - previousLatency);
                jitterData.push(jitter);

                // Atualiza o texto do jitter na página
                document.getElementById('jitter').textContent = `Jitter: ${jitter.toFixed(2)} ms`;
            } else {
                // Para o primeiro valor de jitter, adiciona zero
                jitterData.push(0);
            }

            // Atualiza os rótulos de tempo
            let currentTime = ((latencyData.length - 1) * measurementInterval) / 1000;
            timeLabels.push(currentTime.toFixed(1));

            // Limita o número de pontos no gráfico (opcional)
            const maxDataPoints = 60; // Mantém os últimos 60 pontos
            if (latencyData.length > maxDataPoints) {
                latencyData.shift();
                jitterData.shift();
                timeLabels.shift();
            }

            // Atualiza o gráfico
            chart.update();

            // Agenda a próxima medição
            setTimeout(measureLatency, measurementInterval);
        })
        .catch(error => console.error('Erro ao medir latência:', error));
}

// Chama a função após o carregamento da página
window.onload = function() {
    initializeChart();
    measureLatency();
    toggleTheme();
};
