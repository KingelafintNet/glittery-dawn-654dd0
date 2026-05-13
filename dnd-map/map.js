// Replace with a call to supabase to get the map data
let width = 20;
let height = 12;
let positions;

let size = [15, 25, 50, 100, 150, 200];

positions = await fetch("../part2Filled.json").then((response) => response.json());

// Create the table
let table = document.getElementById("map");
for (let i = 0; i < height; i++) {
    let row = document.createElement("tr");
    for (let j = 0; j < width; j++) {
        let cell = document.createElement("td");
        row.appendChild(cell);
    }
    table.appendChild(row);
}

// Fill the table based on the positions
function placeTokens() {
    for (let i = 0; i < positions.length; i++) {
        const element = positions[i];
        let token = document.createElement("div");
        token.innerHTML = `<div style="height:${size[element.size]}px; width:${size[element.size]}px;"><img src="${element.picture}" width${size[element.size]}></div>`;
        token.classList.add("token");

        if (element.size > 2) {
            for (let j = 1; j < 9; j++) {
                table.rows[element.y + (j % 3)].cells[element.x].remove();
            }
            table.rows[element.y].cells[element.x].rowSpan = element.size - 1;
            table.rows[element.y].cells[element.x].colSpan = element.size - 1;
        }

        token.addEventListener("click", () => {
            // Create movement arrows that shift the token on the tile
            let directions = ["up", "down", "left", "right"];
            directions.forEach((direction) => {
                let arrow = document.createElement("div");
                arrow.classList.add("arrow", direction);
                token.appendChild(arrow);
                arrow.innerHTML = "►";
                arrow.style.transform = `rotate(${directions.indexOf(direction) * 90 + 180}deg)`;
            });
        });

        table.rows[element.y].cells[element.x].appendChild(token);
    }
}
placeTokens();
