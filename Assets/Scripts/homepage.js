class HomePage {
    constructor() {
        this.gameListContainer = document.querySelector('.game-list');
        this.currentLang = 'en'; // Default language
        
        window.addEventListener('message', (event) => {
            try {
                if (event.data.type === 'init') {
                    this.currentLang = event.data.lang;
                    this.init();
                    this.updateAboutContent(this.currentLang);
                } else if (event.data.type === 'languageChange') {
                    this.currentLang = event.data.lang;
                    this.init();
                    this.updateAboutContent(this.currentLang);
                }
            } catch (error) {
                console.warn('Message handling error:', error);
                // Use browser language as fallback
                this.currentLang = navigator.language.startsWith('zh') ? 'zh' :
                                 navigator.language.startsWith('ja') ? 'ja' : 'en';
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
            console.log('Current game:', game); // check each game object
            console.log('Date value:', game.date); // check date value
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
        if (!links || links.text === "Preparing") {
            const text = this.currentLang === 'zh' ? '準備中' :
                        this.currentLang === 'ja' ? '準備中' : 'Preparing';
            return `<span class="show-link">${text}</span>`;
        }

        try {
            const linkTexts = links.text.split(' | ');
            const hrefs = links.hrefs || [];
            
            if (linkTexts.length !== hrefs.length) {
                console.warn(`Links mismatch for text: ${links.text}`);
                return '<span class="show-link">Links unavailable</span>';
            }

            return linkTexts
                .map((text, index) => {
                    const href = hrefs[index];
                    if (!href) return text;
                    return `<a href="${href}" target="_blank" rel="noopener noreferrer">${text}</a>`;
                })
                .join('\n');
        } catch (error) {
            console.error('Error creating links:', error);
            return '<span class="show-link">Error loading links</span>';
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.homePage = new HomePage();
}); 