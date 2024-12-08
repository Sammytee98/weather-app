const getWeather = document.querySelector('.getWeather');
const container = document.querySelector('.weatherDisplay');
const cityInput = document.querySelector('.cityName');
const apiKey = 'f419b26d8f8702c935c8d072fa5d1bd0';

getWeather.addEventListener('submit', async event => {
    event.preventDefault();

    container.innerHTML = '';
    const city = cityInput.value;
    if(!city){
        errorDisplay('Please enter a city!');
        return;
    }
    try {
        cityDisplay(city);
        const weather = await getWeatherInfo(city);
        displayWeatherInfo(weather);
    } catch (error) {
        errorDisplay(error);
    }
});


const getWeatherInfo = async (info) => {
    const apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${info}&appid=${apiKey}`;
    const weatherInfo = await fetch(apiURL);
    if(!weatherInfo.ok){
        throw new Error('Could not fetch weather data');
    }
    return await weatherInfo.json();   
}

const cityDisplay = (name) => {
    const firstLetter = name.slice(0,1);
    const restOfTheLetter = name.slice(1, name.length).toLowerCase();
    const capitalizedLetter = firstLetter.toUpperCase();
    const cityName = `${capitalizedLetter}${restOfTheLetter}`;
    
    const cityDisplay = document.createElement('h1');
    cityDisplay.textContent = cityName;
    cityDisplay.classList.add('cityDisplay');

    container.appendChild(cityDisplay)
}

const displayWeatherInfo = (info) => {
    const {
        main: {humidity, temp}, 
        weather: [{id, description}]
    } = info;
    
    const temperature = document.createElement('p');
    const humidityDisplay = document.createElement('p');
    const weatherCondition = document.createElement('p');
    const weatherEmoji = document.createElement('p');

    temperature.textContent = `${(temp - 273.15).toFixed(2)}°C`;
    humidityDisplay.textContent = `Humidity: ${humidity}%`;
    weatherCondition.textContent = description;
    weatherEmoji.textContent = emojiDisplay(id);
    
    temperature.classList.add('tempDisplay');
    humidityDisplay.classList.add('humidityDisplay');
    weatherCondition.classList.add('conditionDisplay');
    weatherEmoji.classList.add('emojiDisplay');
    
    container.appendChild(temperature);
    container.appendChild(humidityDisplay);
    container.appendChild(weatherCondition);
    container.appendChild(weatherEmoji);
}

const emojiDisplay = (weatherId) => {
    switch (true) {
        case (weatherId >= 200 && weatherId <=232):
            return '⛈️';
        break;

        case (weatherId >= 300 && weatherId <=321):
            return '🌧️';
        break;

        case (weatherId >= 500 && weatherId <=531):
            return '🌦️';
        break;

        case (weatherId >= 600 && weatherId <=622):
            return '❄️';
        break;

        case (weatherId >= 701 && weatherId <=781):
            return '🌪️';
        break;

        case (weatherId === 800):
            return '🌟';
        break;

        case (weatherId > 800):
            return '☁️';
        break;

        default:
            return '��';
    }
}

const errorDisplay = (message) => {
    const errorMessage = document.createElement('p');
    errorMessage.textContent = message;
    errorMessage.classList.add('errorMessage');
    errorMessage.style.dislay = 'flex';
    container.appendChild(errorMessage);
}