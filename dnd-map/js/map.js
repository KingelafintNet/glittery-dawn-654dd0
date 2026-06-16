// Supabase configuration

let positions = [];
let shadows = [];

const SUPABASE_URL = "https://ksetlpqassfnkbchpttc.supabase.co";
const SUPABASE_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtzZXRscHFhc3NmbmtiY2hwdHRjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1MzU2NTksImV4cCI6MjA5NDExMTY1OX0.FsT-nXL-f_x6ws6Gdm6aC7DXeV62SPpgtuEJ3Gmn4Jo";
const size = [15, 25, 50, 100, 150, 200];
const directions = ["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp"];
const initiativeTracker = document.getElementById("initiativeTracker");
const urlParams = new URLSearchParams(window.location.search);
const table = document.getElementById("map");

let GMcode;
let width;
let height;
let backgroundData;

let controlling = 0;
let pictures = [];

// Initialize Supabase client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Get overall information from Supabase
if (true) {
    if (urlParams.get("battleName")) {
    } else {
        localStorage.clear();
        const url = new URL(window.location);
        url.searchParams.set("battleName", prompt("Get a battle code from your DM and paste it here"));
        window.location.replace(url.toString());
    }
    const { data, error } = await supabase.from("Battles").select("*").eq("battle", urlParams.get("battleName")).single();
    if (error) {
        console.error("Error fetching battle data:", error);
    } else {
        GMcode = data.GMcode;
        height = data.height;
        width = data.width;
        backgroundData = data.background;
    }
}

// Fetch positions from Supabase
if (true) {
    const { data, error } = await supabase.from("Tokens").select("*").eq("battle", urlParams.get("battleName"));

    if (error) {
        console.error("Error fetching positions:", error);
        positions = [];
    } else {
        positions = data;
    }
}

// Subscribe to real-time updates
supabase
    .channel("public:Tokens")
    .on("postgres_changes", { event: "*", schema: "public", table: "Tokens" }, (payload) => {
        const originalIndex = positions.findIndex((place) => {
            return place.token_name === payload.new.token_name;
        });
        payload.new.picture = positions[originalIndex].picture;
        payload.new.stats = positions[originalIndex].stats;
        positions[originalIndex] = payload.new;
        makeOrderList();
    })
    .subscribe();

for (let i = 0; i < positions.length; i++) {
    const element = positions[i];
    const { data } = await supabase.storage.from("pictures").getPublicUrl(element.picture);
    positions[i].picture = data.publicUrl;
}

document.getElementById("Update").onclick = async () => {
    let updates = [];
    for (let i = 0; i < shadows.length; i++) {
        let el = positions.find((t) => t.token_name === shadows[i].token_name);
        updates.push({
            battle: urlParams.get("battleName"),
            token_name: shadows[i].token_name,
            hp: el.hp,
            turn: el.turn,
            x: el.x,
            y: el.y,
        });
    }
    const { error } = await supabase.from("Tokens").upsert(updates);
    shadows = [];
};

// End of Supabase stuff

const arrowLayer = document.createElement("div");
arrowLayer.classList.add("arrow-layer");
document.body.appendChild(arrowLayer);

// Establish user profile
if (urlParams.get("profile")) {
    localStorage.setItem("profile", urlParams.get("profile"));
} else {
    if (localStorage.getItem("profile")) {
    } else {
        localStorage.setItem("profile", prompt("Who are you controlling?"));
    }
}
// Make table
// process colors
backgroundData = backgroundData.split("|");
for (let i = 0; i < backgroundData.length; i++) {
    const element = backgroundData[i];
    backgroundData[i] = element.split("+");
}
let procBackground = [];

for (let i = 0; i < backgroundData.length; i++) {
    const element = backgroundData[i];
    for (let j = 0; j < element[0]; j++) {
        procBackground.push(element[1]);
    }
}

console.log(procBackground);

for (let i = 0; i < height; i++) {
    let row = document.createElement("tr");
    for (let j = 0; j < width; j++) {
        let cell = document.createElement("td");
        cell.style.backgroundColor = procBackground[i * height + j];
        row.appendChild(cell);
    }
    table.appendChild(row);
}
const blankTable = table.innerHTML;

// Fill the table based on the positions
function placeTokens() {
    // Make the favicon the picture for the character
    document.querySelectorAll("link").forEach((a) => {
        if (a.rel == "icon") {
            a.remove();
        }
    });
    const favicon = document.createElement("link");
    favicon.rel = "icon";
    favicon.href = positions[controlling].picture;
    document.querySelector("head").appendChild(favicon);
    // Reset the table
    table.innerHTML = blankTable;

    arrowLayer.innerHTML = "";
    for (let i = 0; i < positions.length; i++) {
        const element = positions[i];
        let token = document.createElement("div");
        token.innerHTML = `<div style="height:${size[element.size]}px; width:${size[element.size]}px;"><img src="${element.picture}"></div>`;
        token.classList.add("token");
        token.style.width = String(size[element.size]) + "px";
        token.style.height = String(size[element.size]) + "px";
        token.style.borderColor = positions[i].turn ? "var(--turn)" : positions[i].teamColor;

        token.addEventListener("click", () => {
            changeControlling(i);
        });

        const cell = table.rows[element.y].cells[element.x];
        const cellRect = cell.getBoundingClientRect();
        const bodyRect = document.body.getBoundingClientRect();
        const tokenWidth = size[element.size] + 2;
        const tokenHeight = size[element.size] + 2;
        const tokenTop = cellRect.top - bodyRect.top + (cellRect.height - tokenHeight) / 2;
        const tokenLeft = cellRect.left - bodyRect.left + (cellRect.width - tokenWidth) / 2;

        if (positions[i].controlling && (positions[i].token_name == localStorage.getItem("profile") || localStorage.getItem("profile") == GMcode)) {
            directions.forEach((direction) => {
                let arrow = document.createElement("div");
                arrow.classList.add("arrow", direction);
                arrow.innerHTML = "&#10094;";
                arrow.style.position = "absolute";
                arrow.style.pointerEvents = "auto";
                arrow.addEventListener("click", () => {
                    moveToken(direction, i);
                });

                const arrowWidth = 20;
                const arrowHeight = 40;
                let arrowTop = -6 + tokenTop + (tokenHeight - arrowHeight) / 2;
                let arrowLeft = -6 + tokenLeft + (tokenWidth - arrowWidth) / 2;

                if (direction === "ArrowUp") {
                    arrowTop = tokenTop - 40;
                } else if (direction === "ArrowDown") {
                    arrowTop = tokenTop + tokenHeight - 12;
                } else if (direction === "ArrowLeft") {
                    arrowLeft = tokenLeft - 30;
                } else if (direction === "ArrowRight") {
                    arrowLeft = tokenLeft + tokenWidth;
                }

                arrow.style.top = `${arrowTop}px`;
                arrow.style.left = `${arrowLeft}px`;
                arrowLayer.appendChild(arrow);
            });
        }
        table.rows[element.y].cells[element.x].appendChild(token);
    }
    for (let i = 0; i < shadows.length; i++) {
        const element = shadows[i];
        let shade = document.createElement("div");
        shade.innerHTML = `<div style="height:${size[element.size]}px; width:${size[element.size]}px;"><img src="${element.picture}" width${size[element.size]}></div>`;
        shade.classList.add("shade");
        shade.style.width = String(size[element.size] + 2) + "px";
        shade.style.height = String(size[element.size] + 2) + "px";
        table.rows[element.y].cells[element.x].appendChild(shade);
    }
    displayHeader();
}
function changeControlling(position) {
    positions[controlling].controlling = false;
    controlling = position;
    positions[controlling].controlling = true;

    displayHeader();
    document.getElementById("creatureName").innerText = `Name: ${positions[position].token_name} | AC: ${positions[position].ac}`;
    placeTokens();
}

function moveToken(direction, index) {
    let state = positions[index];
    if (directions.includes(direction)) {
        if (
            shadows.filter((shade) => {
                return shade.token_name === state.token_name;
            }).length === 0
        ) {
            positions[index].shadeIndex = shadows.length;
            shadows.push({ ...state });
        }
        if (direction === "ArrowLeft") {
            state.x--;
        } else if (direction === "ArrowRight") {
            state.x++;
        } else if (direction === "ArrowUp") {
            state.y--;
        } else if (direction === "ArrowDown") {
            state.y++;
        }
        placeTokens();
    }
}

document.addEventListener("keydown", (key) => {
    moveToken(key.key, controlling);
    if (key.key === "Tab") {
        console.log((controlling + 1) % positions.length);
        changeControlling((controlling + 1) % positions.length);
    }
});

let buttons = ["Damage", "Heal"];
for (let i = 0; i < buttons.length; i++) {
    const element = buttons[i];
    document.getElementById(element).onclick = () => {
        manageHealth(element);
    };
}

document.getElementById("showOrderTracker").onclick = () => {
    makeOrderList();
};
document.getElementById("nextInitiative").onclick = () => {
    nextInitiative();
};
function nextInitiative() {
    if (true) {
        let state = positions[0];
        if (!state.shade) {
            positions[0].shadeIndex = shadows.length;
            shadows.push({ ...state });
            positions[0].shade = true;
        }
    }
    positions[0].turn = false;
    let first = positions.shift();
    positions[positions.length] = first;
    positions[0].turn = true;

    if (true) {
        let state = positions[0];
        if (!state.shade) {
            positions[0].shadeIndex = shadows.length;
            shadows.push({ ...state });
            positions[0].shade = true;
        }
    }
    makeOrderList();
}

function manageHealth(button) {
    let state = positions[controlling];
    if (
        shadows.filter((shade) => {
            return shade.token_name === state.token_name;
        }).length === 0
    ) {
        positions[index].shadeIndex = shadows.length;
        shadows.push({ ...state });
    }
    if (localStorage.getItem("profile") == state.token_name || localStorage.getItem("profile") == GMcode) {
        let hp = Number(positions[controlling].hp);
        let hpMax = Number(positions[controlling].hpMax);
        let damage = document.getElementById("value").value;
        positions[controlling].hp = hp + (button == "Damage" ? -1 : 1) * damage;
        displayHeader();
    }
}

function displayHeader() {
    let color1 = document.getElementById("hpColor1");
    let color2 = document.getElementById("hpColor2");
    let left;
    let color = "hsl(" + String((120 * positions[controlling].hp) / positions[controlling].hpMax) + ",100%,50%)";
    document.getElementById("hpText").innerHTML = `<span>${positions[controlling].hp}/${positions[controlling].hpMax}</span>`;
    left = (positions[controlling].hp / positions[controlling].hpMax) * 180 - 90;
    if (positions[controlling].hp / positions[controlling].hpMax > 0.5) {
        left = left - 90;
        color2.style.backgroundColor = color;
    } else {
        color2.style.backgroundColor = "var(--navy)";
    }
    color1.style.backgroundColor = color;
    color2.style.left = String(left) + "px";

    let distanceText = document.getElementById("distance");
    try {
        let currentReal = positions[controlling];
        let xDiff = shadows[currentReal.shadeIndex].x - currentReal.x;
        let yDiff = shadows[currentReal.shadeIndex].y - currentReal.y;
        let final = Math.floor(Math.sqrt(xDiff ** 2 + yDiff ** 2) * 5);
        distanceText.innerText = `Distance moved: ${final} feet`;
    } catch (error) {}
}

// Initial sort for the the order tracker
for (let i = 0; i < positions.length; i++) {
    for (let j = 0; j < positions.length - i - 1; j++) {
        if (positions[j].initiative < positions[j + 1].initiative) {
            // Swap elements
            let temp = positions[j];
            positions[j] = positions[j + 1];
            positions[j + 1] = temp;
        }
    }
}
// Put first in first
for (let i = 0; i < positions.length; i++) {
    if (positions[0].turn) {
        break;
    }
    let first = positions.shift();
    positions[positions.length] = first;
}

function makeOrderList() {
    initiativeTracker.innerHTML = "";
    for (let i = 0; i < positions.length; i++) {
        const element = document.createElement("h4");
        element.innerHTML = positions[i].token_name;
        initiativeTracker.appendChild(element);
    }
    if (localStorage.getItem("profile" == GMcode)) {
        const img = document.createElement("img");
        img.src = positions[0].stats;
        initiativeTracker.appendChild(img);
    }
    placeTokens();
}

makeOrderList();
