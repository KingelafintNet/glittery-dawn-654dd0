import { getBoard, getBoardWhole, setBoard } from "./main.js";

export function spawn() {
    for (let i = 0; i < 100; i++) {
        try {
            let x = Math.floor(Math.random() * 4);
            let y = Math.floor(Math.random() * 4);
            let value = Math.random() >= 0.2 ? 2 : 4;
            spawnCoords(x, y, value);
            break;
        } catch (error) {
            console.log(error);
        }
    }
}

export function spawnCoords(x, y, value) {
    if (document.getElementById("" + x + y) != null) {
        throw new Error(`Coordinates (${x},${y}) have a block already`);
    } else if (x >= 4 || x < 0 || y >= 4 || y < 0) {
        throw new Error(`Coordinates (${x},${y}) are out of bounds.`);
    } else if (value <= 0) {
        throw new Error(`${value} is too low`);
    } else {
        setBoard(x, y, value);

        // Making the display
        let div = document.createElement("div");
        div.className = "node";
        div.id = "" + x + y;
        div.style.left = `${y * 20}vh`;
        div.style.top = `${x * 20}vh`;
        div.innerHTML = value;
        document.querySelectorAll("table")[0].appendChild(div);
    }
}
