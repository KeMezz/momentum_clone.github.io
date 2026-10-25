(() => {
    const form = document.querySelector("#weather-key-form");
    const input = document.querySelector("#weather-key");
    const weather = document.querySelector("#weather span:first-child");
    const name = document.querySelector("#weather span:last-child");
    let apiKey = "";
    let generation = 0;
    let activeRequest;

    function stopWeather() {
        generation += 1;
        apiKey = "";
        input.value = "";
        activeRequest?.abort();
        weather.innerText = "";
        name.innerText = "";
    }

    document.querySelector("#weather-disable").addEventListener("click", stopWeather);
    window.addEventListener("pagehide", stopWeather);
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        const enteredKey = input.value.trim();
        stopWeather();
        if (!/^[a-fA-F0-9]{32}$/.test(enteredKey)) {
            weather.innerText = "본인 OpenWeatherMap 키를 확인해주세요.";
            return;
        }
        if (!navigator.geolocation) {
            weather.innerText = "이 브라우저는 위치 정보를 지원하지 않습니다.";
            return;
        }
        apiKey = enteredKey;
        const current = generation;
        navigator.geolocation.getCurrentPosition(async (position) => {
            if (current !== generation) return;
            const params = new URLSearchParams({
                lat: String(position.coords.latitude),
                lon: String(position.coords.longitude),
                appid: apiKey,
                units: "metric",
            });
            activeRequest = new AbortController();
            try {
                const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?${params}`, {
                    signal: activeRequest.signal,
                    credentials: "omit",
                    referrerPolicy: "no-referrer",
                });
                if (!response.ok) throw new Error("Weather unavailable");
                const data = await response.json();
                if (current !== generation) return;
                if (!Array.isArray(data.weather) || typeof data.weather[0]?.main !== "string" ||
                    !Number.isFinite(data.main?.temp) || typeof data.name !== "string") {
                    throw new Error("Invalid weather response");
                }
                weather.innerText = `${data.weather[0].main} / ${Math.round(data.main.temp)}°C`;
                name.innerText = data.name;
            } catch {
                if (current === generation) weather.innerText = "날씨를 불러오지 못했습니다. 키와 사용 한도를 확인해주세요.";
            } finally {
                if (current === generation) apiKey = "";
            }
        }, () => {
            if (current !== generation) return;
            apiKey = "";
            weather.innerText = "위치 정보를 확인하지 못해 날씨 표시를 생략합니다.";
        }, { timeout: 10000, maximumAge: 300000 });
    });
})();
