"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const articles_1 = require("./articles");
function toggleMenu() {
    const menu = document.getElementById('mobile-menu-list');
    const line1 = document.getElementById('line1');
    const line2 = document.getElementById('line2');
    const line3 = document.getElementById('line3');
    const allLines = [line1, line2, line3];
    (menu === null || menu === void 0 ? void 0 : menu.style.maxHeight) === '0px' ? (menu.style.maxHeight = '500px'
        , line1.style.transform = 'rotate(45deg)'
        , line2.style.display = 'none'
        , line3.style.transform = 'rotate(-45deg)',
        allLines.forEach(line => line.style.margin = '-1px')) : (menu.style.maxHeight = '0px'
        , line1.style.transform = 'rotate(0deg)'
        , line2.style.display = 'block'
        , line3.style.transform = 'rotate(0deg)'
        , line3.style.transform = 'translateY(0px)',
        allLines.forEach(line => line.style.margin = '3px'));
}
document.addEventListener('DOMContentLoaded', () => {
    const menuButton = document.getElementById('toggleMenu');
    menuButton === null || menuButton === void 0 ? void 0 : menuButton.addEventListener('click', () => {
        toggleMenu();
    });
    const latestSection = document.getElementById('latestArticles');
    if (latestSection) {
        (0, articles_1.fetchArticles)().then((articles) => {
            articles.articles.slice(0, 6).forEach(article => {
                latestSection.innerHTML += `
                        <article class="article-card">
                        <div class="article-card-inner">
                            <div class="article-card-author">
                            <img src="${article.author_image}" alt="author" class="card-author" />
                            <div class="article-card-info">
                                <p>${article.author}</p>
                                <p>${article.date.split(' ').slice(0, 2).join(' ')}</p>
                            </div>
                            </div>
                            <div class="article-info">
                            <h4 class="article-card-header">
                                ${article.title}
                            </h4>
                            ${article.tags.map(tag => `<span class="tag">#${tag}</span>`).join('')}
                            <div class="article-card-interactions">
                                <span>❤️ ${article.likes}</span>
                                <span>💬 ${article.likes} ${article.likes === 1 ? `comment` : `comments`}</span>
                            </div>
                            </div>
                        </div>
                        </article>
                        `;
            });
        });
    }
});
