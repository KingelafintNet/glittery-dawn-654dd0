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
