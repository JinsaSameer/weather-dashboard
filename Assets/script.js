
var searchHistory =[];
var apikey = "d7eeb9196a40716acda32bb91673d4f2";
var cityEl = document.querySelector('#search');
var searchButtonEl = document.getElementById("searchButton1");
//var searchButtonEl = document.getElementById("search-button1");
var currentCity = document.querySelector('#current-city');
var currentTemperature =document.querySelector('#temperature');
var currentHumidty= document.querySelector('#humidity');
var currentWindSpeed=document.querySelector('#speed');
var currentUvindex= document.querySelector('#uv-index');
var dateValue = document.querySelector('#currentDate');
var imgIcon = document.querySelector('#weathericon');
var dailyDateHandles = [
    document.querySelector('#currentDate1'),
    document.querySelector('#currentDate2'),
    document.querySelector('#currentDate3'),
    document.querySelector('#currentDate4'),
    document.querySelector('#currentDate5')
  ];
  

var dailytempHandles = [
  document.querySelector('#temperature1'),
  document.querySelector('#temperature2'),
  document.querySelector('#temperature3'),
  document.querySelector('#temperature4'),
  document.querySelector('#temperature5')
];

var dailyHumHandles = [
    document.querySelector('#humidity1'),
    document.querySelector('#humidity2'),
    document.querySelector('#humidity3'),
    document.querySelector('#humidity4'),
    document.querySelector('#humidity5'),
 ];
 var dailyWindHandles = [
    document.querySelector('#speed1'),
    document.querySelector('#speed2'),
    document.querySelector('#speed3'),
    document.querySelector('#speed4'),
    document.querySelector('#speed5'),
 ];
 var dailyUvHandles = [
    document.querySelector('#uv-index1'),
    document.querySelector('#uv-index2'),
    document.querySelector('#uv-index3'),
    document.querySelector('#uv-index4'),
    document.querySelector('#uv-index5'),
 ];
  
/* document.querySelector('#humidity');
var currentWindSpeed=document.querySelector('#speed');
var currentUvindex= document.querySelector('#uv-index');
var dateValue = document.querySelector('#currentDate');
*/

function UpdateWeatherInfo (myJson1, index)
{
    dailyDateHandles[index].innerHTML =new Date(myJson1.daily[index+1].dt*1000).toLocaleDateString("en-US");
    dailytempHandles[index].innerHTML = myJson1.daily[index+1].temp.day+"°F";
    dailyHumHandles[index].innerHTML = myJson1.daily[index+1].humidity+"%";
    dailyWindHandles[index].innerHTML = myJson1.daily[index+1].wind_speed+"MPH";
    dailyUvHandles[index].innerHTML = myJson1.daily[index+1].uvi;
    if (myJson1.daily[index].uvi  > 5)
    {
      dailyUvHandles[index].style.backgroundColor= "red";  
    }
    else if (myJson1.daily[index].uvi<5)
    {
      dailyUvHandles[index].style.backgroundColor= "green";
    }
    else
    {
      dailyUvHandles[index].style.backgroundColor= "orange";
    }

    /*currentTemperature.innerHTML =myJson1.daily[0].temp.day+"°F";
    currentUvindex.innerHTML = myJson1.daily[0].uvi;
    dateValue.textContent = new Date(myJson1.daily[0].dt*1000).toDateString();
    currentWindSpeed.innerHTML = myJson1.daily[0].wind_speed+"MPH";*/

}


async function asyncCall(apiUrl) {
    const myresponse = await fetch(apiUrl);
    const myJson = await myresponse.json(); //extract JSON from the http response
    if(myJson.cod != 200)
      console.log(myJson.message);
    else
    {
     
      //console.log( myJson.name, myJson.main.temp);
      //console.log( "Complete data: ");
      console.log( myJson);
      console.log( myJson.coord.lat, myJson.coord.lon);
      var nameValue =myJson.name;
      var tempValue =myJson.main.temp;
      console.log( myJson.weather[0].icon);

      //var humidityValue =data['main']
      var windSpeedValue =myJson.wind.speed;
      currentCity.innerHTML = nameValue;
      //currentTemperature.innerHTML = tempValue;
      //currentWindSpeed.innerHTML = windSpeedValue;
    }
    
    const myresponse1 = await fetch('https://api.openweathermap.org/data/2.5/onecall?lat='+myJson.coord.lat+'&lon='+myJson.coord.lon+'&units=imperial&exclude=current,minutely,hourly,alerts&appid='+apikey);
    const myJson1 = await myresponse1.json();
    if(myresponse1.status !=200)
    {
       console.log(myJson1.message);
    }
    else{
        console.log(myJson1);

        //currentCity.innerHTML = myJson1.timezone;
        currentHumidty.innerHTML = myJson1.daily[0].humidity+"%";
        currentTemperature.innerHTML =myJson1.daily[0].temp.day+"°F";
        currentUvindex.innerHTML = myJson1.daily[0].uvi;
        if (myJson1.daily[0].uvi  > 5)
        {
            currentUvindex.style.backgroundColor= "red";
        }
        // add icon url: https://openweathermap.org/img/w/01n.png
        var iconUrl =  'https://openweathermap.org/img/w/'+myJson.weather[0].icon+'.png';
        imgIcon.setAttribute('src',iconUrl);

        //dateValue.textContent = new Date(myJson1.daily[0].dt*1000).toDateString();
        dateValue.innerHTML = new Date(myJson1.daily[0].dt*1000).toLocaleDateString("en-US");
        currentWindSpeed.innerHTML = myJson1.daily[0].wind_speed+"MPH";

        for(index=0; index<5; index++)
           UpdateWeatherInfo (myJson1, index);

    }
    
}
//weather displays from common function per city
function commonWeatherHandler(cityName){
   // console.log(currentDate);
    var apiUrl = 'https://api.openweathermap.org/data/2.5/weather?q='+cityName+'&APPID='+apikey;
    //var futureUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=32.7153&lon=-117.1573&units=imperial&exclude=current,minutely,hourly,alerts&appid='+apikey;
    asyncCall(apiUrl);
    //Adding city to local storage
   }

function historyBtnHandler(event){
       
   if(event.target)
   {
    commonWeatherHandler(event.target.innerHTML);
   }
   console.log(event);
}

function displaySearchHistory(){
    var cityList=[];
    cityList = JSON.parse(localStorage.getItem("searchCitytHistory"));
    console.log(cityList?cityList.length:"");
    //localStorage.setItem("search", JSON.stringify(search));
    if(null != cityList)
    {
        for(var index=0;index<cityList.length;index++)
        {
            var btn = document.createElement("button") ;
            btn.textContent =cityList[index];
            document.body.appendChild(btn);
            btn.addEventListener('click',historyBtnHandler);
        }
    }
}

function elementinList(ReadCityList, cityName)
{
  for(var i = 0;i<ReadCityList.length;i++)
  {
     if(ReadCityList[i]==cityName)
     {
         return true;
     }
  }
  return false;
}

function searchHandler(event){
 console.log ("Executing serach handler");
 var cityName = cityEl.value;
  console.log(cityName);
  event.preventDefault();
  
  commonWeatherHandler(cityName);
  var cityList = [];
  var ReadCityList = [];
  ReadCityList = JSON.parse(localStorage.getItem("searchCitytHistory"));
  if( ReadCityList == null)
  {
     cityList[0]= cityName;    
  }
  else
  {
     if(!elementinList(ReadCityList,cityName)) 
     {
      ReadCityList[ReadCityList.length] = cityName;
      console.log("Adding city name"); 
     }
     cityList = ReadCityList;
  }
  localStorage.setItem("searchCitytHistory", JSON.stringify(cityList));


  //var currentDate = moment().format('dddd MMM DD YYYY HH:mm:ss');
  //dateValue.textContent = currentDate;
  
/*
  fetch(apiUrl).then(function (response) {
    if (response.ok) {
        console.log(response);
      response.json().then(function (data) {
        console.log(data.items);
      });
    } else {
      alert('Error: ' + response.statusText);
    }
  });*/
}
displaySearchHistory();
console.log ("Starting the program");
searchButtonEl.addEventListener('click',searchHandler);
console.log ("Conclusing the program");
