"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function toggleMenu() {
    var menu = document.getElementById('mobile-menu-list');
    var line1 = document.getElementById('line1');
    var line2 = document.getElementById('line2');
    var line3 = document.getElementById('line3');
    var allLines = [line1, line2, line3];
    (menu === null || menu === void 0 ? void 0 : menu.style.maxHeight) === '0px' ? (menu.style.maxHeight = '500px'
        , line1.style.transform = 'rotate(45deg)'
        , line2.style.display = 'none'
        , line3.style.transform = 'rotate(-45deg)',
        allLines.forEach(function (line) { return line.style.margin = '-1px'; })) : (menu.style.maxHeight = '0px'
        , line1.style.transform = 'rotate(0deg)'
        , line2.style.display = 'block'
        , line3.style.transform = 'rotate(0deg)'
        , line3.style.transform = 'translateY(0px)',
        allLines.forEach(function (line) { return line.style.margin = '3px'; }));
}
document.addEventListener('DOMContentLoaded', function () {
    toggleMenu();
    console.log("object");
});
