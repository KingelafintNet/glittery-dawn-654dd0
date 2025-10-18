let setList = [];
// Update this every time there is a new list
const allSets = ['aot', 'tdp', 'kage', 'one', 'per', 'ten', 'tsuki'];
let paths = [];
let length = 0;
let dark = 0;
let names = [];
let isFirstPassOver = true;
let isFirstPassOverNames = true;
function checkLength(valid, setid) {
    if (valid) {
        let group = allSets[setid];
        // The code below gets the path to a file premade with all of the paths for the images, and then checks if that file exsists.
        let preMadePath = '/Guess Who/'+group+'/'+group+'.txt';
        let preMade = doesFileExist(preMadePath);
        if (preMade) {
            let rawPath = readTextFile(preMadePath);
            length = paths.length;
            if (isFirstPassOver) {
                isFirstPassOver = false;
                paths = rawPath.split(',');
                // console.log(paths);
            } else {
                let tempPaths = paths.join(',');
                paths = (tempPaths+','+rawPath).split(',');
            }
        } else {
            // If there is not a premade list of filepaths
            console.log("You don't have a premade list.");
            let i = 1;
            let prelist = [];
            while (true) {
                let iteration = '/Guess Who/' + group + '/' + i + '.jpg';
                if (doesFileExist(iteration)) {
                    paths[length+i-1] = iteration;
                    prelist[i-1] = iteration;
                    i+=1;
                    console.log(iteration);
                } else { 
                    if (!preMade) {
                        function downloadFile() {
                            const link = document.createElement('a');
                            const content = prelist.toString();
                            const file = new Blob([content], { type: 'text/plain' });
                            link.href = URL.createObjectURL(file);
                            link.download = group + '.txt';
                            link.click();
                            URL.revokeObjectURL(link.href);
                        };
                        downloadFile(); 
                        alert('Please place the downloaded file in the apropriate folder.');   
                    };
                    console.log('To be clear, these errors should be here');
                    break;
                }
            }
            
            i--;
            return i;
        }
        let rawNames = readTextFile('/Guess Who/'+group+'/names.txt');
        if (isFirstPassOverNames) {
            isFirstPassOverNames = false;
            names = rawNames.split(',');
            // console.log(names);
        } else {
            let tempNames = names.join(',');
            names = (tempNames+','+rawNames).split(',');
        }
    } else {
        return 0;
    }
}

function doesFileExist(urlToFile) {
    let xhr = new XMLHttpRequest();
    xhr.open('HEAD', urlToFile, false);
    xhr.send();
    if (xhr.status == "404") {
        return false;
    } else {
        return true;
    }
}

function readTextFile(file) {
    let allText = '';
    let rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function () {
      if(rawFile.readyState === 4)  {
        if(rawFile.status === 200 || rawFile.status == 0) {
          allText = rawFile.responseText;
         }
      }
    }
    rawFile.send(null);
    return allText;
}

function getList() {
    if (setList.includes(true)) {
        for (let index = 0; index < setList.length; index++) {
            checkLength(setList[index], index);
        }
        length = paths.length;
        return true;
    } else {
        alert('Select a List');
        return false;
    }

}

function choosePicture() {
    if (document.getElementById('shuff').checked) {shuffle();}
    let icon = document.getElementById('icon');
    let character = Math.floor(Math.random() * length);
    let picturePath = paths[character];
    document.getElementById('playerCapt').innerText = names[character];
    picturePath = picturePath.substr(11, picturePath.length-1);
    icon.src = picturePath;
}

function darken(index) {
    const img = document.getElementById(index);
    if (img.className == 'black') {
        img.className ='red';
        img.style.filter = 'grayscale(1)';
        img.style.order = 10000;
        dark++;
    } else {
        img.className = 'black';
        img.style.filter = 'grayscale(0)';
        dark--;
        img.style.order = 0;
    }
    if (dark == paths.length) {
        endGame();
    }
}

function endGame() {
    let over = document.getElementById('over');
    over.innerHTML = '<button type="button" onclick="unyeet()">New Game</button>';
}

function startGame() {
    length = 0;
    setList = [];
    paths = [];
    document.getElementById('main').innerHTML = '';
    document.getElementById('over').innerHTML = '';
    // Check to see if any lists are selected
    for (let listItem = 0; listItem < allSets.length; listItem++) {
        setList[listItem] = document.getElementById(allSets[listItem]).checked;
    }
    if (getList()) {
        document.getElementById('setupP').style.display = 'none';
        choosePicture();
        let main = document.getElementById('main');
        for (let buildIndex = 0; buildIndex < paths.length; buildIndex++) {
            let figure = document.createElement('figure');
            figure.id = buildIndex;
            figure.setAttribute('class','black');
            figure.setAttribute('onclick','darken('+buildIndex+')')
            figure.innerHTML = '<img src="'+paths[buildIndex]+'" alt="no"><figcaption>'+names[buildIndex]+'</figcaption>';
            main.appendChild(figure);
        }
    }
}

function unyeet() {
    document.getElementById('setupP').style.display = 'flex';
    length = 0;
    setList = [];
    paths = [];
    document.getElementById('main').innerHTML = '';
    document.getElementById('icon').src = 'default.jpg';
    for (let listItem = 0; listItem < allSets.length; listItem++) {
        document.getElementById(allSets[listItem]).checked = false;
    }
    document.getElementById('over').innerHTML = '';
}

function shuffle() {
    let index = paths.length,
      randomIndex;
  
    // While there remain elements to shuffle.
    while (index != 0) {
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * index);
      index--;
  
      // And swap it with the current element.
      [paths[index], paths[randomIndex]] = [paths[randomIndex], paths[index]];
      [names[index], names[randomIndex]] = [names[randomIndex], names[index]];
    }
  
    return paths;
}

function hideProfile() {
    let icon = document.getElementById('gwiz');
    if (icon.style.opacity == '0') {
        icon.style.opacity = '1';
    } else {
        icon.style.opacity = '0';
    }
}