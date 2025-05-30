/**
 * flashcard.js - 智能單詞卡片系統
 * 負責：分級詞彙、3D翻轉效果、學習進度追蹤
 */

class FlashcardModule {
    constructor(app) {
        this.app = app;
        this.currentCard = 0;
        this.vocabulary = [];
        this.learnedWords = [];
        this.isFlipped = false;
        this.studySessionStartTime = null;
        
        // 分級詞彙庫
        this.vocabularyDatabase = this.generateVocabularyDatabase();
        
        this.init();
    }
    
    /**
     * 初始化單詞卡片模組
     */
    init() {
        console.log('📚 單詞卡片模組初始化');
        this.setupEventListeners();
        this.loadLeveledVocabulary();
    }
    
    /**
     * 設定事件監聽器
     */
    setupEventListeners() {
        // 卡片控制按鈕
        const flipBtn = document.getElementById('flipCard');
        const prevBtn = document.getElementById('prevCard');
        const nextBtn = document.getElementById('nextCard');
        
        if (flipBtn) flipBtn.addEventListener('click', () => this.flipCard());
        if (prevBtn) prevBtn.addEventListener('click', () => this.previousCard());
        if (nextBtn) nextBtn.addEventListener('click', () => this.nextCard());
        
        // 鍵盤快捷鍵
        document.addEventListener('keydown', (e) => {
            if (this.app.currentModule === 'flashcard') {
                switch(e.key) {
                    case ' ':
                    case 'Enter':
                        e.preventDefault();
                        this.flipCard();
                        break;
                    case 'ArrowLeft':
                        e.preventDefault();
                        this.previousCard();
                        break;
                    case 'ArrowRight':
                        e.preventDefault();
                        this.nextCard();
                        break;
                }
            }
        });
        
        // 觸控手勢支援
        this.setupTouchGestures();
        
        // 監聽級別變更
        this.app.on('levelChanged', (data) => {
            this.loadLeveledVocabulary(data.level);
        });
    }
    
    /**
     * 設定觸控手勢
     */
    setupTouchGestures() {
        const cardElement = document.getElementById('flashcard3D');
        if (!cardElement) return;
        
        let startX = 0;
        let startY = 0;
        let startTime = 0;
        
        cardElement.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            startTime = Date.now();
        }, { passive: true });
        
        cardElement.addEventListener('touchend', (e) => {
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            const endTime = Date.now();
            
            const deltaX = endX - startX;
            const deltaY = endY - startY;
            const deltaTime = endTime - startTime;
            
            // 點擊翻轉
            if (Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10 && deltaTime < 300) {
                this.flipCard();
                return;
            }
            
            // 滑動切換卡片
            if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY)) {
                if (deltaX > 0) {
                    this.previousCard();
                } else {
                    this.nextCard();
                }
            }
        }, { passive: true });
    }
    
    /**
     * 生成分級詞彙庫
     */
    generateVocabularyDatabase() {
        return {
            A1: [
                {
                    word: 'hello',
                    phonetic: '/həˈləʊ/',
                    meaning: '你好，哈囉',
                    etymology: '來自古英語 hǣl (健康)',
                    examples: [
                        { english: 'Hello, how are you?', chinese: '你好，你好嗎？' },
                        { english: 'Hello everyone!', chinese: '大家好！' }
                    ],
                    difficulty: 1,
                    frequency: 'high'
                },
                {
                    word: 'cat',
                    phonetic: '/kæt/',
                    meaning: '貓',
                    etymology: '來自古英語 catt',
                    examples: [
                        { english: 'I have a black cat.', chinese: '我有一隻黑貓。' },
                        { english: 'The cat is sleeping.', chinese: '貓在睡覺。' }
                    ],
                    difficulty: 1,
                    frequency: 'high'
                },
                {
                    word: 'book',
                    phonetic: '/bʊk/',
                    meaning: '書本',
                    etymology: '來自古英語 bōc',
                    examples: [
                        { english: 'I read a good book.', chinese: '我讀了一本好書。' },
                        { english: 'This book is interesting.', chinese: '這本書很有趣。' }
                    ],
                    difficulty: 1,
                    frequency: 'high'
                },
                {
                    word: 'water',
                    phonetic: '/ˈwɔːtər/',
                    meaning: '水',
                    etymology: '來自古英語 wæter',
                    examples: [
                        { english: 'I drink water every day.', chinese: '我每天喝水。' },
                        { english: 'The water is clean.', chinese: '水很乾淨。' }
                    ],
                    difficulty: 1,
                    frequency: 'high'
                },
                {
                    word: 'good',
                    phonetic: '/ɡʊd/',
                    meaning: '好的',
                    etymology: '來自古英語 gōd',
                    examples: [
                        { english: 'This is a good idea.', chinese: '這是個好主意。' },
                        { english: 'Have a good day!', chinese: '祝你有美好的一天！' }
                    ],
                    difficulty: 1,
                    frequency: 'high'
                }
            ],
            
            A2: [
                {
                    word: 'beautiful',
                    phonetic: '/ˈbjuːtɪfʊl/',
                    meaning: '美麗的，漂亮的',
                    etymology: '來自古法語 beaute',
                    examples: [
                        { english: 'She has beautiful eyes.', chinese: '她有美麗的眼睛。' },
                        { english: 'What a beautiful day!', chinese: '多麼美好的一天！' }
                    ],
                    difficulty: 2,
                    frequency: 'medium'
                },
                {
                    word: 'important',
                    phonetic: '/ɪmˈpɔːrtənt/',
                    meaning: '重要的',
                    etymology: '來自拉丁語 importare',
                    examples: [
                        { english: 'Education is very important.', chinese: '教育非常重要。' },
                        { english: 'This is an important meeting.', chinese: '這是一個重要的會議。' }
                    ],
                    difficulty: 2,
                    frequency: 'high'
                },
                {
                    word: 'different',
                    phonetic: '/ˈdɪfərənt/',
                    meaning: '不同的',
                    etymology: '來自拉丁語 differre',
                    examples: [
                        { english: 'We have different opinions.', chinese: '我們有不同的意見。' },
                        { english: 'This is different from before.', chinese: '這和以前不同。' }
                    ],
                    difficulty: 2,
                    frequency: 'high'
                },
                {
                    word: 'because',
                    phonetic: '/bɪˈkɔːz/',
                    meaning: '因為',
                    etymology: '來自中古英語 bi cause',
                    examples: [
                        { english: 'I stay home because it\'s raining.', chinese: '我待在家因為在下雨。' },
                        { english: 'She is happy because she passed the test.', chinese: '她很開心因為通過了考試。' }
                    ],
                    difficulty: 2,
                    frequency: 'high'
                }
            ],
            
            B1: [
                {
                    word: 'environment',
                    phonetic: '/ɪnˈvaɪrənmənt/',
                    meaning: '環境',
                    etymology: '來自古法語 environ',
                    examples: [
                        { english: 'We should protect our environment.', chinese: '我們應該保護環境。' },
                        { english: 'The work environment is friendly.', chinese: '工作環境很友善。' }
                    ],
                    difficulty: 3,
                    frequency: 'medium'
                },
                {
                    word: 'opportunity',
                    phonetic: '/ˌɒpərˈtuːnɪti/',
                    meaning: '機會',
                    etymology: '來自拉丁語 opportunitas',
                    examples: [
                        { english: 'This is a great opportunity.', chinese: '這是一個很好的機會。' },
                        { english: 'Don\'t miss this opportunity.', chinese: '不要錯過這個機會。' }
                    ],
                    difficulty: 3,
                    frequency: 'medium'
                },
                {
                    word: 'relationship',
                    phonetic: '/rɪˈleɪʃənʃɪp/',
                    meaning: '關係',
                    etymology: '來自 relate + ship',
                    examples: [
                        { english: 'They have a good relationship.', chinese: '他們關係很好。' },
                        { english: 'Building relationships takes time.', chinese: '建立關係需要時間。' }
                    ],
                    difficulty: 3,
                    frequency: 'medium'
                }
            ],
            
            B2: [
                {
                    word: 'sophisticated',
                    phonetic: '/səˈfɪstɪkeɪtɪd/',
                    meaning: '複雜的，精密的',
                    etymology: '來自希臘語 sophistēs',
                    examples: [
                        { english: 'This is a sophisticated system.', chinese: '這是一個複雜的系統。' },
                        { english: 'She has sophisticated taste.', chinese: '她有精緻的品味。' }
                    ],
                    difficulty: 4,
                    frequency: 'medium'
                },
                {
                    word: 'nevertheless',
                    phonetic: '/ˌnevərðəˈles/',
                    meaning: '然而，不過',
                    etymology: '來自 never + the + less',
                    examples: [
                        { english: 'It was difficult; nevertheless, we succeeded.', chinese: '雖然困難，但我們成功了。' },
                        { english: 'The weather was bad. Nevertheless, we went hiking.', chinese: '天氣很糟，不過我們還是去爬山了。' }
                    ],
                    difficulty: 4,
                    frequency: 'low'
                }
            ],
            
            C1: [
                {
                    word: 'ubiquitous',
                    phonetic: '/juːˈbɪkwɪtəs/',
                    meaning: '無所不在的',
                    etymology: '來自拉丁語 ubique (到處)',
                    examples: [
                        { english: 'Smartphones are ubiquitous in modern society.', chinese: '智慧型手機在現代社會中無所不在。' },
                        { english: 'The internet has made information ubiquitous.', chinese: '網際網路讓資訊變得無所不在。' }
                    ],
                    difficulty: 5,
                    frequency: 'low'
                },
                {
                    word: 'paradigm',
                    phonetic: '/ˈpærədaɪm/',
                    meaning: '典範，模式',
                    etymology: '來自希臘語 paradeigma',
                    examples: [
                        { english: 'This represents a new paradigm in education.', chinese: '這代表教育的新典範。' },
                        { english: 'The paradigm shift changed everything.', chinese: '典範轉移改變了一切。' }
                    ],
                    difficulty: 5,
                    frequency: 'low'
                }
            ],
            
            C2: [
                {
                    word: 'perspicacious',
                    phonetic: '/ˌpɜːspɪˈkeɪʃəs/',
                    meaning: '洞察力敏銳的',
                    etymology: '來自拉丁語 perspicax',
                    examples: [
                        { english: 'Her perspicacious analysis impressed everyone.', chinese: '她敏銳的分析讓所有人印象深刻。' },
                        { english: 'A perspicacious observer would notice the details.', chinese: '敏銳的觀察者會注意到細節。' }
                    ],
                    difficulty: 6,
                    frequency: 'very low'
                }
            ]
        };
    }
    
    /**
     * 載入分級詞彙
     */
    loadLeveledVocabulary(level = null) {
        const userLevel = level || this.app.userLevel || 'A1';
        console.log(`📖 載入 ${userLevel} 級別詞彙`);
        
        // 根據用戶級別載入適當的詞彙
        this.vocabulary = [];
        
        // 載入當前級別及以下的詞彙
        const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
        const currentLevelIndex = levels.indexOf(userLevel);
        
        for (let i = 0; i <= currentLevelIndex; i++) {
            const levelVocab = this.vocabularyDatabase[levels[i]] || [];
            this.vocabulary.push(...levelVocab);
        }
        
        // 打亂順序
        this.vocabulary = this.shuffleArray(this.vocabulary);
        
        // 重置卡片狀態
        this.currentCard = 0;
        this.isFlipped = false;
        this.learnedWords = [];
        
        // 更新顯示
        this.updateLevelDisplay(userLevel);
        this.showCurrentCard();
        this.updateProgress();
        
        console.log(`📚 載入了 ${this.vocabulary.length} 個單詞`);
    }
    
    /**
     * 更新級別顯示
     */
    updateLevelDisplay(level) {
        const levelElement = document.getElementById('flashcardLevel');
        if (levelElement) {
            levelElement.textContent = level;
            levelElement.className = `current-level level-badge ${level.toLowerCase()}`;
        }
    }
    
    /**
     * 顯示當前卡片
     */
    showCurrentCard() {
        if (this.vocabulary.length === 0) {
            this.showNoVocabularyMessage();
            return;
        }
        
        const word = this.vocabulary[this.currentCard];
        if (!word) return;
        
        // 更新正面內容
        this.updateCardFront(word);
        
        // 更新背面內容
        this.updateCardBack(word);
        
        // 重置翻轉狀態
        this.resetFlipState();
        
        // 更新進度
        this.updateProgress();
        
        // 記錄學習時間
        if (!this.studySessionStartTime) {
            this.studySessionStartTime = Date.now();
        }
    }
    
    /**
     * 更新卡片正面
     */
    updateCardFront(word) {
        const elements = {
            badge: document.getElementById('wordLevelBadge'),
            main: document.getElementById('wordMain'),
            phonetic: document.getElementById('wordPhonetic')
        };
        
        if (elements.badge) {
            elements.badge.textContent = this.getWordLevel(word);
            elements.badge.className = `word-level-badge level-badge ${this.getWordLevel(word).toLowerCase()}`;
        }
        
        if (elements.main) {
            elements.main.textContent = word.word;
        }
        
        if (elements.phonetic) {
            elements.phonetic.textContent = word.phonetic;
        }
    }
    
    /**
     * 更新卡片背面
     */
    updateCardBack(word) {
        const elements = {
            meaning: document.getElementById('wordMeaning'),
            etymology: document.getElementById('wordEtymology'),
            exampleEn: document.getElementById('exampleEnglish'),
            exampleZh: document.getElementById('exampleChinese')
        };
        
        if (elements.meaning) {
            elements.meaning.textContent = word.meaning;
        }
        
        if (elements.etymology) {
            elements.etymology.textContent = word.etymology;
        }
        
        // 隨機選擇一個例句
        const randomExample = word.examples[Math.floor(Math.random() * word.examples.length)];
        
        if (elements.exampleEn) {
            elements.exampleEn.textContent = randomExample.english;
        }
        
        if (elements.exampleZh) {
            elements.exampleZh.textContent = randomExample.chinese;
        }
    }
    
    /**
     * 取得單詞級別
     */
    getWordLevel(word) {
        // 根據詞彙庫找出單詞級別
        for (const [level, words] of Object.entries(this.vocabularyDatabase)) {
            if (words.some(w => w.word === word.word)) {
                return level;
            }
        }
        return 'A1';
    }
    
    /**
     * 翻轉卡片
     */
    flipCard() {
        const cardElement = document.getElementById('flashcard3D');
        if (!cardElement) return;
        
        this.isFlipped = !this.isFlipped;
        cardElement.classList.toggle('flipped', this.isFlipped);
        
        // 更新按鈕文字
        const flipBtn = document.getElementById('flipCard');
        if (flipBtn) {
            flipBtn.textContent = this.isFlipped ? '翻回' : '翻轉';
        }
        
        // 記錄翻轉事件
        this.trackCardInteraction('flip');
    }
    
    /**
     * 重置翻轉狀態
     */
    resetFlipState() {
        const cardElement = document.getElementById('flashcard3D');
        if (!cardElement) return;
        
        this.isFlipped = false;
        cardElement.classList.remove('flipped');
        
        const flipBtn = document.getElementById('flipCard');
        if (flipBtn) {
            flipBtn.textContent = '翻轉';
        }
    }
    
    /**
     * 上一張卡片
     */
    previousCard() {
        if (this.vocabulary.length === 0) return;
        
        this.currentCard = (this.currentCard - 1 + this.vocabulary.length) % this.vocabulary.length;
        this.showCurrentCard();
        this.trackCardInteraction('previous');
    }
    
    /**
     * 下一張卡片
     */
    nextCard() {
        if (this.vocabulary.length === 0) return;
        
        // 標記當前單詞為已學習
        this.markWordAsLearned();
        
        this.currentCard = (this.currentCard + 1) % this.vocabulary.length;
        this.showCurrentCard();
        this.trackCardInteraction('next');
    }
    
    /**
     * 標記單詞為已學習
     */
    markWordAsLearned() {
        const currentWord = this.vocabulary[this.currentCard];
        if (!currentWord) return;
        
        if (!this.learnedWords.includes(currentWord.word)) {
            this.learnedWords.push(currentWord.word);
            
            // 更新應用程式進度
            this.app.updateProgress({
                module: 'flashcard',
                progress: (this.learnedWords.length / this.vocabulary.length) * 100,
                completedItems: this.learnedWords.length
            });
        }
    }
    
    /**
     * 更新進度顯示
     */
    updateProgress() {
        const progressElement = document.getElementById('cardProgress');
        const progressFillElement = document.getElementById('cardProgressFill');
        
        if (progressElement) {
            progressElement.textContent = `${this.currentCard + 1} / ${this.vocabulary.length}`;
        }
        
        if (progressFillElement) {
            const progress = ((this.currentCard + 1) / this.vocabulary.length) * 100;
            progressFillElement.style.width = `${progress}%`;
        }
    }
    
    /**
     * 顯示無詞彙訊息
     */
    showNoVocabularyMessage() {
        const cardElement = document.getElementById('flashcard3D');
        if (cardElement) {
            cardElement.innerHTML = `
                <div class="no-vocabulary-message">
                    <h3>暫無詞彙</h3>
                    <p>請先完成分級測驗以載入適合的詞彙</p>
                    <button class="btn btn-primary" onclick="app.switchModule('assessment')">
                        前往分級測驗
                    </button>
                </div>
            `;
        }
    }
    
    /**
     * 追蹤卡片互動
     */
    trackCardInteraction(action) {
        const currentWord = this.vocabulary[this.currentCard];
        if (!currentWord) return;
        
        // 記錄互動事件
        console.log(`📊 卡片互動: ${action} - ${currentWord.word}`);
        
        // 可以在這裡添加學習分析邏輯
        this.analyzeCardInteraction(action, currentWord);
    }
    
    /**
     * 分析卡片互動
     */
    analyzeCardInteraction(action, word) {
        // 簡單的學習行為分析
        const sessionTime = Date.now() - (this.studySessionStartTime || Date.now());
        
        const interaction = {
            timestamp: Date.now(),
            action: action,
            word: word.word,
            level: this.getWordLevel(word),
            sessionTime: sessionTime,
            isFlipped: this.isFlipped
        };
        
        // 儲存到學習記錄（如果需要）
        // this.saveInteractionLog(interaction);
    }
    
    /**
     * 模組顯示時的回調
     */
    onShow() {
        // 檢查是否需要載入詞彙
        if (this.vocabulary.length === 0) {
            this.loadLeveledVocabulary();
        }
        
        // 重新開始學習會話計時
        this.studySessionStartTime = Date.now();
        
        console.log('📚 單詞卡片模組已顯示');
    }
    
    /**
     * 取得學習統計
     */
    getStudyStatistics() {
        const totalWords = this.vocabulary.length;
        const learnedCount = this.learnedWords.length;
        const progress = totalWords > 0 ? (learnedCount / totalWords) * 100 : 0;
        const sessionTime = this.studySessionStartTime ? Date.now() - this.studySessionStartTime : 0;
        
        return {
            totalWords,
            learnedCount,
            progress,
            sessionTime,
            currentWord: this.vocabulary[this.currentCard]?.word || null,
            wordsPerMinute: sessionTime > 0 ? (learnedCount / (sessionTime / 60000)) : 0
        };
    }
    
    /**
     * 重置學習進度
     */
    resetProgress() {
        this.learnedWords = [];
        this.currentCard = 0;
        this.studySessionStartTime = Date.now();
        this.updateProgress();
        this.showCurrentCard();
        
        console.log('🔄 單詞學習進度已重置');
    }
    
    /**
     * 跳到指定單詞
     */
    goToWord(wordIndex) {
        if (wordIndex >= 0 && wordIndex < this.vocabulary.length) {
            this.currentCard = wordIndex;
            this.showCurrentCard();
        }
    }
    
    /**
     * 搜尋單詞
     */
    searchWord(query) {
        if (!query || query.trim() === '') return [];
        
        const searchTerm = query.toLowerCase().trim();
        return this.vocabulary.filter(word => 
            word.word.toLowerCase().includes(searchTerm) ||
            word.meaning.toLowerCase().includes(searchTerm)
        );
    }
    
    /**
     * 取得單詞詳細資訊
     */
    getWordDetails(word) {
        const wordData = this.vocabulary.find(w => w.word === word);
        if (!wordData) return null;
        
        return {
            ...wordData,
            level: this.getWordLevel(wordData),
            isLearned: this.learnedWords.includes(word),
            studyCount: this.getWordStudyCount(word)
        };
    }
    
    /**
     * 取得單詞學習次數
     */
    getWordStudyCount(word) {
        // 簡化版本，實際應用中可以追蹤更詳細的數據
        return this.learnedWords.includes(word) ? 1 : 0;
    }
    
    /**
     * 匯出學習進度
     */
    exportProgress() {
        const stats = this.getStudyStatistics();
        const progress = {
            timestamp: new Date().toISOString(),
            userLevel: this.app.userLevel,
            statistics: stats,
            learnedWords: this.learnedWords,
            vocabulary: this.vocabulary.map(word => ({
                word: word.word,
                level: this.getWordLevel(word),
                isLearned: this.learnedWords.includes(word.word)
            }))
        };
        
        return progress;
    }
    
    /**
     * 建立學習計劃
     */
    createStudyPlan() {
        const userLevel = this.app.userLevel || 'A1';
        const totalWords = this.vocabulary.length;
        const learnedWords = this.learnedWords.length;
        const remainingWords = totalWords - learnedWords;
        
        // 建議每日學習單詞數
        const dailyTarget = Math.max(5, Math.min(20, Math.ceil(remainingWords / 30)));
        
        const studyPlan = {
            currentLevel: userLevel,
            totalWords: totalWords,
            learnedWords: learnedWords,
            remainingWords: remainingWords,
            dailyTarget: dailyTarget,
            estimatedDays: Math.ceil(remainingWords / dailyTarget),
            suggestions: this.generateStudySuggestions()
        };
        
        return studyPlan;
    }
    
    /**
     * 生成學習建議
     */
    generateStudySuggestions() {
        const suggestions = [];
        const stats = this.getStudyStatistics();
        
        if (stats.progress < 25) {
            suggestions.push('建議每天學習10-15個新單詞，重點記憶基礎詞彙');
        } else if (stats.progress < 50) {
            suggestions.push('繼續保持學習節奏，可以增加複習頻率');
        } else if (stats.progress < 75) {
            suggestions.push('學習進度良好，建議開始接觸更高級別的詞彙');
        } else {
            suggestions.push('詞彙掌握度很高，可以挑戰下一個CEFR級別');
        }
        
        if (stats.wordsPerMinute < 2) {
            suggestions.push('建議增加學習時間，提高學習效率');
        }
        
        return suggestions;
    }
    
    /**
     * 快速複習模式
     */
    enterQuickReviewMode() {
        // 只顯示已學習的單詞進行快速複習
        const reviewWords = this.vocabulary.filter(word => 
            this.learnedWords.includes(word.word)
        );
        
        if (reviewWords.length === 0) {
            this.app.showNotification('暫無可複習的單詞', 'info');
            return;
        }
        
        // 打亂複習順序
        this.vocabulary = this.shuffleArray(reviewWords);
        this.currentCard = 0;
        this.showCurrentCard();
        
        this.app.showNotification(`進入快速複習模式，共${reviewWords.length}個單詞`, 'success');
        console.log('⚡ 進入快速複習模式');
    }
    
    /**
     * 困難單詞模式
     */
    enterDifficultWordsMode() {
        // 顯示高級別或低頻詞彙
        const difficultWords = this.vocabulary.filter(word => 
            word.difficulty >= 4 || word.frequency === 'low' || word.frequency === 'very low'
        );
        
        if (difficultWords.length === 0) {
            this.app.showNotification('當前級別沒有困難單詞', 'info');
            return;
        }
        
        this.vocabulary = this.shuffleArray(difficultWords);
        this.currentCard = 0;
        this.showCurrentCard();
        
        this.app.showNotification(`進入困難單詞模式，共${difficultWords.length}個單詞`, 'warning');
        console.log('🔥 進入困難單詞模式');
    }
    
    /**
     * 收藏單詞
     */
    favoriteWord(word) {
        // 簡化版本，實際應用中可以有更複雜的收藏系統
        if (!window.favoriteWords) {
            window.favoriteWords = [];
        }
        
        if (!window.favoriteWords.includes(word)) {
            window.favoriteWords.push(word);
            this.app.showNotification(`已收藏單詞: ${word}`, 'success');
        } else {
            this.app.showNotification(`單詞已在收藏清單中: ${word}`, 'info');
        }
    }
    
    /**
     * 語音朗讀單詞
     */
    speakWord(word) {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(word);
            utterance.lang = 'en-US';
            utterance.rate = 0.8;
            speechSynthesis.speak(utterance);
        } else {
            this.app.showNotification('您的瀏覽器不支援語音功能', 'warning');
        }
    }
    
    /**
     * 自動播放模式
     */
    startAutoPlay(interval = 5000) {
        if (this.autoPlayTimer) {
            this.stopAutoPlay();
        }
        
        this.autoPlayTimer = setInterval(() => {
            this.nextCard();
        }, interval);
        
        this.app.showNotification('自動播放已開始', 'info');
        console.log('▶️ 自動播放模式開啟');
    }
    
    /**
     * 停止自動播放
     */
    stopAutoPlay() {
        if (this.autoPlayTimer) {
            clearInterval(this.autoPlayTimer);
            this.autoPlayTimer = null;
            this.app.showNotification('自動播放已停止', 'info');
            console.log('⏸️ 自動播放模式關閉');
        }
    }
    
    // ==========================================
    // 工具函數
    // ==========================================
    
    /**
     * 洗牌陣列
     */
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
    
    /**
     * 格式化時間
     */
    formatTime(milliseconds) {
        const seconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        
        if (hours > 0) {
            return `${hours}:${(minutes % 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;
        } else {
            return `${minutes}:${(seconds % 60).toString().padStart(2, '0')}`;
        }
    }
    
    /**
     * 清理資源
     */
    destroy() {
        // 停止自動播放
        this.stopAutoPlay();
        
        // 清理計時器
        if (this.studySessionStartTime) {
            this.studySessionStartTime = null;
        }
        
        // 清理事件監聽器（由主應用程式處理）
        
        console.log('🗑️ Flashcard模組資源清理完成');
    }
}

// 確保類別在全域範圍內可用
window.FlashcardModule = FlashcardModule;