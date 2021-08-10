import Phaser from "phaser";
import MainScene from "./mainScene";
import LevelScene from "./levelScene";

const config = {
  type: Phaser.AUTO,
  backgroundColor: 0x656565,
  scale: {
    parent: 'game',
    width: 64,
    height: 64,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    mode: Phaser.Scale.FIT
  },
  pixelArt: true,
  parent: "game",
  scene: [LevelScene, MainScene],
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  }
};

const game = new Phaser.Game(config);

export default game;