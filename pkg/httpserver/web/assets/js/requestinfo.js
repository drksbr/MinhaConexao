// Função para buscar informações do IP
async function fetchRequestInfo() {
    try {
        const response = await fetch('/requestinfo');
        const data = await response.json();

        // Monta as linhas da tabela
        const tableBody = document.getElementById('requestInfoDataTable');

        // Remove o spinner
        document.getElementById('spinner').style.display = 'none';

        document.getElementById('XRealIP').innerText = data.XRealIP;
        document.getElementById('XForwardedSourcePort').innerText = data.XForwardedSourcePort;
        document.getElementById('Timestamp').innerText = data.Timestamp

        // apaga o spinner com id requestInfoSpinner
        document.getElementById('requestInfoSpinner').style.display = 'none';

        // remove a classe hidden para exibir a tabela
        tableBody.classList.remove('hidden');

    } catch (error) {
        console.error('Erro ao buscar informações do IP:', error);
    }
}