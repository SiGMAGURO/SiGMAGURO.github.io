class ImageDisplay {
    constructor() {
        this.container = document.querySelector('.image-container');
        if (!this.container) {
            console.error('Image container not found');
            return;
        }
        this.modal = document.querySelector('.image-modal');
        this.modalImg = document.querySelector('.modal-content');
        this.closeModal = document.querySelector('.close-modal');
        this.prevButton = document.querySelector('.prev-button');
        this.nextButton = document.querySelector('.next-button');
        this.images = [];
        this.currentIndex = 0;
        this.intervalId = null;
        this.isPaused = false;
        this.isButtonHovered = false;

        this.init();
    }

    async init() {
        try {
            // modify path to fit iframe environment
            const response = await fetch('../Textures/Display/manifest.json');
            const imageList = await response.json();
            this.images = imageList.images;
            console.log("Loading images:", this.images);

            this.loadImages();
            this.setupEventListeners();
            this.startAutoPlay();
        } catch (error) {
            console.error('Error initializing display:', error);
        }
    }

    loadImages() {
        if (!this.container) return;
        
        this.container.innerHTML = '';
        this.images.forEach((src, index) => {
            const img = document.createElement('img');
            // modify path to fit iframe environment
            img.src = `../Textures/Display/${src}`;
            img.classList.add('display-image');
            img.onerror = () => console.error(`Failed to load image: ${src}`);
            img.onload = () => console.log(`Loaded image: ${src}`);
            this.container.appendChild(img);
        });
        this.updatePosition();
    }

    setupEventListeners() {
        // mouse hover pause
        this.container.addEventListener('mouseenter', () => {
            this.isPaused = true;
            clearInterval(this.intervalId);
        });

        // mouse leave resume
        this.container.addEventListener('mouseleave', () => {
            if (!this.isButtonHovered) {  // Only resume if buttons aren't hovered
                this.isPaused = false;
                this.startAutoPlay();
            }
        });

        // Add button hover handling
        [this.prevButton, this.nextButton].forEach(button => {
            button.addEventListener('mouseenter', () => {
                this.isButtonHovered = true;
                this.isPaused = true;
                clearInterval(this.intervalId);
            });

            button.addEventListener('mouseleave', () => {
                this.isButtonHovered = false;
                if (!this.container.matches(':hover')) {  // Only resume if container isn't hovered
                    this.isPaused = false;
                }
            });
        });

        // navigate buttons
        this.prevButton.addEventListener('click', () => this.navigate(-1));
        this.nextButton.addEventListener('click', () => this.navigate(1));

        // click image to enlarge
        this.container.addEventListener('click', (e) => {
            if (e.target.classList.contains('display-image')) {
                this.modalImg.src = e.target.src;
                this.modal.style.display = 'block';
            }
        });

        // close enlarged image
        this.closeModal.addEventListener('click', () => {
            this.modal.style.display = 'none';
        });
    }

    startAutoPlay() {
        if (!this.isPaused) {
            this.intervalId = setInterval(() => this.navigate(1), 5000);
        }
    }

    navigate(direction) {
        this.currentIndex = (this.currentIndex + direction + this.images.length) % this.images.length;
        this.updatePosition();
    }

    updatePosition() {
        this.container.style.transform = `translateX(-${this.currentIndex * 100}%)`;
    }
}

// wait for DOM content loaded
document.addEventListener('DOMContentLoaded', () => {
    new ImageDisplay();
}); 