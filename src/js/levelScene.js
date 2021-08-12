import Phaser from "phaser";
import {colors} from "./color";
import * as state from "./save"
import main from "url:../audio/main.mp3"
import boxAudio from "url:../audio/box.mp3"
import boxAudioSprite from "url:../audio/box_audiosprite.json"

export default class LevelScene extends Phaser.Scene {

  constructor() {
      super({
        key: "LevelScene",
      });
    }

  preload() {
        
    this.load.audio('main', [
      main
    ]);

    this.load.audioSprite('box', boxAudioSprite, [
        boxAudio
    ]);
  }

  create() {

    if(!this.mainAudio) {
      this.mainAudio = this.sound.add('main', { loop: true });
      this.mainAudio.volume = 0;
      this.mainAudio.play();

      this.tweens.add({
        targets: this.mainAudio,
        volume: 0.3,
        ease: 'Linear',
        duration: 1000,
      });
    }
    
  
    const levelColors = [colors.Orange, colors.Blue, colors.Green, colors.Purple, ]

    const currentState = state.load();

    for(let x = 0; x < 4; x++) {
      for(let y = 0; y < 4; y++) {

        let levelColor = levelColors[x].clone().darken(x*5 + y*5);

        const level = this.add.rectangle(8+16*x, 8+16*y, 16, 16, levelColor.color);

        if(y*4+x <= 13)
        {
          if(currentState[(y*4+x)]) {
            this.drawCheckbox(x, y, 0xE94CFF, 1)
            this.drawCheckbox(x, y, 0xF288FF, 0)
          } else {
            this.add.text(16*x+8, 16*y+8, (y*4+x+1), { font: '13px Monospace', fill: '#fff', stroke: 'rgba(0,0,0,0.1)', strokeThickness: 0 }).setOrigin(0.5)
          }

          level.setInteractive();
          level.on("pointerdown", () => {
            this.scene.start('MainScene', {level: (y*4+x)});
          })
          level.on("pointerover", () => {
            
            level.alpha = 0.7
          })
          level.on("pointerout", () => {
            level.alpha = 1
          })

        }

      }
    }
  }
    
  drawCheckbox(x, y, color, deltaY) {
    var graphics = this.add.graphics();

    graphics.lineStyle(1, color, 1);

    graphics.beginPath();

    graphics.moveTo(16*x+3, 16*y+10+deltaY);
    graphics.lineTo(16*x+7, 16*y+14+deltaY);
    graphics.lineTo(16*x+13, 16*y+2+deltaY);


    graphics.strokePath();
  }
}
