import 'phaser';

export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor (scene, x, y) {
    super(scene, x, y, 'female_character');
    this.scene = scene;
    this.health = 3;
    this.hitDelay = false;
    this.direction = 'up';
    this.jumps = 1;
    this.hasJumped = false;

    // enable physics
    this.scene.physics.world.enable(this);
    // add our player to the scene
    this.scene.add.existing(this);
    // scale our player
    this.setScale(1.5);
    this.scene.events.on('extraJump', () => {
      this.jumps++;
    });
  }

  update (cursors) {
    this.setVelocityX(0);
    this.anims.play('f_turn', true);
    // check if the up or down key is pressed
    if (cursors.up.isDown) {
      this.hasJumped = false;
      if (this.jumps === 1 && this.body.blocked.down) {
        this.direction = 'up';
        this.setVelocityY(-550);
      } else if (this.jumps > 1) {
        this.direction = 'up';
        this.setVelocityY(-550);
        this.scene.time.addEvent({
          delay: 1000,
          callback: () => {
            if (this.jumps > 1 && !this.hasJumped) {
              this.jumps--;
              this.hasJumped = true;
            }
          },
          callbackScope: this
        });
      }
    } else if (cursors.down.isDown) { 
      this.direction = 'down';
    }
    // check if the left or right key is pressed
    if (cursors.left.isDown) {
      this.direction = 'left';
      this.setVelocityX(-300);
      this.anims.play('f_left')

    } else if (cursors.right.isDown) {
      this.direction = 'right';
      this.setVelocityX(300);
      this.anims.play('f_right', true);
    }
  }

  loseHealth () {
    this.health--;
    this.scene.events.emit('loseHealth', this.health);
    if (this.health === 0) {
      this.scene.loadNextLevel(true);
    }
  }

  enemyCollision (player) {
    if (!this.hitDelay) {
      this.loseHealth();
      this.hitDelay = true;
      this.tint = 0xff0000;
      this.scene.time.addEvent({
        delay: 1200,
        callback: () => {
          this.hitDelay = false;
          this.tint = 0xffffff;
        },
        callbackScope: this
      });
    }
  }


}