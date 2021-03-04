var currentTime = moment().format("dddd, MMMM Do");
var apiKey = "0e0c6aad36efe9e1c68b9c8519d805a5";
var citiesList = [];

// I need query selector to select to variables,, "I will use the One Call API"
$(document).ready(function(){
    
    $('#button').on('click', function(){
        var inputSearch = $("#search-value").val();
       
        $('#search-value').val("");

        searchCity(inputSearch);
    });
   
   
});

// //This function pull the city list array 
// function cityList(){
//     var storedCities = JSON.parse(localStorage.getItem("cities"));

//     if (storedCities !== null) {
//         citiesList = storedCities;
//     }


// }

//this adds a new city list search
function newRow(data){
    var cityList = ('<li>').addClass('list-group-item active').text(data);
    $('.list-group').append(cityList);
}
//I need some data from the user input and going to use it in the API
function searchCity(inputSearch) {
$.ajax({
    url: 'https://api.openweathermap.org/data/2.5/weather?q='+ inputSearch + '&appid=' +  apiKey + "&units=imperial",
    method: 'GET',
    dataType: 'JSON',
    }).then(function(data){
     console.log(currentTime);   
        var dataIcon = data.weather[0].icon;
        var newDate = new Date();
        // var currentDate =  (newDate.getMonth() + 1) + "/" + (newDate.getDate() + i + 1) + "/" + newDate.getFullYear();
        var cityDisplay = $('<h3>').addClass('card-title').text(data.name + " " + currentTime);
        var cardDisplay = $('<div>').addClass('card');
        var temperature = $('<p>').addClass('card-text').text('Temperature: ' + Math.floor(data.main.temp) + ' F' );
        var humidity = $('<p>').addClass('card-text').text('Humidity: ' + data.main.humidity + ' %');
        var wind = $('<p>').addClass('card-text').text('Wind Speed: ' + data.wind.speed + ' MPH');
        var image = $('<img>').attr('src' , "https://openweathermap.org/img/w/" + dataIcon + ".png");
        var card = $('<div>').addClass('card-body');

          // to clean every search
          $('#today').empty();


        cardDisplay.append(image);
        card.append(cityDisplay, humidity, wind, temperature);
        cardDisplay.append(card);
        $('#today').append(cardDisplay);
    
      

        foreCast(inputSearch);

        // getUv(data.coord.lat, data.coord.ton)
      
    });
    };
    


//Add the data from future weather conditions
function foreCast(inputSearch) {
    $.ajax({
        url: 'https://api.openweathermap.org/data/2.5/forecast?q=' + inputSearch  + "&appid=" + apiKey + "&units=imperial",
        method: 'GET',
        dataType: 'JSON'
    }).then(function(data){
    console.log(data)
        var forecastDiv = $("<div>").attr('id', 'fiveDayForecast');
        var forecastHeader = $('<h5>').addClass("card-header border-secondary").text("5 Day Forecast");
        forecastDiv.append(forecastHeader);
        var cardDeck = $("<div>").addClass("card-deck");
        forecastDiv.append(cardDeck);
        $('#forecast').empty();
        $('#forecast').append(forecastDiv);
// this loop and create 5 card bootstrap showing the next 5 forecast days
        for (i = 0; i < 5; i++){
            var forecastCard = $("<div>").addClass('card mb-3 mt-3');
            var cardBody = $('<div>').addClass('card-body');
           
            //  var val = (date.getMonth() + 1) + "/" + (date.getDate() + i + 1) + "/" + date.getFullYear();
            var forecastDate = $('<h5>').addClass('card-title').text(new Date(data.list[i].dt_txt).toLocaleDateString());

            cardBody.append(forecastDate);
            var weatherIcon = data.list[i].weather[0].icon;
            var displayIcon = $('<img>').attr('src', 'https://openweathermap.org/img/wn/' + weatherIcon + '.png');
            cardBody.append(displayIcon);
            var Temp = data.list[i].main.temp;
            var tempEl = $('<p>').addClass('card-text').text("Temperature: " + Temp + " F");
            cardBody.append(tempEl);
            var humid = data.list[i].main.humidity;
            var humidEl = $('<p>').addClass('card-text').text("Humidity: " + humid + "%");
            cardBody.append(humidEl);
            forecastCard.append(cardBody);
            cardDeck.append(forecastCard);

            
            
                }
            })
           
}
// this function call the API to get UV data 
function getUv (lat, lon){
    $.ajax({
        url: 'http://api.openweathermap.org/data/2.5/uvi?lat=' + lat + '&lon=' + lon + '&appid=' + apiKey,
        method: 'GET',
        data: 'json'
    }).then(function(data){
     console.log(data);
     var uvNumber = $('<span>').text(data.value)
     
     // this if condition is to set uv color class  

     if (getUVIndex > 0 && getUVIndex <= 2.99){
         uvNumber.addClass('low');
     }
     else if (getUVIndex >= 3 && getUVIndex <= 5.99){
         uvNumber.addClass('moderate');
     }
     else if (getUVIndex >= 6 && getUVIndex <= 7.99){
         uvNumber.addClass('high');
     } 
     else if (getUVIndex >= 8 && getUVIndex <= 10.99){
         uvNumber.addClass('veryHigh');
     }
         else{
             uvNumber.addClass('extreme');
         }

         
         uvNumber.text(getUVIndex);
         var uvIndexEl = $('<p>').addClass('card-text').text("UV Index ");
         $('#today .card-body').append(uvIndexEl.append(uvNumber));
         uvNumber.appendTo(uvIndexEl);
         

     
    });
}
//I need to view current condition of the day
//I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index
//I view the UV index
//I am presented with a color that indicates whether the conditions are favorable, moderate, or severe I view future weather conditions for that city
//I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, and the humidity I view future weather conditions for that city
//I click on a city in the search history I am again presented with current and future conditions for that city
