import 'phaser';

export default class Enemy extends Phaser.Physics.Arcade.Sprite {
  constructor (scene, x, y) {
    super(scene, x, y, 'male_character');
    this.scene = scene;
    this.health = 3;

    // enable physics
    this.scene.physics.world.enable(this);
    // add our player to the scene
    this.scene.add.existing(this);
    // scale our player
    this.setScale(2);

    // move our enemy
    this.timeEvent = this.scene.time.addEvent({
      delay: 3000,
      callback: this.move,
      loop: true,
      callbackScope: this
    });
  }

  loseHealth () {
    this.health--;
    this.tint = 0xff0000;
    if (this.health === 0) {
      this.scene.events.emit('enemyKilled');
      this.scene.events.emit('extraJump');
      this.timeEvent.destroy();
      this.destroy();
    } else {
      this.scene.time.addEvent({
        delay: 200,
        callback: () => {
          this.tint = 0xffffff;
        }
      });
    }
  }

  move () {
    const randNumber = Math.floor((Math.random() * 4) + 1);
    switch (randNumber) {
      case 1:
        this.setVelocityX(200);
        this.anims.play('m_right', true);
        break;
      case 2:
        this.setVelocityX(-200);
        this.anims.play('m_left', true);
        break;
      case 3:
        this.setVelocityY(-550);
        this.setVelocityX(200);
        this.anims.play('m_right', true);
        break;
      case 4:
        this.setVelocityY(-550);
        this.setVelocityX(-200);
        this.anims.play('m_left', true);
        break;
    }

    this.scene.time.addEvent({
      delay: 500,
      callback: () => {
        if (this.active) {
          this.setVelocity(0);
          this.anims.play('m_turn', true);
        }
      },
      callbackScope: this
    });
  }
}