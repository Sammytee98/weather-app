const weatherForm = document.querySelector('.getWeather');
const container = document.querySelector('.weatherDisplay');
const cityInput = document.querySelector('.cityName');
const apiKey = 'f419b26d8f8702c935c8d072fa5d1bd0';


weatherForm.addEventListener('submit', async event => {
    event.preventDefault();

    container.innerHTML = '';
    const city = cityInput.value;
    if(!city){
        errorDisplay('Please enter a city!');
        return;
    }
    try {
        createCityHeader(city);
        const weather = await fetchWeatherData(city);
        console.log(weather);
        
        displayWeatherInfo(weather);
    } catch (error) {
        errorDisplay(error);
    }
});


const fetchWeatherData = async (data) => {
    const apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${data}&appid=${apiKey}`;
    const weatherInfo = await fetch(apiURL);
    if(!weatherInfo.ok){
        throw new Error('Could not fetch weather data');
    }
    return await weatherInfo.json();   
}

const createCityHeader = (name) => {
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
        weather: [{id, description}],
        sys: {sunset},
        wind: {speed}
    } = info;
    console.log(sunset, speed);
    
    const KELVIN_TO_CELSIUS = 273.15;
    const sunsetTime = new Date(sunset * 1000);
    const sunsetFormatedTime = sunsetTime.toLocaleTimeString([], 
        {hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
    
    const weatherEmoji = document.createElement('p');
    const temperature = document.createElement('p');
    const weatherCondition = document.createElement('p');
    const details = document.createElement('div');

    weatherEmoji.textContent = emojiDisplay(weatherEmoji, id);
    temperature.textContent = `${Math.floor(temp - KELVIN_TO_CELSIUS)}°`;
    weatherCondition.textContent = description;
    details.innerHTML = humidtyWindSunset('Humidity', `${humidity}%`) +
                        humidtyWindSunset('Wind', `${speed} m/s`) +
                        humidtyWindSunset('Sunset', sunsetFormatedTime);
    
    weatherEmoji.classList.add('emojiDisplay');
    temperature.classList.add('tempDisplay');
    weatherCondition.classList.add('conditionDisplay');
    details.classList.add('details')
    
    container.appendChild(weatherEmoji);
    container.appendChild(temperature);
    container.appendChild(weatherCondition);
    container.appendChild(details);
}

const humidtyWindSunset = (name, value) => {
    const detailDisplay = `<p class="humidityDisplay">${name}<span>${value}</span></p>`;
    return detailDisplay;
}



const emojiDisplay = (emoji, weatherId) => {
    switch (true) {
        case (weatherId >= 200 && weatherId <=232):
            emoji.style.textShadow = '0 0 5px white';
            return '⛈️';
        break;

        case (weatherId >= 300 && weatherId <=321):
            emoji.style.textShadow = '0 0 5px white';
            return '🌧️';
        break;

        case (weatherId >= 500 && weatherId <=531):
            emoji.style.textShadow = '0 0 5px white';
            return '🌦️';
        break;

        case (weatherId >= 600 && weatherId <=622):
            emoji.style.textShadow = '0 0 5px white';
            return '❄️';
        break;

        case (weatherId >= 701 && weatherId <=781):
            emoji.style.textShadow = '0 0 5px white';
            return '🌪️';
        break;

        case (weatherId === 800):
            emoji.style.textShadow = '0 0 5px white';
            return '🌟';
        break;

        case (weatherId > 800):
            emoji.style.textShadow = '0 0 10px white';
            return '☁️';
        break;

        default:
            return '❓';
    }
}

const errorDisplay = (message) => {
    // Clear existing errors
    const existingError = document.querySelector('.errorMessage');
    if(existingError) existingError.remove();

    const errorMessage = document.createElement('p');
    errorMessage.textContent = message;
    errorMessage.classList.add('errorMessage');
    errorMessage.style.display = 'flex';
    container.appendChild(errorMessage);
}