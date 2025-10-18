class InitiativeObject {
    constructor(tableRow) {
        this.initiative = Number(tableRow.cells[0].querySelector("input").value);
        this.name = tableRow.cells[1].querySelector("input").value;
        this.hp = Number(tableRow.cells[2].querySelector("input").value);
        this.hpMax = Number(tableRow.cells[3].querySelector("input").value);
        this.ac = Number(tableRow.cells[4].querySelector("input").value);
        this.picture = tableRow.cells[5].querySelector("input").value;
        this.turn;
    }
}