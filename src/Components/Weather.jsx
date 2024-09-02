import React, { useState } from 'react';
import './weather.css';
import axios from 'axios';

export default function Weather() {
    const [city, setCity] = useState('');
    const [weatherInfo, setWeatherInfo] = useState(null);
    const [error, setError] = useState('');
    const [isClicked, setIsClicked] = useState(false);
    const [loading, setLoading] = useState(false);

    const tempConverter = () => {
        if (weatherInfo) {
            const kelvin = weatherInfo.data.main.temp;
            const celsius = kelvin - 273.15;
            return celsius.toFixed(2); // Converting to 2 decimal places
        }
        return null;
    };

    const handleCityChange = (event) => {
        setCity(event.target.value);
        setError(''); // Clear the error message when typing starts
    };

    const fetchWeather = async () => {
        setLoading(true);
        setError(''); // Clear any previous error

        try {
            const response = await axios.get(
                `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=763ca7fa30c677c83e7f122aa7aa5387`
            );
            setWeatherInfo(response);
        } catch (error) {
            if (error.response) {
                setError(error.response.data.message);
            } else {
                setError('An unexpected error occurred.');
            }
            setWeatherInfo(null); // Clear previous weather info on error
        } finally {
            setLoading(false);
        }
    };

    const handleClick = () => {
        fetchWeather();
        setIsClicked(true);
    };

    return (
        <div className='weather-container'>
            <div className="input-container">
                <input
                    type="text"
                    placeholder='Enter City Name'
                    value={city}
                    onChange={handleCityChange}
                />
                <button onClick={handleClick}>Get Weather</button>
            </div>

            <div className={isClicked ? "data-container-show" : "data-container"}>
                {loading ? (
                    <div className='loading-content'>
                        <h4>Loading...</h4> 
                        <span className='loading'></span>
                    </div>
                ) : weatherInfo ? (
                    <div className="weather-info">
                        <div className="city">
                            <h3>City:</h3>
                            <p>{weatherInfo.data.name}</p>
                        </div>

                        <div className="city">
                            <h3>Temperature:</h3>
                            <p>{tempConverter()} °C</p>
                        </div>

                        <div className="city">
                            <h3>Status:</h3>
                            <p>{weatherInfo.data.weather[0].description}</p>
                        </div>
                    </div>
                ) : error ? (
                    <div className="error-message">
                        <span className='cityName'>{city}</span> {error}
                    </div>
                ) : null}
            </div>
        </div>
    );
}
