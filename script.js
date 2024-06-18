const apiKey = '6877b16cc2989977bd86b4ee10b7fa56';

// Default city
let city = 'Maribor';

// Document Object Model elements for weather information
const cityElement = document.getElementById('city');
const dateElement = document.getElementById('date');
const temperatureElement = document.getElementById('temperature');
const descriptionElement = document.getElementById('weather-description');
const humidityElement = document.getElementById('humidity');
const precipitationElement = document.getElementById('precipitation');
const countryElement = document.getElementById('country');
const windSpeedElement = document.getElementById('wind-speed');
const airPressureElement = document.getElementById('air-pressure');
const windDirectionElement = document.getElementById('wind-direction');
const mariborMap = document.getElementById('maribor-map');
const teldeMap = document.getElementById('telde-map');
const forecastContainer = document.getElementById('forecast-container');

// Function to fetch weather data based on the selected city
const fetchWeatherData = () => {
    // Fetch current weather data
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            // Update DOM with current weather information
            updateCurrentWeather(data);
        })
        .catch(error => console.error('Error fetching current weather data:', error));

    // Fetch 5 day / 3 hour forecast
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            // Display the forecast data in the forecastContainer div
            forecastContainer.innerHTML = generateForecastHTML(data.list);
        })
        .catch(error => console.error('Error fetching forecast data:', error));
};

// Function to update the Document Object Model with current weather information
const updateCurrentWeather = (data) => {
    cityElement.textContent = data.name;
    dateElement.textContent = new Date().toLocaleDateString();
    temperatureElement.textContent = `${Math.round(data.main.temp - 273.15)}°C`;
    descriptionElement.textContent = data.weather[0].description;
    humidityElement.textContent = `Humidity: ${data.main.humidity}%`;
    precipitationElement.textContent = `Precipitation: ${data.clouds.all}%`;
    countryElement.textContent = `Country: ${data.sys.country}`;
    windSpeedElement.textContent = `Wind Speed: ${data.wind.speed} m/s`;
    airPressureElement.textContent = `Air Pressure: ${data.main.pressure} hPa`;
    windDirectionElement.textContent = `Wind Direction: ${data.wind.deg}°`;

    // Hide or show maps based on the selected city
    if (city === 'Maribor') {
        mariborMap.style.display = 'block';
        teldeMap.style.display = 'none';
    } else {
        mariborMap.style.display = 'none';
        teldeMap.style.display = 'block';
    }
};

// Function to generate HTML for the forecast data
const generateForecastHTML = (forecastData) => {
    const dailyForecasts = groupForecastByDay(forecastData);
    let html = '';

    dailyForecasts.forEach(dayForecast => {
        const date = new Date(dayForecast[0].dt * 1000);
        const maxTemp = Math.max(...dayForecast.map(entry => entry.main.temp_max - 273.15));
        const minTemp = Math.min(...dayForecast.map(entry => entry.main.temp_min - 273.15));

        html += `<div class="daily-forecast">
            <p>${date.toDateString()}</p>
            <p>Max Temperature: ${Math.round(maxTemp)}°C</p>
            <p>Min Temperature: ${Math.round(minTemp)}°C</p>
            <ul>`;

        dayForecast.forEach(entry => {
            const time = new Date(entry.dt * 1000).toLocaleTimeString();
            const temperature = Math.round(entry.main.temp - 273.15);
            html += `<li>${time}: ${temperature}°C</li>`;
        });

        html += '</ul></div>';
    });

    return html;
};

// Function to group forecast entries by day
const groupForecastByDay = (forecastData) => {
    const groupedForecast = {};

    forecastData.forEach(entry => {
        const date = new Date(entry.dt * 1000).toLocaleDateString();
        if (!groupedForecast[date]) {
            groupedForecast[date] = [];
        }
        groupedForecast[date].push(entry);
    });

    return Object.values(groupedForecast);
};

// Initial fetch for default city
fetchWeatherData();

// Function to toggle between Maribor and Telde
const toggleCity = () => {
    city = (city === 'Maribor') ? 'Telde' : 'Maribor';

    // Fetch weather data for the new city
    fetchWeatherData();

    // Toggle map visibility based on the selected city
    mariborMap.classList.toggle('hidden', city !== 'Maribor');
    teldeMap.classList.toggle('hidden', city !== 'Telde');
};
