function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        alert("cant get location!!!!!")
    }
}

async function getCity(town) {
    const url = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${town}&appid=800e8010067e6408327003c8fafc07e4&units=metric`);
    return await url.json();
}

function fetchData(url, local = false) {
    fetch(url)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    card(data, local);
                });
            } else {
                console.log("response failed");
            }
        });

}

function save(town) {
    let towns = JSON.parse(window.localStorage.getItem("tow"));
    if (!towns) {
        towns = [];
    }

    if (towns.includes(town.toUpperCase())) {
        alert("city is already added or doesn't exist")
    } else {
        towns.push(town.toUpperCase());
    }

    console.log(towns);
    window.localStorage.setItem("tow", JSON.stringify(towns));

}

function loadItems() {
    const items = JSON.parse(window.localStorage.getItem("tow"));


    items.forEach(async function (town) {
        const data = await getCity(town);
        card(data);
    });
}

async function deleteItem() {
    document.addEventListener('click', function (e) {
        if (e.target && e.target.id === 'delete') {


            let towns = JSON.parse(window.localStorage.getItem("tow"));

            if (!towns) {
                towns = [];
            }
            e.target.parentNode.remove(); // to delete the div

            let text = e.target.parentNode.getElementsByTagName("h4")[0];

            towns = towns.filter(e => e !== text.innerText);

            window.localStorage.setItem("tow", JSON.stringify(towns));
        }
    }, false);

}

function render(element) {
    return document.body.appendChild(element);
}

function getInputData() {
    document.querySelector('.main__submit').addEventListener("click", function () {

        const town = document.getElementById('city').value;

        save(town);
    });

}

function draggable() {
    document.addEventListener('ondrag', function (e) {
        if (e.target && e.target.id === 'test') {
            console.log(e);
        }
    });
}


function showPosition(position, local = true) {
    const key = '800e8010067e6408327003c8fafc07e4';
    const q = position.coords.latitude;
    const y = position.coords.longitude;
    const url = 'http://api.openweathermap.org/data/2.5/weather?lat=' + q + '&lon=' + y + '&appid=' + key + '&units=metric';
    fetchData(url, local);
}


function card(data, local = false) {

    const div = document.createElement('div');
    const iconurl = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/" + data.weather[0].icon + ".svg"; // icon url depending on discription


    div.innerHTML += "<img" + " src=" + iconurl + " + alt = 'dit is een foto' class='card__img img'>";
    div.innerHTML += "<p class='weer'>" + Math.round(data.main.temp) + "°C" + "</p>";
    div.innerHTML += "<p class='desc'>" + data.weather[0]["description"] + "</p>";
    div.innerHTML += "<h4 class='naam' >" + data.name.toUpperCase() + "</h4>";

    if (local) {
        div.classList.add("position");
        div.innerHTML += "<b>current location!</b>";

    } else {

        div.classList.add("maintwo__card");
        div.setAttribute("draggable", 'true');
        div.setAttribute("id", 'test');
        div.innerHTML += "<input type='button' class='delete' id='delete'>";
    }
    return render(div);
}

deleteItem();
getInputData();
getLocation();
loadItems();

