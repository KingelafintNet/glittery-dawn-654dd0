// Auth
import { sha256 } from "./hash_coder.js";
const allow = "5122098903e774a45eb15025abcd822e76e325254661f134198e88dc31264d12";
if (localStorage.getItem("authtoken") == allow) {
    document.getElementById("auth").style.display = "none";
}
document.getElementById("authButton").onclick = () => {
    setTimeout(() => {
        let value = document.getElementById("authInput").value;
        let hash = sha256(value);
        if (hash === allow) {
            alert("confirmed");
            document.getElementById("auth").style.display = "none";
            localStorage.setItem("authtoken", hash);
        } else {
            alert("wrong");
        }
    }, 3000);
};

// Supabase
const SUPABASE_URL = "https://ksetlpqassfnkbchpttc.supabase.co";
const SUPABASE_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtzZXRscHFhc3NmbmtiY2hwdHRjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1MzU2NTksImV4cCI6MjA5NDExMTY1OX0.FsT-nXL-f_x6ws6Gdm6aC7DXeV62SPpgtuEJ3Gmn4Jo";
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
document.getElementById("upload").onclick = async () => {
    const { error } = await supabase.from("Battles").upsert({
        battle: document.getElementById("battleName").value,
        width: table.rows[0].cells.length,
        height: table.rows.length,
        background: convertTableToString(),
        GMcode: document.getElementById("GMCode").value,
    });
    console.log(error);
};

// Make the one <td> have the right colors
const table = document.getElementById("map-editor").querySelector("table");
function setSquareColor(square) {
    square.style.backgroundColor = document.getElementById("selected-color").style.backgroundColor;
}

document.querySelector("td").onclick = (a) => {
    setSquareColor(a.target);
};
document.querySelector("td").onmouseover = (a) => {
    if (a.buttons === 1) {
        setSquareColor(a.target);
    }
};

// Add to map
// Make the buttons work
// Horizontal changes
function horiTableGrow(sign, end) {
    if (sign === "-") {
        for (let i = 0; i < table.rows.length; i++) {
            table.rows[i].cells[end == 3 ? table.rows[0].cells.length - 1 : 0].remove();
        }
    } else {
        for (let i = 0; i < table.rows.length; i++) {
            const firstCell = table.rows[i].cells[end == 3 ? table.rows[0].cells.length - (i != 0 ? 2 : 1) : 0].cloneNode();
            firstCell.onmouseover = (a) => {
                if (a.buttons === 1) {
                    setSquareColor(a.target);
                }
            };
            firstCell.onclick = (a) => {
                setSquareColor(a.target);
            };
            if (end == 1) {
                table.rows[i].prepend(firstCell);
            } else {
                table.rows[i].append(firstCell);
            }
        }
    }
}
["+1", "-1", "+3", "-3"].forEach((a) => {
    document.getElementById(a).onclick = () => {
        horiTableGrow(a[0], a[1]);
        document.getElementById("dimensions").innerText = `Horizontal: ${table.rows[0].cells.length}, Vertical: ${table.rows.length}`;
    };
});

// Vertical changes
function vertTableGrow(sign, end) {
    if (sign === "-") {
        table.rows[end == 4 ? table.rows.length - 1 : 0].remove();
    } else {
        const row = table.rows[end == 4 ? table.rows.length - 1 : 0].cloneNode(true);
        for (let i = 0; i < row.childNodes.length; i++) {
            const element = row.childNodes[i];
            element.onmouseover = (a) => {
                if (a.buttons === 1) {
                    setSquareColor(a.target);
                }
            };
            element.onmousedown = (a) => {
                setSquareColor(a.target);
            };
        }
        if (end == 2) {
            table.prepend(row);
        } else {
            table.appendChild(row);
        }
    }
}
["+2", "-2", "+4", "-4"].forEach((a) => {
    document.getElementById(a).onclick = () => {
        vertTableGrow(a[0], a[1]);
        document.getElementById("dimensions").innerText = `Horizontal: ${table.rows[0].cells.length}, Vertical: ${table.rows.length}`;
    };
});

function rgbStringToHex(rgbString) {
    // Extract all digit sequences from the string
    const rgbValues = rgbString.match(/\d+/g);

    if (!rgbValues || rgbValues.length < 3) {
        throw new Error("Invalid RGB string format");
    }

    // Convert each number to a 2-digit base-16 string and join them
    const hex = rgbValues
        .slice(0, 3) // Ensures we only take R, G, and B even if A (alpha) is present
        .map((x) => parseInt(x, 10).toString(16).padStart(2, "0"))
        .join("");

    return `#${hex}`;
}

// Add swatch
document.getElementById("add-swatch").onclick = (a) => {
    // const color = prompt("Enter the hex code of the new color:");
    if (!document.getElementById("colorEditor")) {
        const colorEditor = document.createElement("div");
        colorEditor.id = "colorEditor";

        ["Red", "Green", "Blue"].forEach((element) => {
            const red = document.createElement("input");
            red.type = "range";
            red.min = "0";
            red.value = "0";
            red.max = "255";
            red.id = element;
            const redLabel = document.createElement("label");
            redLabel.id = element + "Label";
            redLabel.innerText = element + ": 0";

            red.addEventListener("input", (a) => {
                redLabel.innerText = `${element}: ${a.target.value}`;
                const r = Number(document.getElementById("Red").value);
                const g = Number(document.getElementById("Blue").value);
                const b = Number(document.getElementById("Green").value);

                const hex = `#${r.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}`;
                document.getElementById("preview").style.backgroundColor = hex;
                document.getElementById("hexInput").value = hex;
            });

            const colorHolder = document.createElement("div");
            colorHolder.appendChild(redLabel);
            colorHolder.appendChild(red);
            colorEditor.appendChild(colorHolder);
        });
        const preview = document.createElement("div");
        preview.id = "preview";
        colorEditor.appendChild(preview);

        // Hex code input
        const inputColor = document.createElement("input");
        inputColor.type = "text";
        inputColor.id = "hexInput";
        inputColor.onblur = (a) => {
            document.getElementById("preview").style.backgroundColor = a.target.value;
        };

        colorEditor.appendChild(inputColor);

        // Add the final color button
        const addColor = document.createElement("button");
        addColor.type = "button";
        addColor.innerText = "Add to Swatches";
        addColor.onclick = () => {
            const color = document.getElementById("preview").style.backgroundColor;
            let colorEle = document.createElement("div");
            colorEle.style.backgroundColor = color;
            colorEle.onclick = () => {
                try {
                    document.getElementById("selected-color").id = "";
                } catch (error) {}
                colorEle.id = "selected-color";
            };

            document.getElementById("colors").appendChild(colorEle);
            colorEditor.remove();
        };
        colorEditor.appendChild(addColor);
        a.target.appendChild(colorEditor);
    }
};

// Save table state as string
function convertTableToString() {
    let finalList = [];
    let workingString = "";

    const rows = table.rows.length;
    const cells = table.rows[0].cells.length;
    for (let i = 0; i < rows * cells; i++) {
        const element = table.rows[Math.floor(i / cells)].cells[i % cells];
        let currentColor = element.style.backgroundColor;
        currentColor = rgbStringToHex(currentColor);
        const workingList = workingString.split("+");
        if (workingList[1] != currentColor) {
            finalList.push(workingString);
            workingString = "1+" + currentColor;
        } else {
            workingList[0]++;
            workingString = workingList.join("+");
        }
    }
    finalList.push(workingString);
    finalList.shift();
    return finalList.join("|");
}
