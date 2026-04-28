import { start } from "./moving.js";
import { spawn } from "./spawning.js";

let boardBlank = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
];
let board = boardBlank;

export function getBoard(x, y) {
    return board[x][y];
}

export function getBoardWhole() {
    return board;
}

export function getBoardBlank() {
    return boardBlank;
}

export function setBoard(x, y, value) {
    board[x][y] = value;
}

export function setBoardWhole(newBoard) {
    board = newBoard;
}

start();
spawn();
spawn();
