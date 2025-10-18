const classes = ["Artificer","Bard","Barbarian","Cleric","Druid","Fighter","Monk","Paladin","Ranger","Rogue","Sorcerer","Warlock","Wizard"]
let levels = [];
let characterLevel;
let casterLevel = 0;

function hideUnusedLevels() {
    let clas;
    // checks each class and hides it if it has no levels
    for (let i = 0; i < classes.length; i++) {
        const element = classes[i];
        clas = document.getElementById(element);
        if (clas.value == 0) {
            clas.parentElement.style.display = "none";
            // Deletes the caster checkbox if class is unused
            if (element == "Fighter" || element == "Rogue") {
                document.getElementById(element+"Caster").parentElement.style.display = "none";
            }
        }
        levels[i] = Number(clas.value);
        // casterLevel += (i==1||i==3||i==4||i==10||i==12)?clas.value:(i=0||i==7||i==8)?clas.value/2:(i==5||i==9)?clas.value/3:0;
    }
    casterLevel += levels[1]+levels[3]+levels[4]+levels[10]+levels[12];
    casterLevel += (levels[0]+levels[7]+levels[8])/2;
    if (document.getElementById("FighterCaster").value) {
        casterLevel += levels[5]/3;
    }
    if (document.getElementById("RogueCaster").value) {
        casterLevel += levels[9]/3;
    }
    characterLevel=() => {
        let sum;
        levels.forEach(element => {
            sum+=element;
        });
        return sum;
    };
    characterLevel=characterLevel.apply();
    abilityScores.set("STR", document.getElementById("Str").value);
    abilityScores.set("DEX", document.getElementById("Dex").value);
    abilityScores.set("CON", document.getElementById("Con").value);
    abilityScores.set("INT", document.getElementById("Int").value);
    abilityScores.set("WIS", document.getElementById("Wis").value);
    abilityScores.set("CHA", document.getElementById("Cha").value);
    abilityScores.set("STRmod", Math.floor(((abilityScores.get("STR")-10)/2)));
    abilityScores.set("DEXmod", Math.floor(((abilityScores.get("DEX")-10)/2)));
    abilityScores.set("CONmod", Math.floor(((abilityScores.get("CON")-10)/2)));
    abilityScores.set("INTmod", Math.floor(((abilityScores.get("INT")-10)/2)));
    abilityScores.set("WISmod", Math.floor(((abilityScores.get("WIS")-10)/2)));
    abilityScores.set("CHAmod", Math.floor(((abilityScores.get("CHA")-10)/2)));
    addAttackArgs("Greataxe","STR","1d12");
}

