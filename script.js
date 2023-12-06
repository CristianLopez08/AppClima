const apiKey = 'TU_API_DE_OPENWEATHERMAP';
const telegramBotToken = 'TU_TOKEN_BOT_DE_TELEGRAM';
const telegramChatId = 'TU_CHAT_ID';

function getCurrentLocationWeather() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;

            fetchWeather(apiUrl);
        }, error => {
            console.error('Error getting current location:', error.message);
        });
    } else {
        console.error('La geolocalización no es compatible con este navegador.');
    }
}

function searchWeather() {
    const cityInput = document.getElementById('city-input').value;
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityInput}&appid=${apiKey}`;

    fetchWeather(apiUrl);
}

function fetchWeather(apiUrl) {
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            displayWeather(data);
        })
        .catch(error => console.error('Error fetching weather:', error));
}

function sendReport() {
    const cityInput = document.getElementById('city-input').value;

    if (cityInput) {
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityInput}&appid=${apiKey}`;
        fetchWeatherAndSendReport(apiUrl);
    } else {
        console.error('Por favor, ingrese una ciudad para generar el informe.');
    }
}

function fetchWeatherAndSendReport(apiUrl) {
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            displayWeather(data);
            sendTelegramReport(data);
        })
        .catch(error => console.error('Error fetching weather:', error));
}

function sendTelegramReport(data) {
    const location = `${data.name}, ${data.sys.country}`;
    const temperature = Math.round(data.main.temp - 273.15); // Convert to Celsius
    const description = data.weather[0].description;
    const humidity = data.main.humidity;
    const windSpeed = data.wind.speed;

    const message = `Informe del Clima\nUbicación: ${location}\nTemperatura: ${temperature}°C\nDescripción: ${description}\nHumedad: ${humidity}%\nVelocidad del viento: ${windSpeed} m/s`;

    sendTelegramMessage(message);
    displayTelegramReport('Informe enviado a Telegram exitosamente!');
}

function sendTelegramMessage(message) {
    const telegramApiUrl = `https://api.telegram.org/bot${telegramBotToken}/sendMessage?chat_id=${telegramChatId}&text=${encodeURIComponent(message)}`;

    fetch(telegramApiUrl)
        .then(response => response.json())
        .then(result => {
            console.log('Mensaje de Telegram enviado:', result);
        })
        .catch(error => console.error('Error al enviar el mensaje a Telegram:', error));
}

function displayWeather(data) {
    const locationElement = document.getElementById('current-location');
    const weatherElement = document.getElementById('current-weather');
    const additionalInfoElement = document.getElementById('additional-info');

    const location = `Ubicación: ${data.name}, ${data.sys.country} (Latitud: ${data.coord.lat}, Longitud: ${data.coord.lon})`;
    const temperature = Math.round(data.main.temp - 273.15); // Convert to Celsius
    const description = data.weather[0].description;
    const humidity = data.main.humidity;
    const windSpeed = data.wind.speed;

    locationElement.textContent = location;
    weatherElement.textContent = `Temperatura: ${temperature}°C, Descripción: ${description}`;
    additionalInfoElement.textContent = `Humedad: ${humidity}%, Velocidad del viento: ${windSpeed} m/s`;
}

function displayTelegramReport(message) {
    const telegramReportElement = document.getElementById('telegram-report');

    if (telegramReportElement) {
        telegramReportElement.textContent = message;
    } else {
        console.error('Elemento con id "telegram-report" no encontrado.');
    }
}

// Llamar a getCurrentLocationWeather() en la carga de la página
getCurrentLocationWeather();
