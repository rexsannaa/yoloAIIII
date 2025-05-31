/**
 * reading.js - 多模式閱讀理解系統
 * 負責：分級內容、閱讀模式、單詞高亮、即時釋義
 */

class ReadingModule {
    constructor(app) {
        this.app = app;
        this.currentMode = 'bilingual'; // bilingual/english/chinese
        this.difficulty = 4; // 1-6級難度
        this.content = '';
        this.leveledWords = {};
        this.highlightedWords = [];
        
        // 範例內容庫
        this.contentDatabase = this.generateContentDatabase();
        
        this.init();
    }
    
    /**
     * 初始化閱讀模組
     */
    init() {
        console.log('📖 多模式閱讀模組初始化');
        this.setupEventListeners();
        this.loadDefaultContent();
    }
    
    /**
     * 設定事件監聽器
     */
    setupEventListeners() {
        // 閱讀模式切換
        const modeButtons = document.querySelectorAll('.mode-btn');
        modeButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const mode = e.target.dataset.mode;
                this.switchReadingMode(mode);
            });
        });
        
        // 難度調整滑桿
        const difficultySlider = document.getElementById('difficultySlider');
        if (difficultySlider) {
            difficultySlider.addEventListener('input', (e) => {
                this.adjustDifficulty(parseInt(e.target.value));
            });
        }
        
        // 監聽級別變更
        this.app.on('levelChanged', (data) => {
            this.adjustContentForLevel(data.level);
        });
        
        // 監聽內容處理事件
        this.app.on('contentProcessed', (data) => {
            this.loadProcessedContent(data);
        });
    }
    
    /**
     * 生成內容資料庫
     */
    generateContentDatabase() {
        return {
            A1: {
                title: "My Daily Life",
                english: "I wake up at 7 AM every day. I eat breakfast and go to work. I work in an office. I come home at 6 PM. I cook dinner and watch TV. I go to bed at 10 PM.",
                chinese: "我每天早上7點起床。我吃早餐然後去上班。我在辦公室工作。我下午6點回家。我做晚餐和看電視。我晚上10點睡覺。",
                vocabulary: [
                    { word: "wake", level: "A1", meaning: "醒來" },
                    { word: "breakfast", level: "A1", meaning: "早餐" },
                    { word: "office", level: "A1", meaning: "辦公室" },
                    { word: "dinner", level: "A1", meaning: "晚餐" }
                ]
            },
            A2: {
                title: "Weekend Plans",
                english: "This weekend I plan to visit my friends. We will go to the park and have a picnic. The weather forecast says it will be sunny and warm. After the picnic, we might go shopping or watch a movie.",
                chinese: "這個週末我計劃拜訪朋友。我們會去公園野餐。天氣預報說會是晴朗溫暖的天氣。野餐後，我們可能會去購物或看電影。",
                vocabulary: [
                    { word: "plan", level: "A2", meaning: "計劃" },
                    { word: "picnic", level: "A2", meaning: "野餐" },
                    { word: "forecast", level: "A2", meaning: "預報" },
                    { word: "shopping", level: "A2", meaning: "購物" }
                ]
            },
            B1: {
                title: "Environmental Protection",
                english: "Environmental protection has become increasingly important in recent years. Climate change affects our daily lives in many ways. People are now more aware of the need to reduce pollution and conserve natural resources. Many countries have implemented policies to promote renewable energy and sustainable development.",
                chinese: "近年來環境保護變得越來越重要。氣候變化在許多方面影響我們的日常生活。人們現在更加意識到減少污染和保護自然資源的必要性。許多國家已經實施政策來促進再生能源和可持續發展。",
                vocabulary: [
                    { word: "increasingly", level: "B1", meaning: "越來越" },
                    { word: "pollution", level: "B1", meaning: "污染" },
                    { word: "conserve", level: "B1", meaning: "保護" },
                    { word: "sustainable", level: "B1", meaning: "可持續的" }
                ]
            },
            B2: {
                title: "Artificial Intelligence Revolution",
                english: "The rapid advancement of artificial intelligence has transformed the way we work and live. Machine learning algorithms enable computers to perform tasks that were once thought to be exclusively human. However, this technological revolution also raises important questions about employment, privacy, and ethical considerations that society must address.",
                chinese: "人工智慧的快速進步改變了我們工作和生活的方式。機器學習演算法使電腦能夠執行曾經被認為是人類專有的任務。然而，這場技術革命也提出了關於就業、隱私和道德考量的重要問題，社會必須加以解決。",
                vocabulary: [
                    { word: "advancement", level: "B2", meaning: "進步" },
                    { word: "algorithms", level: "B2", meaning: "演算法" },
                    { word: "exclusively", level: "B2", meaning: "專有地" },
                    { word: "ethical", level: "B2", meaning: "道德的" }
                ]
            },
            C1: {
                title: "Global Economic Interdependence",
                english: "In today's interconnected world, economic interdependence has reached unprecedented levels. The globalization of markets has created complex networks of trade relationships that can amplify both opportunities and risks. A financial crisis in one region can quickly propagate across continents, demonstrating the delicate balance of our integrated global economy.",
                chinese: "在當今相互關聯的世界中，經濟相互依存已達到前所未有的水平。市場全球化創造了複雜的貿易關係網絡，可以放大機會和風險。一個地區的金融危機可以迅速傳播到各大洲，證明了我們整合的全球經濟的微妙平衡。",
                vocabulary: [
                    { word: "interdependence", level: "C1", meaning: "相互依存" },
                   { word: "unprecedented", level: "C1", meaning: "前所未有的" },
                   { word: "amplify", level: "C1", meaning: "放大" },
                   { word: "propagate", level: "C1", meaning: "傳播" }
               ]
           },
           C2: {
               title: "The Paradox of Choice in Modern Society",
               english: "Contemporary society presents us with an unprecedented array of choices, yet paradoxically, this abundance often leads to decision paralysis and decreased satisfaction. The proliferation of options, while ostensibly beneficial, can overwhelm our cognitive capacity and create anxiety about making suboptimal decisions. This phenomenon underscores the complex relationship between freedom and well-being in affluent societies.",
               chinese: "當代社會為我們提供了前所未有的選擇陣列，然而矛盾的是，這種豐富往往導致決策癱瘓和滿意度下降。選項的激增雖然表面上有益，但可能會壓倒我們的認知能力，並對做出次優決策產生焦慮。這種現象強調了富裕社會中自由與福祉之間的複雜關係。",
               vocabulary: [
                   { word: "paradoxically", level: "C2", meaning: "矛盾地" },
                   { word: "proliferation", level: "C2", meaning: "激增" },
                   { word: "ostensibly", level: "C2", meaning: "表面上" },
                   { word: "suboptimal", level: "C2", meaning: "次優的" }
               ]
           }
       };
   }
   
   /**
    * 載入預設內容
    */
   loadDefaultContent() {
       const userLevel = this.app.userLevel || 'B2';
       const content = this.contentDatabase[userLevel];
       
       if (content) {
           this.loadContent(content);
       }
   }
   
   /**
    * 載入內容
    */
   loadContent(content) {
       this.content = content;
       this.leveledWords = {};
       
       // 處理詞彙級別
       if (content.vocabulary) {
           content.vocabulary.forEach(word => {
               this.leveledWords[word.word.toLowerCase()] = word;
           });
       }
       
       // 顯示內容
       this.displayContent();
       
       // 高亮單詞
       this.highlightWords();
       
       console.log('📄 內容載入完成:', content.title);
   }
   
   /**
    * 顯示內容
    */
   displayContent() {
       const contentDisplay = document.getElementById('contentDisplay');
       if (!contentDisplay || !this.content) return;
       
       const { title, english, chinese } = this.content;
       
       contentDisplay.innerHTML = `
           <div class="content-bilingual mode-${this.currentMode}">
               <div class="content-english">
                   <h3>${title}</h3>
                   <div class="content-text" data-lang="en">${english}</div>
               </div>
               <div class="content-chinese">
                   <h3>${title}</h3>
                   <div class="content-text" data-lang="zh">${chinese}</div>
               </div>
           </div>
       `;
       
       // 應用當前模式
       this.applyReadingMode();
   }
   
   /**
    * 切換閱讀模式
    */
   switchReadingMode(mode) {
       this.currentMode = mode;
       
       // 更新按鈕狀態
       const modeButtons = document.querySelectorAll('.mode-btn');
       modeButtons.forEach(btn => {
           btn.classList.remove('active');
           if (btn.dataset.mode === mode) {
               btn.classList.add('active');
           }
       });
       
       // 應用模式
       this.applyReadingMode();
       
       console.log(`📖 切換到 ${mode} 模式`);
   }
   
   /**
    * 應用閱讀模式
    */
   applyReadingMode() {
       const contentBilingual = document.querySelector('.content-bilingual');
       if (!contentBilingual) return;
       
       // 移除所有模式類別
       contentBilingual.classList.remove('mode-bilingual', 'mode-english', 'mode-chinese');
       
       // 添加當前模式類別
       contentBilingual.classList.add(`mode-${this.currentMode}`);
       
       // 重新高亮單詞
       setTimeout(() => {
           this.highlightWords();
       }, 100);
   }
   
   /**
    * 調整難度
    */
   adjustDifficulty(level) {
       this.difficulty = level;
       
       // 更新難度顯示
       const difficultyLevel = document.getElementById('difficultyLevel');
       if (difficultyLevel) {
           difficultyLevel.textContent = level;
       }
       
       // 重新高亮單詞（根據難度）
       this.highlightWords();
       
       console.log(`📊 難度調整為: ${level}`);
   }
   
   /**
    * 高亮單詞
    */
   highlightWords() {
       const contentTexts = document.querySelectorAll('.content-text[data-lang="en"]');
       
       contentTexts.forEach(textElement => {
           const text = textElement.textContent;
           const words = text.split(/\s+/);
           
           let highlightedText = '';
           
           words.forEach(word => {
               const cleanWord = word.toLowerCase().replace(/[^\w]/g, '');
               const wordData = this.leveledWords[cleanWord];
               
               if (wordData && this.shouldHighlight(wordData)) {
                   const levelClass = wordData.level.toLowerCase();
                   highlightedText += `<span class="word-highlight ${levelClass}" data-word="${cleanWord}">${word}</span> `;
               } else {
                   highlightedText += `${word} `;
               }
           });
           
           textElement.innerHTML = highlightedText.trim();
       });
       
       // 設定高亮單詞的事件監聽
       this.setupWordHighlightEvents();
   }
   
   /**
    * 判斷是否應該高亮單詞
    */
   shouldHighlight(wordData) {
       const levelOrder = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
       const wordLevelIndex = levelOrder.indexOf(wordData.level);
       const difficultyIndex = this.difficulty - 1;
       
       // 根據難度設定決定是否高亮
       return wordLevelIndex <= difficultyIndex;
   }
   
   /**
    * 設定單詞高亮事件
    */
   setupWordHighlightEvents() {
       const highlightedWords = document.querySelectorAll('.word-highlight');
       
       highlightedWords.forEach(wordElement => {
           // 滑鼠懸停顯示釋義
           wordElement.addEventListener('mouseenter', (e) => {
               this.showWordTooltip(e);
           });
           
           wordElement.addEventListener('mouseleave', () => {
               this.hideWordTooltip();
           });
           
           // 點擊單詞詳細資訊
           wordElement.addEventListener('click', (e) => {
               this.showWordDetails(e);
           });
       });
   }
   
   /**
    * 顯示單詞提示框
    */
   showWordTooltip(event) {
       const wordElement = event.target;
       const word = wordElement.dataset.word;
       const wordData = this.leveledWords[word];
       
       if (!wordData) return;
       
       const tooltip = document.getElementById('wordTooltip');
       if (!tooltip) return;
       
       // 設定提示框內容
       tooltip.querySelector('.tooltip-word').textContent = wordData.word;
       tooltip.querySelector('.tooltip-phonetic').textContent = wordData.phonetic || '';
       tooltip.querySelector('.tooltip-meaning').textContent = wordData.meaning;
       tooltip.querySelector('.tooltip-level').textContent = `級別: ${wordData.level}`;
       
       // 定位提示框
       const rect = wordElement.getBoundingClientRect();
       tooltip.style.left = `${rect.left + window.scrollX}px`;
       tooltip.style.top = `${rect.bottom + window.scrollY + 10}px`;
       
       // 顯示提示框
       tooltip.classList.add('show');
   }
   
   /**
    * 隱藏單詞提示框
    */
   hideWordTooltip() {
       const tooltip = document.getElementById('wordTooltip');
       if (tooltip) {
           tooltip.classList.remove('show');
       }
   }
   
   /**
    * 顯示單詞詳細資訊
    */
   showWordDetails(event) {
       const word = event.target.dataset.word;
       const wordData = this.leveledWords[word];
       
       if (!wordData) return;
       
       // 創建詳細資訊模態框
       this.createWordDetailModal(wordData);
   }
   
   /**
    * 創建單詞詳細資訊模態框
    */
   createWordDetailModal(wordData) {
       const modal = document.createElement('div');
       modal.className = 'modal word-detail-modal';
       modal.innerHTML = `
           <div class="modal-content">
               <div class="modal-header">
                   <h3>${wordData.word}</h3>
                   <button class="modal-close">&times;</button>
               </div>
               <div class="modal-body">
                   <div class="word-detail">
                       <div class="level-badge ${wordData.level.toLowerCase()}">${wordData.level}</div>
                       <p><strong>音標：</strong>${wordData.phonetic || '無'}</p>
                       <p><strong>釋義：</strong>${wordData.meaning}</p>
                       <p><strong>詞根：</strong>${wordData.etymology || '無詞根資訊'}</p>
                       ${wordData.examples ? `
                           <div class="word-examples">
                               <h4>例句：</h4>
                               ${wordData.examples.map(example => `
                                   <div class="example-item">
                                       <p class="example-en">${example.english}</p>
                                       <p class="example-zh">${example.chinese}</p>
                                   </div>
                               `).join('')}
                           </div>
                       ` : ''}
                   </div>
               </div>
               <div class="modal-footer">
                   <button class="btn btn-primary" onclick="this.speakWord('${wordData.word}')">發音</button>
                   <button class="btn btn-secondary" onclick="this.addToFavorites('${wordData.word}')">收藏</button>
               </div>
           </div>
       `;
       
       document.body.appendChild(modal);
       setTimeout(() => modal.classList.add('show'), 10);
       
       // 關閉事件
       const closeBtn = modal.querySelector('.modal-close');
       closeBtn.addEventListener('click', () => {
           modal.classList.remove('show');
           setTimeout(() => document.body.removeChild(modal), 300);
       });
       
       modal.addEventListener('click', (e) => {
           if (e.target === modal) {
               modal.classList.remove('show');
               setTimeout(() => document.body.removeChild(modal), 300);
           }
       });
   }
   
   /**
    * 根據級別調整內容
    */
   adjustContentForLevel(level) {
       const content = this.contentDatabase[level];
       if (content) {
           this.loadContent(content);
       }
   }
   
   /**
    * 載入處理過的內容
    */
   loadProcessedContent(data) {
       const { original, analysis } = data;
       
       // 簡單的雙語內容處理
       const processedContent = {
           title: "自訂內容",
           english: original,
           chinese: this.translateToSimpleChinese(original),
           vocabulary: this.extractVocabulary(original, analysis)
       };
       
       this.loadContent(processedContent);
   }
   
   /**
    * 簡單翻譯到中文（示例）
    */
   translateToSimpleChinese(text) {
       // 這裡應該調用翻譯API，現在只是示例
       return "這是翻譯後的中文內容。實際應用中需要接入翻譯服務。";
   }
   
   /**
    * 提取詞彙
    */
   extractVocabulary(text, analysis) {
       const words = text.split(/\s+/).filter(word => word.length > 3);
       const vocabulary = [];
       
       words.forEach(word => {
           const cleanWord = word.toLowerCase().replace(/[^\w]/g, '');
           if (cleanWord.length > 3) {
               vocabulary.push({
                   word: cleanWord,
                   level: this.estimateWordLevel(cleanWord),
                   meaning: "需要字典查詢",
                   phonetic: "/" + cleanWord + "/"
               });
           }
       });
       
       return vocabulary.slice(0, 20); // 限制詞彙數量
   }
   
   /**
    * 估算單詞級別
    */
   estimateWordLevel(word) {
       // 簡化的級別估算
       if (word.length <= 4) return 'A1';
       if (word.length <= 6) return 'A2';
       if (word.length <= 8) return 'B1';
       if (word.length <= 10) return 'B2';
       if (word.length <= 12) return 'C1';
       return 'C2';
   }
   
   /**
    * 語音朗讀
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
    * 添加到收藏
    */
   addToFavorites(word) {
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
    * 取得閱讀統計
    */
   getReadingStatistics() {
       const totalWords = this.content ? this.content.english.split(/\s+/).length : 0;
       const highlightedWordsCount = document.querySelectorAll('.word-highlight').length;
       const readingTime = Date.now() - (this.startTime || Date.now());
       
       return {
           totalWords,
           highlightedWords: highlightedWordsCount,
           readingTime,
           wordsPerMinute: readingTime > 0 ? Math.round((totalWords / (readingTime / 60000))) : 0,
           currentMode: this.currentMode,
           difficulty: this.difficulty
       };
   }
   
   /**
    * 切換到下一篇文章
    */
   loadNextArticle() {
       const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
       const currentLevelIndex = levels.indexOf(this.app.userLevel || 'B2');
       const nextLevelIndex = (currentLevelIndex + 1) % levels.length;
       const nextLevel = levels[nextLevelIndex];
       
       const nextContent = this.contentDatabase[nextLevel];
       if (nextContent) {
           this.loadContent(nextContent);
           this.app.showNotification(`載入 ${nextLevel} 級別文章`, 'info');
       }
   }
   
   /**
    * 重新開始閱讀計時
    */
   startReadingSession() {
       this.startTime = Date.now();
       console.log('📚 開始閱讀會話');
   }
   
   /**
    * 結束閱讀會話
    */
   endReadingSession() {
       const stats = this.getReadingStatistics();
       
       // 更新應用程式進度
       this.app.updateProgress({
           module: 'reading',
           progress: 100,
           score: stats.wordsPerMinute,
           completedItems: stats.totalWords
       });
       
       console.log('📚 閱讀會話結束:', stats);
       return stats;
   }
   
   /**
    * 匯出閱讀記錄
    */
   exportReadingRecord() {
       const stats = this.getReadingStatistics();
       const record = {
           timestamp: new Date().toISOString(),
           content: {
               title: this.content?.title || '',
               wordCount: stats.totalWords
           },
           settings: {
               mode: this.currentMode,
               difficulty: this.difficulty
           },
           performance: {
               readingTime: stats.readingTime,
               wordsPerMinute: stats.wordsPerMinute,
               highlightedWords: stats.highlightedWords
           }
       };
       
       return record;
   }
   
   /**
    * 模組顯示時的回調
    */
   onShow() {
       // 重新開始閱讀計時
       this.startReadingSession();
       
       // 如果沒有內容，載入預設內容
       if (!this.content) {
           this.loadDefaultContent();
       }
       
       console.log('📖 閱讀模組已顯示');
   }
   
   /**
    * 模組隱藏時的回調
    */
   onHide() {
       // 結束閱讀會話
       this.endReadingSession();
       
       // 隱藏工具提示
       this.hideWordTooltip();
       
       console.log('📖 閱讀模組已隱藏');
   }
   
   /**
    * 清理資源
    */
   destroy() {
       // 隱藏工具提示
       this.hideWordTooltip();
       
       // 清理事件監聽器（由主應用程式處理）
       
       console.log('🗑️ Reading模組資源清理完成');
   }
}

// 確保類別在全域範圍內可用
window.ReadingModule = ReadingModule;