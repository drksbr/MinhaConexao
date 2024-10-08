// Funções de tema
function toggleTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
}

function loadTheme() {
    const storedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const defaultTheme = storedTheme || (prefersDark ? 'dark' : 'light');
    toggleTheme(defaultTheme);
    document.getElementById('themeSwitch').checked = defaultTheme === 'dark';
}

document.getElementById('themeSwitch').addEventListener('change', function () {
    const theme = this.checked ? 'dark' : 'light';
    toggleTheme(theme);
});

// Ao carregar a página
window.onload = function () {
    loadTheme();
    fetchIPInfo();
    fetchRequestInfo();
};
