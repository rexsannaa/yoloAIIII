options: [
                        'Maria never takes risks.',
                        'Maria takes risks.',
                        'Maria is not an entrepreneur.',
                        'Maria is unsuccessful.'
                    ],
                    correct: 1,
                    ability: 'reasoning',
                    explanation: '根據三段論邏輯：所有成功企業家都會冒險 → 瑪麗亞是成功企業家 → 瑪麗亞會冒險。'
                },
                {
                    type: 'comprehension',
                    level: 'B2',
                    question: '閱讀並理解隱含意義：\n"While the new policy appears beneficial on the surface, critics argue that it may have unintended consequences in the long run."\n這段話暗示什麼？',
                    options: [
                        '新政策肯定是好的',
                        '新政策表面看起來好但可能有隱藏問題',
                        '批評者完全反對新政策',
                        '新政策已經造成了問題'
                    ],
                    correct: 1,
                    ability: 'comprehension',
                    explanation: '關鍵詞 "appears beneficial on the surface" 和 "unintended consequences" 表明政策表面有益但可能隱藏問題。'
                }
            ],
            
            // C1級別題目
            C1: [
                {
                    type: 'vocabulary',
                    level: 'C1',
                    question: '選擇最精確的詞語：\n"The politician\'s speech was full of ___ statements that could be interpreted in multiple ways."',
                    options: ['clear', 'ambiguous', 'simple', 'direct'],
                    correct: 1,
                    ability: 'vocabulary',
                    explanation: '"Ambiguous" 意思是模糊不清的、可以多種理解的，最符合語境。'
                },
                {
                    type: 'reasoning',
                    level: 'C1',
                    question: '分析複雜情況：\n"The correlation between social media usage and depression among teenagers is well-documented. However, establishing causation remains challenging due to numerous confounding variables."\n這段話的核心論點是：',
                    options: [
                        '社交媒體直接導致青少年抑鬱',
                        '社交媒體和抑鬱有關聯，但因果關係難以確定',
                        '青少年抑鬱與社交媒體無關',
                        '研究結果不可信'
                    ],
                    correct: 1,
                    ability: 'reasoning',
                    explanation: '區分相關性(correlation)和因果性(causation)是高級學術閱讀的重要技能。'
                },
                {
                    type: 'comprehension',
                    level: 'C1',
                    question: '理解學術文本：\n"The paradigm shift in renewable energy adoption has been precipitated by a confluence of technological advances, policy incentives, and changing consumer preferences."\n"precipitated by a confluence of" 的意思是：',
                    options: [
                        '被阻止由於',
                        '被加速由於多種因素的匯聚',
                        '被簡化通過',
                        '被推遲因為'
                    ],
                    correct: 1,
                    ability: 'comprehension',
                    explanation: '"Precipitated by a confluence of" 意思是由多種因素的匯聚而促成/加速。'
                }
            ],
            
            // C2級別題目
            C2: [
                {
                    type: 'vocabulary',
                    level: 'C2',
                    question: '選擇語義最精確的詞語：\n"Her argument was so ___ that even her opponents had to acknowledge its validity."',
                    options: ['loud', 'cogent', 'popular', 'lengthy'],
                    correct: 1,
                    ability: 'vocabulary',
                    explanation: '"Cogent" 意思是有說服力的、令人信服的，是高級詞彙。'
                },
                {
                    type: 'reasoning',
                    level: 'C2',
                    question: '分析複雜論證：\n"While the author\'s thesis is intellectually provocative, the paucity of empirical evidence undermines the credibility of his conclusions, rendering them more speculative than substantive."\n作者的觀點是：',
                    options: [
                        '論文在智力上具有挑戰性且證據充分',
                        '論文觀點有趣但缺乏實證支持，更像推測',
                        '論文完全沒有價值',
                        '論文的結論完全正確'
                    ],
                    correct: 1,
                    ability: 'reasoning',
                    explanation: '關鍵在於理解 "paucity of empirical evidence" (缺乏實證證據) 和 "speculative than substantive" (推測性多於實質性)。'
                },
                {
                    type: 'comprehension',
                    level: 'C2',
                    question: '理解微妙語義差異：\n"The politician\'s ostensibly magnanimous gesture was, in fact, a calculated maneuver designed to rehabilitate his tarnished reputation."\n這句話的含義是：',
                    options: [
                        '政治家真誠地做了好事',
                        '政治家表面慷慨實則別有用心',
                        '政治家的聲譽很好',
                        '政治家的行為很自然'
                    ],
                    correct: 1,
                    ability: 'comprehension',
                    explanation: '"Ostensibly magnanimous" (表面慷慨) 與 "calculated maneuver" (精心策劃的手段) 形成對比。'
                }
            ]
        };
    }
    
    /**
     * 開始分級測驗
     */
    startAssessment() {
        console.log('🎯 開始CEFR分級測驗');
        
        // 隱藏介紹，顯示測驗
        document.querySelector('.assessment-intro').style.display = 'none';
        document.querySelector('.level-overview').style.display = 'none';
        document.querySelector('.assessment-test').style.display = 'block';
        
        // 重置測驗狀態
        this.resetAssessment();
        
        // 選擇測驗題目
        this.selectQuestions();
        
        // 開始計時
        this.testStartTime = Date.now();
        this.isTestActive = true;
        
        // 顯示第一題
        this.showQuestion(0);
        
        // 更新進度
        this.updateProgress();
    }
    
    /**
     * 重置測驗狀態
     */
    resetAssessment() {
        this.currentQuestion = 0;
        this.responses = [];
        this.abilities = {
            vocabulary: 0,
            grammar: 0,
            comprehension: 0,
            reasoning: 0
        };
        this.testStartTime = null;
        this.isTestActive = false;
        this.selectedQuestions = [];
    }
    
    /**
     * 選擇測驗題目
     */
    selectQuestions() {
        const allQuestions = [];
        
        // 從每個級別選擇題目，確保平衡
        Object.keys(this.questionBank).forEach(level => {
            const levelQuestions = this.questionBank[level];
            // 每個級別選2-3題
            const selectedCount = level === 'A1' || level === 'A2' ? 3 : 2;
            const shuffled = this.shuffleArray([...levelQuestions]);
            allQuestions.push(...shuffled.slice(0, selectedCount));
        });
        
        // 打亂題目順序並選擇總共15題
        this.selectedQuestions = this.shuffleArray(allQuestions).slice(0, this.totalQuestions);
        
        console.log('📋 已選擇測驗題目:', this.selectedQuestions.length, '題');
    }
    
    /**
     * 顯示題目
     */
    showQuestion(questionIndex) {
        if (questionIndex < 0 || questionIndex >= this.selectedQuestions.length) {
            return;
        }
        
        const question = this.selectedQuestions[questionIndex];
        
        // 更新題目內容
        const questionText = document.getElementById('questionText');
        const optionsContainer = document.getElementById('optionsContainer');
        const questionTypeElement = document.querySelector('.question-type');
        const questionLevelElement = document.querySelector('.question-level');
        
        if (questionText) {
            questionText.textContent = question.question;
        }
        
        if (questionTypeElement) {
            const typeNames = {
                'vocabulary': '詞彙測試',
                'grammar': '語法測試',
                'comprehension': '理解測試',
                'reasoning': '邏輯推理'
            };
            questionTypeElement.textContent = typeNames[question.type] || question.type;
        }
        
        if (questionLevelElement) {
            questionLevelElement.textContent = question.level;
        }
        
        // 生成選項
        if (optionsContainer) {
            optionsContainer.innerHTML = '';
            question.options.forEach((option, index) => {
                const optionLabel = document.createElement('label');
                optionLabel.className = 'option-label';
                optionLabel.innerHTML = `
                    <input type="radio" name="question-answer" value="${index}">
                    <span class="option-text">${option}</span>
                `;
                optionsContainer.appendChild(optionLabel);
            });
            
            // 如果已經回答過，恢復選擇
            const previousAnswer = this.responses[questionIndex];
            if (previousAnswer !== undefined) {
                const radioButton = optionsContainer.querySelector(`input[value="${previousAnswer}"]`);
                if (radioButton) {
                    radioButton.checked = true;
                }
            }
        }
        
        // 更新按鈕狀態
        this.updateNavigationButtons();
        
        // 更新進度
        this.updateProgress();
    }
    
    /**
     * 上一題
     */
    previousQuestion() {
        if (this.currentQuestion > 0) {
            // 儲存當前答案
            this.saveCurrentAnswer();
            
            this.currentQuestion--;
            this.showQuestion(this.currentQuestion);
        }
    }
    
    /**
     * 下一題
     */
    nextQuestion() {
        // 儲存當前答案
        this.saveCurrentAnswer();
        
        if (this.currentQuestion < this.selectedQuestions.length - 1) {
            this.currentQuestion++;
            this.showQuestion(this.currentQuestion);
        }
    }
    
    /**
     * 儲存當前答案
     */
    saveCurrentAnswer() {
        const selectedOption = document.querySelector('input[name="question-answer"]:checked');
        if (selectedOption) {
            this.responses[this.currentQuestion] = parseInt(selectedOption.value);
        }
    }
    
    /**
     * 更新導航按鈕狀態
     */
    updateNavigationButtons() {
        const prevBtn = document.getElementById('prevQuestion');
        const nextBtn = document.getElementById('nextQuestion');
        const finishBtn = document.getElementById('finishTest');
        
        if (prevBtn) {
            prevBtn.disabled = this.currentQuestion === 0;
        }
        
        // 檢查是否為最後一題
        const isLastQuestion = this.currentQuestion === this.selectedQuestions.length - 1;
        
        if (nextBtn && finishBtn) {
            if (isLastQuestion) {
                nextBtn.style.display = 'none';
                finishBtn.style.display = 'inline-flex';
            } else {
                nextBtn.style.display = 'inline-flex';
                finishBtn.style.display = 'none';
            }
        }
    }
    
    /**
     * 更新進度顯示
     */
    updateProgress() {
        const progressFill = document.querySelector('.assessment-test .progress-fill');
        const progressText = document.querySelector('.assessment-test .progress-text');
        
        const progress = ((this.currentQuestion + 1) / this.selectedQuestions.length) * 100;
        
        if (progressFill) {
            progressFill.style.width = `${progress}%`;
        }
        
        if (progressText) {
            progressText.textContent = `${this.currentQuestion + 1} / ${this.selectedQuestions.length}`;
        }
    }
    
    /**
     * 完成測驗
     */
    finishAssessment() {
        // 儲存最後一題答案
        this.saveCurrentAnswer();
        
        // 檢查是否所有題目都已回答
        const unansweredQuestions = this.selectedQuestions.length - this.responses.filter(r => r !== undefined).length;
        
        if (unansweredQuestions > 0) {
            const confirmFinish = confirm(`還有 ${unansweredQuestions} 題未回答，確定要完成測驗嗎？`);
            if (!confirmFinish) {
                return;
            }
        }
        
        // 計算結果
        this.calculateResults();
        
        // 顯示結果
        this.showResults();
        
        console.log('✅ CEFR分級測驗完成');
    }
    
    /**
     * 計算測驗結果
     */
    calculateResults() {
        let totalScore = 0;
        let abilityScores = {
            vocabulary: { correct: 0, total: 0 },
            grammar: { correct: 0, total: 0 },
            comprehension: { correct: 0, total: 0 },
            reasoning: { correct: 0, total: 0 }
        };
        
        // 計算各題得分
        this.selectedQuestions.forEach((question, index) => {
            const userAnswer = this.responses[index];
            const isCorrect = userAnswer === question.correct;
            
            if (isCorrect) {
                totalScore++;
                abilityScores[question.ability].correct++;
            }
            abilityScores[question.ability].total++;
        });
        
        // 計算各能力維度百分比
        Object.keys(abilityScores).forEach(ability => {
            const { correct, total } = abilityScores[ability];
            this.abilities[ability] = total > 0 ? Math.round((correct / total) * 100) : 0;
        });
        
        // 計算總體得分率
        const overallScore = Math.round((totalScore / this.selectedQuestions.length) * 100);
        
        // 根據得分確定CEFR級別
        const cefrLevel = this.determineCEFRLevel(overallScore, this.abilities);
        
        // 儲存結果到應用程式狀態
        this.app.setUserLevel(cefrLevel, this.abilities);
        
        console.log('📊 測驗結果:', {
            level: cefrLevel,
            overallScore: overallScore,
            abilities: this.abilities
        });
    }
    
    /**
     * 確定CEFR級別
     */
    determineCEFRLevel(overallScore, abilities) {
        // 綜合考慮總分和各能力維度
        const avgAbilityScore = Object.values(abilities).reduce((sum, score) => sum + score, 0) / 4;
        const finalScore = (overallScore + avgAbilityScore) / 2;
        
        // 級別判定標準
        if (finalScore >= 90) return 'C2';
        if (finalScore >= 80) return 'C1';
        if (finalScore >= 70) return 'B2';
        if (finalScore >= 60) return 'B1';
        if (finalScore >= 50) return 'A2';
        return 'A1';
    }
    
    /**
     * 顯示測驗結果
     */
    showResults() {
        // 隱藏測驗，顯示結果
        document.querySelector('.assessment-test').style.display = 'none';
        document.querySelector('.assessment-result').style.display = 'block';
        
        // 更新級別顯示
        const levelBadge = document.getElementById('finalLevelBadge');
        const levelTitle = document.getElementById('levelTitle');
        const levelDescription = document.getElementById('levelDescription');
        
        const levelInfo = this.app.cefrLevels[this.app.userLevel];
        
        if (levelBadge) {
            levelBadge.textContent = this.app.userLevel;
            levelBadge.className = `final-level-badge ${this.app.userLevel.toLowerCase()}`;
        }
        
        if (levelTitle) {
            levelTitle.textContent = levelInfo.name;
        }
        
        if (levelDescription) {
            levelDescription.textContent = `您能${levelInfo.description}`;
        }
        
        // 更新能力分數顯示
        this.updateAbilityDisplay();
        
        // 生成學習建議
        this.generateRecommendations();
        
        // 生成能力雷達圖
        this.generateAbilityRadar();
    }
    
    /**
     * 更新能力分數顯示
     */
    updateAbilityDisplay() {
        const abilityElements = {
            vocabulary: document.getElementById('vocabScore'),
            grammar: document.getElementById('grammarScore'),
            comprehension: document.getElementById('comprehensionScore'),
            reasoning: document.getElementById('reasoningScore')
        };
        
        Object.keys(this.abilities).forEach(ability => {
            const element = abilityElements[ability];
            const fillElement = document.querySelector(`.ability-fill[data-ability="${ability}"]`);
            
            if (element) {
                element.textContent = `${this.abilities[ability]}%`;
            }
            
            if (fillElement) {
                setTimeout(() => {
                    fillElement.style.width = `${this.abilities[ability]}%`;
                }, 500);
            }
        });
    }
    
    /**
     * 生成學習建議
     */
    generateRecommendations() {
        const recommendationsList = document.getElementById('recommendationList');
        if (!recommendationsList) return;
        
        const recommendations = this.generatePersonalizedRecommendations();
        
        recommendationsList.innerHTML = '';
        recommendations.forEach((rec, index) => {
            const recElement = document.createElement('div');
            recElement.className = 'recommendation-item';
            recElement.innerHTML = `
                <div class="recommendation-icon">${index + 1}</div>
                <div class="recommendation-text">${rec}</div>
            `;
            recommendationsList.appendChild(recElement);
        });
    }
    
    /**
     * 生成個性化建議
     */
    generatePersonalizedRecommendations() {
        const level = this.app.userLevel;
        const abilities = this.abilities;
        const recommendations = [];
        
        // 根據級別提供基礎建議
        const levelRecommendations = {
            'A1': [
                '專注於基礎詞彙學習，建議從日常生活用語開始',
                '練習簡單的語法結構，如現在式和過去式',
                '多聽英語兒歌和簡單對話來培養語感'
            ],
            'A2': [
                '擴展詞彙量到1000-2000個常用單詞',
                '學習基礎語法結構，包括疑問句和否定句',
                '嘗試簡單的英語閱讀材料，如兒童故事'
            ],
            'B1': [
                '學習2000-3000個實用詞彙，包括抽象概念',
                '掌握複雜語法，如條件句和被動語態',
                '練習表達個人觀點和描述經歷'
            ],
            'B2': [
                '掌握3000-4000個進階詞彙',
                '學習複雜語法結構和各種時態',
                '練習學術寫作和正式演講'
            ],
            'C1': [
                '擴展到4000-6000個高級詞彙',
                '掌握高級語法和慣用表達',
                '練習批判性思維和學術討論'
            ],
            'C2': [
                '持續擴展專業領域詞彙',
                '精細掌握語言的細微差別',
                '練習母語水平的表達和寫作'
            ]
        };
        
        // 添加級別建議
        recommendations.push(...levelRecommendations[level]);
        
        // 根據能力薄弱環節提供針對性建議
        const weakestAbility = Object.keys(abilities).reduce((min, key) => 
            abilities[key] < abilities[min] ? key : min
        );
        
        const abilityRecommendations = {
            vocabulary: '建議使用記憶卡片或詞彙應用程式加強詞彙學習',
            grammar: '建議系統學習語法規則，多做語法練習題',
            comprehension: '建議增加閱讀量，從簡單文章逐步提升到複雜內容',
            reasoning: '建議練習邏輯推理題，培養批判性思維能力'
        };
        
        if (abilities[weakestAbility] < 70) {
            recommendations.push(`您的${this.getAbilityName(weakestAbility)}需要加強：${abilityRecommendations[weakestAbility]}`);
        }
        
        return recommendations.slice(0, 5); // 限制建議數量
    }
    
    /**
     * 取得能力中文名稱
     */
    getAbilityName(ability) {
        const names = {
            vocabulary: '詞彙掌握',
            grammar: '語法理解',
            comprehension: '閱讀理解',
            reasoning: '邏輯推理'
        };
        return names[ability] || ability;
    }
    
    /**
     * 生成能力雷達圖
     */
    generateAbilityRadar() {
        const radarContainer = document.getElementById('abilityRadar');
        if (!radarContainer) return;
        
        // 創建SVG雷達圖
        const size = 300;
        const center = size / 2;
        const maxRadius = center - 40;
        
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', size);
        svg.setAttribute('height', size);
        svg.setAttribute('viewBox', `0 0 ${size} ${size}`);
        
        // 繪製背景網格
        this.drawRadarGrid(svg, center, maxRadius);
        
        // 繪製能力數據
        this.drawAbilityData(svg, center, maxRadius);
        
        // 添加標籤
        this.drawAbilityLabels(svg, center, maxRadius);
        
        radarContainer.innerHTML = '';
        radarContainer.appendChild(svg);
    }
    
    /**
     * 繪製雷達圖網格
     */
    drawRadarGrid(svg, center, maxRadius) {
        const levels = 5;
        
        // 繪製同心圓
        for (let i = 1; i <= levels; i++) {
            const radius = (maxRadius / levels) * i;
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', center);
            circle.setAttribute('cy', center);
            circle.setAttribute('r', radius);
            circle.setAttribute('fill', 'none');
            circle.setAttribute('stroke', '#e2e8f0');
            circle.setAttribute('stroke-width', '1');
            svg.appendChild(circle);
        }
        
        // 繪製軸線
        const abilities = Object.keys(this.abilities);
        const angleStep = (2 * Math.PI) / abilities.length;
        
        abilities.forEach((_, index) => {
            const angle = (index * angleStep) - (Math.PI / 2);
            const x = center + Math.cos(angle) * maxRadius;
            const y = center + Math.sin(angle) * maxRadius;
            
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', center);
            line.setAttribute('y1', center);
            line.setAttribute('x2', x);
            line.setAttribute('y2', y);
            line.setAttribute('stroke', '#cbd5e1');
            line.setAttribute('stroke-width', '1');
            svg.appendChild(line);
        });
    }
    
    /**
     * 繪製能力數據
     */
    drawAbilityData(svg, center, maxRadius) {
        const abilities = Object.keys(this.abilities);
        const angleStep = (2 * Math.PI) / abilities.length;
        const points = [];
        
        abilities.forEach((ability, index) => {
            const score = this.abilities[ability];
            const radius = (score / 100) * maxRadius;
            const angle = (index * angleStep) - (Math.PI / 2);
            const x = center + Math.cos(angle) * radius;
            const y = center + Math.sin(angle) * radius;
            
            points.push(`${x},${y}`);
            
            // 繪製數據點
            const point = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            point.setAttribute('cx', x);
            point.setAttribute('cy', y);
            point.setAttribute('r', '4');
            point.setAttribute('fill', '#3b82f6');
            point.setAttribute('stroke', '#ffffff');
            point.setAttribute('stroke-width', '2');
            svg.appendChild(point);
        });
        
        // 繪製連接線
        const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        polygon.setAttribute('points', points.join(' '));
        polygon.setAttribute('fill', 'rgba(59, 130, 246, 0.2)');
        polygon.setAttribute('stroke', '#3b82f6');
        polygon.setAttribute('stroke-width', '2');
        svg.appendChild(polygon);
    }
    
    /**
     * 繪製能力標籤
     */
    drawAbilityLabels(svg, center, maxRadius) {
        const abilities = Object.keys(this.abilities);
        const abilityNames = {
            vocabulary: '詞彙',
            grammar: '語法',
            comprehension: '理解',
            reasoning: '推理'
        };
        
        const angleStep = (2 * Math.PI) / abilities.length;
        const labelRadius = maxRadius + 20;
        
        abilities.forEach((ability, index) => {
            const angle = (index * angleStep) - (Math.PI / 2);
            const x = center + Math.cos(angle) * labelRadius;
            const y = center + Math.sin(angle) * labelRadius;
            
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', x);
            text.setAttribute('y', y);
            text.setAttribute('text-anchor', 'middle');
            text.setAttribute('dominant-baseline', 'middle');
            text.setAttribute('font-size', '12');
            text.setAttribute('font-weight', '500');
            text.setAttribute('fill', '#374151');
            text.textContent = abilityNames[ability];
            svg.appendChild(text);
        });
    }
    
    /**
     * 開始學習旅程
     */
    startLearningJourney() {
        // 切換到下一個模組
        this.app.switchModule('flashcard');
    }
    
    /**
     * 顯示級別詳情
     */
    showLevelDetails(level) {
        const levelInfo = this.app.cefrLevels[level];
        if (!levelInfo) return;
        
        // 創建詳情模態框
        const modal = document.createElement('div');
        modal.className = 'modal level-detail-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>CEFR ${level} - ${levelInfo.name}</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="level-detail">
                        <div class="level-badge ${level.toLowerCase()}">${level}</div>
                        <p><strong>能力描述：</strong>${levelInfo.description}</p>
                        <p><strong>詞彙範圍：</strong>${levelInfo.vocabularyRange[0]}-${levelInfo.vocabularyRange[1]}個單詞</p>
                        <div class="criteria-list">
                            <h4>評估標準：</h4>
                            <ul>
                                <li>詞彙掌握：${levelInfo.criteria.vocabulary}+ 個單詞</li>
                                <li>語法理解：${levelInfo.criteria.grammar} 級別</li>
                                <li>閱讀理解：${levelInfo.criteria.comprehension} 水平</li>
                            </ul>
                        </div>
                    </div>
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
     * 模組顯示時的回調
     */
    onShow() {
        // 檢查是否已完成測驗
        if (this.app.userLevel) {
            // 已完成測驗，顯示結果
            document.querySelector('.assessment-intro').style.display = 'none';
            document.querySelector('.level-overview').style.display = 'none';
            document.querySelector('.assessment-test').style.display = 'none';
            document.querySelector('.assessment-result').style.display = 'block';
            
            this.showResults();
        } else {
            // 尚未完成測驗，顯示介紹
            document.querySelector('.assessment-intro').style.display = 'block';
            document.querySelector('.level-overview').style.display = 'grid';
            document.querySelector('.assessment-test').style.display = 'none';
            document.querySelector('.assessment-result').style.display = 'none';
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
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    
    /**
     * 計算測驗統計
     */
    getTestStatistics() {
        const testDuration = this.testStartTime ? Date.now() - this.testStartTime : 0;
        const answeredQuestions = this.responses.filter(r => r !== undefined).length;
        const correctAnswers = this.selectedQuestions.filter((q, i) => 
            this.responses[i] === q.correct
        ).length;
        
        return {
            duration: testDuration,
            totalQuestions: this.selectedQuestions.length,
            answeredQuestions: answeredQuestions,
            correctAnswers: correctAnswers,
            accuracy: answeredQuestions > 0 ? (correctAnswers / answeredQuestions) * 100 : 0
        };
    }
    
    /**
     * 匯出測驗結果
     */
    exportResults() {
        const stats = this.getTestStatistics();
        const results = {
            timestamp: new Date().toISOString(),
            userLevel: this.app.userLevel,
            abilities: this.abilities,
            statistics: stats,
            responses: this.responses.map((response, index) => ({
                questionIndex: index,
                question: this.selectedQuestions[index],
                userAnswer: response,
                correct: response === this.selectedQuestions[index].correct
            }))
        };
        
        return results;
    }
    
    /**
     * 重新測驗
     */
    retakeAssessment() {
        // 確認重新測驗
        const confirmRetake = confirm('確定要重新進行CEFR分級測驗嗎？這將清除目前的結果。');
        if (!confirmRetake) return;
        
        // 重置所有狀態
        this.resetAssessment();
        this.app.userLevel = null;
        this.app.updateLevelDisplay('未測試');
        
        // 回到測驗開始頁面
        document.querySelector('.assessment-result').style.display = 'none';
        document.querySelector('.assessment-intro').style.display = 'block';
        document.querySelector('.level-overview').style.display = 'grid';
        
        console.log('🔄 重新開始CEFR分級測驗');
    }
    
    /**
     * 清理資源
     */
    destroy() {
        // 停止任何進行中的測驗
        this.isTestActive = false;
        
        // 清理事件監聽器
        // (事件監聽器會在主應用程式清理時一併處理)
        
        console.log('🗑️ Assessment模組資源清理完成');
    }
}

// 確保類別在全域範圍內可用
window.AssessmentModule = AssessmentModule;/**
 * assessment.js - CEFR分級測驗系統
 * 負責：水平評估、級別判定、能力分析、個性化建議
 */

class AssessmentModule {
    constructor(app) {
        this.app = app;
        this.currentQuestion = 0;
        this.totalQuestions = 15;
        this.responses = [];
        this.abilities = {
            vocabulary: 0,    // 詞彙掌握度 (30%)
            grammar: 0,       // 語法理解度 (25%)
            comprehension: 0, // 閱讀理解度 (25%)
            reasoning: 0      // 邏輯推理度 (20%)
        };
        this.testStartTime = null;
        this.isTestActive = false;
        
        // CEFR測驗題庫
        this.questionBank = this.generateQuestionBank();
        this.selectedQuestions = [];
        
        this.init();
    }
    
    /**
     * 初始化測驗模組
     */
    init() {
        console.log('📝 CEFR分級測驗模組初始化');
        this.setupEventListeners();
        this.resetAssessment();
    }
    
    /**
     * 設定事件監聽器
     */
    setupEventListeners() {
        // 開始測驗按鈕
        const startBtn = document.getElementById('startAssessment');
        if (startBtn) {
            startBtn.addEventListener('click', () => this.startAssessment());
        }
        
        // 測驗控制按鈕
        const prevBtn = document.getElementById('prevQuestion');
        const nextBtn = document.getElementById('nextQuestion');
        const finishBtn = document.getElementById('finishTest');
        
        if (prevBtn) prevBtn.addEventListener('click', () => this.previousQuestion());
        if (nextBtn) nextBtn.addEventListener('click', () => this.nextQuestion());
        if (finishBtn) finishBtn.addEventListener('click', () => this.finishAssessment());
        
        // 開始學習按鈕
        const startLearningBtn = document.getElementById('startLearning');
        if (startLearningBtn) {
            startLearningBtn.addEventListener('click', () => this.startLearningJourney());
        }
        
        // 級別卡片點擊
        const levelCards = document.querySelectorAll('.level-card');
        levelCards.forEach(card => {
            card.addEventListener('click', () => {
                const level = card.dataset.level;
                this.showLevelDetails(level);
            });
        });
    }
    
    /**
     * 生成測驗題庫
     */
    generateQuestionBank() {
        return {
            // A1級別題目（基礎詞彙和語法）
            A1: [
                {
                    type: 'vocabulary',
                    level: 'A1',
                    question: '選擇 "Hello" 的正確中文意思：',
                    options: ['再見', '你好', '謝謝', '對不起'],
                    correct: 1,
                    ability: 'vocabulary',
                    explanation: '"Hello" 是最基本的英語問候語，意思是"你好"。'
                },
                {
                    type: 'grammar',
                    level: 'A1',
                    question: '選擇正確的句子：',
                    options: [
                        'I am student.',
                        'I am a student.',
                        'I am the student.',
                        'I student am.'
                    ],
                    correct: 1,
                    ability: 'grammar',
                    explanation: '"I am a student" 是正確的語法結構，需要使用不定冠詞 "a"。'
                },
                {
                    type: 'comprehension',
                    level: 'A1',
                    question: '閱讀句子："My name is John." 這句話的意思是：',
                    options: ['我喜歡約翰', '我的名字是約翰', '約翰是我朋友', '我認識約翰'],
                    correct: 1,
                    ability: 'comprehension',
                    explanation: '"My name is John" 直接翻譯就是"我的名字是約翰"。'
                }
            ],
            
            // A2級別題目
            A2: [
                {
                    type: 'vocabulary',
                    level: 'A2',
                    question: '選擇 "exciting" 的最佳中文翻譯：',
                    options: ['困難的', '令人興奮的', '重要的', '危險的'],
                    correct: 1,
                    ability: 'vocabulary',
                    explanation: '"Exciting" 意思是令人興奮的、刺激的。'
                },
                {
                    type: 'grammar',
                    level: 'A2',
                    question: '選擇正確的過去式：',
                    options: [
                        'I go to school yesterday.',
                        'I went to school yesterday.',
                        'I going to school yesterday.',
                        'I goed to school yesterday.'
                    ],
                    correct: 1,
                    ability: 'grammar',
                    explanation: '"Go" 的過去式是 "went"，所以正確答案是 "I went to school yesterday"。'
                },
                {
                    type: 'reasoning',
                    level: 'A2',
                    question: '根據上下文，選擇最合適的詞語填空：\n"It\'s raining outside. You should take an ___."',
                    options: ['apple', 'umbrella', 'orange', 'book'],
                    correct: 1,
                    ability: 'reasoning',
                    explanation: '下雨天需要雨傘(umbrella)，這是邏輯推理的結果。'
                }
            ],
            
            // B1級別題目
            B1: [
                {
                    type: 'vocabulary',
                    level: 'B1',
                    question: '選擇與 "accomplish" 意思最接近的詞：',
                    options: ['fail', 'achieve', 'begin', 'forget'],
                    correct: 1,
                    ability: 'vocabulary',
                    explanation: '"Accomplish" 和 "achieve" 都有"完成、達成"的意思。'
                },
                {
                    type: 'comprehension',
                    level: 'B1',
                    question: '閱讀段落後回答：\n"Although the weather was terrible, the concert was a huge success. Many people attended despite the rain."\n主要意思是：',
                    options: [
                        '天氣很好，音樂會很成功',
                        '天氣很糟，音樂會失敗了',
                        '儘管天氣很糟，音樂會仍然很成功',
                        '因為下雨，很少人參加音樂會'
                    ],
                    correct: 2,
                    ability: 'comprehension',
                    explanation: '關鍵詞 "Although" 表示轉折，儘管天氣糟糕，音樂會依然成功。'
                },
                {
                    type: 'grammar',
                    level: 'B1',
                    question: '選擇正確的條件句：',
                    options: [
                        'If I will have time, I will call you.',
                        'If I have time, I will call you.',
                        'If I had time, I will call you.',
                        'If I have time, I would call you.'
                    ],
                    correct: 1,
                    ability: 'grammar',
                    explanation: '第一類條件句的結構是：If + 現在式, will + 動詞原形。'
                }
            ],
            
            // B2級別題目
            B2: [
                {
                    type: 'vocabulary',
                    level: 'B2',
                    question: '選擇最適合的詞語完成句子：\n"The company decided to ___ their marketing strategy to attract younger customers."',
                    options: ['modify', 'destroy', 'ignore', 'copy'],
                    correct: 0,
                    ability: 'vocabulary',
                    explanation: '"Modify" 意思是修改、調整，最符合商業語境中改變策略的含義。'
                },
                {
                    type: 'reasoning',
                    level: 'B2',
                    question: '根據邏輯推理，選擇最合理的結論：\n"All successful entrepreneurs take risks. Maria is a successful entrepreneur. Therefore..."',
                    options: [