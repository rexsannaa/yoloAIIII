/**
 * app.js - CEFR分級英語學習網站主應用程式
 * 負責：模組管理、用戶狀態、導航控制、全域功能
 */

class CEFRLearningApp {
    constructor() {
        // 應用程式狀態
        this.currentModule = 'assessment';
        this.userLevel = null; // A1-C2
        this.learningProgress = {};
        this.modules = {};
        this.eventListeners = [];
        
        // CEFR級別定義
        this.cefrLevels = {
            A1: {
                name: '初級',
                description: '基礎日常表達',
                vocabularyRange: [500, 1000],
                color: '#4ade80'
            },
            A2: {
                name: '中初級',
                description: '簡單交流對話',
                vocabularyRange: [1000, 2000],
                color: '#22d3ee'
            },
            B1: {
                name: '中級',
                description: '熟悉主題表達',
                vocabularyRange: [2000, 3000],
                color: '#3b82f6'
            },
            B2: {
                name: '中高級',
                description: '流利詳細表達',
                vocabularyRange: [3000, 4000],
                color: '#8b5cf6'
            },
            C1: {
                name: '進階級',
                description: '靈活有效運用',
                vocabularyRange: [4000, 6000],
                color: '#f59e0b'
            },
            C2: {
                name: '熟練級',
                description: '精細含義區分',
                vocabularyRange: [6000, 10000],
                color: '#ef4444'
            }
        };
        
        // 全域狀態管理
        this.appState = {
            user: {
                level: null,
                progress: {},
                preferences: {
                    readingMode: 'bilingual',
                    difficulty: 4,
                    posterStyle: 'modern'
                }
            },
            content: {
                original: '',
                processed: {},
                vocabulary: {}
            },
            assessment: {
                responses: [],
                abilities: {},
                recommendations: []
            }
        };
    }
    
    /**
     * 初始化應用程式
     */
    init() {
        console.log('🚀 CEFR學習應用程式啟動中...');
        
        try {
            // 載入各個模組
            this.loadModules();
            
            // 設定事件監聽
            this.setupEventListeners();
            
            // 檢查是否有儲存的用戶資料
            this.loadUserData();
            
            // 初始化UI狀態
            this.initializeUI();
            
            // 開始第一個模組
            this.showModule('assessment');
            
            console.log('✅ 應用程式初始化完成');
            
        } catch (error) {
            console.error('❌ 應用程式初始化失敗:', error);
            this.showError('應用程式載入失敗，請重新整理頁面');
        }
    }
    
    /**
     * 載入各個功能模組
     */
    loadModules() {
        console.log('📦 載入功能模組...');
        
        // 檢查模組是否已載入
        const moduleClasses = [
            'AssessmentModule',
            'FlashcardModule', 
            'ReadingModule',
            'QuizModule',
            'PosterModule'
        ];
        
        moduleClasses.forEach(className => {
            if (typeof window[className] === 'function') {
                const moduleName = className.toLowerCase().replace('module', '');
                this.modules[moduleName] = new window[className](this);
                console.log(`  ✓ ${className} 載入成功`);
            } else {
                console.warn(`  ⚠️ ${className} 尚未載入，功能可能受限`);
            }
        });
    }
    
    /**
     * 設定全域事件監聽
     */
    setupEventListeners() {
        // 導航連結事件
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            const listener = (e) => {
                e.preventDefault();
                const module = link.dataset.module;
                if (module) {
                    this.switchModule(module);
                }
            };
            link.addEventListener('click', listener);
            this.eventListeners.push({ element: link, event: 'click', listener });
        });
        
        // 全域進度步驟點擊
        const progressSteps = document.querySelectorAll('.step');
        progressSteps.forEach(step => {
            const listener = (e) => {
                const stepName = step.dataset.step;
                if (stepName && this.isModuleAccessible(stepName)) {
                    this.switchModule(stepName);
                }
            };
            step.addEventListener('click', listener);
            this.eventListeners.push({ element: step, event: 'click', listener });
        });
        
        // 鍵盤快捷鍵
        const keyListener = (e) => {
            // Ctrl/Cmd + 數字鍵切換模組
            if ((e.ctrlKey || e.metaKey) && e.key >= '1' && e.key <= '5') {
                e.preventDefault();
                const moduleIndex = parseInt(e.key) - 1;
                const modules = ['assessment', 'flashcard', 'reading', 'quiz', 'poster'];
                if (modules[moduleIndex] && this.isModuleAccessible(modules[moduleIndex])) {
                    this.switchModule(modules[moduleIndex]);
                }
            }
            
            // ESC 鍵關閉模態框
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        };
        document.addEventListener('keydown', keyListener);
        this.eventListeners.push({ element: document, event: 'keydown', listener: keyListener });
        
        // 視窗調整大小事件
        const resizeListener = () => {
            this.handleResize();
        };
        window.addEventListener('resize', resizeListener);
        this.eventListeners.push({ element: window, event: 'resize', listener: resizeListener });
        
        // 頁面可見性變化
        const visibilityListener = () => {
            if (document.visibilityState === 'visible') {
                this.handlePageVisible();
            } else {
                this.handlePageHidden();
            }
        };
        document.addEventListener('visibilitychange', visibilityListener);
        this.eventListeners.push({ element: document, event: 'visibilitychange', listener: visibilityListener });
    }
    
    /**
     * 模組切換管理
     */
    switchModule(moduleName) {
        if (!this.isModuleAccessible(moduleName)) {
            this.showNotification('請先完成前面的步驟', 'warning');
            return;
        }
        
        // 隱藏所有模組
        const allModules = document.querySelectorAll('.module');
        allModules.forEach(module => {
            module.classList.remove('active');
        });
        
        // 顯示目標模組
        const targetModule = document.getElementById(`${moduleName}-module`);
        if (targetModule) {
            targetModule.classList.add('active');
            this.currentModule = moduleName;
            
            // 更新導航狀態
            this.updateNavigation(moduleName);
            
            // 更新進度指示器
            this.updateProgressIndicator(moduleName);
            
            // 通知模組已切換
            this.emit('moduleChanged', { module: moduleName });
            
            // 初始化模組（如果需要）
            if (this.modules[moduleName] && typeof this.modules[moduleName].onShow === 'function') {
                this.modules[moduleName].onShow();
            }
            
            console.log(`📄 切換到模組: ${moduleName}`);
        } else {
            console.error(`❌ 找不到模組: ${moduleName}`);
        }
    }
    
    /**
     * 檢查模組是否可訪問
     */
    isModuleAccessible(moduleName) {
        const moduleOrder = ['assessment', 'flashcard', 'reading', 'quiz', 'poster'];
        const currentIndex = moduleOrder.indexOf(this.currentModule);
        const targetIndex = moduleOrder.indexOf(moduleName);
        
        // 第一個模組（assessment）總是可訪問
        if (moduleName === 'assessment') {
            return true;
        }
        
        // 如果用戶已完成分級測驗，允許訪問後續模組
        if (this.userLevel) {
            return true;
        }
        
        // 否則只能順序訪問
        return targetIndex <= currentIndex + 1;
    }
    
    /**
     * 更新導航狀態
     */
    updateNavigation(activeModule) {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.dataset.module === activeModule) {
                link.classList.add('active');
            }
        });
    }
    
    /**
     * 更新進度指示器
     */
    updateProgressIndicator(activeModule) {
        const steps = document.querySelectorAll('.step');
        const moduleOrder = ['assessment', 'flashcard', 'reading', 'quiz', 'poster'];
        const activeIndex = moduleOrder.indexOf(activeModule);
        
        steps.forEach((step, index) => {
            step.classList.remove('active', 'completed');
            
            if (index < activeIndex) {
                step.classList.add('completed');
            } else if (index === activeIndex) {
                step.classList.add('active');
            }
        });
    }
    
    /**
     * 設定用戶級別
     */
    setUserLevel(level, abilities = {}) {
        if (!this.cefrLevels[level]) {
            console.error('❌ 無效的CEFR級別:', level);
            return;
        }
        
        this.userLevel = level;
        this.appState.user.level = level;
        this.appState.assessment.abilities = abilities;
        
        // 更新UI顯示
        this.updateLevelDisplay(level);
        
        // 儲存用戶資料
        this.saveUserData();
        
        // 通知級別變更
        this.emit('levelChanged', { level, abilities });
        
        console.log(`🎯 用戶級別設定為: ${level} (${this.cefrLevels[level].name})`);
    }
    
    /**
     * 更新級別顯示
     */
    updateLevelDisplay(level) {
        const levelBadge = document.getElementById('userLevelBadge');
        if (levelBadge) {
            levelBadge.textContent = level;
            levelBadge.className = `level-indicator level-badge ${level.toLowerCase()}`;
        }
        
        // 更新其他級別顯示元素
        const levelElements = document.querySelectorAll('[data-user-level]');
        levelElements.forEach(element => {
            element.textContent = level;
            element.className = element.className.replace(/\b[abc][12]?\b/gi, level.toLowerCase());
        });
    }
    
    /**
     * 學習進度更新
     */
    updateProgress(moduleData) {
        const { module, progress, score, completedItems } = moduleData;
        
        if (!this.learningProgress[module]) {
            this.learningProgress[module] = {};
        }
        
        // 更新模組進度
        Object.assign(this.learningProgress[module], {
            progress: progress || 0,
            score: score || 0,
            completedItems: completedItems || 0,
            lastUpdated: new Date().toISOString()
        });
        
        // 儲存進度
        this.saveUserData();
        
        // 發送進度更新事件
        this.emit('progressUpdated', { module, data: this.learningProgress[module] });
        
        console.log(`📈 ${module} 模組進度更新:`, this.learningProgress[module]);
    }
    
    /**
     * 載入用戶資料
     */
    loadUserData() {
        try {
            // 從記憶體變數中載入（因為不能使用localStorage）
            if (window.cefrUserData) {
                const userData = window.cefrUserData;
                this.userLevel = userData.level;
                this.learningProgress = userData.progress || {};
                this.appState.user = { ...this.appState.user, ...userData };
                
                if (this.userLevel) {
                    this.updateLevelDisplay(this.userLevel);
                }
                
                console.log('💾 用戶資料載入成功');
            }
        } catch (error) {
            console.warn('⚠️ 用戶資料載入失敗:', error);
        }
    }
    
    /**
     * 儲存用戶資料
     */
    saveUserData() {
        try {
            const userData = {
                level: this.userLevel,
                progress: this.learningProgress,
                preferences: this.appState.user.preferences,
                lastAccess: new Date().toISOString()
            };
            
            // 儲存到記憶體變數（因為不能使用localStorage）
            window.cefrUserData = userData;
            
            console.log('💾 用戶資料儲存成功');
        } catch (error) {
            console.error('❌ 用戶資料儲存失敗:', error);
        }
    }
    
    /**
     * 初始化UI狀態
     */
    initializeUI() {
        // 設定載入動畫
        this.hideLoading();
        
        // 檢查設備能力
        this.checkDeviceCapabilities();
    }
    
    /**
     * 檢查設備能力
     */
    checkDeviceCapabilities() {
        // 檢查觸控支援
        if ('ontouchstart' in window) {
            document.body.classList.add('touch-device');
        }
        
        // 檢查網路狀態
        if ('onLine' in navigator) {
            document.body.classList.toggle('offline', !navigator.onLine);
            
            window.addEventListener('online', () => {
                document.body.classList.remove('offline');
                this.showNotification('網路連線已恢復', 'success');
            });
            
            window.addEventListener('offline', () => {
                document.body.classList.add('offline');
                this.showNotification('網路連線中斷，部分功能可能受限', 'warning');
            });
        }
    }
    
    /**
     * 處理視窗大小調整
     */
    handleResize() {
        // 更新視窗大小相關的UI
        this.emit('windowResized', {
            width: window.innerWidth,
            height: window.innerHeight
        });
    }
    
    /**
     * 處理頁面變為可見
     */
    handlePageVisible() {
        // 頁面重新可見時的邏輯
        console.log('📱 頁面變為可見');
        this.emit('pageVisible');
    }
    
    /**
     * 處理頁面變為隱藏
     */
    handlePageHidden() {
        // 頁面隱藏時儲存狀態
        console.log('📱 頁面變為隱藏');
        this.saveUserData();
        this.emit('pageHidden');
    }
    
    /**
     * 顯示載入動畫
     */
    showLoading(message = '載入中...') {
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) {
            const messageElement = loadingOverlay.querySelector('p');
            if (messageElement) {
                messageElement.textContent = message;
            }
            loadingOverlay.style.display = 'flex';
        }
    }
    
    /**
     * 隱藏載入動畫
     */
    hideLoading() {
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) {
            loadingOverlay.style.display = 'none';
        }
    }
    
    /**
     * 顯示通知訊息
     */
    showNotification(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${this.getNotificationColor(type)};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 1000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 300px;
            font-size: 14px;
            line-height: 1.4;
        `;
        
        notification.innerHTML = `
            <div style="display: flex; align-items: flex-start; gap: 8px;">
                <span style="flex-shrink: 0;">${this.getNotificationIcon(type)}</span>
                <span style="flex: 1;">${message}</span>
                <button style="
                    background: none; 
                    border: none; 
                    color: white; 
                    cursor: pointer; 
                    font-size: 16px; 
                    line-height: 1; 
                    padding: 0; 
                    margin-left: 8px;
                    flex-shrink: 0;
                ">&times;</button>
            </div>
        `;
        
        // 添加到頁面
        document.body.appendChild(notification);
        
        // 動畫顯示
        setTimeout(() => notification.style.transform = 'translateX(0)', 10);
        
        // 自動隱藏
        const autoHide = setTimeout(() => {
            this.hideNotification(notification);
        }, duration);
        
        // 點擊關閉
        const closeBtn = notification.querySelector('button');
        closeBtn.addEventListener('click', () => {
            clearTimeout(autoHide);
            this.hideNotification(notification);
        });
        
        return notification;
    }
    
    /**
     * 隱藏通知訊息
     */
    hideNotification(notification) {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }
    
    /**
     * 取得通知顏色
     */
    getNotificationColor(type) {
        const colors = {
            success: '#10b981',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#06b6d4'
        };
        return colors[type] || colors.info;
    }
    
    /**
     * 取得通知圖示
     */
    getNotificationIcon(type) {
        const icons = {
            success: '✓',
            error: '✗',
            warning: '⚠',
            info: 'ℹ'
        };
        return icons[type] || icons.info;
    }
    
    /**
     * 顯示錯誤訊息
     */
    showError(message, error = null) {
        console.error('❌ 錯誤:', message, error);
        this.showNotification(message, 'error', 5000);
    }
    
    /**
     * 關閉所有模態框
     */
    closeAllModals() {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.classList.remove('show');
            modal.style.display = 'none';
        });
    }
    
    /**
     * 顯示模組
     */
    showModule(moduleName) {
        this.switchModule(moduleName);
    }
    
    /**
     * 處理文本輸入
     */
    processTextInput(text) {
        if (!text || text.trim().length === 0) {
            this.showError('請輸入有效的文本內容');
            return;
        }
        
        this.showLoading('正在分析文本內容...');
        
        try {
            // 分析文本
            const analysis = this.analyzeText(text);
            
            // 儲存到應用程式狀態
            this.appState.content.original = text;
            this.appState.content.processed = analysis;
            
            // 通知所有模組有新內容
            this.emit('contentProcessed', {
                original: text,
                analysis: analysis
            });
            
            this.hideLoading();
            this.showNotification('文本處理完成！', 'success');
            
        } catch (error) {
            this.hideLoading();
            this.showError('文本處理失敗', error);
        }
    }
    
    /**
     * 分析文本內容
     */
    analyzeText(text) {
        // 基本文本統計
        const words = text.split(/\s+/).filter(word => word.length > 0);
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
        const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
        
        // 詞彙級別分析（簡化版）
        const vocabularyAnalysis = this.analyzeVocabulary(words);
        
        // 語法複雜度分析（簡化版）
        const grammarComplexity = this.analyzeGrammarComplexity(sentences);
        
        // 估算CEFR級別
        const estimatedLevel = this.estimateCEFRLevel(vocabularyAnalysis, grammarComplexity);
        
        return {
            statistics: {
                wordCount: words.length,
                sentenceCount: sentences.length,
                paragraphCount: paragraphs.length,
                averageWordsPerSentence: Math.round(words.length / sentences.length)
            },
            vocabulary: vocabularyAnalysis,
            grammar: grammarComplexity,
            estimatedLevel: estimatedLevel
        };
    }
    
    /**
     * 分析詞彙級別
     */
    analyzeVocabulary(words) {
        // 簡化的詞彙級別判定
        const levelDistribution = { A1: 0, A2: 0, B1: 0, B2: 0, C1: 0, C2: 0 };
        const uniqueWords = [...new Set(words.map(w => w.toLowerCase()))];
        
        uniqueWords.forEach(word => {
            // 簡單的級別判定邏輯（實際應用中需要詞彙數據庫）
            const wordLength = word.length;
            if (wordLength <= 3) {
                levelDistribution.A1++;
            } else if (wordLength <= 5) {
                levelDistribution.A2++;
            } else if (wordLength <= 7) {
                levelDistribution.B1++;
            } else if (wordLength <= 9) {
                levelDistribution.B2++;
            } else if (wordLength <= 12) {
                levelDistribution.C1++;
            } else {
                levelDistribution.C2++;
            }
        });
        
        return {
            uniqueWordCount: uniqueWords.length,
            levelDistribution: levelDistribution
        };
    }
    
    /**
     * 分析語法複雜度
     */
    analyzeGrammarComplexity(sentences) {
        let complexity = 'basic';
        let complexSentences = 0;
        
        sentences.forEach(sentence => {
            // 簡單的複雜度判定
            const words = sentence.split(/\s+/).length;
            const hasConjunctions = /\b(because|although|however|therefore|meanwhile)\b/i.test(sentence);
            const hasPassiveVoice = /\b(is|are|was|were)\s+\w+ed\b/i.test(sentence);
            
            if (words > 20 || hasConjunctions || hasPassiveVoice) {
                complexSentences++;
            }
        });
        
        const complexityRatio = complexSentences / sentences.length;
        
        if (complexityRatio > 0.7) complexity = 'advanced';
        else if (complexityRatio > 0.4) complexity = 'complex';
        else if (complexityRatio > 0.2) complexity = 'compound';
        else complexity = 'simple';
        
        return {
            level: complexity,
            complexSentenceRatio: complexityRatio
        };
    }
    
    /**
     * 估算CEFR級別
     */
    estimateCEFRLevel(vocabulary, grammar) {
        // 簡化的級別估算邏輯
        const vocabularyScore = this.calculateVocabularyScore(vocabulary);
        const grammarScore = this.calculateGrammarScore(grammar);
        
        const overallScore = (vocabularyScore + grammarScore) / 2;
        
        if (overallScore >= 5.5) return 'C2';
        if (overallScore >= 4.5) return 'C1';
        if (overallScore >= 3.5) return 'B2';
        if (overallScore >= 2.5) return 'B1';
        if (overallScore >= 1.5) return 'A2';
        return 'A1';
    }
    
    /**
     * 計算詞彙分數
     */
    calculateVocabularyScore(vocabulary) {
        const { levelDistribution, uniqueWordCount } = vocabulary;
        const total = Object.values(levelDistribution).reduce((sum, count) => sum + count, 0);
        
        if (total === 0) return 1;
        
        let score = 0;
        score += (levelDistribution.A1 / total) * 1;
        score += (levelDistribution.A2 / total) * 2;
        score += (levelDistribution.B1 / total) * 3;
        score += (levelDistribution.B2 / total) * 4;
        score += (levelDistribution.C1 / total) * 5;
        score += (levelDistribution.C2 / total) * 6;
        
        return score;
    }
    
    /**
     * 計算語法分數
     */
    calculateGrammarScore(grammar) {
        const { level } = grammar;
        const scores = {
            'basic': 1,
            'simple': 2,
            'compound': 3,
            'complex': 4,
            'advanced': 5
        };
        return scores[level] || 1;
    }
    
    // ==========================================
    // 事件系統
    // ==========================================
    
    /**
     * 事件監聽器註冊
     */
    on(event, callback) {
        if (!this.eventListeners[event]) {
            this.eventListeners[event] = [];
        }
        this.eventListeners[event].push(callback);
    }
    
    /**
     * 事件觸發
     */
    emit(event, data = null) {
        if (this.eventListeners[event]) {
            this.eventListeners[event].forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`事件 ${event} 處理器錯誤:`, error);
                }
            });
        }
    }
    
    /**
     * 移除事件監聽器
     */
    off(event, callback) {
        if (this.eventListeners[event]) {
            const index = this.eventListeners[event].indexOf(callback);
            if (index > -1) {
                this.eventListeners[event].splice(index, 1);
            }
        }
    }
    
    // ==========================================
    // 工具函數
    // ==========================================
    
    /**
     * 格式化日期
     */
    formatDate(date, format = 'YYYY-MM-DD') {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        
        return format
            .replace('YYYY', year)
            .replace('MM', month)
            .replace('DD', day);
    }
    
    /**
     * 防抖函數
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    /**
     * 節流函數
     */
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
    
    /**
     * 深度複製對象
     */
    deepClone(obj) {
        if (obj === null || typeof obj !== 'object') return obj;
        if (obj instanceof Date) return new Date(obj.getTime());
        if (obj instanceof Array) return obj.map(item => this.deepClone(item));
        if (typeof obj === 'object') {
            const copy = {};
            Object.keys(obj).forEach(key => {
                copy[key] = this.deepClone(obj[key]);
            });
            return copy;
        }
    }
    
    /**
     * 產生唯一ID
     */
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
    
    /**
     * 清理資源
     */
    destroy() {
        // 移除所有事件監聽器
        this.eventListeners.forEach(({ element, event, listener }) => {
            element.removeEventListener(event, listener);
        });
        
        // 清理模組
        Object.values(this.modules).forEach(module => {
            if (typeof module.destroy === 'function') {
                module.destroy();
            }
        });
        
        // 清理全域變數
        if (window.cefrUserData) {
            delete window.cefrUserData;
        }
        
        console.log('🗑️ 應用程式資源清理完成');
    }
}

// 確保類別在全域範圍內可用
window.CEFRLearningApp = CEFRLearningApp;