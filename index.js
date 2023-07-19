const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const https = require("https");
const path = require("path");
const dotenv = require("dotenv");
const axios = require('axios');
dotenv.config();

// const fs = require('@cyclic.sh/s3fs/promises')('cyclic-odd-gray-gorilla-yoke-ap-northeast-2')

const port = 8000;

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, './public')));
// app.use(express.static("public"));


app.get('/', (req, res) => {
    res.render("home");
})
app.get('/main', (req, res) => {
    res.render("home");
})

app.post('/main', (req, res) => {
    const cityName = req.body.location;
    const apiKey = process.env.WEATHER_API_KEY;
    const unit = "metric";

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=${unit}`;

    https.get(url, (response) => {
        response.on("data", async (data) => {
            const weatherData = JSON.parse(data);

            if (weatherData.cod === "404") {
                res.render("error");
            }

            else {
                const city = weatherData.name;
                const lon = weatherData.coord.lon;
                const lat = weatherData.coord.lat;
                const description = weatherData.weather[0].main;
                const icon = weatherData.weather[0].icon;
                const temp = weatherData.main.temp;
                const feelsLike = weatherData.main.feels_like;
                const windSpeed = weatherData.wind.speed;
                const humidity = weatherData.main.humidity;
                const imgURL = `http://openweathermap.org/img/wn/${icon}@2x.png`;

                //! for chatGPT
                const options = {
                    method: 'GET',
                    url: 'https://chatgpt-api9.p.rapidapi.com/ask',
                    params: {
                        question: `Forecast the weather of the location: ${city} where Latitude: ${lat} & Longitude: ${lon}, and write the response WEATHER FORECAST MANNER.`
                    },
                    headers: {
                        'X-RapidAPI-Key': process.env.CHAT_GPT_API_KEY,
                        'X-RapidAPI-Host': 'chatgpt-api9.p.rapidapi.com'
                    }
                };

                try {
                    const response = await axios.request(options);
                    const forecast = response.data.answer;
                    res.render("main", { cityName: city, lat: lat, lon: lon, description: description, temp: temp, humidity: humidity, feelsLike: feelsLike, windSpeed: windSpeed, img: imgURL, forecast: forecast });
                } catch (error) {
                    const forecast = `Apologies, Due to some internal error we are unable to forecast the weather.`;
                    res.render("main", { cityName: city, lat: lat, lon: lon, description: description, temp: temp, humidity: humidity, feelsLike: feelsLike, windSpeed: windSpeed, img: imgURL, forecast: forecast });
                    console.error(error);
                }

                // res.render("main", { cityName: city, lat: lat, lon: lon, description: description, temp: temp, humidity: humidity, feelsLike: feelsLike, windSpeed: windSpeed, img: imgURL, forecast: forecast });
            }
        })
    })
});



// app.listen(port, () => {
//     console.log(`Server has started on port: ${port}`);
// })

const server = app.listen(process.env.PORT || 4000);
const portNumber = server.address().port;
console.log(`port is open on ${portNumber}`);