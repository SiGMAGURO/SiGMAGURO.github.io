class GameList {
    constructor() {
        this.container = document.querySelector('.game-list');
        this.init();
    }

    async init() {
        try {
            const response = await fetch('../GameList/gamelist.json');
            const data = await response.json();
            this.renderGames(data.games);
        } catch (error) {
            console.error('Error loading game list:', error);
        }
    }

    renderGames(games) {
        games.forEach(game => {
            const gameElement = document.createElement('div');
            gameElement.className = 'game-item';
            
            gameElement.innerHTML = `
                <div class="game-header">
                    <div class="game-name">${game.name}</div>
                    <div class="game-date">${game.date}</div>
                </div>
                <div class="game-content">
                    <div class="game-thumbnail">
                        <img src="${game.thumbnail}" alt="${game.name}">
                    </div>
                    <div class="game-links">
                        ${this.createLinksHtml(game.links)}
                    </div>
                </div>
            `;
            
            this.container.appendChild(gameElement);
        });
    }

    createLinksHtml(links) {
        if (!links || links.text === "Coming soon") {
            return '<span class="coming-soon">Coming soon</span>';
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
    new GameList();
}); 