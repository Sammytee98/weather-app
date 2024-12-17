$(document).ready(function() {
    
    const $container = $('.weatherDisplay');
    const $cityInput = $('.cityName');
    const apiKey = 'f419b26d8f8702c935c8d072fa5d1bd0';
    
    
    $('.getWeather').submit(async event => {
        event.preventDefault();
        
    
        $container.html('');
        const city = $cityInput.val().trim();
        if(!city){
            errorDisplay('Please enter a valid city!');
            return;
        }
        try {
            createCityHeader(city);
            const weatherData = await fetchWeatherData(city);
            displayWeatherInfo(weatherData);
        } catch (error) {
            console.log(error.message);
            $container.html('');
            errorDisplay('City not found. Check the name and try again!');
        }
    });

    const fetchWeatherData = async (data) => {
        try {
            const response = await $.ajax({
                type: 'GET',
                url: `https://api.openweathermap.org/data/2.5/weather?q=${data}&appid=${apiKey}`,
                dataType: 'json'
            });
            console.log(response);
            
            
            if(response.cod && response.cod !== 200){
                throw new Error(response.message || 'Failed to fetch weather data');
            }
    
            return response;
            
        } catch (error) {
            throw new Error(error.responseJSON?.message || 'Unable to fecth weather data');
        }
    }
    
    const createCityHeader = (name) => {
        const cityName = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
        
        const $cityDisplay = $('<h1 class="cityDisplay">');
        $cityDisplay.text(cityName);
    
        $container.append($cityDisplay)
    }
    
    const displayWeatherInfo = (info) => {
        
        const {
            main: {humidity, temp}, 
            sys: {sunset},
            weather: [{id, description}],
            wind: {speed}
        } = info;
        console.log(info);
        
        
        const KELVIN_TO_CELSIUS = 273.15;
        const sunsetTime = new Date(sunset * 1000);
        const sunsetFormatedTime = sunsetTime.toLocaleTimeString([], 
            {hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
        
        const $weatherEmoji = $('<p class="emojiDisplay">');
        const $temperature = $('<p class="tempDisplay">');
        const $weatherCondition = $('<p class="conditionDisplay">');
        const $details = $('<div class="details">');
    
        $weatherEmoji.text(emojiDisplay($weatherEmoji, id));
        $temperature.text(`${Math.floor(temp - KELVIN_TO_CELSIUS)}°`);
        $weatherCondition.text(description);
        $details.html(humidityWindSunset('Humidity', `${humidity}%`) +
                            humidityWindSunset('Wind', `${speed} m/s`) +
                            humidityWindSunset('Sunset', sunsetFormatedTime));
        
        
        $container.append($weatherEmoji);
        $container.append($temperature);
        $container.append($weatherCondition);
        $container.append($details);
    }
    
    const humidityWindSunset = (name, value) => {
        const detailDisplay = `<p class="humidityDisplay">${name}<span>${value}</span></p>`;
        return detailDisplay;
    }
    
    
    
    const emojiDisplay = (emoji, weatherId) => {
        switch (true) {
            case (weatherId >= 200 && weatherId <=232):
                emoji.css('textShadow', '0 0 5px hsl(220, 90%, 80%)');
                return '⛈️';
            break;
    
            case (weatherId >= 300 && weatherId <=321):
                emoji.css('textShadow', '0 0 5px white');
                return '🌧️';
            break;
    
            case (weatherId >= 500 && weatherId <=531):
                emoji.css('textShadow', '0 0 5px white');
                return '🌦️';
            break;
    
            case (weatherId >= 600 && weatherId <=622):
                emoji.css('textShadow', '0 0 5px hsl(220, 90%, 80%)');
                return '❄️';
            break;
    
            case (weatherId >= 701 && weatherId <=781):
                emoji.css('textShadow', '0 0 5px white');
                return '🌪️';
            break;
    
            case (weatherId === 800):
                emoji.css('textShadow', '0 0 10px yellow');
                return '🌟';
            break;
    
            case (weatherId > 800):
                emoji.css('textShadow', '0 0 10px white');
                return '☁️';
            break;
    
            default:
                return '❓';
        }
    }
    
    const errorDisplay = (message) => {
        // Clear existing errors
        const existingError = $('.errorMessage');
        if(existingError) existingError.remove();
    
        const $errorMessage = $('<p class="errorMessage">');
        $errorMessage.text(message);
        $errorMessage.css('display', 'flex');
        $container.append($errorMessage);
    }
});