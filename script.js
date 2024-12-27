document.addEventListener('DOMContentLoaded', async () => {
    const langBtn = document.getElementById('langBtn');
    const langMenu = document.getElementById('langMenu');
    const homeLink = document.getElementById('homeLink');
    let isMenuOpen = false;

    // Scroll to top with smooth animation
    homeLink.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Toggle menu display
    function toggleMenu() {
        if (!isMenuOpen) {
            langMenu.classList.add('show');
            isMenuOpen = true;
        } else {
            closeMenu();
        }
    }

    // Close menu with fade out
    function closeMenu() {
        if (isMenuOpen) {
            langMenu.classList.remove('show');
            isMenuOpen = false;
        }
    }

    // Handle language selection
    function handleLanguageSelect(lang) {
        document.documentElement.lang = lang;
        closeMenu();
        // Add additional language switching logic here
    }

    // Event listeners
    langBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu();
    });

    document.addEventListener('click', (e) => {
        if (!langMenu.contains(e.target)) {
            closeMenu();
        }
    });

    document.querySelectorAll('.lang-option').forEach(option => {
        option.addEventListener('click', (e) => {
            handleLanguageSelect(e.target.dataset.lang);
        });
    });

    // Content switching handlers
    const contentHandlers = {
        'home_link': showContent.bind(null, 'intro-content'),
        'twitter_link': showContent.bind(null, 'twitter-content'),
        'ci-en_link': showContent.bind(null, 'cien-content'),
        'facebook_link': showContent.bind(null, 'facebook-content'),
        'youtube_link': showContent.bind(null, 'youtube-content'),
        'email_link': showContent.bind(null, 'email-content')
    };

    // Add click handlers for all content links
    Object.entries(contentHandlers).forEach(([id, handler]) => {
        document.getElementById(id).addEventListener('click', (e) => {
            e.preventDefault();
            handler();
        });
    });

    // Initialize content containers
    const contentDiv = document.getElementById('content');
    contentDiv.innerHTML = `
        <div id="intro-content" class="intro-section">
            <section class="game-dev">
                <h2>Current Projects</h2>
                <div class="game-list">
                    <!-- Game projects will be dynamically added here -->
                </div>
            </section>
            
            <section class="team-intro">
                <h2>About Us</h2>
                <div class="team-description">
                    <!-- Team introduction content -->
                </div>
            </section>
            
            <section class="team-members">
                <h2>Our Team</h2>
                <div class="member-list">
                    <!-- Team member list will be dynamically added here -->
                </div>
            </section>
        </div>
        <div id="twitter-content" class="twitter-embed" style="display: none;">
            <a class="twitter-timeline" 
               href="https://twitter.com/SiGMAGURO"
               data-chrome="noheader nofooter noborders transparent"
               data-tweet-limit="10"
               data-conversation="none"
               data-link-color="#5fc3e5"
               data-media-preview="true"
               data-theme="light"
               data-dnt="true">
            </a>
        </div>
        <div id="cien-content" class="cien-embed" style="display: none;">
            <iframe 
                src="https://ci-en.dlsite.com/creator/18092/article?mode=detail"
                allowfullscreen>
            </iframe>
        </div>
        <div id="facebook-content" class="facebook-embed" style="display: none;">
            <div class="iframe-container">
                <iframe 
                    src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fprofile.php%3Fid%3D61558566783982&tabs=timeline&width=500&height=800&small_header=true&adapt_container_width=true&hide_cover=false&show_facepile=false"
                    scrolling="no"
                    frameborder="0"
                    allowfullscreen="true"
                    allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share">
                </iframe>
            </div>
        </div>
        <div id="youtube-content" class="youtube-embed" style="display: none;">
            <div class="videos-container">
                <div class="video-wrapper">
                    <iframe 
                        src="https://www.youtube.com/embed?listType=playlist&list=PLgdRPeSGM0EDf81XOd2o1FrWq2PKHsUQg"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowfullscreen>
                    </iframe>
                </div>
                <div class="video-wrapper">
                    <iframe 
                        src="https://www.youtube.com/embed?listType=playlist&list=PLgdRPeSGM0EB2yhW5h943osWg3lj9zk3C"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowfullscreen>
                    </iframe>
                </div>
            </div>
        </div>
    `;

    // Load Twitter widget
    await loadTwitterWidget();

    // Load Facebook SDK
    loadExternalScript("https://connect.facebook.net/zh_TW/sdk.js#xfbml=1&version=v21.0");

    // Load external script with error handling
    function loadExternalScript(src, attributes = {}) {
        return new Promise((resolve, reject) => {
            try {
                const script = document.createElement('script');
                script.src = src;
                
                // Add security attributes
                script.setAttribute('crossorigin', 'anonymous');
                script.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');
                
                // Add error handling
                script.onerror = (error) => {
                    console.warn(`Failed to load script: ${src}`, error);
                    resolve(); // Don't reject to keep the site running
                };
                
                script.onload = resolve;
                
                // Add custom attributes
                Object.entries(attributes).forEach(([key, value]) => {
                    script.setAttribute(key, value);
                });
                
                document.head.appendChild(script);
            } catch (error) {
                console.warn(`Error while loading script: ${src}`, error);
                resolve(); // Don't reject to keep the site running
            }
        });
    }

    // 修改Twitter腳本加載
    async function loadTwitterWidget() {
        try {
            await loadExternalScript('https://platform.twitter.com/widgets.js', {
                async: true,
                charset: 'utf-8',
                onerror: (error) => {
                    console.warn('Twitter widget failed to load:', error);
                }
            });
            
            // 等待Twitter時間軸加載完成
            if (window.twttr) {
                await window.twttr.ready();
            }
        } catch (error) {
            console.error('Failed to load Twitter widget:', error);
        }
    }

    async function showContent(contentId) {
        const allContents = document.querySelectorAll('[id$="-content"]');
        const currentContent = Array.from(allContents).find(el => el.style.display === 'block');
        
        try {
            // 淡出當前內容
            if (currentContent) {
                currentContent.style.opacity = '0';
                await new Promise(resolve => setTimeout(resolve, 300));
                currentContent.style.display = 'none';
            }

            // 準備新內容
            let newElement = document.getElementById(contentId);
            if (!newElement) {
                newElement = document.createElement('div');
                newElement.id = contentId;
                newElement.className = contentId;
                document.getElementById('content').appendChild(newElement);

                // 載入對應內容
                try {
                    switch(contentId) {
                        case 'intro-content':
                            const introResponse = await fetch('./home.html');
                            if (!introResponse.ok) {
                                throw new Error(`HTTP error! status: ${introResponse.status}`);
                            }
                            const introHtml = await introResponse.text();
                            newElement.innerHTML = introHtml;
                            break;
                        case 'email-content':
                            const emailResponse = await fetch('./email.html');
                            if (!emailResponse.ok) {
                                throw new Error(`HTTP error! status: ${emailResponse.status}`);
                            }
                            const emailHtml = await emailResponse.text();
                            newElement.innerHTML = emailHtml;
                            requestAnimationFrame(() => {
                                console.log('Initializing email form...');
                                initEmailForm();
                            });
                            break;
                        default:
                            newElement.innerHTML = getContentHTML(contentId);
                    }
                } catch (error) {
                    console.error(`Error loading ${contentId}:`, error);
                    newElement.innerHTML = `
                        <div class="error-container">
                            <h2>載入失敗</h2>
                            <p>很抱歉，內容載入失敗。請確保您使用的是支援的瀏覽器並通過HTTP/HTTPS訪問。</p>
                            <p>錯誤詳情：${error.message}</p>
                        </div>
                    `;
                }
            }

            // 顯示新內容
            newElement.style.display = 'block';
            newElement.offsetHeight; // Force reflow
            newElement.style.opacity = '1';
        } catch (error) {
            console.error('Error in content switching:', error);
        }
    }

    // Helper function to get content HTML
    function getContentHTML(contentId) {
        switch(contentId) {
            case 'twitter-content':
                return `<div class="twitter-embed">
                    <a class="twitter-timeline" 
                       href="https://twitter.com/SiGMAGURO"
                       data-chrome="noheader nofooter noborders transparent"
                       data-tweet-limit="10"
                       data-conversation="none"
                       data-link-color="#5fc3e5"
                       data-media-preview="true"
                       data-theme="light"
                       data-dnt="true">
                    </a>
                </div>`;
            // ... other cases
            default:
                return '';
        }
    }

    // Show home content by default
    showContent('intro-content');

    // Add blur effect on panel hover
    const panels = document.querySelectorAll('.panel');
    panels.forEach(panel => {
        panel.addEventListener('mouseenter', () => {
            document.body.classList.add('blur-background');
        });
        
        panel.addEventListener('mouseleave', () => {
            document.body.classList.remove('blur-background');
        });
    });

    // Toggle emoji balls
    let ballsActive = true;
    let ballsInstance = null;

    class EmojiBall {
        constructor(emoji, container, mousePos, balls) {
            this.element = document.createElement('div');
            this.element.className = 'emoji-ball';
            this.element.textContent = emoji;
            container.appendChild(this.element);

            this.mousePos = mousePos;
            this.balls = balls;
            this.updateSize();
            
            // Random initial position
            this.x = Math.random() * (window.innerWidth - this.size);
            this.y = Math.random() * (window.innerHeight - this.size);
            
            // Random initial velocity
            this.vx = (Math.random() - 0.5) * 5;
            this.vy = (Math.random() - 0.5) * 5;
            
            // Initial rotation
            this.rotation = Math.random() * 360;
            this.angularVelocity = (Math.random() - 0.5) * 20;

            this.update();
        }

        updateSize() {
            // Store old size for position adjustment
            const oldSize = this.size || 0;
            
            // Update ball size based on current viewport
            this.size = Math.min(window.innerWidth, window.innerHeight) * 0.1;
            this.collisionSize = this.size * 0.75;

            // If ball exists, adjust its position
            if (this.x !== undefined) {
                // Calculate new valid range
                const maxX = window.innerWidth - this.size;
                const maxY = window.innerHeight - this.size;
                
                // Check if ball is outside bounds
                if (this.x > maxX || this.y > maxY) {
                    // Regenerate position if out of bounds
                    this.x = Math.random() * maxX;
                    this.y = Math.random() * maxY;
                    
                    // Give new random velocity
                    this.vx = (Math.random() - 0.5) * 5;
                    this.vy = (Math.random() - 0.5) * 5;
                    
                    // Reset rotation
                    this.rotation = Math.random() * 360;
                    this.angularVelocity = (Math.random() - 0.5) * 20;
                }
                
                // Scale position proportionally if window gets smaller
                const scaleRatio = this.size / oldSize;
                if (scaleRatio < 1) {
                    this.x *= scaleRatio;
                    this.y *= scaleRatio;
                }
            }
        }

        update() {
            // Mouse repulsion
            const dx = (this.mousePos.x - 1) - (this.x + this.size/2);
            const dy = (this.mousePos.y - 1) - (this.y + this.size/2);
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < this.collisionSize/2 + 1) {
                const angle = Math.atan2(dy, dx);
                const repulsion = (this.collisionSize/2 + 1 - distance) / 5;
                this.vx -= Math.cos(angle) * repulsion;
                this.vy -= Math.sin(angle) * repulsion;
                this.angularVelocity += (dx * this.vy - dy * this.vx) / (this.size * this.size) * 20;
            }

            // Ball collision with enhanced spin
            this.balls.forEach(ball => {
                if (ball !== this) {
                    const dx = ball.x - this.x;
                    const dy = ball.y - this.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < this.collisionSize) {
                        const angle = Math.atan2(dy, dx);
                        const overlap = this.collisionSize - distance;
                        
                        this.x -= Math.cos(angle) * overlap / 2;
                        this.y -= Math.sin(angle) * overlap / 2;
                        ball.x += Math.cos(angle) * overlap / 2;
                        ball.y += Math.sin(angle) * overlap / 2;
                        
                        const normalX = dx / distance;
                        const normalY = dy / distance;
                        const p = 2 * (this.vx * normalX + this.vy * normalY - ball.vx * normalX - ball.vy * normalY) / 8;
                        
                        this.vx -= p * normalX;
                        this.vy -= p * normalY;
                        ball.vx += p * normalX;
                        ball.vy += p * normalY;

                        const relativeVel = Math.sqrt((this.vx - ball.vx) ** 2 + (this.vy - ball.vy) ** 2);
                        this.angularVelocity += relativeVel * (Math.random() - 0.5) * 0.075;
                        ball.angularVelocity -= relativeVel * (Math.random() - 0.5) * 0.075;
                    }
                }
            });

            // Wall collision with enhanced spin
            if (this.x < 0 || this.x > window.innerWidth - this.size) {
                this.vx *= -0.2;
                this.x = Math.max(0, Math.min(this.x, window.innerWidth - this.size));
                this.angularVelocity += this.vy * 0.05;
            }
            if (this.y < 0 || this.y > window.innerHeight - this.size) {
                this.vy *= -0.2;
                this.y = Math.max(0, Math.min(this.y, window.innerHeight - this.size));
                this.angularVelocity -= this.vx * 0.05;
            }

            // Apply velocity with minimum speed
            this.x += this.vx;
            this.y += this.vy;
            
            // Maintain minimum velocity
            const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
            if (speed < 0.5) {
                const scale = 0.5 / speed;
                this.vx *= scale;
                this.vy *= scale;
            }

            // Update rotation
            this.rotation += this.angularVelocity;
            this.angularVelocity *= 0.995;

            // Update position and rotation
            this.element.style.transform = `translate(${this.x}px, ${this.y}px) rotate(${this.rotation}deg)`;
            this.animationFrame = requestAnimationFrame(() => this.update());
        }
    }

    function startEmojiBalls() {
        if (!ballsInstance) {
            ballsInstance = {
                container: null,
                balls: [],
                animationFrames: [],
                mouseListener: null,
                resizeListener: null,
                
                initialize: function() {
                    // Create container
                    this.container = document.createElement('div');
                    this.container.className = 'emoji-container';
                    document.body.appendChild(this.container);

                    // Setup mouse tracking
                    const mousePos = { x: -100, y: -100 };
                    this.mouseListener = (e) => {
                        mousePos.x = e.clientX;
                        mousePos.y = e.clientY;
                    };
                    document.addEventListener('mousemove', this.mouseListener);

                    // Setup resize handling
                    this.resizeListener = () => {
                        this.balls.forEach(ball => ball.updateSize());
                    };
                    window.addEventListener('resize', this.resizeListener);

                    // Create balls
                    const emojis = ['🥵', '😳', '😋', '😂', '😭', '😡', '🥹', 'S','i','G','M','A','G','U','R','O','女','神','綾','音'];
                    emojis.forEach(emoji => {
                        const ball = new EmojiBall(emoji, this.container, mousePos, this.balls);
                        this.balls.push(ball);
                    });
                },

                cleanup: function() {
                    // Remove event listeners
                    document.removeEventListener('mousemove', this.mouseListener);
                    window.removeEventListener('resize', this.resizeListener);
                    
                    // Cancel all animation frames
                    this.balls.forEach(ball => {
                        if (ball.animationFrame) {
                            cancelAnimationFrame(ball.animationFrame);
                        }
                    });
                    
                    // Remove container and clear arrays
                    if (this.container) {
                        this.container.remove();
                    }
                    this.balls = [];
                    this.animationFrames = [];
                }
            };

            ballsInstance.initialize();
        }
    }

    // Start emoji balls by default
    startEmojiBalls();
    
    document.getElementById('hide_ball').addEventListener('click', () => {
        if (ballsActive) {
            // Stop and cleanup emoji balls
            if (ballsInstance) {
                ballsInstance.cleanup();
                ballsInstance = null;
            }
        } else {
            // Restart emoji balls
            startEmojiBalls();
        }
        ballsActive = !ballsActive;
    });

    // Toggle panels with better error handling
    function togglePanels(show) {
        const panels = document.querySelectorAll('.panel');
        const transition = 'opacity 0.3s ease, transform 0.3s ease';
        
        panels.forEach(panel => {
            panel.style.transition = transition;
            
            if (!show) {
                // 隱藏面板
                panel.style.opacity = '0';
                panel.style.transform = 'translateY(-10px)';
                setTimeout(() => {
                    panel.style.display = 'none';
                }, 300);
            } else {
                // 顯示面板
                const display = ['menu', 'content'].includes(panel.id) ? 'block' : 'flex';
                panel.style.display = display;
                panel.style.opacity = '0';
                panel.style.transform = 'translateY(-10px)';
                
                // Force reflow and show
                requestAnimationFrame(() => {
                    panel.style.opacity = '1';
                    panel.style.transform = 'translateY(0)';
                });
            }
        });
    }

    // 更新事件監聽器
    document.getElementById('hide_panel').addEventListener('click', () => {
        panelsVisible = !panelsVisible;
        togglePanels(panelsVisible);
    });

    function initEmailForm() {
        const inputs = {
            subject: document.getElementById('subject'),
            email: document.getElementById('email'),
            content: document.getElementById('content')
        };
        const sendButton = document.getElementById('sendButton');
        const modal = document.getElementById('responseModal');
        const modalOverlay = document.getElementById('modalOverlay');
        const modalClose = document.getElementById('modalClose');
        const modalContent = document.getElementById('modalContent');

        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;
        let xOffset = 0;
        let yOffset = 0;

        // Modal drag functionality
        modal.addEventListener('mousedown', dragStart);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', dragEnd);

        function dragStart(e) {
            if (e.target === modalClose) return;
            
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;

            if (e.target === modal) {
                isDragging = true;
            }
        }

        function drag(e) {
            if (isDragging) {
                e.preventDefault();
                
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;

                xOffset = currentX;
                yOffset = currentY;

                setModalPosition(currentX, currentY);
            }
        }

        function dragEnd() {
            isDragging = false;
        }

        function setModalPosition(x, y) {
            modal.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        }

        // Show modal with message
        function showModal(message, isSuccess = true) {
            modalContent.innerHTML = `
                <div class="modal-${isSuccess ? 'success' : 'error'}">
                    <h3>${isSuccess ? 'Success!' : 'Error'}</h3>
                    <p>${message}</p>
                </div>
            `;
            modalOverlay.style.display = 'flex';
            // Reset position
            xOffset = 0;
            yOffset = 0;
            setModalPosition(0, 0);
        }

        // Close modal
        modalClose.addEventListener('click', () => {
            modalOverlay.style.display = 'none';
        });

        // Email validation and sending
        async function handleSubmit() {
            const validations = {
                subject: validateInput(inputs.subject, inputs.subject.value),
                email: validateInput(inputs.email, inputs.email.value, true),
                content: validateInput(inputs.content, inputs.content.value)
            };

            if (Object.values(validations).every(Boolean)) {
                sendButton.disabled = true;
                sendButton.innerHTML = '<span class="button-text">Sending...</span>';

                try {
                    const emailContent = `${inputs.content.value}\n\nFrom: SiGMAGURO official feedback / bug report`;
                    
                    const response = await emailjs.send("service_feedback", "template_feedback", {
                        subject: inputs.subject.value,
                        email: inputs.email.value,
                        content: emailContent
                    });

                    if (response.status === 200) {
                        showModal('Your message has been sent successfully!');
                        Object.values(inputs).forEach(input => input.value = '');
                    } else {
                        throw new Error('Failed to send email');
                    }
                } catch (error) {
                    console.error('Failed to send email:', error);
                    showModal('Failed to send email. Please try again later.', false);
                } finally {
                    sendButton.disabled = false;
                    sendButton.innerHTML = `
                        <span class="button-text">Send</span>
                        <div class="button-icon">
                            <i class="fas fa-paper-plane"></i>
                        </div>
                    `;
                }
            }
        }

        // Rest of the existing email form code...
    }

    // Add click handlers for menu items
    document.getElementById('home_link').addEventListener('click', (e) => {
        e.preventDefault();
        showContent('intro-content');
    });

    document.getElementById('twitter_link').addEventListener('click', (e) => {
        e.preventDefault();
        showContent('twitter-content');
    });

    document.getElementById('ci-en_link').addEventListener('click', (e) => {
        e.preventDefault();
        showContent('cien-content');
    });

    document.getElementById('facebook_link').addEventListener('click', (e) => {
        e.preventDefault();
        showContent('facebook-content');
    });

    document.getElementById('youtube_link').addEventListener('click', (e) => {
        e.preventDefault();
        showContent('youtube-content');
    });

    // Add email link handler
    document.getElementById('email_link').addEventListener('click', (e) => {
        e.preventDefault();
        showContent('email-content');
    });

    // Load social media scripts with error handling
    async function loadSocialMediaScripts() {
        try {
            // Twitter
            await loadExternalScript('https://platform.twitter.com/widgets.js', {
                async: true,
                charset: 'utf-8',
                onerror: (error) => {
                    console.warn('Twitter widget failed to load:', error);
                }
            });

            // Facebook
            await loadExternalScript('https://connect.facebook.net/zh_TW/sdk.js', {
                async: true,
                defer: true,
                crossorigin: 'anonymous',
                onerror: (error) => {
                    console.warn('Facebook SDK failed to load:', error);
                }
            });
        } catch (error) {
            console.warn('Social media scripts failed to load:', error);
        }
    }
}); 