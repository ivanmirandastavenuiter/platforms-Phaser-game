import 'phaser';

export default class UIScene extends Phaser.Scene {
  constructor () {
    super({ key: 'UI', active: true });
  }

  init () {
    this.gemsCollected = 0;
    this.enemiesKilled = 0;
    this.extraJumps = 0;
    this.levelsDefined = false;
    this.launchMenu = false;
  }

  create () {

    // create score text
    this.scoreText = this.add.text(12, 12, `Score: ${this.gemsCollected}`, { fontSize: '32px', fill: '#fff' });

    // create health text
    this.healthText = this.add.text(12, 50, `Health: 3`, { fontSize: '32px', fill: '#fff' });

    // create enemies killed text
    this.enemiesText = this.add.text(1580, 12, `Enemies killed: ${this.enemiesKilled}`, { fontSize: '32px', fill: '#fff' });

    // create the key to restart
    this.key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);

    // get a reference to the game scene
    this.gameScene = this.scene.get('Game');

    // listen for events from that scene
    this.gameScene.events.on('gemsCollected', () => {
      this.gemsCollected++;
      this.scoreText.setText(`Score: ${this.gemsCollected}`);
      this.playerWins();
    });

    this.gameScene.events.on('enemyKilled', () => {
      this.enemiesKilled++;
      this.enemiesText.setText(`Enemies killed: ${this.enemiesKilled}`);
      this.playerWins();
    });

    this.gameScene.events.on('loseHealth', (health) => {
      this.healthText.setText(`Health: ${health}`);
    });

    this.gameScene.events.on('newGame', () => {
      this.gemsCollected = 0;
      this.enemiesKilled = 0;
      this.scoreText.setText(`Score: ${this.gemsCollected}`);
      this.enemiesText.setText(`Enemies killed: ${this.enemiesKilled}`);
      this.healthText.setText(`Health: 3`);
    });

    this.gameScene.events.on('playerWins', () => {
      this.winText = this.add.text(480, 300, `You win! Press x to restart`, { fontSize: '32px', fill: '#fff' });
      this.launchMenu = true;
      this.scene.pause('Game');
    });

    this.gameScene.events.on('restartGame', () => {
      if (this.winText != null) this.winText.destroy();
      this.gameScene.events.emit('newGame');
      this.launchMenu = false;
      this.levelsDefined = false;
      this.gameScene.scene.restart({ level: 1, levels: this._LEVELS, newGame: true });
    });
  }

  playerWins() {
    if (this.gemsCollected === 15 || this.enemiesKilled === 10) {
      this.gameScene.events.emit('playerWins');
    }
  }

  restartGame() {
    if (this.key.isDown) {
      this.gameScene.events.emit('restartGame');
    }
  }

  controlDataStatus() {
    if (this.gameScene._LEVEL != undefined && this.gameScene._LEVELS != undefined) {
      this._LEVEL = this.gameScene._LEVEL;
      this._LEVELS = this.gameScene._LEVELS; 
      this.levelsDefined = true;
    }
  }

  triggerNewGame() {
    if (!this.levelDefined) this.controlDataStatus();
    if (this.levelsDefined && this.launchMenu) this.restartGame();
  }

  update() {
    this.triggerNewGame();
  }
};
