import 'phaser';

export default class Gem extends Phaser.Physics.Arcade.StaticGroup {
  constructor (world, scene, children, spriteArray) {
    super(world, scene, children);
    this.scene = scene;

    // add gems to our group
    spriteArray.forEach((gem) => {
      gem.setScale(0.8);
      this.add(gem);
    });
    this.refresh();
  }

  collectGems (player, gem) {
    this.remove(gem);
    gem.destroy();
    // dispatch an event
    this.scene.events.emit('gemsCollected');
  }
}