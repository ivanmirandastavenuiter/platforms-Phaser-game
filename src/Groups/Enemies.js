import 'phaser';
import Enemy from '../Sprites/Enemy';

export default class Enemies extends Phaser.Physics.Arcade.Group {
  constructor (world, scene, children, spriteArray) {
    super(world, scene, children);
    this.scene = scene;

    // create our enemies from the sprite array
    this.createEnemies(scene, spriteArray);
  }

  createEnemies (scene, spriteArray) {
    spriteArray.forEach((sprite) => {
      // create a new enemy
      const enemy = new Enemy(scene, sprite.x, sprite.y);
      // add to our group
      this.add(enemy);
      // destroy the sprite
      sprite.destroy();
    });
  }
}