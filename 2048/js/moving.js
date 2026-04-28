import { getBoardBlank, getBoardWhole, setBoardWhole } from "./main.js";
import { spawn, spawnCoords } from "./spawning.js";

export function start() {
    document.addEventListener("keydown", (event) => {
        switch (event.key) {
            case "ArrowUp":
                shiftUp();
                break;
            case "ArrowDown":
                shiftDown();
                break;
            case "ArrowLeft":
                shiftLeft();
                break;
            case "ArrowRight":
                shiftRight();
                break;
        }
    });
}

function shiftUp() {}
function shiftDown() {}
function shiftLeft() {
    console.log("left");
    let board = getBoardWhole();
    let newBoard = getBoardBlank();
    for (let i = 0; i < board.length; i++) {
        board[i] = board[i].filter((a) => a != 0);
        for (let j = 0; j < board[i].length; j++) {
            if (board[i][j] == board[i][j + 1]) {
                board[i].splice(j + 1, 1);
                board[i][j] = 2 * board[i][j];
            }
        }
        while (board[i].length < 4) {
            board[i].push(0);
        }
        newBoard[i] = board[i];
    }

    let blocks = document.getElementsByClassName("node");
    for (let i = 0; i < blocks.length; i++) {
        const element = blocks[i];
        console.log(element);
        element.style.left = "";
        element.style.zIndex = "-20";
        setTimeout(function () {
            element.remove();
        }, 1000);
    }

    setBoardWhole(newBoard);

    setTimeout(function () {
        let board = getBoardWhole();
        console.log(board);
        for (let i = 0; i < board.length; i++) {
            console.log(i);
            for (let j = 0; j < board[i].length; j++) {
                try {
                    spawnCoords(i, j, board[i][j]);
                } catch (e) {}
            }
        }
        spawn();
    }, 1000);
}
function shiftRight() {}
