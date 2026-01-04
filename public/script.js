// ページ読み込み時に初期化
document.addEventListener('DOMContentLoaded', function() {
    setupClickAnimations();
    setupHoverEffects();
});

// クリックアニメーションの設定
function setupClickAnimations() {
    const clickableElements = document.querySelectorAll('[data-clickable]');
    
    clickableElements.forEach(element => {
        element.addEventListener('click', function(e) {
            // ランダムなアニメーションを選択
            const animations = ['bounce', 'spin', 'wiggle', 'jump', 'shake', 'pulse'];
            const randomAnimation = animations[Math.floor(Math.random() * animations.length)];
            
            // アニメーションクラスを追加
            this.classList.add(`animate-${randomAnimation}`);
            
            // パーティクルエフェクトを生成
            createParticles(e, this);
            
            // アニメーション後にクラスを削除
            setTimeout(() => {
                this.classList.remove(`animate-${randomAnimation}`);
            }, 600);
            
            // 音効果（オプション）
            playClickSound();
        });
    });
}

// パーティクルエフェクトの生成
function createParticles(event, element) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const colors = ['#ff69b4', '#ffd700', '#87ceeb', '#ff6b6b', '#90ee90', '#ff4500'];
    const particleCount = 15;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const color = colors[Math.floor(Math.random() * colors.length)];
        const size = Math.random() * 8 + 4;
        const angle = (Math.PI * 2 * i) / particleCount;
        const velocity = Math.random() * 100 + 50;
        const tx = Math.cos(angle) * velocity;
        const ty = Math.sin(angle) * velocity;
        
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.background = color;
        particle.style.left = centerX + 'px';
        particle.style.top = centerY + 'px';
        particle.style.setProperty('--tx', tx + 'px');
        particle.style.setProperty('--ty', ty + 'px');
        
        document.body.appendChild(particle);
        
        setTimeout(() => {
            particle.remove();
        }, 1000);
    }
}

// ホバーエフェクトの設定
function setupHoverEffects() {
    const interactiveElements = document.querySelectorAll('.grid-item, .char-display, .merch-item');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.transition = 'transform 0.3s ease';
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
}

// クリック音効果（オプション）
function playClickSound() {
    // 音声ファイルがない場合でも動作するように、コンソールログで代用
    // 実際の音声ファイルがある場合は、以下のコードを使用できます：
    // const audio = new Audio('click.mp3');
    // audio.volume = 0.3;
    // audio.play().catch(e => console.log('音声再生エラー:', e));
}

// スクロールアニメーション
let lastScrollTop = 0;
window.addEventListener('scroll', function() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > lastScrollTop) {
        // 下にスクロール
        document.body.style.cursor = 'pointer';
    } else {
        // 上にスクロール
        document.body.style.cursor = 'default';
    }
    
    lastScrollTop = scrollTop;
});

// 特定の要素に対する特別なアニメーション
document.addEventListener('DOMContentLoaded', function() {
    // 寿司キャラクターの特別なアニメーション
    const sushiItems = document.querySelectorAll('.sushi-item');
    sushiItems.forEach(item => {
        item.addEventListener('click', function() {
            this.style.transform = 'rotate(360deg) scale(1.2)';
            setTimeout(() => {
                this.style.transform = '';
            }, 600);
        });
    });
    
    // バブルガムのアニメーション
    const bubbleGum = document.querySelector('.bubble');
    if (bubbleGum) {
        bubbleGum.addEventListener('click', function() {
            this.style.transform = 'scale(1.5)';
            setTimeout(() => {
                this.style.transform = '';
            }, 300);
        });
    }
    
    // スケートボードキャラクターのアニメーション
    const skaters = document.querySelectorAll('.skater');
    skaters.forEach(skater => {
        skater.addEventListener('click', function() {
            this.style.transform = 'translateX(50px) rotate(15deg)';
            setTimeout(() => {
                this.style.transform = '';
            }, 600);
        });
    });
    
    // 水中キャラクターのアニメーション
    const underwaterChars = document.querySelectorAll('.octopus-character, .fish, .crab');
    underwaterChars.forEach(char => {
        char.addEventListener('click', function() {
            this.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                this.style.transform = '';
            }, 600);
        });
    });
    
    // メインロゴキャラクターの特別なアニメーション
    const mainLogo = document.querySelector('.main-logo-character');
    if (mainLogo) {
        mainLogo.addEventListener('click', function() {
            const ears = this.querySelectorAll('.blob-ear');
            ears.forEach(ear => {
                ear.style.transform = 'scale(1.3)';
                setTimeout(() => {
                    ear.style.transform = '';
                }, 300);
            });
        });
    }
    
    // グッズアイテムの特別なアニメーション
    const merchItems = document.querySelectorAll('.merch-item');
    merchItems.forEach(item => {
        item.addEventListener('click', function() {
            // 3D回転効果
            this.style.transform = 'perspective(1000px) rotateY(15deg) rotateX(5deg) scale(1.1)';
            setTimeout(() => {
                this.style.transform = '';
            }, 600);
        });
    });
});

// キーボード操作のサポート（オプション）
document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' || e.key === ' ') {
        const focusedElement = document.activeElement;
        if (focusedElement.hasAttribute('data-clickable')) {
            focusedElement.click();
        }
    }
});

// タッチデバイス対応
let touchStartX = 0;
let touchStartY = 0;

document.addEventListener('touchstart', function(e) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
});

document.addEventListener('touchend', function(e) {
    if (!touchStartX || !touchStartY) return;
    
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    
    const diffX = touchStartX - touchEndX;
    const diffY = touchStartY - touchEndY;
    
    // タップ判定（移動距離が少ない場合）
    if (Math.abs(diffX) < 10 && Math.abs(diffY) < 10) {
        const element = document.elementFromPoint(touchEndX, touchEndY);
        if (element && element.closest('[data-clickable]')) {
            const clickableElement = element.closest('[data-clickable]');
            clickableElement.click();
        }
    }
    
    touchStartX = 0;
    touchStartY = 0;
});



