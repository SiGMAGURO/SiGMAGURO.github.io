class HomePage {
    constructor() {
        this.gameListContainer = document.querySelector('.game-list');
        this.currentLang = window.parent.document.documentElement.getAttribute('data-lang') || 'en';
        this.init();
        this.updateAboutContent(this.currentLang);
        
        window.addEventListener('message', (event) => {
            if (event.data.type === 'languageChange') {
                this.currentLang = event.data.lang;
                this.init();
                this.updateAboutContent(this.currentLang);
            }
        });
    }

    updateAboutContent(lang) {
        document.querySelectorAll('.about-content').forEach(content => {
            content.classList.remove('active');
        });

        const currentContent = document.querySelector(`.about-content[data-lang="${lang}"]`);
        if (currentContent) {
            currentContent.classList.add('active');
        }
    }

    async init() {
        try {
            const response = await fetch('../HomePage/gamelist.json');
            const data = await response.json();
            this.renderGames(data.games);
        } catch (error) {
            console.error('Error loading game list:', error);
        }
    }

    renderGames(games) {
        this.gameListContainer.innerHTML = '';
        games.forEach(game => {
            const gameElement = document.createElement('div');
            gameElement.className = 'game-item';
            
            gameElement.innerHTML = `
                <div class="game-header">
                    <div class="game-name">${game.name[this.currentLang]}</div>
                    <div class="game-date">${game.date}</div>
                </div>
                <div class="game-content">
                    <div class="game-thumbnail">
                        <img src="${game.thumbnail}" alt="${game.name[this.currentLang]}">
                    </div>
                    <div class="game-links">
                        ${this.createLinksHtml(game.links)}
                    </div>
                </div>
            `;
            
            this.gameListContainer.appendChild(gameElement);
        });
    }

    createLinksHtml(links) {
        if (!links || links.text === "In preparation") {
            const text = this.currentLang === 'zh' ? '準備中' :
                        this.currentLang === 'ja' ? '準備中' : 'In preparation';
            return `<span class="coming-soon">${text}</span>`;
        }

        try {
            const linkTexts = links.text.split(' | ');
            const hrefs = links.hrefs || [];
            
            if (linkTexts.length !== hrefs.length) {
                console.warn(`Links mismatch for text: ${links.text}`);
                return '<span class="coming-soon">Links unavailable</span>';
            }

            return linkTexts
                .map((text, index) => {
                    const href = hrefs[index];
                    if (!href) return text;
                    return `<a href="${href}" target="_blank" rel="noopener noreferrer">${text}</a>`;
                })
                .join('');
        } catch (error) {
            console.error('Error creating links:', error);
            return '<span class="coming-soon">Error loading links</span>';
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.homePage = new HomePage();
}); 