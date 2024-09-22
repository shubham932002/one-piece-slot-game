class BaseGameScene extends Phaser.Scene {
    constructor() {
        super('BaseGameScene');
        this.credits = 0; 
        this.bet = 0;     
    }

    preload() {
        this.load.json('gameSettings', 'data/gameSettings.json');
        this.load.json('winConfig', 'data/winConfig.json');
        for (let i = 1; i <= 7; i++) {
            this.load.image(`reel${i}`, `assets/reels/reel${i}.png`); 
        }
    }

    create() {
        const gameSettings = this.cache.json.get('gameSettings');
        const winConfig = this.cache.json.get('winConfig');
        this.credits = gameSettings.credits;
        this.bet = gameSettings.bet;
        this.add.image(850, 300, 'background3').setDisplaySize(2100, 910);
        this.add.image(820, 350, 'slotmachine').setOrigin(0.5).setDisplaySize(800, 300);
        this.add.image(150, 150, 'scroll').setOrigin(0.5).setDisplaySize(300, 300);
        this.add.image(800, 100, 'logo').setDisplaySize(800, 100);
        this.add.image(1500, 25, 'ggllogo2').setDisplaySize(50, 50);
        this.add.image(550, 600, 'credit').setDisplaySize(300, 100);
        this.add.image(1100, 600, 'bet').setDisplaySize(300, 100);


        this.add.image(80, 60, 'tablereel1').setDisplaySize(25, 25);
        this.add.image(80, 90, 'tablereel2').setDisplaySize(25, 25);
        this.add.image(80, 120, 'tablereel3').setDisplaySize(25, 25);
        this.add.image(80, 150, 'tablereel4').setDisplaySize(25, 25);
        this.add.image(80, 180, 'tablereel5').setDisplaySize(25, 25);
        this.add.image(80, 210, 'tablereel6').setDisplaySize(25, 25);
        this.add.image(80, 240, 'tablereel7').setDisplaySize(25, 25);




        const plusButton = this.add.image(1250, 580, 'plus').setDisplaySize(25, 25).setInteractive();
        const minusButton = this.add.image(1250, 630, 'minus').setDisplaySize(25, 25).setInteractive();
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
        this.creditText = this.add.text(550, 600, `Credits: $${this.credits}`, textStyle).setOrigin(0.5);
        this.betText = this.add.text(1100, 600, `Bet: $${this.bet}`, textStyle).setOrigin(0.5);
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
        const backgroundMusic = this.sound.add('basegamesound', { loop: true, volume: 0.05 });
        backgroundMusic.play();

        this.addWinSound = this.sound.add('winsound', { loop: true, volume: 0.3 });
        this.addLooseSound = this.sound.add('loosesound', { loop: true, volume: 0.3 });
        this.reelSpinningSound = this.sound.add('reelspinning', { loop: false, volume: 0.6 });
        this.hammerSound = this.sound.add('hammer', { loop: false, volume: 2.0 });
        this.reels = [
            this.add.image(560, 350, 'thunderimage').setDisplaySize(230, 235), // Reel 1
            this.add.image(820, 350, 'thunderimage').setDisplaySize(230, 235), // Reel 2
            this.add.image(1080, 350, 'thunderimage').setDisplaySize(230, 235) // Reel 3
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
            lineSpacing: 10 // Adjust this value for desired spacing
        }).setOrigin(0.5);
        

        this.updatePayTable();

        const spinButton = this.add.image(810, 600, 'button2').setDisplaySize(100, 100).setInteractive();
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
        const payouts = {};
        for (let i = 1; i <= 7; i++) {
            payouts[`reel${i}`] = this.bet * i*10; 
        }
    
        let payTableText = '';
        for (const [reel, amount] of Object.entries(payouts)) {
            payTableText += `3x : $${amount}\n`;
        }
    
        this.payTableText.setText(payTableText.trim());
        
        // Optionally, adjust lineSpacing here if needed
        this.payTableText.setLineSpacing(4); // Adjust this value as needed
    }
    

    spinReels(winConfig) {
        if (this.credits < this.bet) {
            this.displayNoWinMessage("Add Credits!");
            return; 
        }
        this.credits -= this.bet;
        this.creditText.setText(`Credits: $${this.credits}`);

        const reelSymbols = ['reel1', 'reel2', 'reel3', 'reel4', 'reel5', 'reel6', 'reel7'];
        const results = [];
        this.reels.forEach(reel => {
            reel.setTexture('thunderimage');
        });

        this.reelSpinningSound.play();
        const revealReel = (reelIndex, delay) => {
            this.time.delayedCall(delay, () => {
                const randomSymbol = Phaser.Math.Between(1, reelSymbols.length); 
                this.reels[reelIndex].setTexture(`reel${randomSymbol}`);
                results.push(`reel${randomSymbol}`);

                this.hammerSound.play();

                if (reelIndex === this.reels.length - 1) {
                    this.calculateWinnings(winConfig, results);
                    this.reelSpinningSound.stop();
                }
            });
        };

        revealReel(0, 1000);
        revealReel(1, 2000);
        revealReel(2, 3000);
    }

    calculateWinnings(winConfig, results) {
        const combinations = winConfig.combinations;
        const combination = results.join('-');
        let winAmount = combinations[combination];
        if (winAmount) {
            if (this.bet === 20) {
                winAmount *= 2; 
            } else if (this.bet === 30) {
                winAmount *= 3; 
            }

            this.credits += winAmount; 
            this.displayWinMessage(winAmount);
            this.creditText.setText(`Credits: $${this.credits}`); 
        } else {
            this.displayNoWinMessage();
        }
    }

    displayWinMessage(amount) {
        this.addWinSound.play();
        const winText = this.add.text(1380, 350, `You Won $${amount}!`, {
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
        const noWinText = this.add.text(1380, 350, message, {
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
