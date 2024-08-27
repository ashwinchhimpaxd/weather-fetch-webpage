const APIKEYONE = 'cd0bbcaa6c4e60b2d100601240408;
const APIKEYTWO = '60194f1530d40b963654f278347529'; // this api key not work because I disactive both API keys
const historyapi = "http://api.weatherapi.com/v1/history.json?key=f8cd0bbcaa6c4e60b2d100601240408&q=London&dt=2024-08-20";
const Setlocation = document.querySelector('.current-location>p')
const toggleMode = document.querySelector('.theme-checkbox');
const weatherBox = document.querySelector('.weather-box');
const weather_input = document.querySelector('#search-weather')
const section_navigate = document.querySelector('.days-navigator')

const Allweathernames = {
    'clear': './weather_icones/animated/clear-day.svg',
    'patchy light drizzle': './weather_icones/animated/partly-cloudy-day-drizzle.svg',
    'patchy rain nearby': './weather_icones/animated/patchy rain nearby.svg',
    'patchy rain possible': './weather_icones/animated/patchy rain nearby.svg',
    'partly cloudy': './weather_icones/animated/partly cloudy.svg',
    'light drizzle': './weather_icones/animated/drizzle.svg',
    'light rain shower': './weather_icones/animated/light rain shower.svg',
    'sunny': './weather_icones/animated/clear-day.svg',
    'moderate or heavy rain shower': './weather_icones/animated/rain.svg',
    'patchy light rain': './weather_icones/animated/drizzle.svg',
    'rain': './weather_icones/animated/rain.svg',
    'mist': './weather_icones/animated/mist.svg',
    'moderate or heavy rain with thunder': './weather_icones/animated/thunderstorms-rain.svg',
    'cloudy': './weather_icones/animated/cloudy.svg',
    'clouds': './weather_icones/animated/cloudy.svg',
    'light rain': './weather_icones/animated/light rain shower.svg',
    'patchy light rain with thunder': './weather_icones/animated/thunderstorms-rain.svg',
    // 'thunder': './weather_icones/animated/thunderstorms.svg',
    /* add weather icone as you want to add according to your response then access using the name of icon */
};

// get current location using geolocation methods

window.onload = function () {
    document.getElementById('loader').style.display = 'none';
    document.querySelector('.weather-box').style.filter = "blur(0px)";

    async function success(position) {
        let latitude = position.coords.latitude;
        let longitude = position.coords.longitude;
        let geocurlocation;
        try {
            geocurlocation = await weather_data_fetch(`http://api.weatherapi.com/v1/current.json?key=${APIKEYONE}=${latitude},${longitude}&aqi=yes`)
        } catch (err) {
            console.error(err)
        }
        if (!geocurlocation) return;
        Setdata(geocurlocation);
    }
    function fail(error) {
        console.log('error', error.code)
        switch (error.code) {
            case error.PERMISSION_DENIED:
                console.error("User denied geolocation permission.");
                break;
            case error.POSITION_UNAVAILABLE:
                console.error("Location information is unavailable.");
                break;
            case error.TIMEOUT:
                console.error("Geolocation request time out");
                break;
            case error.UNKNOWN_ERROR:
                console.error("An unknown error occurred.");
                break;
        }
    }
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success, fail)
    } else {
        console.error('Geolocation not supported by this browser')
    }
};

// navigate to days section 
section_navigate.addEventListener('click', (e) => {
    let todays = document.getElementById('today')
    let yesterday = document.getElementById('yesterday')
    let nextdays = document.getElementById('nextdays')
    let weather_cards = document.querySelector('.weather-cards');
    let todays_weather = document.querySelector('.today-weather');
    let yesterdaySection = document.getElementById('yesterday-weather-info')
    if (e.target.innerHTML.toLowerCase() == "today") {
        todays.classList.add('today')
        yesterday.classList.remove('yesterday')
        nextdays.classList.remove('nextdays')
        weather_cards.style.display = 'none';
        yesterdaySection.style.display = 'none'
        todays_weather.style.display = "flex"
    } else if (e.target.innerHTML.toLowerCase() == 'yesterday') {
        yesterday.classList.add('yesterday')
        todays.classList.remove('today')
        nextdays.classList.remove('nextdays')
        weather_cards.style.display = 'none';
        todays_weather.style.display = "none"
        yesterdaySection.style.display = "block"
    } else if (e.target.innerHTML.toLowerCase() == 'next 7 days') {

        nextdays.classList.add('nextdays')
        todays.classList.remove('today')
        yesterday.classList.remove('yesterday')
        weather_cards.style.display = 'flex';
        todays_weather.style.display = "none"
        yesterdaySection.style.display = "none"
    }
})

const root = document.documentElement;
toggleMode.addEventListener('click', (e) => {

    if (e.target.checked) {
        root.classList.toggle('light-theme')
        weatherBox.style.backgroundImage = "url('./SVG/light-theme.svg')";
    } else {
        weatherBox.style.backgroundImage = "url('./SVG/dark-theme.svg')";
        root.classList.toggle('light-theme')
    }
});

const weather_data_fetch = async (url) => {
    let response = await fetch(url);
    if (!response.ok) {
        throw new Error('Network Is Not OK')
        return;
    }
    let data = await response.json()
    return data;
}

const Setdata = async (dataobj) => {
    // update current loction 
    Setlocation.innerHTML = `${dataobj.location.name}, ${dataobj.location.region}`;
    // update wind speed
    let windSpeed = document.querySelector('.infoone h4');
    windSpeed.innerHTML = `${Math.floor(dataobj.current.wind_kph)}Km/h`;
    // update humidity 
    let humidity = document.querySelector('.infothree>h4');
    humidity.innerHTML = Math.floor(dataobj.current.humidity);
    // update heating index
    let heatIndex = document.querySelector('.infotwo>h4')
    heatIndex.innerHTML = Math.floor(dataobj.current.heatindex_c);
    // update celsius and image of weather conditions 
    let celsius = document.querySelector('.main-info-weather>h1')
    let WTcondition = document.querySelector('.main-info-weather >p')
    let set_weather_icone = document.querySelector('.main-info img');
    let weather_condition = dataobj.current.condition.text;
    celsius.innerHTML = `${Math.floor(dataobj.current.temp_c)} <sup>℃</sup> `;
    WTcondition.innerHTML = weather_condition;
    set_weather_icone.src = Allweathernames[`${weather_condition.toLowerCase()}`];
}
const Getinputdata = async (evt) => {
    let InputValue = evt.target.value.replace(" ", "-");
    let TodayDataobj;
    try {
        TodayDataobj = await weather_data_fetch(`http://api.weatherapi.com/v1/current.json?key=${APIKEYONE}=${InputValue}&aqi=yes`);
    } catch (err) {
        console.error(err);
    }
    if (!TodayDataobj) return;  // if todayDataojb if null then simpaly return 
    Setdata(TodayDataobj)
}
function millisecondsToDate(milliseconds) {
    const date = new Date(milliseconds * 1000);
    const formattedDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
    return formattedDate;
}
weather_input.addEventListener('keyup', (e) => {
    if (e.key == "Enter") {
        Getinputdata(e);
        fetchYesterdayData(e);
        Next5DayFX(e)
    }
})
async function fetchYesterdayData(evt) {

    const date = new Date(Date.now() - 86400000);
    const yesterdayDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).replaceAll('/', '-');

    let InputValue = evt.target.value.replace(" ", "-");
    let url = `http://api.weatherapi.com/v1/history.json?key=f8cd0bbcaa6c4e60b2d100601240408&q=${InputValue}&dt=${yesterdayDate}`;
    let yesterdayDataObj;
    try {
        yesterdayDataObj = await weather_data_fetch(url);
    } catch (error) {
        console.error(error)
    }
    if (!yesterdayDataObj) return // if yesterday data is null then empty return 
    yesterdayData(yesterdayDataObj)
}


async function yesterdayData(yesterdayObj) {

    const setDate = document.querySelector('.date-section>p')
    const windSpeed = document.querySelector('.wind>h3')
    const condition = document.querySelector('.condition>h3')
    const conditionimg = document.querySelector('.condition img')
    const uvindex = document.querySelector('.uvindex>h3')
    const tempe = document.querySelector('.temp>h3')


    windSpeed.innerHTML = `${Math.floor(yesterdayObj.forecast.forecastday[0].day.maxwind_kph)} kp_h`;

    uvindex.innerHTML = yesterdayObj.forecast.forecastday[0].day.uv;

    let weather_icone = document.querySelector('.right-side-info img')
    condition.innerHTML = yesterdayObj.forecast.forecastday[0].day.condition.text;
    weather_icone.src = Allweathernames[`${yesterdayObj.forecast.forecastday[0].day.condition.text.toLowerCase()}`];
    conditionimg.src = Allweathernames[`${yesterdayObj.forecast.forecastday[0].day.condition.text.toLowerCase()}`];

    setDate.innerHTML = yesterdayObj.forecast.forecastday[0].date;

    tempe.innerHTML = `${Math.floor(yesterdayObj.forecast.forecastday[0].day.maxtemp_c)}°C`;

    const scrollOne = document.querySelector('.scroll-one>p:last-child');
    const scrolltwo = document.querySelector('.scroll-two>p:last-child');
    const scrollthree = document.querySelector('.scroll-three>p:last-child');
    const scrollfour = document.querySelector('.scroll-four>p:last-child');
    const scrollfive = document.querySelector('.scroll-five>p:last-child');
    const scrollsix = document.querySelector('.scroll-six>p:last-child');
    const scrollseven = document.querySelector('.scroll-seven>p:last-child');
    const scrolleigth = document.querySelector('.scroll-eight>p:last-child');
    // console.log(scrolleigth)
    scrollOne.innerHTML = Math.floor(yesterdayObj.forecast.forecastday[0].hour[22].humidity);
    scrolltwo.innerHTML = `${Math.floor(yesterdayObj.forecast.forecastday[0].hour[22].temp_c)}°C`;
    scrollthree.innerHTML = Math.floor(yesterdayObj.forecast.forecastday[0].hour[22].wind_kph);
    scrollfour.innerHTML = yesterdayObj.forecast.forecastday[0].hour[22].cloud;
    scrollfive.innerHTML = Math.floor(yesterdayObj.forecast.forecastday[0].hour[22].wind_degree);
    scrollsix.innerHTML = `${Math.floor(yesterdayObj.forecast.forecastday[0].hour[22].heatindex_c)}°C`;
    scrollseven.innerHTML = `${yesterdayObj.forecast.forecastday[0].hour[22].uv}`;
    scrolleigth.innerHTML = `${Math.floor(yesterdayObj.forecast.forecastday[0].hour[22].windchill_c)}°C`;
}

// check user navigate with days section and then change the data using geolocation 

section_navigate.addEventListener('click', (e) => {
    let CurrentLocation = e.target.innerHTML;
    switch (CurrentLocation) {
        case "Yesterday":
            GetDatabylocation();
            break;
        case "Next 7 days":
            GetDatabylocfor5days();
            break;
    }
})

const GetDatabylocation = async () => {

    let CityName = Setlocation.innerHTML.slice(0, Setlocation.innerHTML.indexOf(','));

    const date = new Date(Date.now() - 86400000);
    const yesterdayDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).replaceAll('/', '-');
    const URL = `http://api.weatherapi.com/v1/history.json?key=${APIKEYONE}=${CityName}&dt=${yesterdayDate}`
    let Datafromlocation;
    try {
        Datafromlocation = await weather_data_fetch(URL)
    } catch (error) {
        console.error(error)
    }
    if (!Datafromlocation) return;
    yesterdayData(Datafromlocation)
}

// get data for next 5 days

const Next5DayFX = async (evt) => {
    let CityName = evt.target.value.replace(" ", "-");
    const URL = `https://api.openweathermap.org/data/2.5/forecast?q=${CityName}&appid=9260194f1530d40b963654f278347529&units=metric`;
    let NextDayDataobj;
    try {
        NextDayDataobj = await weather_data_fetch(URL)
    } catch (error) {
        console.error(error);
    }
    if (!NextDayDataobj) return;
    SetNextdayData(NextDayDataobj);
}
// get next days data using geolocation Fx
const GetDatabylocfor5days = async () => {
    let CityName = Setlocation.innerHTML.slice(0, Setlocation.innerHTML.indexOf(','));
    const URL = `https://api.openweathermap.org/data/2.5/forecast?q=${CityName}&appid=9260194f1530d40b963654f278347529&units=metric`;
    let dataobj;
    try {
        dataobj = await weather_data_fetch(URL)
    } catch (error) {
        console.error(error)
    }
    if (!dataobj) return
    SetNextdayData(dataobj)
}
// 11:26 19:27 27:28 35:29 39:30
const DaysArray = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thusday", "Friday", "Saturday"]

const SetNextdayData = (DataObj) => {

    const cards = document.querySelectorAll('.day');
    const innerCard = document.querySelectorAll('.innercard')
    // console.log(innerCard[0].childNodes)
    let date = DataObj.list;
    let indexcount = 0;
    let innerCardindexcounter = 0;
    date.forEach((Data, index) => {
        let date = "";
        if (index == 11 || index == 19 || index == 27 || index == 35 || index == 39) {
            date = Data.dt_txt.slice(0, Data.dt_txt.indexOf(" "));

            let cardinDetails = innerCard[innerCardindexcounter].childNodes;
            let childNodescount = 1;
            cardinDetails.forEach((innerData) => {
                if (childNodescount == 1) {
                    cardinDetails[childNodescount].innerText = `${Math.floor(Data.main.temp)}℃`;
                }
                if (childNodescount == 3) {
                    let condition = Data.weather[0].main;
                    cardinDetails[childNodescount].attributes[0].nodeValue = Allweathernames[`${condition.toLowerCase()}`]
                }
                if (childNodescount == 5) {
                    let condition = Data.weather[0].main;
                    cardinDetails[childNodescount].innerText = `${condition}`
                }
                childNodescount += 2;
            })

            innerCardindexcounter++;
        }
        if (!date == "") {
            let datenum = new Date(date)
            datenum = datenum.getDay();
            DaysArray.forEach((date, index = {}) => {
                if (index == datenum) {
                    cards[indexcount].innerText = date;
                    indexcount++;
                }
            })
        }
    });
}
