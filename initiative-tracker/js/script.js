const setupTable = document.getElementById("setupTable");
let initiative = [];
let letChangeInit = false;

function addRow() {
    const tr = document.createElement("tr");
    tr.innerHTML = `                <td><span class="center"><input type="number"></span></td>
                <td><span class="center"><input type="text"></span></td>
                <td><span class="center"><input type="number"></span></td>
                <td><span class="center"><input type="number"></span></td>
                <td><span class="center"><input type="number"></span></td>
                <td><span class="center"><input type="text"></span></td>
                <td><span class="center"><input type="checkbox"></span></td>`;
    setupTable.appendChild(tr);
}

function finishSetup(wasPremade) {
    let setupTable = document.getElementById("setupTable");
    for (let i = 1; i < setupTable.rows.length; i++) {
        initiative[i - 1] = makeInitiativeObject(setupTable.rows[i]);
    }
    document.getElementById("setup").style.display = "none";

    // Now we start the useable part

    // But first we sort the initiatives with bubble sort
    if (prompt("Reorder based on initiative score? Y/N").toLowerCase() != "n") {
        for (let i = 0; i < initiative.length; i++) {
            for (let j = 0; j < initiative.length - i - 1; j++) {
                if (initiative[j].initiative < initiative[j + 1].initiative) {
                    // Swap elements
                    let temp = initiative[j];
                    initiative[j] = initiative[j + 1];
                    initiative[j + 1] = temp;
                }
            }
        }
    }
    buildDoc();
}

function makeInitiativeObject(row) {
    const stats = {};
    stats.initiative = Number(row.cells[0].querySelector("input").value);
    stats.name = row.cells[1].querySelector("input").value;
    stats.hp = Number(row.cells[2].querySelector("input").value);
    stats.hpMax = Number(row.cells[3].querySelector("input").value);
    stats.ac = Number(row.cells[4].querySelector("input").value);
    stats.picture = row.cells[5].querySelector("input").value;
    stats.isPlayer = row.cells[6].querySelector("input").checked;
    stats.turn = false;
    return stats;
}

function buildDoc() {
    let using = document.getElementById("using");
    document.getElementById("clearStorage").style.display = "flex";
    using.innerHTML = "";
    let i = 0;
    initiative.forEach((element) => {
        const initiativeObject = document.createElement("div");
        const img = document.createElement("img");
        initiativeObject.innerHTML = `<h2 class="${element.isPlayer ? "player" : ""}">${
            letChangeInit ? `<span class="newInitiative"><input type="number" id="${element.name}newInit">New Init</span>|` : ""
        }${element.name} | ${element.hp}/${element.hpMax} HP | ${element.ac}AC <input type="number" id="${element.name}hp"><button type="button" onclick="handleDamage('${i}')">Damage</button></h2>`;
        initiativeObject.className = "image";
        if (element.turn == true || i == 0) {
            initiativeObject.id = "thisPersonsTurnNow";
        }
        img.src = element.picture;
        initiativeObject.appendChild(img);
        using.appendChild(initiativeObject);
        i++;
    });
    const nextInitiative = document.createElement("button");
    nextInitiative.type = "button";
    nextInitiative.addEventListener("click", nextInitiativefunc);
    nextInitiative.innerText = "Advance Turn";
    using.appendChild(nextInitiative);
}

function handleDamage(i) {
    initiative[i].hp += -1 * Number(document.getElementById(initiative[i].name + "hp").value);
    buildDoc();
}

function reorderInitiative() {
    initiative.forEach((character) => {
        let newInit = document.getElementById(character.name + "newInit").value;
        character.initiative = newInit;
        character.turn = false;
    });
    turn = null;
    // Bubble sort again
    for (let i = 0; i < initiative.length; i++) {
        for (let j = 0; j < initiative.length - i - 1; j++) {
            if (initiative[j].initiative < initiative[j + 1].initiative) {
                // Swap elements
                let temp = initiative[j];
                initiative[j] = initiative[j + 1];
                initiative[j + 1] = temp;
            }
        }
    }
    buildDoc();
}

function nextInitiativefunc() {
    let first = initiative.shift();
    initiative[initiative.length] = first;

    buildDoc();
}

function showReorderInitiative() {
    letChangeInit = !letChangeInit;
    buildDoc();
}
function showResourcesMenu(j) {
    let character = initiative[j];
    let menu = document.createElement("div");
    menu.className = "resourceMenu";
    let title = document.createElement("h2");
    title.innerText = `${character.name}'s Resources`;
    menu.appendChild(title);
    let resourceList = document.createElement("ul");
    for (let i = 0; i < character.resources; i++) {
        const li = document.createElement("li");
        const resource = character.resources[i];
        li.innerHTML = `${resource.name}: ${resource.value}/${resource.max} <button type="button" onclick="changeResources(${j}, ${i})">Change</button>`;
        resourceList.appendChild(li);
    }
    menu.appendChild(resourceList);
    const addResourceButton = document.createElement("button");
    addResourceButton.type = "button";
    addResourceButton.innerText = "Add Resource";
    addResourceButton.onclick = addResource();
    menu.appendChild(addResourceButton);
    document.body.appendChild(menu);
}

function changeResources(character, resourceIndex) {
    let characterObj = initiative[character];
    let resource = characterObj.resources[resourceIndex];
    resource.value += -Number(prompt(`Enter subtracted value for ${resource.name}:`, resource.value));
}

function downloadJSON() {
    const dataStr = JSON.stringify(initiative);
    const blob = new Blob([dataStr], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "initiative_state.json";
    link.click();
    link.remove(); // Clean up the created element
}

function uploadJSON() {
    const shadowInput = document.createElement("input");
    shadowInput.type = "file";
    shadowInput.accept = "application/json";
    shadowInput.click();
    shadowInput.onchange = function () {
        let files = shadowInput.files;
        if (files.length <= 0) {
            return false;
        }

        var fr = new FileReader();

        fr.onload = function (e) {
            let result = JSON.parse(e.target.result);
            initiative = result;
            let i = setupTable.rows.length - 1;
            initiative.forEach((character) => {
                addRow();
                i++;
                let row = setupTable.rows[i];
                row.cells[0].querySelector("input").value = character.initiative;
                row.cells[1].querySelector("input").value = character.name;
                row.cells[2].querySelector("input").value = character.hp;
                row.cells[3].querySelector("input").value = character.hpMax;
                row.cells[4].querySelector("input").value = character.ac;
                row.cells[5].querySelector("input").value = character.picture;
                row.cells[6].querySelector("input").checked = character.isPlayer;
            });
        };

        fr.readAsText(files.item(0));
    };
}
