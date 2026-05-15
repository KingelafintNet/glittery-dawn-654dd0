// Supabase configuration - REPLACE THESE WITH YOUR VALUES

let width = 21;
let height = 24;
let positions;
let shadows = [];

const SUPABASE_URL = "https://ksetlpqassfnkbchpttc.supabase.co";
const SUPABASE_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtzZXRscHFhc3NmbmtiY2hwdHRjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1MzU2NTksImV4cCI6MjA5NDExMTY1OX0.FsT-nXL-f_x6ws6Gdm6aC7DXeV62SPpgtuEJ3Gmn4Jo";
let size = [15, 25, 50, 100, 150, 200];
let directions = ["right", "down", "left", "up"];
let initiativeTracker = document.getElementById("initiativeTracker");
let GMcode = "HoppingFrog";

let controlling = 0;
let pictures = [];

// Initialize Supabase client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Fetch positions from Supabase
const { data, error } = await supabase.from("Tokens").select("*");

if (error) {
    console.error("Error fetching positions:", error);
    positions = [];
} else {
    positions = data;
}

// Subscribe to real-time updates
supabase
    .channel("public:Tokens")
    .on("postgres_changes", { event: "*", schema: "public", table: "Tokens" }, (payload) => {
        setTimeout(window.location.reload(), 10000);
    })
    .subscribe();

for (let i = 0; i < positions.length; i++) {
    const element = positions[i];
    const { data } = await supabase.storage.from("pictures").getPublicUrl(element.picture);
    positions[i].picture = data.publicUrl;
}

const arrowLayer = document.createElement("div");
arrowLayer.classList.add("arrow-layer");
document.body.appendChild(arrowLayer);

// Establish user profile
if (localStorage.getItem("profile")) {
} else {
    localStorage.setItem("profile", prompt("Who are you controlling?"));
}

// Fill the table based on the positions
function placeTokens() {
    // Create the table
    let table = document.getElementById("map");
    table.innerHTML = "";
    for (let i = 0; i < height; i++) {
        let row = document.createElement("tr");
        for (let j = 0; j < width; j++) {
            let cell = document.createElement("td");
            row.appendChild(cell);
        }
        table.appendChild(row);
    }
    arrowLayer.innerHTML = "";
    for (let i = 0; i < positions.length; i++) {
        const element = positions[i];
        let token = document.createElement("div");
        token.innerHTML = `<div style="height:${size[element.size]}px; width:${size[element.size]}px;"><img src="${element.picture}"></div>`;
        token.classList.add("token");
        token.style.width = String(size[element.size] + 2) + "px";
        token.style.height = String(size[element.size] + 2) + "px";
        token.style.borderColor = positions[i].isPlayer ? "var(--hero)" : "var(--enemy)";

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

                if (direction === "up") {
                    arrowTop = tokenTop - 40;
                } else if (direction === "down") {
                    arrowTop = tokenTop + tokenHeight - 12;
                } else if (direction === "left") {
                    arrowLeft = tokenLeft - 30;
                } else if (direction === "right") {
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
    if (!state.shade) {
        positions[index].shadeIndex = shadows.length;
        shadows.push({ ...state });
        positions[index].shade = true;
    }
    if (direction === "left") {
        const element = document.getElementById("map").rows[state.y].cells[state.x - 2];
        let Class;
        try {
            Class = element.children[0].getAttribute("class");
        } catch {
            Class = "no element";
        }
        if (element.innerHTML == "" || Class == "shade") {
            state.x--;
        }
    }
    if (direction === "right") {
        const element = document.getElementById("map").rows[state.y].cells[state.x + 2];
        let Class;
        try {
            Class = element.children[0].getAttribute("class");
        } catch {
            Class = "no element";
        }
        if (element.innerHTML == "" || Class == "shade") {
            state.x++;
        }
    }
    if (direction === "up") {
        const element = document.getElementById("map").rows[state.y - 2].cells[state.x];
        let Class;
        try {
            Class = element.children[0].getAttribute("class");
        } catch {
            Class = "no element";
        }
        if (element.innerHTML == "" || Class == "shade") {
            state.y--;
        }
    }
    if (direction === "down") {
        const element = document.getElementById("map").rows[state.y + 2].cells[state.x];
        let Class;
        try {
            Class = element.children[0].getAttribute("class");
        } catch {
            Class = "no element";
        }
        if (element.innerHTML == "" || Class == "shade") {
            state.y++;
        }
    }
    placeTokens();
}

let buttons = ["Damage", "Heal"];
for (let i = 0; i < buttons.length; i++) {
    const element = buttons[i];
    document.getElementById(element).onclick = () => {
        manageHealth(element);
    };
}
document.getElementById("Update").onclick = async () => {
    for (let i = 0; i < positions.length; i++) {
        let el = positions[i];
        let position = {
            initiative: el.initiative,
            hp: el.hp,
            hpMax: el.hpMax,
            ac: el.ac,
            isPlayer: el.isPlayer,
            turn: el.turn,
            x: el.x,
            y: el.y,
            size: el.size,
        };
        const { error } = await supabase.from("Tokens").update(position).eq("token_name", positions[i].token_name);
    }
};
document.getElementById("showOrderTracker").onclick = () => {
    makeOrderList();
};
document.getElementById("nextInitiative").onclick = () => {
    let first = positions.shift();
    positions[positions.length] = first;
    makeOrderList();
};

function manageHealth(button) {
    if (localStorage.getItem("profile") == positions[controlling].token_name || localStorage.getItem("profile") == GMcode) {
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
while (!positions[0].turn) {
    let first = positions.shift();
    positions[positions.length] = first;
}

function makeOrderList() {
    initiativeTracker.innerHTML = "";
    for (let i = 0; i < positions.length; i++) {
        const element = document.createElement("h5");
        element.innerHTML = positions[i].token_name;
        initiativeTracker.appendChild(element);
    }
    if (!positions[0].isPlayer) {
        const img = document.createElement("img");
        img.src = positions[0].stats;
        initiativeTracker.appendChild(img);
    }
    placeTokens();
}

placeTokens();
