
import { fetchArticles, fetchArticle, Article, Articles, createAndAppendArticle, createAndAppendArticleContent, fetchByTopic } from "./articles";
import hljs from 'highlight.js/lib/core';
import rust from 'highlight.js/lib/languages/rust';
import shell from 'highlight.js/lib/languages/shell';
import html from 'highlight.js/lib/languages/xml';
import json from 'highlight.js/lib/languages/json';
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import bash from 'highlight.js/lib/languages/bash';

hljs.registerLanguage('rust', rust);
hljs.registerLanguage('shell', shell);
hljs.registerLanguage('html', html);
hljs.registerLanguage('json', json);
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('bash', bash);

function toggleMenu(isMenuOpen: boolean): boolean {
    const menu: HTMLElement | null = document.getElementById('mobile-menu-list');
    const line1: HTMLElement | null = document.getElementById('line1');
    const line2: HTMLElement | null = document.getElementById('line2');
    const line3: HTMLElement | null = document.getElementById('line3');
    const allLines: HTMLElement[] = [line1!, line2!, line3!];

    if (!isMenuOpen) {
        menu!.style.maxHeight = '500px';
        line1!.style.transform = 'rotate(45deg)';
        line2!.style.display = 'none';
        line3!.style.transform = 'rotate(-45deg)';
        allLines.forEach(line => line.style.margin = '-1px');
    } else {
        menu!.style.maxHeight = '0px';
        line1!.style.transform = 'rotate(0deg)';
        line2!.style.display = 'block';
        line3!.style.transform = 'rotate(0deg)';
        line3!.style.transform = 'translateY(0px)';
        allLines.forEach(line => line.style.margin = '3px');
    }
    return !isMenuOpen; 
}

document.addEventListener('DOMContentLoaded', () => {

    localStorage.removeItem('topic');
    
    const menu: HTMLElement | null = document.getElementById('mobile-menu-list');
    // Check if the menu is visible by inspecting its maxHeight property.
    let isMenuOpen: boolean | null = menu ? menu.style.maxHeight === '500px' : null;
    const menuButton: HTMLElement | null = document.getElementById('toggleMenu');
    menuButton?.addEventListener('click', () => {
        isMenuOpen = toggleMenu(isMenuOpen!); // Update the isMenuOpen variable based on the returned value
    });

    // Latest Articles for the homepage
    const latestSection: HTMLElement | null = document.getElementById('latestArticles');
    if (latestSection) {
        fetchArticles().then((articles: Articles) => {
            latestSection!.innerHTML = ''; // Clear the section before adding new content
            if (!articles) {
                const errorElement = document.createElement('h1');
                errorElement.textContent = 'No articles found';
                latestSection.appendChild(errorElement);
                return;
            }
            const latestArticles = articles.articles.reverse().slice(0, 3);
            latestArticles.map(article => {
                createAndAppendArticle(article, latestSection);
            });
        });
        const rustTopics = document.getElementById('rust-topic-link') as HTMLElement;
        const webDevTopics = document.getElementById('webdev-topic') as HTMLElement;

        rustTopics.addEventListener('click', () => {
            localStorage.setItem('topic', 'Rust');
            localStorage.removeItem('currentPage');
        });

        webDevTopics.addEventListener('click', () => {
            localStorage.setItem('topic', 'WebDev');
            localStorage.removeItem('currentPage');
        });

    }


    // Single Article Page
    const articleSection: HTMLElement | null = document.getElementById('current-article');

    if (articleSection) {
        const lightThemeLink: HTMLLinkElement= document.getElementById('lightTheme') as HTMLLinkElement;
        const darkThemeLink: HTMLLinkElement = document.getElementById('darkTheme') as HTMLLinkElement;
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            darkThemeLink.disabled = false;
            lightThemeLink.disabled = true;
        }

        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
            const darkModeOn = e.matches;
            darkThemeLink.disabled = !darkModeOn;
            lightThemeLink.disabled = darkModeOn;
        });
        const  urlParams = new URLSearchParams(window.location.search);
        const articleId = urlParams.get('id');
        if (!articleId) {
            articleSection.innerHTML = '<h1>Article not found</h1>';
            return;
        }
        const articleIdNumber = parseInt(articleId);
        fetchArticle(articleIdNumber).then((article: Article) => {
            articleSection.innerHTML = ''; // Clear the section before adding new content
            const hasLiked = localStorage.getItem(articleIdNumber.toString())



            if (article) {
                createAndAppendArticleContent(article, articleSection); 
                const likesElement = document.getElementById('like-button') as HTMLElement;

                if (likesElement) {
                    let likes = article.likes;
                    const likeButton = document.getElementById('like-button') as HTMLElement;
                    if (hasLiked) {
                        likeButton.style.opacity = "0.8"
                        likes++;
                        likesElement.textContent = "❤️ " +likes.toString();
                    } else {
                        likeButton.addEventListener('click', (e) => {
                            e.preventDefault();
                            likes++;
                            likesElement.textContent = "❤️ " +likes.toString();
                            //localStorage.setItem(articleIdNumber.toString(), 'true');
                            likeButton.style.pointerEvents = 'none'
                            likeButton.style.opacity = '0.8';
                            localStorage.setItem(articleIdNumber.toString(), 'true');
                        })
                    }
                }
            }
        });
    }
    
    const newsletterForm = document.getElementById('newsletter-form') as HTMLFormElement;
    const messageDiv = document.getElementById('message') as HTMLElement;
    if (newsletterForm && messageDiv) {
    newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = newsletterForm.email.value;
            if (!email) {
                messageDiv.textContent = 'Please enter a valid email address';
                return;
            }
            messageDiv.textContent = 'Subscribing...';
            setTimeout(() => {
                messageDiv.textContent = 'Subscribed!';
            }, 1000);
        });
    }

    const commentForm: HTMLFormElement = document.getElementById('comment-form') as HTMLFormElement;
    if (commentForm) {
        commentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const author  = commentForm.author.value;
            const comment = commentForm.commentText.value;
 
            const commentDiv = document.getElementById('comments') as HTMLElement;
            const commentParentDiv = document.createElement('div');
            commentParentDiv.className = 'comment-parent';
            const authorBanner = document.createElement('div');
            const commentElement = document.createElement('div');
            const authorInfo = document.createElement('div');
            authorInfo.className = 'author-info';
            commentElement.className = 'comment';
            authorBanner.className = 'author-banner';
            const commentAuthorBanner = document.createElement('img');
            commentAuthorBanner.src = "../images/profile.png"
            commentAuthorBanner.alt = 'author';
            commentAuthorBanner.className = 'comment-author-banner';
            const commentAuthor = document.createElement('p');
            commentAuthor.className = 'comment-author';
            commentAuthor.textContent = author;
            const commentDate = document.createElement('p');
            commentDate.className = 'comment-date';
            
            const options: Intl.DateTimeFormatOptions = { month: 'short', day: '2-digit', year: 'numeric'};
            const dates = new Date();
            commentDate.textContent = dates.toLocaleDateString("en-US", options); 

            const commentContent = document.createElement('p');
            commentContent.className = 'comment-content';
            commentContent.textContent = comment;
            authorBanner.appendChild(commentAuthorBanner);
            authorInfo.appendChild(commentAuthor);
            authorInfo.appendChild(commentDate);
            commentElement.appendChild(authorInfo);
            commentElement.appendChild(commentContent);
            commentParentDiv.appendChild(authorBanner);
            commentParentDiv.appendChild(commentElement);
            commentDiv.insertBefore(commentParentDiv, commentDiv.firstChild);

            commentForm.reset();
        });
    }    

    const allArticleSection = document.getElementById("all-articles");
    if (!allArticleSection) {
        localStorage.setItem('currentPage', '1');
        localStorage.removeItem('topic');
    }
    if(allArticleSection) {
    

        const topicFilter = document.getElementById('topic-filter') as HTMLSelectElement;
        const topics = ["All", "Rust", "WebDev"]
        const topic = localStorage.getItem('topic');
        topics.forEach(topica => {
            const option = document.createElement('option');
            option.id = "topicOption";
            option.value = topica;
            option.textContent = topica;
            topicFilter.appendChild(option);
            if (topic && topica === topic) {
                option.className = 'active-filter';
            }

            if (!topic && topica === "All") {
                option.className = 'active-filter';
            }
            option.addEventListener('click', () => {
                localStorage.setItem('currentPage', '1');
                localStorage.setItem('topic', topica);
                /* clear url */
                window.location.reload();
                option.className = 'active-filter';
                }
            );
        });
        
        fetchByTopic(localStorage.getItem("topic") || "All").then((articles: Articles) => {

            allArticleSection.innerHTML = ''; // Clear the section before adding new content
            if (!articles) {
                const errorElement = document.createElement('h1');
                errorElement.textContent = 'No articles found';
                allArticleSection.appendChild(errorElement);
                return;
            }
            const articleCount = articles.articles.length;
            const pages = Math.ceil(articleCount / 6);
            const pagination = document.getElementById('pagination');
            const currentPage = localStorage.getItem('currentPage');
            if (pagination) {
                for (let i = 1; i <= pages; i++) {
                    const pageLink = document.createElement('li');
                    if (currentPage && parseInt(currentPage) === i) {
                        pageLink.className = 'active-page';
                    }
                    pageLink.textContent = i.toString();
                    pageLink.addEventListener('click', () => {
                        localStorage.setItem('currentPage', i.toString());
                        window.location.reload();
                    });
                    pagination.appendChild(pageLink);
                }
            }
            const currentPageNumber = parseInt(currentPage || '1');
            const start = (currentPageNumber - 1) * 6;
            const end = currentPageNumber * 6;
            const currentArticles = articles.articles.slice(start, end);
            currentArticles.map(article => {
                createAndAppendArticle(article, allArticleSection);
            });
        });
    }

    const contactForm = document.getElementById('contact-form') as HTMLFormElement;
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const topic = contactForm.topic.value;
            const name = contactForm.names.value
            const email = contactForm.email.value;
            const message = contactForm.messagea.value;
            const messageDiv = document.getElementById('messages') as HTMLElement;
            if ( !topic || !name || !email || !message) {
                messageDiv.textContent = 'Please fill out all fields';
                return;
            }
            messageDiv.textContent = 'Sending...';
            setTimeout(() => {
                contactForm.reset();
                messageDiv.textContent = 'Message sent!';
            }, 1000);
        });
    }
});
