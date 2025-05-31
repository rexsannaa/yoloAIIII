/**
 * poster.js - 個性化成就海報系統
 * 負責：級別徽章、學習統計、海報生成、風格切換
 */

class PosterModule {
    constructor(app) {
        this.app = app;
        this.currentStyle = 'modern';
        this.posterData = {};
        this.canvasContext = null;
        
        // 海報樣式模板
        this.styleTemplates = this.generateStyleTemplates();
        
        this.init();
    }
    
    /**
     * 初始化海報模組
     */
    init() {
        console.log('🏆 個性化成就海報模組初始化');
        this.setupEventListeners();
        this.generatePosterData();
        this.renderPoster();
    }
    
    /**
     * 設定事件監聽器
     */
    setupEventListeners() {
        // 風格選擇器
        const styleSelector = document.getElementById('posterStyle');
        if (styleSelector) {
            styleSelector.addEventListener('change', (e) => {
                this.switchStyle(e.target.value);
            });
        }
        
        // 海報操作按鈕
        const downloadBtn = document.getElementById('downloadPoster');
        const shareBtn = document.getElementById('sharePoster');
        const regenerateBtn = document.getElementById('regeneratePoster');
        
        if (downloadBtn) downloadBtn.addEventListener('click', () => this.downloadPoster());
        if (shareBtn) shareBtn.addEventListener('click', () => this.sharePoster());
        if (regenerateBtn) regenerateBtn.addEventListener('click', () => this.regeneratePoster());
        
        // 監聽級別變更
        this.app.on('levelChanged', (data) => {
            this.updatePosterForLevel(data.level, data.abilities);
        });
        
        // 監聽進度更新
        this.app.on('progressUpdated', (data) => {
            this.updatePosterProgress(data);
        });
    }
    
    /**
     * 生成樣式模板
     */
    generateStyleTemplates() {
        return {
            modern: {
                name: '現代風格',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                textColor: '#ffffff',
                accentColor: '#ffd700',
                font: 'system-ui, -apple-system, sans-serif',
                borderRadius: '16px',
                shadow: '0 25px 50px rgba(0, 0, 0, 0.25)'
            },
            classic: {
                name: '經典風格',
                background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
                textColor: '#ecf0f1',
                accentColor: '#f39c12',
                font: 'Georgia, serif',
                borderRadius: '8px',
                shadow: '0 15px 35px rgba(0, 0, 0, 0.3)'
            },
            minimal: {
                name: '簡約風格',
                background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                textColor: '#343a40',
                accentColor: '#007bff',
                font: 'system-ui, -apple-system, sans-serif',
                borderRadius: '12px',
                shadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
            }
        };
    }
    
    /**
     * 生成海報資料
     */
    generatePosterData() {
        const userLevel = this.app.userLevel || 'B2';
        const levelInfo = this.app.cefrLevels[userLevel];
        
        // 收集學習統計資料
        const stats = this.collectLearningStatistics();
        
        this.posterData = {
            // 基本資訊
            level: userLevel,
            levelName: levelInfo ? levelInfo.name : '中高級',
            levelDescription: levelInfo ? levelInfo.description : '流利且詳細地表達想法',
            
            // 學習統計
            statistics: stats,
            
            // 日期資訊
            completionDate: new Date().toLocaleDateString('zh-TW', {
                year: 'numeric',
                month: 'long'
            }),
            certificateId: this.generateCertificateId(),
            
            // 進度資訊
            timeline: this.generateProgressTimeline(),
            
            // 成就資訊
            achievements: this.generateAchievements(stats)
        };
        
        console.log('📊 海報資料生成完成:', this.posterData);
    }
    
    /**
     * 收集學習統計資料
     */
    collectLearningStatistics() {
        const stats = {
            studyWords: 0,
            testScore: 0,
            studyDays: 0,
            readingArticles: 0,
            quizAccuracy: 0
        };
        
        // 從各模組收集統計資料
        if (this.app.modules.flashcard) {
            const flashcardStats = this.app.modules.flashcard.getStudyStatistics();
            stats.studyWords = flashcardStats.learnedCount || 150;
        }
        
        if (this.app.modules.quiz) {
            const quizStats = this.app.modules.quiz.getQuizStatistics();
            stats.testScore = quizStats.accuracy || 85;
            stats.quizAccuracy = quizStats.accuracy || 85;
        }
        
        if (this.app.modules.reading) {
            const readingStats = this.app.modules.reading.getReadingStatistics();
            stats.readingArticles = 5; // 預設值
            }
       
       // 從應用程式狀態獲取額外統計
       if (this.app.learningProgress) {
           const totalProgress = Object.values(this.app.learningProgress);
           stats.studyDays = Math.ceil(totalProgress.length / 2) || 30;
       }
       
       // 確保有合理的預設值
       stats.studyWords = stats.studyWords || 150;
       stats.testScore = stats.testScore || 85;
       stats.studyDays = stats.studyDays || 30;
       stats.readingArticles = stats.readingArticles || 5;
       stats.quizAccuracy = stats.quizAccuracy || 85;
       
       return stats;
   }
   
   /**
    * 生成證書ID
    */
   generateCertificateId() {
       const timestamp = Date.now().toString(36);
       const random = Math.random().toString(36).substr(2, 5);
       return `CEFR-${timestamp}-${random}`.toUpperCase();
   }
   
   /**
    * 生成進度時間軸
    */
   generateProgressTimeline() {
       const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
       const currentLevel = this.app.userLevel || 'B2';
       const currentIndex = levels.indexOf(currentLevel);
       
       return levels.map((level, index) => ({
           level: level,
           name: this.app.cefrLevels[level]?.name || level,
           status: index <= currentIndex ? 'completed' : 
                  index === currentIndex + 1 ? 'current' : 'future',
           completed: index <= currentIndex
       }));
   }
   
   /**
    * 生成成就資訊
    */
   generateAchievements(stats) {
       const achievements = [];
       
       // 基於統計資料生成成就
       if (stats.studyWords >= 100) {
           achievements.push({
               icon: '📚',
               title: '詞彙大師',
               description: `學習了 ${stats.studyWords} 個單詞`
           });
       }
       
       if (stats.testScore >= 80) {
           achievements.push({
               icon: '🎯',
               title: '測驗高手',
               description: `測驗得分 ${stats.testScore}%`
           });
       }
       
       if (stats.studyDays >= 30) {
           achievements.push({
               icon: '⏰',
               title: '堅持學習',
               description: `連續學習 ${stats.studyDays} 天`
           });
       }
       
       // 級別成就
       const levelAchievements = {
           'A1': { icon: '🌱', title: '英語新手', description: '踏出英語學習第一步' },
           'A2': { icon: '🌿', title: '基礎建立', description: '掌握基本溝通能力' },
           'B1': { icon: '🌳', title: '中級進步', description: '可以表達複雜想法' },
           'B2': { icon: '🏆', title: '流利溝通', description: '具備流利表達能力' },
           'C1': { icon: '🎓', title: '高級水平', description: '接近母語使用者' },
           'C2': { icon: '👑', title: '精通英語', description: '達到母語水平' }
       };
       
       const levelAchievement = levelAchievements[this.app.userLevel || 'B2'];
       if (levelAchievement) {
           achievements.unshift(levelAchievement);
       }
       
       return achievements;
   }
   
   /**
    * 渲染海報
    */
   renderPoster() {
       const posterCanvas = document.getElementById('posterCanvas');
       if (!posterCanvas) return;
       
       const style = this.styleTemplates[this.currentStyle];
       
       // 應用樣式到海報容器
       posterCanvas.style.background = style.background;
       posterCanvas.style.color = style.textColor;
       posterCanvas.style.fontFamily = style.font;
       posterCanvas.style.borderRadius = style.borderRadius;
       posterCanvas.style.boxShadow = style.shadow;
       
       // 更新內容
       this.updatePosterContent();
       
       // 更新日期
       this.updateCertificateDate();
       
       console.log(`🎨 海報渲染完成 (${this.currentStyle} 風格)`);
   }
   
   /**
    * 更新海報內容
    */
   updatePosterContent() {
       const data = this.posterData;
       
       // 更新級別資訊
       const posterLevel = document.getElementById('posterLevel');
       const posterLevelName = document.getElementById('posterLevelName');
       const posterLevelDesc = document.getElementById('posterLevelDesc');
       
       if (posterLevel) {
           posterLevel.textContent = data.level;
           posterLevel.className = `badge-level level-badge ${data.level.toLowerCase()}`;
       }
       
       if (posterLevelName) {
           posterLevelName.textContent = `CEFR ${data.level} ${data.levelName}`;
       }
       
       if (posterLevelDesc) {
           posterLevelDesc.textContent = data.levelDescription;
       }
       
       // 更新統計資料
       const statWords = document.getElementById('statWords');
       const statScore = document.getElementById('statScore');
       const statDays = document.getElementById('statDays');
       
       if (statWords) statWords.textContent = data.statistics.studyWords;
       if (statScore) statScore.textContent = data.statistics.testScore;
       if (statDays) statDays.textContent = data.statistics.studyDays;
       
       // 更新進度時間軸
       this.updateProgressTimeline();
       
       // 更新成就徽章顏色
       this.updateAchievementBadge();
   }
   
   /**
    * 更新證書日期
    */
   updateCertificateDate() {
       const certificateDate = document.getElementById('certificateDate');
       if (certificateDate) {
           certificateDate.textContent = this.posterData.completionDate;
       }
   }
   
   /**
    * 更新進度時間軸
    */
   updateProgressTimeline() {
       const timeline = document.querySelector('.progress-timeline');
       if (!timeline) return;
       
       // 清除現有內容
       timeline.innerHTML = '';
       
       // 重新生成時間軸
       this.posterData.timeline.forEach(item => {
           const timelineItem = document.createElement('div');
           timelineItem.className = `timeline-item ${item.status}`;
           timelineItem.innerHTML = `
               <div class="timeline-badge">${item.level}</div>
               <span>${item.name}</span>
           `;
           timeline.appendChild(timelineItem);
       });
   }
   
   /**
    * 更新成就徽章
    */
   updateAchievementBadge() {
       const achievementBadge = document.querySelector('.achievement-badge');
       if (!achievementBadge) return;
       
       const level = this.posterData.level;
       const levelColor = this.app.cefrLevels[level]?.color || '#8b5cf6';
       
       achievementBadge.style.background = `linear-gradient(45deg, ${levelColor}, ${levelColor}cc)`;
   }
   
   /**
    * 切換海報風格
    */
   switchStyle(styleName) {
       if (!this.styleTemplates[styleName]) {
           console.warn(`⚠️ 未知的風格: ${styleName}`);
           return;
       }
       
       this.currentStyle = styleName;
       this.renderPoster();
       
       this.app.showNotification(`已切換到${this.styleTemplates[styleName].name}`, 'info');
       console.log(`🎨 切換到 ${styleName} 風格`);
   }
   
   /**
    * 根據級別更新海報
    */
   updatePosterForLevel(level, abilities) {
       console.log(`🎯 為 ${level} 級別更新海報`);
       
       // 重新生成海報資料
       this.generatePosterData();
       
       // 重新渲染海報
       this.renderPoster();
   }
   
   /**
    * 更新海報進度
    */
   updatePosterProgress(data) {
       // 更新統計資料
       if (data.module === 'flashcard') {
           this.posterData.statistics.studyWords = data.data.completedItems || this.posterData.statistics.studyWords;
       } else if (data.module === 'quiz') {
           this.posterData.statistics.testScore = data.data.score || this.posterData.statistics.testScore;
       }
       
       // 重新渲染統計部分
       this.updatePosterContent();
   }
   
   /**
    * 下載海報
    */
   async downloadPoster() {
       try {
           this.app.showLoading('正在生成海報...');
           
           // 使用 html2canvas 或類似方法將海報轉換為圖片
           const posterElement = document.getElementById('posterCanvas');
           
           // 簡化版本：創建一個下載連結
           const posterData = this.generatePosterDataURL();
           
           const link = document.createElement('a');
           link.download = `CEFR-${this.posterData.level}-證書-${new Date().toISOString().split('T')[0]}.png`;
           link.href = posterData;
           
           document.body.appendChild(link);
           link.click();
           document.body.removeChild(link);
           
           this.app.hideLoading();
           this.app.showNotification('海報下載成功！', 'success');
           
       } catch (error) {
           this.app.hideLoading();
           this.app.showError('海報下載失敗', error);
       }
   }
   
   /**
    * 生成海報資料URL（簡化版本）
    */
   generatePosterDataURL() {
       // 創建canvas元素
       const canvas = document.createElement('canvas');
       canvas.width = 600;
       canvas.height = 800;
       const ctx = canvas.getContext('2d');
       
       // 繪製背景
       const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
       gradient.addColorStop(0, '#667eea');
       gradient.addColorStop(1, '#764ba2');
       ctx.fillStyle = gradient;
       ctx.fillRect(0, 0, canvas.width, canvas.height);
       
       // 設定字體和顏色
       ctx.fillStyle = 'white';
       ctx.textAlign = 'center';
       
       // 繪製標題
       ctx.font = 'bold 32px system-ui';
       ctx.fillText('英語學習成就證書', canvas.width / 2, 80);
       
       // 繪製級別
       ctx.font = 'bold 72px system-ui';
       ctx.fillText(this.posterData.level, canvas.width / 2, 200);
       
       // 繪製級別名稱
       ctx.font = 'bold 28px system-ui';
       ctx.fillText(`CEFR ${this.posterData.level} ${this.posterData.levelName}`, canvas.width / 2, 250);
       
       // 繪製描述
       ctx.font = '20px system-ui';
       ctx.fillText(this.posterData.levelDescription, canvas.width / 2, 290);
       
       // 繪製統計資料
       ctx.font = 'bold 24px system-ui';
       ctx.fillText(`學習單詞: ${this.posterData.statistics.studyWords}`, canvas.width / 2, 400);
       ctx.fillText(`測驗得分: ${this.posterData.statistics.testScore}%`, canvas.width / 2, 440);
       ctx.fillText(`學習天數: ${this.posterData.statistics.studyDays}`, canvas.width / 2, 480);
       
       // 繪製日期
       ctx.font = '16px system-ui';
       ctx.fillText(this.posterData.completionDate, canvas.width / 2, 700);
       
       // 繪製系統標識
       ctx.fillText('CEFR分級英語學習系統', canvas.width / 2, 750);
       
       return canvas.toDataURL('image/png');
   }
   
   /**
    * 分享海報
    */
   async sharePoster() {
       try {
           // 檢查是否支援 Web Share API
           if (navigator.share) {
               const posterBlob = await this.generatePosterBlob();
               
               const shareData = {
                   title: `我的英語水平達到了 CEFR ${this.posterData.level} 級別！`,
                   text: `我在CEFR分級英語學習系統中達到了 ${this.posterData.level} (${this.posterData.levelName}) 級別！`,
                   files: [new File([posterBlob], 'my-english-achievement.png', { type: 'image/png' })]
               };
               
               await navigator.share(shareData);
               this.app.showNotification('分享成功！', 'success');
               
           } else {
               // 備用方案：複製分享文字到剪貼簿
               const shareText = `我在CEFR分級英語學習系統中達到了 ${this.posterData.level} (${this.posterData.levelName}) 級別！🎉`;
               
               if (navigator.clipboard) {
                   await navigator.clipboard.writeText(shareText);
                   this.app.showNotification('分享文字已複製到剪貼簿', 'success');
               } else {
                   this.app.showNotification('您的瀏覽器不支援分享功能', 'warning');
               }
           }
           
       } catch (error) {
           console.error('分享失敗:', error);
           this.app.showError('分享失敗', error);
       }
   }
   
   /**
    * 生成海報Blob
    */
   async generatePosterBlob() {
       const posterDataURL = this.generatePosterDataURL();
       const response = await fetch(posterDataURL);
       return await response.blob();
   }
   
   /**
    * 重新生成海報
    */
   regeneratePoster() {
       // 重新生成海報資料
       this.generatePosterData();
       
       // 重新渲染海報
       this.renderPoster();
       
       this.app.showNotification('海報已重新生成', 'success');
       console.log('🔄 重新生成海報');
   }
   
   /**
    * 預覽不同風格
    */
   previewStyle(styleName) {
       const originalStyle = this.currentStyle;
       
       // 臨時切換風格
       this.switchStyle(styleName);
       
       // 3秒後恢復原風格
       setTimeout(() => {
           this.switchStyle(originalStyle);
       }, 3000);
   }
   
   /**
    * 自訂海報內容
    */
   customizePoster(customData) {
       // 合併自訂資料
       this.posterData = { ...this.posterData, ...customData };
       
       // 重新渲染
       this.renderPoster();
       
       console.log('✏️ 海報內容已自訂');
   }
   
   /**
    * 取得海報統計
    */
   getPosterStatistics() {
       return {
           level: this.posterData.level,
           statistics: this.posterData.statistics,
           achievements: this.posterData.achievements.length,
           style: this.currentStyle,
           certificateId: this.posterData.certificateId,
           completionDate: this.posterData.completionDate
       };
   }
   
   /**
    * 匯出海報資料
    */
   exportPosterData() {
       const exportData = {
           timestamp: new Date().toISOString(),
           userLevel: this.app.userLevel,
           posterData: this.posterData,
           style: this.currentStyle,
           statistics: this.getPosterStatistics()
       };
       
       return exportData;
   }
   
   /**
    * 載入海報資料
    */
   loadPosterData(importData) {
       if (importData.posterData) {
           this.posterData = importData.posterData;
       }
       
       if (importData.style) {
           this.currentStyle = importData.style;
       }
       
       // 重新渲染
       this.renderPoster();
       
       console.log('📥 海報資料載入完成');
   }
   
   /**
    * 創建多頁海報
    */
   createMultiPagePoster() {
       const pages = [
           this.createCoverPage(),
           this.createStatisticsPage(),
           this.createAchievementsPage(),
           this.createTimelinePage()
       ];
       
       return pages;
   }
   
   /**
    * 創建封面頁
    */
   createCoverPage() {
       return {
           type: 'cover',
           content: {
               title: '英語學習成就證書',
               level: this.posterData.level,
               levelName: this.posterData.levelName,
               description: this.posterData.levelDescription,
               date: this.posterData.completionDate
           }
       };
   }
   
   /**
    * 創建統計頁
    */
   createStatisticsPage() {
       return {
           type: 'statistics',
           content: {
               title: '學習統計',
               statistics: this.posterData.statistics,
               charts: this.generateStatisticsCharts()
           }
       };
   }
   
   /**
    * 創建成就頁
    */
   createAchievementsPage() {
       return {
           type: 'achievements',
           content: {
               title: '學習成就',
               achievements: this.posterData.achievements,
               badges: this.generateAchievementBadges()
           }
       };
   }
   
   /**
    * 創建時間軸頁
    */
   createTimelinePage() {
       return {
           type: 'timeline',
           content: {
               title: '學習歷程',
               timeline: this.posterData.timeline,
               milestones: this.generateMilestones()
           }
       };
   }
   
   /**
    * 生成統計圖表
    */
   generateStatisticsCharts() {
       return {
           progressChart: {
               type: 'progress',
               data: this.posterData.statistics
           },
           levelChart: {
               type: 'level',
               data: this.posterData.timeline
           }
       };
   }
   
   /**
    * 生成成就徽章
    */
   generateAchievementBadges() {
       return this.posterData.achievements.map(achievement => ({
           icon: achievement.icon,
           title: achievement.title,
           earned: true
       }));
   }
   
   /**
    * 生成里程碑
    */
   generateMilestones() {
       return [
           {
               date: '第1天',
               event: '開始英語學習之旅',
               icon: '🚀'
           },
           {
               date: '第15天',
               event: '完成第一次分級測驗',
               icon: '📝'
           },
           {
               date: '第30天',
               event: `達到 ${this.posterData.level} 級別`,
               icon: '🎯'
           }
       ];
   }
   
   /**
    * 模組顯示時的回調
    */
   onShow() {
       // 重新生成最新的海報資料
       this.generatePosterData();
       
       // 重新渲染海報
       this.renderPoster();
       
       console.log('🏆 成就海報模組已顯示');
   }
   
   /**
    * 模組隱藏時的回調
    */
   onHide() {
       console.log('🏆 成就海報模組已隱藏');
   }
   
   /**
    * 清理資源
    */
   destroy() {
       // 清理canvas上下文
       if (this.canvasContext) {
           this.canvasContext = null;
       }
       
       // 清理事件監聽器（由主應用程式處理）
       
       console.log('🗑️ Poster模組資源清理完成');
   }
}

// 確保類別在全域範圍內可用
window.PosterModule = PosterModule;