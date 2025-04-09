const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const cityName = document.getElementById('city-name');
const temperature = document.getElementById('temperature');
const feelsLike = document.getElementById('feels-like');
const humidity = document.getElementById('humidity');
const wind = document.getElementById('wind');
const pressure = document.getElementById('pressure');
const weatherIcon = document.getElementById('weather-icon');
const weatherDescription = document.getElementById('weather-description');
const dateTime = document.getElementById('date-time');
const weatherInfo = document.getElementById('weather-info');
const loading = document.getElementById('loading');
const errorMessage = document.getElementById('error-message');
const initialMessage = document.getElementById('initial-message');
const dynamicBackground = document.getElementById('dynamic-background');

const apiKey = '8b136cd87464fba264a4428ccdc46be9';

const testMode = false;

searchBtn.addEventListener('click', getWeatherData);
cityInput.addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
        getWeatherData();
    }
});

function getWeatherData() {
    const city = cityInput.value.trim();
    
    if (!city) return;
    
    showLoading();
    
    if (testMode) {
        setTimeout(() => {
            const testData = getTestData(city);
            displayWeatherData(testData);
        }, 1000); 
    } else {
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=pt_br`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Cidade não encontrada');
                }
                return response.json();
            })
            .then(data => {
                displayWeatherData(data);
            })
            .catch(error => {
                showError();
                console.error('Erro:', error);
            });
    }
}

function getTestData(city) {
    const weatherCodes = ['01d', '01n', '02d', '03d', '04d', '09d', '10d', '11d', '13d', '50d'];
    const randomWeatherCode = weatherCodes[Math.floor(Math.random() * weatherCodes.length)];
    
    const descriptions = {
        '01d': 'céu limpo',
        '01n': 'céu limpo',
        '02d': 'nuvens dispersas',
        '03d': 'nuvens quebradas',
        '04d': 'nuvens carregadas',
        '09d': 'chuva leve',
        '10d': 'chuva',
        '11d': 'tempestade',
        '13d': 'neve',
        '50d': 'neblina'
    };
    
    return {
        name: city,
        sys: {
            country: 'BR'
        },
        main: {
            temp: Math.floor(Math.random() * 35) + 5, 
            feels_like: Math.floor(Math.random() * 35) + 5,
            humidity: Math.floor(Math.random() * 100),
            pressure: Math.floor(Math.random() * 30) + 1000 
        },
        wind: {
            speed: Math.random() * 10 
        },
        weather: [
            {
                icon: randomWeatherCode,
                description: descriptions[randomWeatherCode]
            }
        ]
    };
}

function displayWeatherData(data) {
    cityName.textContent = `${data.name}, ${data.sys.country}`;
    temperature.textContent = `${Math.round(data.main.temp)}°C`;
    feelsLike.textContent = `Sensação: ${Math.round(data.main.feels_like)}°C`;
    humidity.textContent = `${data.main.humidity}%`;
    wind.textContent = `${Math.round(data.wind.speed * 3.6)} km/h`;
    pressure.textContent = `${data.main.pressure} hPa`;
    
    const iconCode = data.weather[0].icon;
    weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    weatherDescription.textContent = data.weather[0].description;
    
    const date = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    dateTime.textContent = date.toLocaleDateString('pt-BR', options);
    
    hideLoading();
    hideError();
    hideInitialMessage();
    showWeatherInfo();
    
    updateBackgroundByWeather(iconCode);
}

function updateBackgroundByWeather(weatherCode) {
    dynamicBackground.className = 'dynamic-background';
    
    if (weatherCode.includes('01d')) {
        // Céu limpo - dia
        dynamicBackground.classList.add('weather-clear-day');
    } else if (weatherCode.includes('01n')) {
        // Céu limpo - noite
        dynamicBackground.classList.add('weather-clear-night');
    } else if (weatherCode.includes('02') || weatherCode.includes('03') || weatherCode.includes('04')) {
        // Nuvens
        dynamicBackground.classList.add('weather-clouds');
    } else if (weatherCode.includes('09') || weatherCode.includes('10')) {
        // Chuva
        dynamicBackground.classList.add('weather-rain');
    } else if (weatherCode.includes('11')) {
        // Tempestade
        dynamicBackground.classList.add('weather-thunderstorm');
    } else if (weatherCode.includes('13')) {
        // Neve
        dynamicBackground.classList.add('weather-snow');
    } else if (weatherCode.includes('50')) {
        // Neblina
        dynamicBackground.classList.add('weather-mist');
    }
    
    adjustTextColors(weatherCode);
}

function adjustTextColors(weatherCode) {
    const body = document.body;
    
    body.classList.remove('theme-clear-day', 'theme-clear-night', 'theme-clouds', 'theme-rain', 'theme-snow', 'theme-mist', 'theme-thunderstorm');
    
    if (weatherCode.includes('01d')) {
        body.classList.add('theme-clear-day');
    } else if (weatherCode.includes('01n')) {
        body.classList.add('theme-clear-night');
    } else if (weatherCode.includes('02') || weatherCode.includes('03') || weatherCode.includes('04')) {
        body.classList.add('theme-clouds');
    } else if (weatherCode.includes('09') || weatherCode.includes('10')) {
        body.classList.add('theme-rain');
    } else if (weatherCode.includes('11')) {
        body.classList.add('theme-thunderstorm');
    } else if (weatherCode.includes('13')) {
        body.classList.add('theme-snow');
    } else if (weatherCode.includes('50')) {
        body.classList.add('theme-mist');
    }
}

function showWeatherInfo() {
    weatherInfo.classList.remove('hidden');
}

function hideWeatherInfo() {
    weatherInfo.classList.add('hidden');
}

function showLoading() {
    loading.classList.remove('hidden');
    hideWeatherInfo();
    hideError();
    hideInitialMessage();
}

function hideLoading() {
    loading.classList.add('hidden');
}

function showError() {
    errorMessage.classList.remove('hidden');
    hideLoading();
    hideWeatherInfo();
    hideInitialMessage();
}

function hideError() {
    errorMessage.classList.add('hidden');
}

function showInitialMessage() {
    initialMessage.classList.remove('hidden');
}

function hideInitialMessage() {
    initialMessage.classList.add('hidden');
}

window.addEventListener('load', () => {
    cityInput.focus();
});


