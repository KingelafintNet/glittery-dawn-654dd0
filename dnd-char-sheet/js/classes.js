class Attack {
    constructor(name,statUsed,damageDie) {
        this.name = name;
        this.statUsed = statUsed;
        this.damageDie = damageDie;
    }
}

class Spell {
    constructor(name, level, school, range, ritual, castTime, components, duration, concentration, classes, description) {
        this.name = name;
        this.level = level;
        this.school = school;
        this.range = range;
        this.ritual = ritual;
        this.castTime = castTime;
        this.components = components;
        this.duration = duration;
        this.concentration = concentration;
        this.classes = classes;
        this.description = description;
    }
}