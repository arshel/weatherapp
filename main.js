function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        console.log("i'm here")
    }
}


function fetchData(url) {
    fetch(url)

        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {


                    const div = document.createElement('div');
                    div.classList.add("maintwo__card");
                    const iconcode = data.weather[0].icon;
                    const iconurl = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/" + iconcode + ".svg"; // icon url depending on weather discription
                    const city = "<h4 class='naam'>" + data.name + ", " + data.sys.country + "</h4>";
                    const img = "<img" + " src=" + iconurl + " + alt = 'dit is een foto' class='card__img img'>";

                    const desc = "<p class='desc'>" + data.weather[0]["description"] + "</p>";
                    var temp = "<p class='weer'>" + Math.round(data.main.temp) + "°C" + "</p>";

                    div.innerHTML += img;
                    div.innerHTML += temp;
                    div.innerHTML += desc;
                    div.innerHTML += city;

                    return render(div);
                });
            } else {
                console.log("response failed");
            }

        });
}

function render(element) {
    return document.body.appendChild(element);
}

function showPosition(position) {
    const key = '800e8010067e6408327003c8fafc07e4';
    const q = position.coords.latitude;
    const y = position.coords.longitude;
    const url = 'http://api.openweathermap.org/data/2.5/weather?lat=' + q + '&lon=' + y + '&appid=' + key + '&units=metric';
    fetchData(url);
}

function geInputData() {
    const key = '800e8010067e6408327003c8fafc07e4';
    document.querySelector('.main__input--submit').addEventListener("click", function () {
        const stad = document.getElementById('city').value;
        const url = 'http://api.openweathermap.org/data/2.5/weather?q=' + stad + '&appid=' + key + '&units=metric';

        fetchData(url);

        // Put the object into storage
        localStorage.setItem('opslaan', JSON.stringify(url));

        // Retrieve the object from storage
        var retrievedObject = localStorage.getItem('opslaan');

        var persons = JSON.parse(retrievedObject);


    });
}

geInputData();
getLocation();
