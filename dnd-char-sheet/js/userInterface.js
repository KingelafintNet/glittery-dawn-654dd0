let isInputHide = false;
let hpMax = 100;
let hp = hpMax;
let temphp = 0;
let attacks = [];
let abilityScores =new Map();
let getPopupToggle = false;
let getPopup = () => {
    return document.getElementById('popup');
};

function hideInput() {
    if (isInputHide) {
        let div = document.getElementById("classLevels");
        let button = document.getElementById("toggleInputButton");
        div.style.left = "";
        button.style.position = "fixed";
        button.style.left = "";
        isInputHide = false;
    } else {
        let div = document.getElementById("classLevels");
        let button = document.getElementById("toggleInputButton");
        div.style.left = "-500px";
        button.style.position = "absolute";
        button.style.left = "80px";
        isInputHide = true;
    }
}
function compileCharacter() {
    // My phone screen is 360px in width, and 700px in height
    document.getElementById("classLevels").style.display = "none";
    document.getElementById("newSpell").style.display = "none";
    // let main = document.getElementById("main");
    // for (let i = 64; i > 0; i--) {
    //     let add = document.createElement("div");
    //     add.style.position = "absolute";
    //     add.style.height = "30px";
    //     add.style.width = i*20+"px";
    //     add.style.top = "0px";
    //     add.style.left = "0px";
    //     add.style.display = "flex";
    //     add.style.justifyContent = "flex-end";
    //     add.style.backgroundColor = "rgba("+4*i+","+4*i+","+4*i+", 10)";
    //     add.innerText = i;
    //     add.style.color = "red";
    //     main.appendChild(add);
    // }
    // for (let i = 64; i > 0; i--) {
    //     let add = document.createElement("div");
    //     add.style.position = "absolute";
    //     add.style.width = "30px";
    //     add.style.top = "0px";
    //     add.style.left = "0px";
    //     add.style.height = i*20+"px";
    //     add.style.display = "flex";
    //     add.style.alignItems = "flex-end";
    //     add.style.backgroundColor = "rgba("+4*i+","+4*i+","+4*i+", 10)";
    //     add.innerText = i;
    //     add.style.color = "red";
    //     main.appendChild(add);
    // }
}

function manageHealth(button) {
    switch (button) {
        case "Damage":
            let damage = getDataViaUser("How much damage do you take?");
            let tempTemp = temphp;
            temphp = (damage>=temphp)?0:damage-temphp;
            damage = Math.max(damage - tempTemp,0);
            hp = hp - damage;
            hp = (hp>0)?(hp>hpMax)?hpMax:hp:0;
            break;
        case "Heal":
            let healing = getDataViaUser("How healing do you get?")
            hp = hp + healing;
            hp = (hp>0)?(hp>hpMax)?hpMax:hp:0;
            break;
        case "TempHP":
            temphp = getDataViaUser("What is the new temp HP?");
            break;
        default:
            break;
    }
    let color1 = document.getElementById("hpColor1");
    let text = document.getElementById("hpText");
    let color2 = document.getElementById("hpColor2");
    let left;
    let color = "hsl("+String(120*hp/hpMax)+",100%,50%)";
    console.log(temphp);
    if (temphp>0) {
        text.innerHTML = "<span style='color:"+color+";'>"+hp+"/"+hpMax+"</span> + "+temphp;
    } else {
        text.innerHTML = "<span style='color:"+color+";'>"+hp+"/"+hpMax+"</span>";
    }
    left = (hp/hpMax)*180-90;
    if (hp/hpMax > 0.5) {
        left = left - 90;
        color2.style.backgroundColor = color;
    } else {
        color2.style.backgroundColor = "rgb(0, 0, 77)";
    }
    document.getElementById("tempHP").style.width = ((temphp>hpMax)?hpMax*180:(180*temphp/hpMax))+"px";
    color1.style.backgroundColor = color;
    color2.style.left = String(left)+"px";
}

// Function to get a valid number from the user
function getDataViaUser(message) {
    let userInput;
    userInput = prompt(message); // Prompt the user for input
    // Check if the input is a valid number
    if (userInput == null) {
        alert("You canceled the input.");
        return null; // Exit if the user clicks "Cancel"
    }
    return userInput;
}

function displayAttacks() {
    let div = document.createElement('div');
    div.className = "p_attacks";
    div.id = "popup";
    /*     
    <h1>Attacks</h1>
    <hr>
    <h2>Greataxe</h2>
    <h3>to hit: +5; damage: 1d12 +3</h3>
     */
    div.innerHTML = "<h1>Attacks</h1><hr>"
    console.log
    attacks.forEach(attack => {
        div.innerHTML = div.innerHTML + "<h2>"+attack.name+"</h2><h3>To hit: +"+(abilityScores.get(attack.statUsed+"mod"))+" Damage: "+attack.damageDie+(abilityScores.get(attack.statUsed+"mod"))+"<hr>";
    });
    document.getElementById('main').appendChild(div);
}

function addAttack() {
    attacks[attacks.length] = new Attack(getDataViaUser("What is the weapon?"),getDataViaUser("What ability score does it use? Use abbreviation. ex: STR"),getDataViaUser("What are the damage dice? ex: 1d12"));
}

function addAttackArgs(name,score,die) {
    attacks[attacks.length] = new Attack(name,score,die);
}

document.addEventListener('click', function(event) {
    // Use contains() to check if the clicked element is inside #myElement
    if (!getPopup.apply().contains(event.target) && getPopupToggle) {
        getPopup.apply().remove(); // Deletes the element if clicked outside
    }
    getPopupToggle = !getPopupToggle;
});