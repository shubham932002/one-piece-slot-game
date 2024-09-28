class GameStartScene extends Phaser.Scene {
    constructor() {
        super('GameStartScene');
    }

    create() {
        const bg = this.add.image(900, 330, 'background2').setDisplaySize(1800, 950); 
        const startButton = this.add.image(390, 630, 'button').setDisplaySize(200, 80).setInteractive();
        const startText = this.add.text(400, 600, '', { 
            font: '24px Arial',
            fill: '#fff'
        }).setOrigin(0.5);
        
        const ggllogo = this.add.image(400, 510, 'ggllogo').setOrigin(0.5).setScale(0.7); 
        const slots = this.add.image(400, 70, 'slots').setOrigin(0.5).setScale(0.2); 
        this.sound.play('onepiecesound', { loop: true });
        startButton.on('pointerdown', () => {
            this.sound.stopByKey('onepiecesound');
            this.scene.start('BaseGameScene');
        });
        startButton.on('pointerover', () => {
            startButton.setTint(0x44ff44); 
        });

        startButton.on('pointerout', () => {
            startButton.clearTint(); 
        });
    }
}
