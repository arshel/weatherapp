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
        if (e.target && e.target.className === 'delete') {


            let towns = JSON.parse(window.localStorage.getItem("tow"));

            if (!towns) {
                towns = [];
            }

            e.target.parentNode.remove(); // to delete the div

            let text = e.target.parentNode.getElementsByTagName("h4")[0];

            towns = towns.filter(e => e !== text.innerHTML);

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
    document.addEventListener('mousedown', function (e) {
        if (e.target && e.target.className === 'maintwo__card') {
            (function () {

                const elRoot = document.querySelector('.maintwo__card');

                console.log("dfd");
                // State variables
                let isDragging = false;
                let startX = null;
                let startY = null;
                let startLeft = null;
                let startTop = null;

                // Whenever mouse button is pressed
                elRoot.addEventListener('mousedown', (e) => {
                    const rect = elRoot.getBoundingClientRect();
                    // Set component state to dragging
                    isDragging = true;

                    // Save mousedown coordinates
                    startX = e.pageX;
                    startY = e.pageY;

                    // Save initial position values
                    startLeft = rect.left;
                    startTop = rect.top;
                });

                // Whenever mouse button is released
                window.addEventListener('mouseup', () => {
                    // Reset all state values and turn dragging mode off
                    isDragging = false;
                    startX = null;
                    startY = null;
                    startLeft = null;
                    startTop = null;
                });

                // Whenever mouse is moved
                window.addEventListener('mousemove', (e) => {
                    // Do nothing if it's you're not in a dragging mode
                    if (!isDragging) return;

                    // Get the difference between current mouse cursor position and the mousedown position
                    const deltaX = e.pageX - startX;
                    const deltaY = e.pageY - startY;

                    // Add the difference to initial card position
                    // Event coordinates and card positions are stored separately because you can click somewhere inside the card,
                    // but you need to know the top left coordinates of the card to move it either with top/left or with css transform.
                    elRoot.style.left = `${startLeft + deltaX}px`;
                    elRoot.style.top = `${startTop + deltaY}px`;
                });
            })();
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

    div.innerHTML += `<img src= ${iconurl}>
                     <p class ='weer'> ${Math.round(data.main.temp)}°C</p>            
                     <p class="desc"> ${data.weather[0]["description"]}</p>   
                     <h4 class="naam">${data.name.toUpperCase()}</h4>   `;
    if (local) {
        div.classList.add("position");
        div.innerHTML += "<b>huidige locatie!</b>";
    } else {
        div.classList.add("maintwo__card");
        div.setAttribute("draggable", 'true');
        div.setAttribute("id", 'test');
        div.innerHTML += "<input type='button' class='delete'>";
    }
    return render(div);
}

deleteItem();
getInputData();
getLocation();
loadItems();
draggable();

