import Phaser from "phaser";
import BoxContainer from "./boxContainer";

export default class MainScene extends Phaser.Scene {

    constructor() {
        super({
          key: "MainScene",
        });
      }

    create(e) {

      console.log(e.level)

        var boxContainer = new BoxContainer(this);

        boxContainer.startLevel(e.level);




        
    }
}