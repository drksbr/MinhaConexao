// dateTimeWorker.ts

// Função que dispara o console.log com o date-time atual a cada segundo
function logCurrentDateTime() {
    setInterval(() => {
        console.log(`Current Date-Time: ${new Date().toLocaleString()}`);
    }, 1000);
}

// Inicia o loop quando o worker é iniciado
logCurrentDateTime();
