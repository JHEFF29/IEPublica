document.querySelector('form').addEventListener('submit', function(event) {
    const username = document.querySelector('#username').value;
    const password = document.querySelector('#password').value;
    
    if (!username || !password) {
        event.preventDefault();
        alert('Todos los campos son obligatorios');
    }
});
