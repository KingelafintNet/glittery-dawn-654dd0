// Supabase configuration - REPLACE THESE WITH YOUR VALUES

const SUPABASE_URL = "https://ksetlpqassfnkbchpttc.supabase.co";
const SUPABASE_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtzZXRscHFhc3NmbmtiY2hwdHRjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1MzU2NTksImV4cCI6MjA5NDExMTY1OX0.FsT-nXL-f_x6ws6Gdm6aC7DXeV62SPpgtuEJ3Gmn4Jo";
let width = 20;
let height = 12;
let positions;
let shadows = [];

let size = [15, 25, 50, 100, 150, 200];
let directions = ["right", "down", "left", "up"];

let controlling = 0;

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
        if (payload.eventType === "INSERT") {
            positions.push(payload.new);
        } else if (payload.eventType === "UPDATE") {
            const index = positions.findIndex((p) => p.token_name === payload.new.token_name);
            if (index !== -1) {
                positions[index] = payload.new;
            }
        } else if (payload.eventType === "DELETE") {
            positions = positions.filter((p) => p.token_name !== payload.old.token_name);
        }
        placeTokens();
    })
    .subscribe();

const arrowLayer = document.createElement("div");
arrowLayer.classList.add("arrow-layer");
document.body.appendChild(arrowLayer);

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

        if (positions[i].controlling) {
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
}
function changeControlling(position) {
    positions[controlling].controlling = false;
    controlling = position;
    positions[controlling].controlling = true;
    placeTokens();
}

function moveToken(direction, index) {
    let state = positions[index];
    if (!state.shade) {
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
        console.log(Class);
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
        console.log(Class);
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
        console.log(Class);
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
        console.log(Class);
        if (element.innerHTML == "" || Class == "shade") {
            state.y++;
        }
    }
    placeTokens();
}

placeTokens();
