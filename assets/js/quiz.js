/**
 * quiz.js - 理解測試評估系統
 * 負責：分級題目、自適應調整、能力分析、即時反饋
 */

class QuizModule {
    constructor(app) {
        this.app = app;
        this.currentQuestion = 0;
        this.totalQuestions = 10;
        this.questions = [];
        this.responses = [];
        this.isTestActive = false;
        this.testStartTime = null;
        this.difficulty = 'medium';
        this.performance = {};
        
        // 測驗題庫
        this.questionBank = this.generateQuestionBank();
        
        this.init();
    }
    
    /**
     * 初始化測驗模組
     */
    init() {
        console.log('🧠 理解測試模組初始化');
        this.setupEventListeners();
        this.generateQuestions();
    }
    
    /**
     * 設定事件監聽器
     */
    setupEventListeners() {
        // 測驗控制按鈕
        const checkBtn = document.getElementById('checkAnswer');
        const prevBtn = document.getElementById('prevQuizQuestion');
        const nextBtn = document.getElementById('nextQuizQuestion');
        const finishBtn = document.getElementById('finishQuiz');
        
        if (checkBtn) checkBtn.addEventListener('click', () => this.checkAnswer());
        if (prevBtn) prevBtn.addEventListener('click', () => this.previousQuestion());
        if (nextBtn) nextBtn.addEventListener('click', () => this.nextQuestion());
        if (finishBtn) finishBtn.addEventListener('click', () => this.finishQuiz());
        
        // 監聽級別變更
        this.app.on('levelChanged', (data) => {
            this.adjustQuestionsForLevel(data.level);
        });
        
        // 監聽內容變更
        this.app.on('contentProcessed', (data) => {
            this.generateContentBasedQuestions(data);
        });
    }
    
    /**
     * 生成測驗題庫
     */
    generateQuestionBank() {
        return {
            A1: [
                {
                    type: 'comprehension',
                    level: 'A1',
                    context: "My name is John. I am 25 years old. I live in London.",
                    question: "Where does John live?",
                    options: ['London', 'Paris', 'Tokyo', 'New York'],
                    correct: 0,
                    explanation: "文中明確提到 'I live in London'，所以約翰住在倫敦。"
                },
                {
                    type: 'vocabulary',
                    level: 'A1',
                    context: "I eat breakfast at 7 AM every morning.",
                    question: "What does 'breakfast' mean?",
                    options: ['晚餐', '午餐', '早餐', '點心'],
                    correct: 2,
                    explanation: "'Breakfast' 指的是早餐，通常在早上吃的第一餐。"
                }
            ],
            
            A2: [
                {
                    type: 'comprehension',
                    level: 'A2',
                    context: "Sarah went to the supermarket yesterday. She bought some apples, bread, and milk. She paid with her credit card.",
                    question: "How did Sarah pay for her shopping?",
                    options: ['現金', '信用卡', '支票', '手機支付'],
                    correct: 1,
                    explanation: "文中提到 'She paid with her credit card'，說明Sarah用信用卡付款。"
                },
                {
                    type: 'inference',
                    level: 'A2',
                    context: "Tom is wearing a heavy coat and gloves. There is snow on the ground.",
                    question: "What season is it probably?",
                    options: ['春天', '夏天', '秋天', '冬天'],
                    correct: 3,
                    explanation: "從厚外套、手套和地上有雪這些線索可以推斷是冬天。"
                }
            ],
            
            B1: [
                {
                    type: 'comprehension',
                    level: 'B1',
                    context: "The new environmental policy aims to reduce carbon emissions by 30% over the next five years. Companies will need to invest in renewable energy sources and improve their energy efficiency.",
                    question: "What is the main goal of the new policy?",
                    options: [
                        '增加公司投資',
                        '減少碳排放',
                        '提高能源價格',
                        '發展新技術'
                    ],
                    correct: 1,
                    explanation: "政策的主要目標是在未來五年內減少30%的碳排放。"
                },
                {
                    type: 'analysis',
                    level: 'B1',
                    context: "Although the weather was bad, many people still came to the outdoor concert. The organizers were surprised by the good attendance.",
                    question: "Why were the organizers surprised?",
                    options: [
                        '因為天氣很好',
                        '因為票價太高',
                        '因為儘管天氣不好但來的人很多',
                        '因為音樂會被取消了'
                    ],
                    correct: 2,
                    explanation: "儘管天氣不好，但參加人數仍然很多，這讓主辦方感到驚訝。"
                }
            ],
            
            B2: [
                {
                    type: 'critical_thinking',
                    level: 'B2',
                    context: "Research shows that social media usage among teenagers has increased by 40% in the past year. However, critics argue that correlation does not imply causation when linking social media to mental health issues.",
                    question: "What is the main point the critics are making?",
                    options: [
                        '社交媒體使用量沒有增加',
                        '青少年心理健康沒有問題',
                        '相關性不等於因果關係',
                        '研究數據不準確'
                    ],
                    correct: 2,
                    explanation: "批評者指出相關性（correlation）不等於因果關係（causation），這是統計學中的重要概念。"
                },
                {
                    type: 'inference',
                    level: 'B2',
                    context: "The company's quarterly report shows declining profits despite increased sales revenue. Industry analysts suggest this indicates rising operational costs.",
                    question: "What can be inferred about the company's situation?",
                    options: [
                        '公司銷售額下降',
                        '公司盈利能力提高',
                        '營運成本可能上升',
                        '市場需求減少'
                    ],
                    correct: 2,
                    explanation: "銷售收入增加但利潤下降，暗示營運成本上升。"
                }
            ],
            
            C1: [
                {
                    type: 'analysis',
                    level: 'C1',
                    context: "The paradigm shift towards sustainable development requires a fundamental reconsideration of economic models. Traditional growth-oriented approaches may be incompatible with environmental preservation.",
                    question: "What does the text suggest about traditional economic approaches?",
                    options: [
                        '它們完全適合環境保護',
                        '它們需要小幅調整',
                        '它們可能與環境保護不相容',
                        '它們是唯一可行的方法'
                    ],
                    correct: 2,
                    explanation: "文中提到傳統增長導向的方法可能與環境保護不相容。"
                },
                {
                    type: 'synthesis',
                    level: 'C1',
                    context: "Globalization has created unprecedented interconnectedness, yet paradoxically, it has also led to increased cultural homogenization and the erosion of local traditions.",
                    question: "What paradox does the text highlight?",
                    options: [
                        '全球化增加了文化多樣性',
                        '全球化連接世界但也導致文化同質化',
                        '全球化只有積極影響',
                        '全球化完全破壞了傳統'
                    ],
                    correct: 1,
                    explanation: "矛盾在於全球化連接了世界，但同時也導致了文化同質化。"
                }
            ],
            
            C2: [
                {
                    type: 'critical_analysis',
                    level: 'C2',
                    context: "The author's ostensibly objective analysis belies a subtle but pervasive bias that undermines the credibility of the conclusions drawn from an otherwise methodologically sound study.",
                    question: "What is the author's main criticism?",
                    options: [
                        '研究方法有問題',
                        '表面客觀但暗含偏見影響結論可信度',
                        '結論完全錯誤',
                        '研究數據不足'
                    ],
                    correct: 1,
                    explanation: "作者批評表面上客觀的分析實際上包含微妙但普遍的偏見。"
                },
                {
                    type: 'nuanced_interpretation',
                    level: 'C2',
                    context: "While the intervention yielded statistically significant results, the clinical significance remains questionable given the marginal effect size and potential confounding variables.",
                    question: "What is the relationship between statistical and clinical significance here?",
                    options: [
                        '兩者完全一致',
                        '統計顯著但臨床意義存疑',
                        '兩者都不顯著',
                        '只有臨床意義顯著'
                    ],
                    correct: 1,
                    explanation: "雖然統計上顯著，但由於效應量小和潛在混淆變量，臨床意義值得質疑。"
                }
            ]
        };
    }
    
    /**
     * 生成測驗題目
     */
    generateQuestions() {
        const userLevel = this.app.userLevel || 'B2';
        console.log(`🎯 為 ${userLevel} 級別生成測驗題目`);
        
        // 從題庫中選擇適當級別的題目
        const levelQuestions = this.questionBank[userLevel] || this.questionBank['B2'];
        
        // 選擇題目（可以混合不同級別）
        this.questions = this.selectQuestionsForLevel(userLevel, levelQuestions);
        
        // 重置測驗狀態
        this.currentQuestion = 0;
        this.responses = [];
        this.isTestActive = false;
        
        // 顯示第一題
        this.showQuestion(0);
        this.updateProgress();
        
        // 更新級別顯示
        this.updateLevelDisplay(userLevel);
    }
    
    /**
     * 為級別選擇題目
     */
    selectQuestionsForLevel(userLevel, levelQuestions) {
        const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
        const currentLevelIndex = levels.indexOf(userLevel);
        const selectedQuestions = [];
    // 從當前級別和附近級別選擇題目
       for (let i = Math.max(0, currentLevelIndex - 1); i <= Math.min(levels.length - 1, currentLevelIndex + 1); i++) {
           const level = levels[i];
           const questions = this.questionBank[level] || [];
           
           // 從每個級別選擇一定數量的題目
           const questionsToSelect = i === currentLevelIndex ? 6 : 2; // 當前級別多選一些
           const shuffled = this.shuffleArray([...questions]);
           selectedQuestions.push(...shuffled.slice(0, questionsToSelect));
       }
       
       // 打亂順序並限制總數
       return this.shuffleArray(selectedQuestions).slice(0, this.totalQuestions);
   }
   
   /**
    * 更新級別顯示
    */
   updateLevelDisplay(level) {
       const quizLevel = document.getElementById('quizLevel');
       if (quizLevel) {
           quizLevel.textContent = level;
           quizLevel.className = `level-badge ${level.toLowerCase()}`;
       }
   }
   
   /**
    * 顯示題目
    */
   showQuestion(questionIndex) {
       if (questionIndex < 0 || questionIndex >= this.questions.length) {
           return;
       }
       
       const question = this.questions[questionIndex];
       
       // 更新題目內容
       const questionText = document.getElementById('quizQuestionText');
       const optionsContainer = document.getElementById('quizOptions');
       const typeBadge = document.querySelector('.question-type-badge');
       
       if (questionText) {
           let questionContent = '';
           if (question.context) {
               questionContent += `<div class="question-context">${question.context}</div><br>`;
           }
           questionContent += question.question;
           questionText.innerHTML = questionContent;
       }
       
       if (typeBadge) {
           const typeNames = {
               'comprehension': '理解測試',
               'vocabulary': '詞彙測試',
               'inference': '推理測試',
               'analysis': '分析測試',
               'critical_thinking': '批判思考',
               'synthesis': '綜合分析',
               'critical_analysis': '批判分析',
               'nuanced_interpretation': '細緻解讀'
           };
           typeBadge.textContent = typeNames[question.type] || '理解測試';
       }
       
       // 生成選項
       if (optionsContainer) {
           optionsContainer.innerHTML = '';
           question.options.forEach((option, index) => {
               const optionLabel = document.createElement('label');
               optionLabel.className = 'option-label';
               optionLabel.innerHTML = `
                   <input type="radio" name="quiz-answer" value="${index}">
                   <span class="option-text">${option}</span>
               `;
               optionsContainer.appendChild(optionLabel);
           });
           
           // 恢復之前的選擇
           const previousAnswer = this.responses[questionIndex];
           if (previousAnswer !== undefined) {
               const radioButton = optionsContainer.querySelector(`input[value="${previousAnswer}"]`);
               if (radioButton) {
                   radioButton.checked = true;
               }
           }
       }
       
       // 隱藏反饋
       this.hideFeedback();
       
       // 更新按鈕狀態
       this.updateNavigationButtons();
       
       // 更新進度
       this.updateProgress();
       
       // 開始計時（如果是第一題）
       if (questionIndex === 0 && !this.isTestActive) {
           this.startTest();
       }
   }
   
   /**
    * 開始測驗
    */
   startTest() {
       this.isTestActive = true;
       this.testStartTime = Date.now();
       console.log('🚀 理解測試開始');
   }
   
   /**
    * 檢查答案
    */
   checkAnswer() {
       const selectedOption = document.querySelector('input[name="quiz-answer"]:checked');
       if (!selectedOption) {
           this.app.showNotification('請選擇一個答案', 'warning');
           return;
       }
       
       const userAnswer = parseInt(selectedOption.value);
       const question = this.questions[this.currentQuestion];
       const isCorrect = userAnswer === question.correct;
       
       // 儲存答案
       this.responses[this.currentQuestion] = userAnswer;
       
       // 顯示反饋
       this.showFeedback(isCorrect, question.explanation);
       
       // 更新按鈕狀態
       this.updateButtonsAfterAnswer();
       
       // 記錄答題時間
       this.recordAnswerTime();
       
       // 自適應難度調整
       this.adaptDifficulty(isCorrect);
   }
   
   /**
    * 顯示反饋
    */
   showFeedback(isCorrect, explanation) {
       const feedback = document.getElementById('quizFeedback');
       if (!feedback) return;
       
       const feedbackIcon = feedback.querySelector('.feedback-icon');
       const feedbackText = feedback.querySelector('.feedback-text');
       const feedbackExplanation = feedback.querySelector('.feedback-explanation');
       
       if (feedbackIcon) {
           feedbackIcon.textContent = isCorrect ? '✓' : '✗';
           feedbackIcon.style.backgroundColor = isCorrect ? 'var(--success-color)' : 'var(--error-color)';
       }
       
       if (feedbackText) {
           feedbackText.textContent = isCorrect ? '回答正確！' : '回答錯誤';
           feedbackText.style.color = isCorrect ? 'var(--success-color)' : 'var(--error-color)';
       }
       
       if (feedbackExplanation) {
           feedbackExplanation.textContent = explanation;
       }
       
       // 更新整體反饋樣式
       feedback.style.borderLeftColor = isCorrect ? 'var(--success-color)' : 'var(--error-color)';
       feedback.style.display = 'block';
   }
   
   /**
    * 隱藏反饋
    */
   hideFeedback() {
       const feedback = document.getElementById('quizFeedback');
       if (feedback) {
           feedback.style.display = 'none';
       }
   }
   
   /**
    * 更新答題後的按鈕狀態
    */
   updateButtonsAfterAnswer() {
       const checkBtn = document.getElementById('checkAnswer');
       const nextBtn = document.getElementById('nextQuizQuestion');
       const finishBtn = document.getElementById('finishQuiz');
       
       if (checkBtn) checkBtn.style.display = 'none';
       
       const isLastQuestion = this.currentQuestion === this.questions.length - 1;
       
       if (isLastQuestion) {
           if (finishBtn) finishBtn.style.display = 'inline-flex';
       } else {
           if (nextBtn) nextBtn.style.display = 'inline-flex';
       }
   }
   
   /**
    * 記錄答題時間
    */
   recordAnswerTime() {
       const currentTime = Date.now();
       const questionStartTime = this.questionStartTime || currentTime;
       const answerTime = currentTime - questionStartTime;
       
       if (!this.performance.answerTimes) {
           this.performance.answerTimes = [];
       }
       
       this.performance.answerTimes[this.currentQuestion] = answerTime;
   }
   
   /**
    * 自適應難度調整
    */
   adaptDifficulty(isCorrect) {
       // 簡單的自適應邏輯
       if (isCorrect) {
           this.performance.correctAnswers = (this.performance.correctAnswers || 0) + 1;
       }
       
       const accuracy = this.performance.correctAnswers / (this.currentQuestion + 1);
       
       if (accuracy > 0.8) {
           this.difficulty = 'hard';
       } else if (accuracy > 0.6) {
           this.difficulty = 'medium';
       } else {
           this.difficulty = 'easy';
       }
       
       console.log(`📊 當前準確率: ${(accuracy * 100).toFixed(1)}%, 難度調整為: ${this.difficulty}`);
   }
   
   /**
    * 上一題
    */
   previousQuestion() {
       if (this.currentQuestion > 0) {
           this.currentQuestion--;
           this.questionStartTime = Date.now();
           this.showQuestion(this.currentQuestion);
       }
   }
   
   /**
    * 下一題
    */
   nextQuestion() {
       if (this.currentQuestion < this.questions.length - 1) {
           this.currentQuestion++;
           this.questionStartTime = Date.now();
           this.showQuestion(this.currentQuestion);
       }
   }
   
   /**
    * 更新導航按鈕狀態
    */
   updateNavigationButtons() {
       const prevBtn = document.getElementById('prevQuizQuestion');
       const checkBtn = document.getElementById('checkAnswer');
       const nextBtn = document.getElementById('nextQuizQuestion');
       const finishBtn = document.getElementById('finishQuiz');
       
       if (prevBtn) {
           prevBtn.disabled = this.currentQuestion === 0;
       }
       
       // 重置按鈕顯示狀態
       if (checkBtn) checkBtn.style.display = 'inline-flex';
       if (nextBtn) nextBtn.style.display = 'none';
       if (finishBtn) finishBtn.style.display = 'none';
       
       // 檢查是否已回答
       const hasAnswered = this.responses[this.currentQuestion] !== undefined;
       if (hasAnswered) {
           this.updateButtonsAfterAnswer();
       }
   }
   
   /**
    * 更新進度顯示
    */
   updateProgress() {
       const progressFill = document.getElementById('quizProgressFill');
       const progressText = document.getElementById('quizProgressText');
       
       const progress = ((this.currentQuestion + 1) / this.questions.length) * 100;
       
       if (progressFill) {
           progressFill.style.width = `${progress}%`;
       }
       
       if (progressText) {
           progressText.textContent = `${this.currentQuestion + 1} / ${this.questions.length}`;
       }
   }
   
   /**
    * 完成測驗
    */
   finishQuiz() {
       // 計算結果
       this.calculateResults();
       
       // 顯示結果
       this.showResults();
       
       // 結束測驗
       this.isTestActive = false;
       
       console.log('✅ 理解測驗完成');
   }
   
   /**
    * 計算測驗結果
    */
   calculateResults() {
       let totalScore = 0;
       let abilityScores = {
           comprehension: { correct: 0, total: 0 },
           vocabulary: { correct: 0, total: 0 },
           inference: { correct: 0, total: 0 },
           analysis: { correct: 0, total: 0 }
       };
       
       // 計算各題得分
       this.questions.forEach((question, index) => {
           const userAnswer = this.responses[index];
           const isCorrect = userAnswer === question.correct;
           
           if (isCorrect) {
               totalScore++;
           }
           
           // 統計各能力維度
           const abilityType = this.mapQuestionTypeToAbility(question.type);
           if (abilityScores[abilityType]) {
               if (isCorrect) {
                   abilityScores[abilityType].correct++;
               }
               abilityScores[abilityType].total++;
           }
       });
       
       // 計算百分比分數
       const percentage = Math.round((totalScore / this.questions.length) * 100);
       
       // 計算各能力維度百分比
       Object.keys(abilityScores).forEach(ability => {
           const { correct, total } = abilityScores[ability];
           abilityScores[ability].percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
       });
       
       // 計算平均答題時間
       const totalTime = this.performance.answerTimes ? 
           this.performance.answerTimes.reduce((sum, time) => sum + time, 0) : 0;
       const averageTime = totalTime / this.questions.length;
       
       // 儲存結果
       this.performance.finalScore = percentage;
       this.performance.totalCorrect = totalScore;
       this.performance.totalQuestions = this.questions.length;
       this.performance.abilityBreakdown = abilityScores;
       this.performance.averageTime = averageTime;
       this.performance.testDuration = Date.now() - this.testStartTime;
       
       // 更新應用程式進度
       this.app.updateProgress({
           module: 'quiz',
           progress: 100,
           score: percentage,
           completedItems: totalScore
       });
   }
   
   /**
    * 映射題目類型到能力維度
    */
   mapQuestionTypeToAbility(questionType) {
       const mapping = {
           'comprehension': 'comprehension',
           'vocabulary': 'vocabulary',
           'inference': 'inference',
           'analysis': 'analysis',
           'critical_thinking': 'analysis',
           'synthesis': 'analysis',
           'critical_analysis': 'analysis',
           'nuanced_interpretation': 'analysis'
       };
       
       return mapping[questionType] || 'comprehension';
   }
   
   /**
    * 顯示測驗結果
    */
   showResults() {
       // 隱藏測驗區域，顯示結果
       const quizContainer = document.querySelector('.quiz-container');
       const resultsContainer = document.getElementById('quizResults');
       
       if (quizContainer) quizContainer.style.display = 'none';
       if (resultsContainer) resultsContainer.style.display = 'block';
       
       // 更新分數顯示
       this.updateScoreDisplay();
       
       // 更新能力分析
       this.updateAbilityAnalysis();
       
       // 生成學習建議
       this.generateLearningRecommendations();
   }
   
   /**
    * 更新分數顯示
    */
   updateScoreDisplay() {
       const scorePercentage = document.querySelector('.score-percentage');
       const scoreDetails = document.querySelector('.score-details');
       const scoreCircle = document.querySelector('.score-circle');
       
       if (scorePercentage) {
           scorePercentage.textContent = `${this.performance.finalScore}%`;
       }
       
       if (scoreDetails) {
           scoreDetails.innerHTML = `
               <p><strong>總分：</strong>${this.performance.totalCorrect}/${this.performance.totalQuestions}</p>
               <p><strong>正確率：</strong>${this.performance.finalScore}%</p>
               <p><strong>級別：</strong>${this.app.userLevel || 'B2'}</p>
               <p><strong>用時：</strong>${this.formatTime(this.performance.testDuration)}</p>
           `;
       }
       
       // 更新圓形進度條
       if (scoreCircle) {
           const percentage = this.performance.finalScore;
           const gradient = `conic-gradient(var(--success-color) ${percentage * 3.6}deg, var(--bg-tertiary) ${percentage * 3.6}deg)`;
           scoreCircle.style.background = gradient;
       }
   }
   
   /**
    * 更新能力分析
    */
   updateAbilityAnalysis() {
       const analysisGrid = document.querySelector('.analysis-grid');
       if (!analysisGrid) return;
       
       const abilities = this.performance.abilityBreakdown;
       const abilityNames = {
           comprehension: '理解力',
           vocabulary: '詞彙力',
           inference: '推理力',
           analysis: '分析力'
       };
       
       analysisGrid.innerHTML = '';
       
       Object.keys(abilities).forEach(ability => {
           if (abilities[ability].total > 0) {
               const percentage = abilities[ability].percentage;
               const analysisItem = document.createElement('div');
               analysisItem.className = 'analysis-item';
               analysisItem.innerHTML = `
                   <span class="analysis-label">${abilityNames[ability] || ability}</span>
                   <div class="analysis-bar">
                       <div class="analysis-fill" style="width: ${percentage}%"></div>
                   </div>
                   <span class="analysis-score">${percentage}%</span>
               `;
               analysisGrid.appendChild(analysisItem);
           }
       });
   }
   
   /**
    * 生成學習建議
    */
   generateLearningRecommendations() {
       const recommendations = [];
       const abilities = this.performance.abilityBreakdown;
       const overallScore = this.performance.finalScore;
       
       // 根據總分給出建議
       if (overallScore >= 90) {
           recommendations.push('表現優異！您的理解能力已達到很高水平');
       } else if (overallScore >= 70) {
           recommendations.push('理解能力良好，可以嘗試更高難度的內容');
       } else if (overallScore >= 50) {
           recommendations.push('理解能力有待提升，建議多練習相關題型');
       } else {
           recommendations.push('建議從基礎內容開始，逐步提高理解能力');
       }
       
       // 根據各能力維度給出具體建議
       Object.keys(abilities).forEach(ability => {
           const score = abilities[ability].percentage;
           if (score < 60) {
               switch (ability) {
                   case 'comprehension':
                       recommendations.push('建議增加閱讀練習，提高文本理解能力');
                       break;
                   case 'vocabulary':
                       recommendations.push('建議加強詞彙學習，擴大詞彙量');
                       break;
                   case 'inference':
                       recommendations.push('建議練習推理題型，提高邏輯思維能力');
                       break;
                   case 'analysis':
                       recommendations.push('建議多做分析類題目，培養批判性思維');
                       break;
               }
           }
       });
       
       // 根據答題時間給出建議
       if (this.performance.averageTime > 60000) { // 超過1分鐘
           recommendations.push('建議提高答題速度，多做限時練習');
       }
       
       return recommendations;
   }
   
   /**
    * 根據級別調整題目
    */
   adjustQuestionsForLevel(level) {
       console.log(`🎯 調整測驗難度為 ${level} 級別`);
       this.generateQuestions();
   }
   
   /**
    * 根據內容生成題目
    */
   generateContentBasedQuestions(data) {
       const { original, analysis } = data;
       
       // 基於內容生成簡單的理解題目
       const contentQuestion = {
           type: 'comprehension',
           level: analysis.estimatedLevel || 'B2',
           context: original.substring(0, 200) + '...',
           question: '根據以上內容，主要討論的是什麼？',
           options: [
               '科技發展',
               '社會問題',
               '經濟議題',
               '教育話題'
           ],
           correct: 0, // 簡化處理
           explanation: '這是基於內容自動生成的題目，實際應用中需要更精確的內容分析。'
       };
       
       // 將新題目添加到題庫
       this.questions.push(contentQuestion);
       
       console.log('📝 基於內容生成了新的測驗題目');
   }
   
   /**
    * 重新開始測驗
    */
   restartQuiz() {
       // 重置所有狀態
       this.currentQuestion = 0;
       this.responses = [];
       this.performance = {};
       this.isTestActive = false;
       this.testStartTime = null;
       
       // 重新生成題目
       this.generateQuestions();
       
       // 顯示測驗區域
       const quizContainer = document.querySelector('.quiz-container');
       const resultsContainer = document.getElementById('quizResults');
       
       if (quizContainer) quizContainer.style.display = 'block';
       if (resultsContainer) resultsContainer.style.display = 'none';
       
       console.log('🔄 重新開始理解測驗');
   }
   
   /**
    * 取得測驗統計
    */
   getQuizStatistics() {
       return {
           totalQuestions: this.questions.length,
           currentQuestion: this.currentQuestion + 1,
           answeredQuestions: this.responses.filter(r => r !== undefined).length,
           correctAnswers: this.performance.totalCorrect || 0,
           accuracy: this.performance.finalScore || 0,
           averageTime: this.performance.averageTime || 0,
           testDuration: this.performance.testDuration || 0,
           difficulty: this.difficulty,
           abilityBreakdown: this.performance.abilityBreakdown || {}
       };
   }
   
   /**
    * 匯出測驗結果
    */
   exportQuizResults() {
       const stats = this.getQuizStatistics();
       const results = {
           timestamp: new Date().toISOString(),
           userLevel: this.app.userLevel,
           questions: this.questions.map((question, index) => ({
               questionIndex: index,
               question: question.question,
               userAnswer: this.responses[index],
               correctAnswer: question.correct,
               isCorrect: this.responses[index] === question.correct,
               answerTime: this.performance.answerTimes ? this.performance.answerTimes[index] : null
           })),
           performance: this.performance,
           statistics: stats
       };
       
       return results;
   }
   
   /**
    * 模組顯示時的回調
    */
   onShow() {
       // 如果沒有題目，生成題目
       if (this.questions.length === 0) {
           this.generateQuestions();
       }
       
       // 重置問題開始時間
       this.questionStartTime = Date.now();
       
       console.log('🧠 理解測試模組已顯示');
   }
   
   /**
    * 模組隱藏時的回調
    */
   onHide() {
       // 記錄當前題目的答題時間
       if (this.questionStartTime) {
           this.recordAnswerTime();
       }
       
       console.log('🧠 理解測試模組已隱藏');
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
       const remainingSeconds = seconds % 60;
       return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
   }
   
   /**
    * 清理資源
    */
   destroy() {
       // 停止任何進行中的測驗
       this.isTestActive = false;
       
       // 清理計時器
       if (this.testStartTime) {
           this.testStartTime = null;
       }
       
       console.log('🗑️ Quiz模組資源清理完成');
   }
}

// 確保類別在全域範圍內可用
window.QuizModule = QuizModule;