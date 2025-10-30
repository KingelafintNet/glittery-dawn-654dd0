let didWeLoadBois = false;

function createMediaAndCookies() {
    document.getElementById('addShow').style.display = 'none';
    let name = String(document.getElementById('name').value);
    let desc = String(document.getElementById('desc').value);
    let light = String(document.getElementById('light').value);
    let img = String(document.getElementById('img').value);
    let id = String(document.getElementById('id').value);
    let ids = getCookie("ids");
    let weCanDoThisBois = true;

    if (ids != "") {
        ids = ids.split(',')
        for (let index = 0; index < ids.length; index++) {
            if (id == ids[index]) {
                weCanDoThisBois = false;
                alert("That ID has been used. Please choose something else");
                break;
            }
        }
        if (weCanDoThisBois) {
            setCookie("ids",id+","+getCookie("ids"),100);
        }
    } else {
        setCookie("ids",id,100);
    }
    if (weCanDoThisBois) {
        setCookie(id+"name",name,100);
        setCookie(id+"desc",desc,100);
        setCookie(id+"light",light,100);
        setCookie(id+"img",img,100);
        displayMedia(name,desc,light,img,id);
    }
}

function removeShow(id) {
    let main = document.getElementById('main');
    console.log("Main does exsist");
    if (main.hasChildNodes()) {
        console.log("Main does have children");
        console.log(id);      
        main.removeChild(document.getElementById(id));
        console.log("Child Neutralized");
    }
    setCookie(id+"name","",0);
    setCookie(id+"desc","",0);
    setCookie(id+"light","",0);
    setCookie(id+"img","",0);
    let ids = getCookie("ids");
    const index = ids.indexOf(id+',');
    if (ids == id) {
        setCookie("ids","",100);
    }
    setCookie("ids",ids.slice(0, index) + ids.slice(index + (id+',').length),100);
}

function addShow() {
    document.getElementById('addShow').style.display = 'flex';
}

function loadMedia() {
    let rawids = getCookie("ids");
    let ids = rawids.split(',');
    if (ids != "" && !didWeLoadBois) {
        for (let index = 0; index < ids.length; index++) {
            const id = ids[index];
            displayMedia(getCookie(id+"name"),getCookie(id+"desc"),getCookie(id+"light"),getCookie(id+"img"),id);
        }
    }
}

function displayMedia(name,desc,light,img,id) {
    let main = document.getElementById("main");
    let newEntry = document.createElement("div");
    let betterID = "'"+id+"'";
    newEntry.className = "entry";
    newEntry.id = id;
    newEntry.innerHTML = '<div class="imgCon"><img src="'+img+'" alt=""></div><div class="description"><h1>'+name+' <br><span>recommended by: '+light+'</span></h1><p>'+desc+'</p><button type="button" onclick="removeShow('+betterID+')">Remove Media</button></div>';
    main.appendChild(newEntry);
}

function setCookie(cname,cvalue,exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
function clearMedia() {
    let rawids = getCookie("ids");
    let ids = rawids.split(',');
    for (let i = 0; i < ids.length; i++) {
        let id = ids[i];
        setCookie(id+"name","",0);
        setCookie(id+"desc","",0);
        setCookie(id+"light","",0);
        setCookie(id+"img","",0);
    }
    setCookie("ids","",0)
    document.getElementById("main").innerHTML = "";
}
window.onload(loadMedia());