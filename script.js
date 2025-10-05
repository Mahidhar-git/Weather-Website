const apiKey = "326381ae2ed348df85493938250510"; // Your API key
const baseUrl = "https://api.weatherapi.com/v1";

const elements = {
    cityInput: document.getElementById("city-input"),
    searchBtn: document.getElementById("search-btn"),
    detectBtn: document.getElementById("detect-btn"),
    alerts: document.getElementById("alerts"),
    currentWeather: document.getElementById("current-weather"),
    dailyForecast: document.getElementById("daily-forecast"),
    hourlyForecast: document.getElementById("hourly-forecast"),
    sunInfo: document.getElementById("sun-info"),
    aqiInfo: document.getElementById("aqi-info"),
    uvHumidity: document.getElementById("uv-humidity"),
    windInfo: document.getElementById("wind-info"),
    windArrow: null,
    temperatureChartCtx: document.getElementById("temperatureChart").getContext("2d"),
    themeToggle: document.getElementById("theme-toggle"),
    shareBtn: document.getElementById("share-btn"),
};

let temperatureChart = null;
let isDark = true;

async function fetchWeatherData(city) {
    resetDisplay();

    try {
        const url = `${baseUrl}/forecast.json?key=${apiKey}&q=${encodeURIComponent(city)}&days=3&aqi=yes&alerts=yes`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.error) {
            elements.alerts.textContent = "City not found. Try again.";
            return;
        }

        displayAlerts(data.alerts);
        displayCurrent(data);
        displaySunInfo(data.forecast.forecastday[0]);
        displayAQI(data.current.air_quality);
        displayUVHumidity(data.current);
        displayWind(data.current.wind_degree, data.current.wind_kph);
        displayDailyForecast(data.forecast.forecastday);
        displayHourlyForecast(data.forecast.forecastday[0].hour);
        renderTemperatureChart(data.forecast.forecastday);
    } catch (e) {
        elements.alerts.textContent = "Error loading weather data.";
    }
    const shareSection = document.querySelector(".share-section");
if (shareSection) {
  shareSection.classList.add("visible");
}

}

function resetDisplay() {
    elements.alerts.textContent = "";
    elements.currentWeather.innerHTML = "";
    elements.sunInfo.innerHTML = "";
    elements.aqiInfo.innerHTML = "";
    elements.uvHumidity.innerHTML = "";
    elements.windInfo.innerHTML = "";
    elements.dailyForecast.innerHTML = "";
    elements.hourlyForecast.innerHTML = "";

    // Remove visible classes:
    elements.currentWeather.classList.remove("visible");
    elements.sunInfo.classList.remove("visible");
    elements.aqiInfo.classList.remove("visible");
    elements.uvHumidity.classList.remove("visible");
    elements.windInfo.classList.remove("visible");
    elements.dailyForecast.classList.remove("visible");
    elements.hourlyForecast.classList.remove("visible");
    document.querySelector(".chart-section").classList.remove("visible");
    document.querySelector(".share-section").classList.remove("visible");
    elements.windInfo.classList.remove("visible");
    document.querySelector(".share-section").classList.remove("visible");

    if (temperatureChart) {
        temperatureChart.destroy();
        temperatureChart = null;
    }
}


function displayWind(degree, kph) {
    // existing code...
    elements.windInfo.classList.add("visible");
}

function renderTemperatureChart(forecastDays) {
    // existing code...

    document.querySelector(".chart-section").classList.add("visible");
    document.querySelector(".share-section").classList.add("visible");
    document.querySelector(".chart-section").classList.add("visible");
    elements.shareBtn.parentElement.classList.add("visible");

}


function resetDisplay() {
    elements.alerts.textContent = "";
    elements.currentWeather.innerHTML = "";
    elements.sunInfo.innerHTML = "";
    elements.aqiInfo.innerHTML = "";
    elements.uvHumidity.innerHTML = "";
    elements.windInfo.innerHTML = "";
    elements.dailyForecast.innerHTML = "";
    elements.hourlyForecast.innerHTML = "";
    if (temperatureChart) {
        temperatureChart.destroy();
        temperatureChart = null;
    }
}

// Alerts display (severe weather)
function displayAlerts(alerts) {
    if (alerts && alerts.alert && alerts.alert.length) {
        elements.alerts.textContent = `Alert: ${alerts.alert[0].headline}`;
    } else {
        elements.alerts.textContent = "";
    }
}

// Current weather display
function displayCurrent(data) {
    const { location, current } = data;
    elements.currentWeather.innerHTML = `
    <span class="title" tabindex="0">${location.name}, ${location.country}</span>
    <img src="https:${current.condition.icon}" alt="${current.condition.text}" />
    <span class="temp">${current.temp_c}°C</span>
    <span>Condition: ${current.condition.text}</span>
  `;
    elements.currentWeather.classList.add("visible");
}

// Sunrise/sunset info
function displaySunInfo(day) {
    elements.sunInfo.innerHTML = `
    <strong>Sunrise:</strong> ${day.astro.sunrise} | 
    <strong>Sunset:</strong> ${day.astro.sunset}
  `;
    elements.sunInfo.classList.add("visible");
}

// AQI display
function displayAQI(aqi) {
    if (!aqi) {
        elements.aqiInfo.innerHTML = "Air Quality: N/A";
    } else {
        elements.aqiInfo.innerHTML = `
      <strong>Air Quality (PM2.5):</strong> ${parseFloat(aqi.pm2_5).toFixed(2)}
    `;
    }
    elements.aqiInfo.classList.add("visible");
}

// UV index & humidity display
function displayUVHumidity(current) {
    elements.uvHumidity.innerHTML = `
    <strong>UV Index:</strong> ${current.uv} | 
    <strong>Humidity:</strong> ${current.humidity}%
  `;
    elements.uvHumidity.classList.add("visible");
}

// Wind display
function displayWind(degree, kph) {
    elements.windInfo.innerHTML = `
    <strong>Wind:</strong> ${kph} km/h
    <svg class="wind-arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="white" d="M12 2L15 11H9L12 2Z"/><rect x="11" y="11" width="2" height="11" fill="white"/>
    </svg>
  `;
    elements.windInfo.classList.add("visible");
    const arrow = elements.windInfo.querySelector(".wind-arrow");
    const rotation = (degree + 180) % 360; // Adjust for wind direction arrow
    arrow.style.transform = `rotate(${rotation}deg)`;
}

// Daily forecast display (3 days)
function displayDailyForecast(forecastDays) {
    let html = '<div class="daily-forecast">';
    forecastDays.forEach(day => {
        html += `
    <div class="forecast-day" tabindex="0" aria-label="Forecast for ${day.date}">
      <div class="date">${day.date}</div>
      <img src="https:${day.day.condition.icon}" alt="${day.day.condition.text}" />
      <div class="temp">${day.day.maxtemp_c.toFixed(0)}° / ${day.day.mintemp_c.toFixed(0)}°</div>
      <div>${day.day.condition.text}</div>
    </div>
    `;
    });
    html += '</div>';
    elements.dailyForecast.innerHTML = html;
    elements.dailyForecast.classList.add("visible");
}

// Hourly forecast display for current day
function displayHourlyForecast(hours) {
    let html = '<div class="hourly-forecast" aria-label="Hourly forecast">';
    // Show next 12 hours from now
    const nowHour = new Date().getHours();
    const filteredHours = hours.filter(h => Number(h.time.split(' ')[1].split(':')[0]) >= nowHour).slice(0, 12);
    filteredHours.forEach(hour => {
        const timeLabel = hour.time.split(' ')[1].slice(0, 5);
        html += `
    <div class="hour-block" tabindex="0" aria-label="Weather at ${timeLabel}">
      <div class="time">${timeLabel}</div>
      <img src="https:${hour.condition.icon}" alt="${hour.condition.text}">
      <div class="temp">${hour.temp_c.toFixed(0)}°C</div>
    </div>
    `;
    });
    html += '</div>';
    elements.hourlyForecast.innerHTML = html;
    elements.hourlyForecast.classList.add("visible");
}

// Temperature trend chart
function renderTemperatureChart(forecastDays) {
    if (temperatureChart) temperatureChart.destroy();

    const labels = forecastDays.map(day => day.date);
    const maxTemps = forecastDays.map(day => day.day.maxtemp_c);
    const minTemps = forecastDays.map(day => day.day.mintemp_c);

    temperatureChart = new Chart(elements.temperatureChartCtx, {
        type: "line",
        data: {
            labels,
            datasets: [
                {
                    label: "Max Temp (°C)",
                    data: maxTemps,
                    borderColor: "rgba(88, 101, 255, 0.9)",
                    backgroundColor: "rgba(88, 101, 255, 0.3)",
                    fill: true,
                    tension: 0.3,
                },
                {
                    label: "Min Temp (°C)",
                    data: minTemps,
                    borderColor: "rgba(160, 184, 255, 0.7)",
                    backgroundColor: "rgba(160, 184, 255, 0.2)",
                    fill: true,
                    tension: 0.3,
                },
            ],
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    labels: {
                        color: 'white',
                        font: { size: 14 }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    ticks: { color: 'white', font: { size: 12 } }
                },
                x: {
                    ticks: { color: 'white', font: { size: 12 } }
                }
            }
        },
    });

    document.querySelector(".chart-section").classList.add("visible");
}

// Search button event
elements.searchBtn.addEventListener("click", () => {
    const city = elements.cityInput.value.trim();
    if (city) fetchWeatherData(city);
});

elements.cityInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        elements.searchBtn.click();
    }
});


// Detect location button event
elements.detectBtn.addEventListener("click", () => {
    if (!navigator.geolocation) {
        elements.alerts.textContent = "Geolocation is not supported by your browser.";
        return;
    }
    navigator.geolocation.getCurrentPosition(
        pos => {
            const lat = pos.coords.latitude;
            const lon = pos.coords.longitude;
            fetchWeatherData(`${lat},${lon}`);
        },
        () => {
            elements.alerts.textContent = "Unable to retrieve your location.";
        }
    );
});

// Dark/Light theme toggle
elements.themeToggle.addEventListener("click", () => {
    isDark = !isDark;
    if (isDark) {
        document.body.style.background = "#1a2a6c";
        elements.themeToggle.textContent = "🌗";
    } else {
        document.body.style.background = "#f3f4f6";
        elements.themeToggle.textContent = "☀️";
    }
});

// Social share
elements.shareBtn.addEventListener("click", () => {
    if (navigator.share) {
        const city = elements.cityInput.value.trim() || "your location";
        const temp = elements.currentWeather.querySelector(".temp")?.textContent || "";
        const condition = elements.currentWeather.querySelector("span:nth-child(4)")?.textContent || "";

        navigator.share({
            title: "Current Weather",
            text: `Weather in ${city}: ${temp}, ${condition}`,
            url: window.location.href,
        }).catch(() => {
            alert("Sharing failed or canceled.");
        });
    } else {
        alert("Share feature is not supported on this browser.");
    }
});

// Automatically fetch current location weather on load if permitted
window.addEventListener("load", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            pos => {
                const lat = pos.coords.latitude;
                const lon = pos.coords.longitude;
                fetchWeatherData(`${lat},${lon}`);
            },
            () => { }
        );
    }
});
