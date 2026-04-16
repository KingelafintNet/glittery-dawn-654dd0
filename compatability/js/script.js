let output = document.getElementById("output");
document.getElementById("calculate").addEventListener("click", () => {
    let one = document.getElementById("subject1").value.toLowerCase();
    let two = document.getElementById("subject2").value.toLowerCase();
    let list = [one, two];
    let nameString = "";
    for (let i = 0; i < list.length; i++) {
        const element = list[i];
        nameString += element.split(" ").join("");
    }

    let numberString = "";
    let previousLetters = [];
    for (let i = 0; i < nameString.length; i++) {
        if (previousLetters.includes(nameString[i])) {
        } else {
            let length = nameString.split(nameString[i]);
            numberString += length.length - 1;
            previousLetters.push(nameString[i]);
        }
    }
    console.log(nameString);
    console.log(numberString);

    outPercent = "";
    while (true) {
        for (let i = 0; i < numberString.length / 2; i++) {
            let next = Number(numberString[i]) + Number(numberString[numberString.length - 1 - i]);
            if (i == numberString.length - 1 - i) {
                outPercent += next / 2;
            } else {
                outPercent += next;
            }
        }
        if (Number(outPercent) < 120) {
            output.innerText = "" + outPercent + "%";
            break;
        }
        numberString = outPercent;
        outPercent = "";
        console.log(numberString);
    }
});
