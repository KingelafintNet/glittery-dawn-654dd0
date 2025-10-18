function openAddSpellGui() {
    document.getElementById("newSpellGui").style.display = "flex";
}

function addSpell() {
    new Spell(
        document.getElementById("spellName"),
        document.getElementById("spellLevel"),
        document.getElementById("spellSchool"),
        document.getElementById("spellRange"),
        document.getElementById("spellRitual"),
        document.getElementById("spellCastTime"),
        document.getElementById("spellComponents"),
        document.getElementById("spellDuration"),
        document.getElementById("spellConcentration"),
        document.getElementById("spellClasses"),
        document.getElementById("spellDescription")
    );
}

function getEleId(Id) {
    return document.getElementById("spell");
}