const setupTable = document.getElementById('setupTable');
let initiative = [];
let turn;
let letChangeInit =false;

function addRow() {
    const tr = document.createElement('tr');
    tr.innerHTML = `                <td><input type="number"></td>
                <td><input type="text"></td>
                <td><input type="number"></td>
                <td><input type="number"></td>
                <td><input type="number"></td>
                <td><input type="text"></td>`;
    setupTable.appendChild(tr);
}

function finishSetup(wasPremade) {
    let setupTable = document.getElementById('setupTable');
    for (let i = 1; i < setupTable.rows.length; i++) {
        initiative[i-1] = new InitiativeObject(setupTable.rows[i]);
        resetLocalStorage(wasPremade, i, false);
    }
    document.getElementById('setup').style.display = 'none';
    
    // Now we start the useable part

    // But first we sort the initiatives with bubble sort
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

function resetLocalStorage(wasPremade, i, reset) {
    if (!wasPremade) {
        if (reset) {
            StorageHelper.clear();
        }
        StorageHelper.set(initiative[i-1].name+"initiative",String(initiative[i-1].initiative));
        StorageHelper.set(initiative[i-1].name+"hp",String(initiative[i-1].hp));
        StorageHelper.set(initiative[i-1].name+"hpMax",String(initiative[i-1].hpMax));
        StorageHelper.set(initiative[i-1].name+"ac",String(initiative[i-1].ac));
        StorageHelper.set(initiative[i-1].name+"picture",String(initiative[i-1].picture));
        StorageHelper.set("names", 
            ((StorageHelper.get("names"))?StorageHelper.get("names")+',':"")
            +initiative[i-1].name);
    }
}

function buildDoc() {
    let using = document.getElementById('using');
    document.getElementById('clearStorage').style.display = "flex";
    using.innerHTML = "";
    let i = 0;
    initiative.forEach(element => {
        const initiativeObject = document.createElement('div');
        const img = document.createElement('img');
        initiativeObject.innerHTML = `<h2>${letChangeInit?(`<span class="newInitiative"><input type="number" id="${element.name}newInit">New Init</span>|`):""}${element.name} | ${element.hp}/${element.hpMax} HP | ${element.ac}AC <input type="number" id="${element.name}hp"><button type="button" onclick="handleDamage('${i}')">Damage</button></h2>`;
        initiativeObject.className = 'image';
        if (element.turn == true) {
            initiativeObject.id = "thisPersonsTurnNow";            
        }
        img.src = element.picture;
        initiativeObject.appendChild(img);
        using.appendChild(initiativeObject);
        i++;
    });
    const nextInitiative = document.createElement('button');
    nextInitiative.type = "button";
    nextInitiative.addEventListener('click', nextInitiativefunc);      
    nextInitiative.innerText = "Advance Turn";
    using.appendChild(nextInitiative);
}

function setupFromLocalStorage() {
    let names = StorageHelper.get("names").split(',');
    for (let i = 0; i < names.length; i++) {
        addRow();
        const name = names[i];
        let row = setupTable.rows[i+1];
        row.cells[0].querySelector("input").value = StorageHelper.get(name+"initiative");
        row.cells[1].querySelector("input").value = name;
        row.cells[2].querySelector("input").value = StorageHelper.get(name+"hp");
        row.cells[3].querySelector("input").value = StorageHelper.get(name+"hpMax");
        row.cells[4].querySelector("input").value = StorageHelper.get(name+"ac");
        row.cells[5].querySelector("input").value = StorageHelper.get(name+"picture");
    };
    finishSetup(true);
}

function handleDamage(i) {
    initiative[i].hp += -1 * Number(document.getElementById(initiative[i].name+'hp').value);
    StorageHelper.set(initiative[i].name+"hp",String(initiative[i].hp));
    buildDoc();
}

function reorderInitiative() {
    initiative.forEach(character => {
        let newInit = document.getElementById(character.name+"newInit").value;
        character.initiative = newInit;
        StorageHelper.set(character.name+"initiative",String(newInit));
        character.turn = false;
    });
    turn = null;
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
    if (turn == null) {
        initiative[0].turn = true;
        turn = 0;
    } else {
        initiative[turn].turn = false;
        turn++;
        turn = turn>=initiative.length?0:turn;
        initiative[turn].turn = true;
    }
    buildDoc();
}

function showReorderInitiative() {
    letChangeInit = !letChangeInit;
    buildDoc();
}

function downloadSite() {
    fetch('site.zip')
    .then(response => response.blob()) // Convert the response to a Blob
    .then(blob => {
        const link = document.createElement("a"); // Create a temporary <a> element
        link.href = URL.createObjectURL(blob); // Create an object URL for the Blob
        link.download = "Initiative Tracker"; // Set the desired file name
        link.click(); // Trigger the download
        URL.revokeObjectURL(link.href); // Clean up the object URL
    })
    .catch(error => console.error("Download failed:", error));
}
const StorageHelper = {
    // Save an object or value
    set(key, value) {
        try {
            const serialized = JSON.stringify(value);
            localStorage.setItem(key, serialized);
        } catch (e) {
            console.error("Failed to store data:", e);
        }
    },

    // Retrieve and parse an object or value
    get(key) {
        try {
            const raw = localStorage.getItem(key);
            return raw ? JSON.parse(raw) : null;
        } catch (e) {
            console.error("Failed to parse stored data:", e);
            return null;
        }
    },

    // Remove a specific item
    remove(key) {
        localStorage.removeItem(key);
    },

    // Clear all localStorage
    clear() {
        if (prompt("Are you sure?") == "true") {
            localStorage.clear();
        }
    },

    // Check if a key exists
    has(key) {
        return localStorage.getItem(key) !== null;
    },

    // Print the Contents of localStorage to the browser
    contents() {
        console.log("LocalStorage Contents:");
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            const value = localStorage.getItem(key);
            console.log(`${key}: ${value}`);
        }
    }  
};