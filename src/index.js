//find current date, year, day and time
let now = new Date();

//Current MONTH
let months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];
let month = months[now.getMonth()];

//Current DATE
let date = now.getDate();

//Current YEAR
let year = now.getFullYear();

//Display DATE format
let displayMonth = document.querySelector("#current-month");
displayMonth.innerHTML = `${month}`;
let displayDate = document.querySelector("#current-date");
displayDate.innerHTML = `${date},`;
let displayYear = document.querySelector("#current-year");
displayYear.innerHTML = `${year}`;

//Getting current DAY
let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];
let day = days[now.getDay()];



//Getting current TIME
let hour = now.getHours();
let min = now.getMinutes();
let suffix;
if (hour >= 12 && min > 0) suffix = "PM";
else suffix = "AM";

if (hour > 12)
  hour = hour - 12;
let minutes = (min <10?'0':'') + now.getMinutes();


//Display DAY & TIME
let currentDay = document.querySelector("#current-day");
currentDay.innerHTML = `${day},`;
let currentDate = document.querySelector("#current-time");
currentDate.innerHTML = `${hour}:${minutes}`;
let ampmSuffix = document.querySelector("#current-am-pm");
ampmSuffix.innerHTML = `${suffix}`;

//Display City
let city = document.querySelector("#current-city");
city.innerHTML = navigator.geolocation.getCurrentPosition(showCurrentPosition);

//Getting day from date from API
function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[day];
}
//Show forecast for next 5 days
function showForecast(response) {
  let forecast = response.data.daily;
  let forcastElement = document.querySelector("#forecast");
  let forecastHTML = "";
  forecastHTML = `<div class="row">`;
  forecast.forEach(function (forecastDay, index) { 
    if (index < 6) {
      forecastHTML = forecastHTML +
        `
    <div class="col">
      <p class="day">${formatDay(forecastDay.dt)}</p>
      <p class="temperature-5Days">
        <strong><span id="max">
          ${Math.round(forecastDay.temp.max)}&#xb0;C
        </span></strong>
        |
        <span id="min">${Math.round(forecastDay.temp.min)}&#xb0;C</span>
      </p>
      <img
          src="http://openweathermap.org/img/wn/${
            forecastDay.weather[0].icon
          }@2x.png"
          alt=""
          width="50"
        />
      <p class="details">${
            forecastDay.weather[0].description
          }</p>
    </div>
    `;
    }
  });
  
  forecastHTML = forecastHTML + `</div>`;
  forcastElement.innerHTML = forecastHTML;
}

//Get forecast
function getForecast(coordinates) {
  let apiKey = "f7dffd4359849bb28c77fa4fe304c30f";
  let apiURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiURL).then(showForecast);
}
//Searched City using API
function displaySearchedCityDate(response) {
  console.log(response);
  let currentCity = document.querySelector("#current-city");
  currentCity.innerHTML = response.data.name;

  let temperature = document.querySelector("#display-temperature");
  celciusTemperature = Math.round(response.data.main.temp);
  temperature.innerHTML = celciusTemperature;

  let description = document.querySelector(".weather-description");
  description.innerHTML = response.data.weather[0].description;

  let humidity = document.querySelector(".humidity");
  humidity.innerHTML = `Humidity: ${response.data.main.humidity}%`;

  let wind = document.querySelector(".wind");
  let windSpeed = Math.round(response.data.wind.speed);
  wind.innerHTML = `Wind: ${windSpeed}mph`;

  let iconElement = document.querySelector("#icon-element");
  iconElement.setAttribute("src",
 `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);
  getForecast(response.data.coord);
}

//current button using Geolocation
function showCurrentPosition(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let apiKey = "f7dffd4359849bb28c77fa4fe304c30f";
  let unit = "metric";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${unit}`;
  axios.get(apiUrl).then(displaySearchedCityDate);
}

function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(showCurrentPosition);
}
document.querySelector(".current-location").addEventListener("click",getCurrentLocation);


function search(event) {
  event.preventDefault();
  let searchedCityName = document.querySelector("#search-city");

  let apiKey = "f7dffd4359849bb28c77fa4fe304c30f";
  let unit = "metric";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${searchedCityName.value}&appid=${apiKey}&units=${unit}`;
  axios.get(apiUrl).then(displaySearchedCityDate);
}

let searchButton = document.querySelector("button");
searchButton.addEventListener("click", search);

let celciusTemperature = null;
//getting temperature into Fahrenheit  
function changeToFahrenheit(event) {
  event.preventDefault();
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  let temperatureElement = document.querySelector("#display-temperature");
  console.log(celciusTemperature);
  temperatureElement.innerHTML = Math.round(((celciusTemperature * 9) / 5) + 32);
}

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", changeToFahrenheit);


//getting temperature into Celcius  
function changeToCelcius(event) {
  event.preventDefault();
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
  let temperature = document.querySelector("#display-temperature");
  console.log(temperature.innerHTML);
  temperature.innerHTML = celciusTemperature;
}

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", changeToCelcius);
