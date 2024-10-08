// Função para buscar informações do IP
async function fetchIPInfo() {
    try {
        const response = await fetch('https://ipinfo.io/json');
        const data = await response.json();

        // Monta as linhas da tabela
        const tableBody = document.getElementById('ipInfoTable');

        // Campos a serem exibidos com seus respectivos aliases
        const fieldsToDisplay = {
            city: 'Cidade',
            country: 'País',
            loc: 'Localização',
            org: 'Organização',
            postal: 'CEP',
            region: 'Estado',
            timezone: 'Zona',
        };

        // Itera sobre os campos a serem exibidos
        for (const [key, alias] of Object.entries(fieldsToDisplay)) {
            const value = data[key];
            if (value !== undefined) {
                const row = document.createElement('tr');
                let displayValue = value;

                // Adiciona bandeira se for o país
                if (key === 'country') {
                    const flagUrl = `https://flagcdn.com/32x24/${value.toLowerCase()}.png`;
                    displayValue = `${value} <img src="${flagUrl}" alt="${value} flag" class="inline-block ml-2">`;
                }

                // Formata a localização como link para o mapa, se for o campo "loc"
                if (key === 'loc') {
                    const [latitude, longitude] = value.split(',');
                    const mapUrl = `https://www.google.com/maps/@${latitude},${longitude},15z`;
                    displayValue = `
                    <div class="flex gap-2">
                        <p class="text-blue-500 hover:underline">${value}</p>
                        <a href="${mapUrl}" target="_blank" class="text-blue-500">
                            <img src="/assets/img/google-maps-new.png" alt="Google Maps">
                        </a>
                    </div>
                    `;
                }

                row.innerHTML = `
                    <td class="py-2 px-4 font-semibold">${alias}</td>
                    <td class="py-2 px-4">${displayValue}</td>
                `;
                tableBody.appendChild(row);
            }
        }
    } catch (error) {
        console.error('Erro ao buscar informações do IP:', error);
    }
}

// Função para capitalizar a primeira letra
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}