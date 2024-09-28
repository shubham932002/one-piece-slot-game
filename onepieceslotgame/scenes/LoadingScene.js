class LoadingScene extends Phaser.Scene {
    constructor() {
        super('LoadingScene');
    }

    preload() {
        console.log("Loading assets...");
        this.load.image('background1', 'assets/images/background1.png');
        this.load.image('background2', 'assets/images/background2.png');
        this.load.image('background3', 'assets/images/background3.jpg');
        this.load.image('slotmachine1', 'assets/images/slotmachine.png');
        this.load.image('slotmachine2', 'assets/images/slotmachine.png');
        this.load.image('slotmachine3', 'assets/images/slotmachine.png');
        this.load.image('logo', 'assets/images/logo.png');
        this.load.image('ggllogo', 'assets/images/ggllogo.png');
        this.load.image('ggllogo2', 'assets/images/ggllogo2.png');
        this.load.image('loadingIcon', 'assets/images/loading.png');
        this.load.image('slots', 'assets/images/slots.png');
        this.load.image('button', 'assets/images/button.png');
        this.load.image('button2', 'assets/images/spinstart.png');
        this.load.image('reel1', 'assets/images/reel1.png');
        this.load.image('reel2', 'assets/images/reel2.png');
        this.load.image('reel3', 'assets/images/reel3.png');
        this.load.image('reel4', 'assets/images/reel4.png');
        this.load.image('reel5', 'assets/images/reel5.png');
        this.load.image('reel6', 'assets/images/reel6.png');
        this.load.image('reel7', 'assets/images/reel7.png');

        this.load.image('tablereel1', 'assets/images/reel1.png');
        this.load.image('tablereel2', 'assets/images/reel2.png');
        this.load.image('tablereel3', 'assets/images/reel3.png');
        this.load.image('tablereel4', 'assets/images/reel4.png');
        this.load.image('tablereel5', 'assets/images/reel5.png');
        this.load.image('tablereel6', 'assets/images/reel6.png');
        this.load.image('tablereel7', 'assets/images/reel7.png');


       


 
        this.load.image('credit', 'assets/images/credit.png');
        this.load.image('bet', 'assets/images/bet.png');

        this.load.image('plus', 'assets/images/plus.png');
        this.load.image('minus', 'assets/images/minus.png');

        this.load.image('thunderimage', 'assets/images/thunderimage.png');
        this.load.image('scroll', 'assets/images/scroll.png');

        this.load.audio('gameStartSound', 'assets/sounds/gamestartsound.mp3');
        this.load.audio('onepiecesound', 'assets/sounds/onepiecesong.mp3');
        this.load.audio('basegamesound', 'assets/sounds/basegamesong.mp3');
        this.load.audio('reelspinning', 'assets/sounds/reelspinning.mp3');
        this.load.audio('hammer', 'assets/sounds/hammer.mp3');
        this.load.audio('winsound','assets/sounds/win.mp3');
        this.load.audio('loosesound','assets/sounds/loose.mp3');
       
    }

    create() {
        const gameWidth = this.cameras.main.width;
        const gameHeight = this.cameras.main.height;
        this.add.image(gameWidth / 2, gameHeight / 2, 'background1').setDisplaySize(gameWidth, gameHeight).setOrigin(0.5);
        const logo = this.add.image(gameWidth / 2, 100, 'logo').setOrigin(0.5).setScale(0.05);
        const loadingText = this.add.text(gameWidth / 2, gameHeight / 2 + 100, 'Game Loading', {
            font: '40px cursive',
            fill: '#000000'
        }).setOrigin(0.5);
        

        const loadingIcon = this.add.image(gameWidth / 2, gameHeight / 2 + 200, 'loadingIcon').setOrigin(0.5).setScale(0.1);
        this.tweens.add({
            targets: loadingIcon,
            angle: 360,
            duration: 2000,
            repeat: -1
        });
        this.input.once('pointerdown', () => {
            this.sound.play('gameStartSound'); 
        });
        this.time.delayedCall(2000, () => {
            this.scene.start('GameStartScene');
        });
    }
}
