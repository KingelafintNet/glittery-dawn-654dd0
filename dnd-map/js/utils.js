export { rgbToHex };
function rgbToHex(rgbStr) {
    const [r, g, b] = rgbStr.match(/\d+/g).map(Number);

    return "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("");
}
