import 'phaser';
import Player from '../Sprites/Player';
import Portal from '../Sprites/Portal';
import Gem from '../Groups/Gems';
import Enemies from '../Groups/Enemies';
import Bullets from '../Groups/Bullets';

export default class GameScene extends Phaser.Scene {
  constructor (key) {
    super(key);
  }

  init (data) {
    this._LEVEL = data.level;
    this._LEVELS = data.levels; 
    this._NEWGAME = data.newGame;
    this.loadingLevel = false;
    if (this._NEWGAME) this.events.emit('newGame');
  }

  create () {
    // listen for the resize event
    this.events.on('resize', this.resize, this);
    // listen for player input
    this.cursors = this.input.keyboard.createCursorKeys();
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    // create our tilemap
    this.createMap();
    // create our player
    this.createPlayer();
    this.setPlayerAnimations();
    // creating the portal
    this.createPortal();
    
    // creating the gem group
    this.gems = this.map.createFromObjects('Gems', 'Gem', { key: 'gem' });
    this.gemsGroup = new Gem(this.physics.world, this, [], this.gems);
    // creating the enemies
    this.enemies = this.map.createFromObjects('Enemies', 'Enemy', {});
    this.enemiesGroup = new Enemies(this.physics.world, this, [], this.enemies);
    this.setEnemiesBound(this.enemiesGroup.children.entries);
    // creating the bullets
    this.bullets = new Bullets(this.physics.world, this, []);

    // add collisions
    this.addCollisions();

    // update our camera
    this.cameras.main.startFollow(this.player);
  }

  update () {
    this.player.update(this.cursors);

    if (this._LEVEL === 2) {
      this.movePlatforms();
    }

    if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
      this.bullets.fireBullet(this.player.x, this.player.y, this.player.direction);
    }
  }

  addCollisions () {
    if (this._LEVEL == 1) {
      this.physics.add.collider(this.player, this.blockedLayer);
      this.physics.add.collider(this.enemiesGroup, this.blockedLayer);
      this.physics.add.collider(this.portal, this.blockedLayer);
      this.physics.add.overlap(this.player, this.enemiesGroup, this.player.enemyCollision.bind(this.player));
      this.physics.add.overlap(this.player, this.portal, this.loadNextLevel.bind(this, false));
      this.physics.add.overlap(this.gemsGroup, this.player, this.gemsGroup.collectGems.bind(this.gemsGroup));
      this.physics.add.overlap(this.bullets, this.enemiesGroup, this.bullets.enemyCollision);
    } else if (this._LEVEL == 2) {
      this.physics.add.collider(this.player, this.fixedPlatformsL2);
      this.physics.add.collider(this.enemiesGroup, this.fixedPlatformsL2);
      this.physics.add.collider(this.player, this.dynamicPlatformsL2);
      this.physics.add.collider(this.enemiesGroup, this.dynamicPlatformsL2);
      this.physics.add.collider(this.portal, this.fixedPlatformsL2);
      this.physics.add.overlap(this.player, this.portal, this.loadNextLevel.bind(this, false));
      this.physics.add.overlap(this.player, this.enemiesGroup, this.player.enemyCollision.bind(this.player));
      this.physics.add.overlap(this.gemsGroup, this.player, this.gemsGroup.collectGems.bind(this.gemsGroup));
      this.physics.add.overlap(this.bullets, this.enemiesGroup, this.bullets.enemyCollision);
    }
  }

  createPlayer () {
    this.map.findObject('Player', (obj) => {
      if (this._NEWGAME && this._LEVEL === 1) {
        if (obj.type === 'StartingPoint') {
        this.player = new Player(this, obj.x, obj.y);
        }
      } else {
        this.player = new Player(this, obj.x, obj.y);
      }
    });
    this.player.setCollideWorldBounds(true); 
    this.player.setBounce(0.2);
  }

  createPortal () {
    this.map.findObject('Portal', (obj) => {
      if (this._LEVEL === 1) {
        this.portal = new Portal(this, obj.x, obj.y - 68);
      } else if (this._LEVEL === 2) {
        this.portal = new Portal(this, obj.x, obj.y + 70);
      }
    });
  }

  resize (width, height) {
    if (width === undefined) {
      width = this.sys.game.config.width;
    }
    if (height === undefined) {
      height = this.sys.game.config.height;
    }
    this.cameras.resize(width, height);
  }

  createMap () {
    // create the tilemap
    this.map = this.make.tilemap({ key: this._LEVELS[this._LEVEL] });
    // set bounds so the camera won't go outside the game world
    this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
    // add tileset image
    this.tiles = this.map.addTilesetImage('snow');

    if (this._LEVEL == 1) {
      // create our layers for level one
      this.backgroundLayer = this.map.createStaticLayer('Background', this.tiles, 0, 0);
      this.blockedLayer = this.map.createDynamicLayer('Platforms', this.tiles, 0, 0);
      this.blockedLayer.setCollisionByExclusion([-1]);

      // set the boundaries of our game world
      this.physics.world.bounds.width = this.blockedLayer.width;
      this.physics.world.bounds.height = this.blockedLayer.height;
    } else if (this._LEVEL == 2) {
      // create our layers for level two
      this.backgroundLayerL2 = this.map.createStaticLayer('Background_L2', this.tiles, 0, 0);
      this.fixedPlatformsL2 = this.map.createDynamicLayer('Fixed_platforms_L2', this.tiles, 0, 0);
      this.fixedPlatformsL2.setCollisionByExclusion([-1]);
      this.dynamicPlatformsL2 = this.map.createDynamicLayer('Dynamic_platforms_L2', this.tiles, 0, 0);
      this.dynamicPlatformsL2.setCollisionByExclusion([-1]);
      
      this.speedDirection = this.setSpeedDirection();
  
      // set the boundaries of our game world
      this.physics.world.bounds.width = this.fixedPlatformsL2.width;
      this.physics.world.bounds.height = this.fixedPlatformsL2.height;
    }
  }
  
  loadNextLevel (endGame) {
    if (!this.loadingLevel) {
      this.cameras.main.fade(500, 0, 0, 0);
      this.cameras.main.on('camerafadeoutcomplete', () => {
        if (endGame) {
          this.scene.restart({ level: 1, levels: this._LEVELS, newGame: true });
        } else if (this._LEVEL === 1) {
          this.scene.restart({ level: 2, levels: this._LEVELS, newGame: false });
        } else if (this._LEVEL === 2) {
          this.scene.restart({ level: 1, levels: this._LEVELS, newGame: false });
        }
      });
      this.loadingLevel = true;
    }
  }

  setEnemiesBound (enemies) {
    enemies.forEach(function(enemy) {
      enemy.setCollideWorldBounds(true);
    });
  }

  setPlayerAnimations() {

    // Female character 

    this.anims.create({
      key: 'f_left',
      frames: this.anims.generateFrameNumbers('female_character', { start: 0, end: 5, zeroPad: 2 }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
        key: 'f_turn',
        frames: [ { key: 'female_character', frame: 6 } ],
        frameRate: 20
    });

    this.anims.create({
        key: 'f_right',
        frames: this.anims.generateFrameNumbers('female_character', { start: 7, end: 12, zeroPad: 2}),
        frameRate: 10,
        repeat: -1
    });

    // Male character

    this.anims.create({
      key: 'm_left',
      frames: this.anims.generateFrameNumbers('male_character', { start: 0, end: 5, zeroPad: 2 }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
        key: 'm_turn',
        frames: [ { key: 'male_character', frame: 6 } ],
        frameRate: 20
    });

    this.anims.create({
        key: 'm_right',
        frames: this.anims.generateFrameNumbers('male_character', { start: 7, end: 12, zeroPad: 2}),
        frameRate: 10,
        repeat: -1
    });
  }

  movePlatforms() {

    this.dynamicPlatformsL2.x += this.speedDirection;

    if (this.dynamicPlatformsL2.x > 250 || this.dynamicPlatformsL2.x < -250) {
      this.speedDirection *= -1;
    }
  }

  setSpeedDirection() {

    var speedDirection = 1;

    if (Math.random() > 0.5) {
      speedDirection *= -1;
    }

    return speedDirection;
  }

  

};
