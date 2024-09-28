class BaseGameScene extends Phaser.Scene {
    constructor() {
        super('BaseGameScene');
        this.credits = 0; 
        this.bet = 0;  
       
    }

    preload() {
        this.load.json('gameSettings', 'data/gameSettings.json');
        this.load.json('winConfig', 'data/winConfig.json');
    }

    create() {
        const gameSettings = this.cache.json.get('gameSettings');
        const winConfig = this.cache.json.get('winConfig');
        this.credits = gameSettings.credits;
        this.bet = gameSettings.bet;
        this.add.image(850, 300, 'background3').setDisplaySize(2000, 910);
        this.add.image(820, 280, 'slotmachine1').setOrigin(0.5).setDisplaySize(400, 120);
        this.add.image(820, 400, 'slotmachine2').setOrigin(0.5).setDisplaySize(400, 120);
        this.add.image(820, 520, 'slotmachine3').setOrigin(0.5).setDisplaySize(400, 120);
        this.add.image(150, 150, 'scroll').setOrigin(0.5).setDisplaySize(300, 300);
        this.add.image(800, 100, 'logo').setDisplaySize(800, 200);
        this.add.image(550, 630, 'credit').setDisplaySize(300, 100);
        this.add.image(1100, 630, 'bet').setDisplaySize(300, 100);


        this.add.image(80, 60, 'tablereel1').setDisplaySize(25, 25);
        this.add.image(80, 90, 'tablereel2').setDisplaySize(25, 25);
        this.add.image(80, 120, 'tablereel3').setDisplaySize(25, 25);
        this.add.image(80, 150, 'tablereel4').setDisplaySize(25, 25);
        this.add.image(80, 180, 'tablereel5').setDisplaySize(25, 25);
        this.add.image(80, 210, 'tablereel6').setDisplaySize(25, 25);
        this.add.image(80, 240, 'tablereel7').setDisplaySize(25, 25);




        const plusButton = this.add.image(1250, 610, 'plus').setDisplaySize(25, 25).setInteractive();
        const minusButton = this.add.image(1250, 660, 'minus').setDisplaySize(25, 25).setInteractive();
        const textStyle = {
            fontFamily: 'Verdana',
            fontSize: '15px',
            fontStyle: 'bold',
            color: '#FFD700',
            stroke: '#000000',
            strokeThickness: 6,
            shadow: {
                offsetX: 2,
                offsetY: 2,
                color: '#000000',
                blur: 2,
                stroke: true,
                fill: true
            }
        };
        this.creditText = this.add.text(550, 630, `Credits: $${this.credits}`, textStyle).setOrigin(0.5);
        this.betText = this.add.text(1100, 630, `Bet: $${this.bet}`, textStyle).setOrigin(0.5);
        plusButton.on('pointerdown', () => {
            if (this.bet < 30) { 
                this.bet += 10;
                this.updateBetText();
                this.updatePayTable(); 
            }
        });

    
        minusButton.on('pointerdown', () => {
            if (this.bet > 10) { 
                this.bet -= 10;
                this.updateBetText();
                this.updatePayTable(); 
            }
        });
        const backgroundMusic = this.sound.add('basegamesound', { loop: true, volume: 0.2 });
        backgroundMusic.play();

        this.addWinSound = this.sound.add('winsound', { loop: true, volume: 0.3 });
        this.addLooseSound = this.sound.add('loosesound', { loop: true, volume: 0.3 });
        this.reelSpinningSound = this.sound.add('reelspinning', { loop: false, volume: 0.6 });
        // this.hammerSound = this.sound.add('hammer', { loop: false, volume: 2.0 });
      
this.reels = [
    [this.add.image(690, 280, 'thunderimage').setDisplaySize(118, 92), 
     this.add.image(820, 280, 'thunderimage').setDisplaySize(118, 92), 
     this.add.image(950, 280, 'thunderimage').setDisplaySize(118, 92)],
     
     [this.add.image(690, 400, 'thunderimage').setDisplaySize(118, 92), 
        this.add.image(820, 400, 'thunderimage').setDisplaySize(118, 92), 
        this.add.image(950, 400, 'thunderimage').setDisplaySize(118, 92)],
     
        [this.add.image(690, 520, 'thunderimage').setDisplaySize(118, 92), 
            this.add.image(820, 520, 'thunderimage').setDisplaySize(118, 92), 
            this.add.image(950, 520, 'thunderimage').setDisplaySize(118, 92)]
];


        this.payTableText = this.add.text(160, 147, '', {
            fontFamily: 'Verdana',
            fontSize: '17px',
            fontStyle: 'bold',
            color: '#FFD700',
            stroke: '#000000',
            strokeThickness: 6,
            shadow: {
                offsetX: 2,
                offsetY: 2,
                color: '#000000',
                blur: 2,
                stroke: true,
                fill: true
            },
            lineSpacing: 10 
        }).setOrigin(0.5);
        

        this.updatePayTable();

        const spinButton = this.add.image(810, 630, 'button2').setDisplaySize(100, 100).setInteractive();
        spinButton.on('pointerdown', () => this.spinReels(winConfig));
        spinButton.on('pointerover', () => {
            spinButton.setTint(0xff4444); 
        });
        spinButton.on('pointerout', () => {
            spinButton.clearTint(); 
        });
    }

    updateBetText() {
        this.betText.setText(`Bet: $${this.bet}`);
    }

    updatePayTable() {
        let payTableText = '';
        for (let i = 1; i <= 7; i++) {
            const amount = this.bet * i * 10;
            payTableText += `3x : $${amount}\n`;
        }
    
        this.payTableText.setText(payTableText.trim());
        this.payTableText.setLineSpacing(4); 
    }
    

    spinReels(winConfig) {
        if (this.credits < this.bet) {
            this.displayNoWinMessage("Add Credits!");
            return; 
        }
        this.credits -= this.bet;
        this.creditText.setText(`Credits: $${this.credits}`);
    
        const reelSymbols = ['reel1', 'reel2', 'reel3', 'reel4', 'reel5', 'reel6', 'reel7'];
        const results = [[], [], []]; // For three rows
        this.reels.forEach((row, rowIndex) => {
            row.forEach((reel, colIndex) => {
                reel.setTexture('thunderimage');
                this.reelSpinningSound.play();
                const delay = (rowIndex * 50 + colIndex * 150); 
                this.time.delayedCall(delay, () => {
                    const randomSymbol = Phaser.Math.Between(1, reelSymbols.length); 
                    reel.setTexture(`reel${randomSymbol}`);
                    results[rowIndex][colIndex] = `reel${randomSymbol}`;
                    // this.hammerSound.play()
    
                    if (rowIndex === this.reels.length - 1 && colIndex === row.length - 1) {
                        this.calculateWinnings(winConfig, results);
                    }
                });
            });
        });
    }  
    

    calculateWinnings(winConfig, results) {
        let winAmount = 0;
        const combinations = winConfig.combinations;
        const winningPatterns = new Set(); 
        const winningPositions = []; 
    
        for (let rowIndex = 0; rowIndex < results.length; rowIndex++) {
            const row = results[rowIndex];
            const combination = row.join('-');
            if (combinations[combination]) {
                winningPatterns.add(combination);
            
                winningPositions.push(...row.map((_, colIndex) => [rowIndex, colIndex]));
            }
        }
    
     
        for (let colIndex = 0; colIndex < 3; colIndex++) {
            const combination = results.map(row => row[colIndex]).join('-');
            if (combinations[combination]) {
                winningPatterns.add(combination);
          
                for (let rowIndex = 0; rowIndex < results.length; rowIndex++) {
                    winningPositions.push([rowIndex, colIndex]);
                }
            }
        }
    
     
        const diagonal1 = [results[0][0], results[1][1], results[2][2]].join('-');
        const diagonal2 = [results[0][2], results[1][1], results[2][0]].join('-');
    
        if (combinations[diagonal1]) {
            winningPatterns.add(diagonal1);
     
            winningPositions.push([0, 0], [1, 1], [2, 2]);
        }
        if (combinations[diagonal2]) {
            winningPatterns.add(diagonal2);
       
            winningPositions.push([0, 2], [1, 1], [2, 0]);
        }
    
     
        for (let pattern of winningPatterns) {
            winAmount += combinations[pattern];
        }
    
  
        if (winAmount > 0) {
            if (this.bet === 20) winAmount *= 2;
            else if (this.bet === 30) winAmount *= 3;
    
            this.credits += winAmount;
            this.displayWinMessage(winAmount);
            this.creditText.setText(`Credits: $${this.credits}`);
    
            this.highlightWinningSymbols(winningPositions);
        } else {
            this.displayNoWinMessage();
        }
    }
    

highlightWinningSymbols(winningPositions) {
    winningPositions.forEach(([rowIndex, colIndex]) => {
        const reel = this.reels[rowIndex][colIndex];
    
        reel.setTint(0xFFD700); 
        
   
        this.tweens.add({
            targets: reel,
            scaleX: 1.2, 
            scaleY: 1.2,
            duration: 300,
            yoyo: true,
            repeat: 1,
            onComplete: () => {
                reel.clearTint(); 
            }
        });

       
        const glowEffect = this.add.graphics();
        glowEffect.lineStyle(5, 0xFFD700, 1); 
        glowEffect.strokeRect(reel.x - 60, reel.y - 46, 118, 92); 

      
        this.tweens.add({
            targets: glowEffect,
            alpha: 0,
            duration: 500,
            onComplete: () => {
                glowEffect.destroy(); 
            }
        });
    });
}

    
    
  
    displayWinMessage(amount) {
        this.addWinSound.play();
        const winText = this.add.text(1280, 350, `You Won $${amount}!`, {
            fontFamily: 'Verdana',
            fontSize: '35px',
            fontStyle: 'bold',
            color: '#00ff00',
            stroke: '#000000',
            strokeThickness: 6,
            shadow: {
                offsetX: 2,
                offsetY: 2,
                color: '#000000',
                blur: 2,
                stroke: true,
                fill: true
            }
        }).setOrigin(0.5);

        this.time.delayedCall(3000, () => {
            winText.setAlpha(0);
            this.addWinSound.stop();
        });
    }

    displayNoWinMessage(message = "No Win!") {
        this.addLooseSound.play();
        const noWinText = this.add.text(1280, 350, message, {
            fontFamily: 'Verdana',
            fontSize: '35px',
            fontStyle: 'bold',
            color: '#ff0000',
            stroke: '#000000',
            strokeThickness: 6,
            shadow: {
                offsetX: 2,
                offsetY: 2,
                color: '#000000',
                blur: 2,
                stroke: true,
                fill: true
            }
        }).setOrigin(0.5);
        this.time.delayedCall(3000, () => {
            noWinText.setAlpha(0);
            this.addLooseSound.stop();
        });
    }
}
