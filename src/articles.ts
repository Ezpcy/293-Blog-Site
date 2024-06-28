import hljs from 'highlight.js/lib/core';
import DOMPurify from 'dompurify';

export interface Articles {
    articles: Article[];
}

export interface Article {
    id: number;
    title: string;
    topics: string;
    html_file: string;
    author: string;
    author_image: string;
    banner: string;
    tags: string[];
    date: string;
    summary: string;
    likes: number;
    comments: Comment[];
}

export interface Comment {
  comment: string;
  date: string;
  author: string;
}

export async function fetchArticles():Promise<Articles> {
    const response = await fetch("../articles/articles.json");
    const data = await response.json();
    return data;
}

export async function fetchArticle(articleId:number):Promise<Article> {
    const response = await fetch("../articles/articles.json");
    const articles = await response.json() as Articles;
    console.log(articleId)
    const article = articles.articles.find(thisOne => thisOne.id === articleId)
    if (!article) {
        throw new Error('Article not found');
    }

    return article;
}
export async function addComment(articleId: number, newComment: Comment): Promise<Comment> {
    // Fetch the article first to get current comments using query parameter
    const response = await fetch("../articles/articles.json");
    const articles = await response.json() as Article;

    const article = articles; 
    const updatedComments = [...article.comments, newComment];

    const updateRequest = {
        method: 'PATCH', 
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ comments: updatedComments }),
    };

    const updateResponse = await fetch('http://localhost:3001/articles/' + articleId, updateRequest);
    if (!updateResponse.ok) {
        throw new Error(`Failed to update article. Status: ${updateResponse.status}`);
    }

    return newComment;
}
 
export async function addLike(articleId: number) {
    const response = await fetch('http://localhost:3001/articles/' + articleId);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const article = await response.json() as Article;
    if (!article) {
        throw new Error('Article not found');
    }

    const updatedLikes = article.likes + 1;


        const updateRequest = {
        method: 'PATCH', 
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ likes: updatedLikes }),    
    };

    const updateResponse = await fetch('http://localhost:3001/articles/' + articleId, updateRequest);
    if (!updateResponse.ok) {
        throw new Error(`Failed to update article. Status: ${updateResponse.status}`);
    }
}
 
export async function fetchByTopic(topic: string): Promise<Articles> {
    const response = await fetch("../articles/articles.json");
    if (topic === 'All') {
        const articles = await response.json() as Articles;
        return articles;
    } else {
    const articles = await response.json() as Articles;
    const filteredArticles = articles.articles.filter(article => article.topics === topic);
    return { articles: filteredArticles };
    }
}

export function createAndAppendArticle(article: Article, container: HTMLElement) {
    const articleElement = document.createElement('article');
    const articleLinkContainer = document.createElement('a');
    articleElement.className = 'article-card';
    articleLinkContainer.href = `./article.html?id=${article.id}`;
    articleElement.setAttribute('key', article.id.toString());

    const cardInner = document.createElement('div');
    cardInner.className = 'article-card-inner';

    const authorSection = document.createElement('div');
    authorSection.className = 'article-card-author';
    const authorImg = document.createElement('img');
    authorImg.src = article.author_image;
    authorImg.alt = 'author';
    authorImg.className = 'card-author';
    authorSection.appendChild(authorImg);

    const authorInfo = document.createElement('div');
    authorInfo.className = 'article-card-info';
    const authorName = document.createElement('p');
    authorName.textContent = article.author;
    const articleDate = document.createElement('p');
    articleDate.textContent = article.date.split(' ').slice(0, 2).join(' ');
    authorInfo.appendChild(authorName);
    authorInfo.appendChild(articleDate);
    authorSection.appendChild(authorInfo);
    cardInner.appendChild(authorSection);

    const articleInfo = document.createElement('div');
    articleInfo.className = 'article-info';

    const articleHeader = document.createElement('h4');
    articleHeader.className = 'article-card-header';
    const articleLink = document.createElement('a');
    articleLink.href = `./article.html?id=${article.id}`;
    articleLink.textContent = article.title;

    articleLinkContainer.appendChild(articleElement);
    articleHeader.appendChild(articleLink);
    articleInfo.appendChild(articleHeader);

    article.tags.forEach(tag => {
        const span = document.createElement('span');
        span.className = 'tag';
        span.textContent = `#${tag}`;
        articleInfo.appendChild(span);
    });

    const interactions = document.createElement('div');
    interactions.className = 'article-card-interactions';
    const likes = document.createElement('span');
    const hasLiked = localStorage.getItem(article.id.toString())
    likes.textContent = `❤️ ${ hasLiked ? article.likes+= 1 : article.likes}`;
    const comments = document.createElement('span');
    comments.textContent = `💬 ${article.comments.length} ${article.comments.length === 1 ? 'comment' : 'comments'}`;
    
    interactions.appendChild(likes);
    interactions.appendChild(comments);
    articleInfo.appendChild(interactions);
    cardInner.appendChild(articleInfo);
    articleElement.appendChild(cardInner);
    articleLinkContainer.appendChild(articleElement);
    container.appendChild(articleLinkContainer);
}

export function createAndAppendArticleContent(article: Article, articleSection: HTMLElement) {
    const articleElement = document.createElement('article');
    articleElement.className = 'single-article';

    const bannerContainer = document.createElement('div');
    bannerContainer.className = 'banner-container';
    const bannerImg = document.createElement('img');
    bannerImg.src = article.banner;
    bannerImg.alt = 'Banner';
    bannerImg.className = 'banner';
    bannerContainer.appendChild(bannerImg);

    const containerDiv = document.createElement('div');
    containerDiv.className = 'container';

    const authorDiv = document.createElement('div');
    authorDiv.className = 'article-card-author';
    const authorImg = document.createElement('img');
    authorImg.src = article.author_image;
    authorImg.alt = 'author';
    authorImg.className = 'card-author';

    const authorInfoDiv = document.createElement('div');
    authorInfoDiv.className = 'article-card-info';
    const authorNameP = document.createElement('p');
    authorNameP.textContent = article.author;
    const authorDateP = document.createElement('p');
    authorDateP.textContent = `Posted on ${article.date.split(' ').slice(0, 2).join(' ')}`;
    authorInfoDiv.appendChild(authorNameP);
    authorInfoDiv.appendChild(authorDateP);

    authorDiv.appendChild(authorImg);
    authorDiv.appendChild(authorInfoDiv);

    const tagsContent = document.createElement('div'); 
    tagsContent.className = 'tags-content';
    article.tags.forEach(tag => {
        const tagSpan = document.createElement('span');
        tagSpan.className = 'tag';
        tagSpan.textContent = `#${tag}`;
        tagsContent.appendChild(tagSpan);
    });

    const articleContentDiv = document.createElement('div');
    articleContentDiv.className = 'article-content';

    const interactionsDiv = document.createElement('div');
    interactionsDiv.className = 'likes-div';
    
    const likesSpan = document.createElement('span');
    likesSpan.className = 'likes-tag';
    likesSpan.id = 'like-button';
    likesSpan.innerHTML = `❤️ `;
    const likesCount = document.createElement('span');
    likesCount.textContent = article.likes.toString();
    likesCount.id = 'like-count';
    likesSpan.appendChild(likesCount);
    interactionsDiv.appendChild(likesSpan);
    containerDiv.appendChild(authorDiv);
    containerDiv.appendChild(tagsContent);
    containerDiv.appendChild(articleContentDiv);
    containerDiv.appendChild(interactionsDiv);
    articleElement.appendChild(bannerContainer);
    articleElement.appendChild(containerDiv);
    articleSection.appendChild(articleElement);

    const commentDiv = document.getElementById('comments') as HTMLElement;
    if (article.comments.length === 0) {
        const noComment = document.createElement('p');
        noComment.textContent = 'No comments yet, be the first to comment!';
        commentDiv.appendChild(noComment);
    } else {
        article.comments.reverse().forEach(comment => {
            const commenParentDiv = document.createElement('div');
            commenParentDiv.className = 'comment-parent';
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
            commentAuthor.textContent = comment.author;
            const commentDate = document.createElement('p');
            commentDate.className = 'comment-date';
            commentDate.textContent = comment.date.split(' ').slice(0, 2).join(' ').replace(",", "");
            const commentContent = document.createElement('p');
            commentContent.className = 'comment-content';
            commentContent.textContent = comment.comment;
            authorBanner.appendChild(commentAuthorBanner);
            authorInfo.appendChild(commentAuthor);
            authorInfo.appendChild(commentDate);
            commentElement.appendChild(authorInfo);
            commentElement.appendChild(commentContent);
            commentDiv.appendChild(authorBanner);
            commentDiv.appendChild(commentElement);
            commenParentDiv.appendChild(authorBanner);
            commenParentDiv.appendChild(commentElement);
            commentDiv.appendChild(commenParentDiv);
        });
    }

    fetch(article.html_file)
        .then(response => response.text())
        .then(html => {
            // Sanitize the fetched HTML
            const cleanHtml = DOMPurify.sanitize(html);

            // Use the sanitized HTML
            articleContentDiv.innerHTML = cleanHtml;

            // Apply syntax highlighting to <pre> blocks
            document.querySelectorAll('pre code').forEach((block) => {
                hljs.highlightElement(block as HTMLElement);
            });
        });
    }

