const API_KEY = "ae1744e07c381f0dac0de7fb4e5a98fd";

function onGeoOK(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    fetch(url)
    .then(Response => Response.json())
    .then(data => {
        const weatherContainer = document.querySelector("#weather");
        const weather = document.querySelector("#weather span:first-child");
        const name = document.querySelector("#weather span:last-child");
        weather.innerText = `${data.weather[0].main} / ${Math.round(data.main.temp)}°C`;
        name.innerText = data.name;
    });
}

function onGeoError() {
    alert("사용자의 위치를 특정하지 못했습니다. 날씨 정보 표시를 생략합니다.")
}

navigator.geolocation.getCurrentPosition(onGeoOK, onGeoError);