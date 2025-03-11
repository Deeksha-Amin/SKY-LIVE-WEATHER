const searchInput = document.getElementById('location-input');
const searchButton = document.getElementById('search-button');
const map = L.map('map').setView([12.8689,74.8843], 15); // Initialize with setView

const weatherInfo = document.getElementById('weather-info');
const temperatureDisplay = document.getElementById('temperature');
const humidityDisplay = document.getElementById('humidity');
const windSpeedDisplay = document.getElementById('wind-speed');
const sunriseDisplay = document.getElementById('sunrise');
const sunsetDisplay = document.getElementById('sunset');
const pressureDisplay = document.getElementById('pressure');

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

let marker;

searchButton.addEventListener('click', () => {
    const location = searchInput.value;
    if (location) {
        geocodeLocation(location);
    }
});

async function geocodeLocation(location) {
    const geocodingUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`;

    try {
        const response = await fetch(geocodingUrl);
        const data = await response.json();

        if (data && data.length > 0) {
            const result = data[0];
            const lat = parseFloat(result.lat);
            const lng = parseFloat(result.lon);

            // Update map view and marker
            map.setView([lat, lng], 12);
            if (marker) {
                marker.remove();
            }
            marker = L.marker([lat, lng]).addTo(map);
            getWeatherData(lat, lng);
        } else {
            alert('Location not found.');
        }
    } catch (error) {
        console.error('Error geocoding location:', error);
        alert('An error occurred while geocoding the location.');
    }
}

async function getWeatherData(lat, lon) {
    const apiKey = '4b31a4fedf57b2b265386bf199fcb029'; // Replace with your actual API key
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        const temperature = Math.round(data.main.temp - 273.15); // Convert from Kelvin to Celsius
        const humidity = data.main.humidity;
        const windSpeed = data.wind.speed;
        const sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString();
        const sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString();
        const pressure = data.main.pressure;

        temperatureDisplay.textContent = `${temperature} °C`;
        humidityDisplay.textContent = `${humidity} %`;
        windSpeedDisplay.textContent = `${windSpeed} m/s`;
        sunriseDisplay.textContent = sunrise;
        sunsetDisplay.textContent = sunset;
        pressureDisplay.textContent = `${pressure} hPa`;

        weatherInfo.style.display = 'block';

    } catch (error) {
        console.error('Error fetching weather data:', error);
        alert('An error occurred while fetching weather data.');
    }
}