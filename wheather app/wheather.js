const apikey="47b40fe140dd8b467a1084fff1ae1c53";
const weatherDataEl=document.getElementById("weather-data");
const cityInputEl=document.getElementById("city-input");
const formEl=document.querySelector("form");


formEl.addEventListener("submit",(event)=>{
    event.preventDefault();
    const cityValue= cityInputEl.value;
    getWeatherData(cityValue);


});

async function getWeatherData(cityValue){
    try {
        const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityValue}&appid=${apikey}&units=metric`)

        if(!response.ok){
            throw new Error("Network response not working")
        }

        const data=await response.json()

        const temperature = Math.round(data.main.temp)
        const description =data.weather[0].description

        const icon=data.weather[0].icon
        const details=[
            `Feels like:${Math.round(data.main.feels_like)}`,
            `Humidity: ${data.main.humidity}%`,
            `Wind speed :${data.wind.speed} m/s`,
        ]

        weatherDataEl.querySelector(".icon").innerHTML=` <img src="http://openweathermap.org/img/wn/${icon}.png" alt="Weather Icon">`;

         weatherDataEl.querySelector(".temperature").textContent=`${temperature}°C`;

         weatherDataEl.querySelector(".description").textContent = description;

          weatherDataEl.querySelector(".details").innerHTML=details.map((details)=>` <div>${details}</div>`).join("");

    } catch (error) {

         weatherDataEl.querySelector(".icon").innerHTML= "";

         weatherDataEl.querySelector(".temperature").textContent=" ";

         weatherDataEl.querySelector(".description").textContent="  Search doesnt exists❌,.....Search valid location plz🕵️";

          weatherDataEl.querySelector(".details").innerHTML="";
        
    }
}


