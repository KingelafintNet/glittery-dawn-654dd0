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
// const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Add to map
// Make the buttons work
// Horizontal changes
const table = document.getElementById("map-editor").querySelector("table");
function horiTableGrow(sign, end) {
    if (sign === "-") {
        for (let i = 0; i < table.rows.length; i++) {
            table.rows[i].cells[end == 3 ? table.rows[0].cells.length - 1 : 0].remove();
        }
    } else {
        for (let i = 0; i < table.rows.length; i++) {
            const firstCell = table.rows[i].cells[end == 3 ? table.rows[0].cells.length - (i != 0 ? 2 : 1) : 0].cloneNode();
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
        document.getElementById("dimensions").innerText = `Horizontal: ${table.rows[0].cells.length}, Vertical: ${table.rows.length}`;
        horiTableGrow(a[0], a[1]);
    };
});

// Vertical changes
function vertTableGrow(sign, end) {
    if (sign === "-") {
        table.rows[end == 4 ? table.rows.length - 1 : 0].remove();
    } else {
        const row = document.createElement("tr");
        row.innerHTML = table.rows[end == 4 ? table.rows.length - 1 : 0].innerHTML;
        if (end == 2) {
            table.prepend(row);
        } else {
            table.appendChild(row);
        }
    }
}
// style="background:blue;"
["+2", "-2", "+4", "-4"].forEach((a) => {
    document.getElementById(a).onclick = () => {
        document.getElementById("dimensions").innerText = `Horizontal: ${table.rows[0].cells.length}, Vertical: ${table.rows.length}`;
        vertTableGrow(a[0], a[1]);
    };
});
