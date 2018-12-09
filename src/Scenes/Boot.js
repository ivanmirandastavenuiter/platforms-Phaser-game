import 'phaser';

export default class BootScene extends Phaser.Scene {
  constructor (key) {
    super(key);
  }

  preload () {
    this.levels = {
      1: 'level1',
      2: 'level2'
    };
    // load in the tilemap
    this.load.tilemapTiledJSON('level1', 'assets/tilemaps/level1.json');
    this.load.tilemapTiledJSON('level2', 'assets/tilemaps/level2.json');
    // load in the spritesheet
    this.load.spritesheet('snow', 'assets/images/snow.png', { frameWidth: 64, frameHeight: 64 });
    // load in our character spritesheet
    this.load.spritesheet('female_character', 'assets/images/female_sprite.png', { frameWidth: 30.8, frameHeight: 60 });
    this.load.spritesheet('male_character', 'assets/images/male_sprite.png', { frameWidth: 30, frameHeight: 55 });
    // load gem icon
    this.load.image('gem', 'assets/images/red_gem.png');
    // load snowball icon
    this.load.image('snowball', 'assets/images/snowball.png');
    // load our portal sprite
    this.load.image('portal', 'assets/images/window.png');
  }

  create () {
    this.scene.start('Game', { level: 1, newGame: true, levels: this.levels });
  }
};
