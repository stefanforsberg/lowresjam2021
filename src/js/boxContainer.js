import {Box,MovingBox,RotatingMovingBox, moves} from "./box";
import {colors} from "./color";
import * as state from "./save"

export default class BoxContainer {
    constructor(scene) {
        this.scene = scene;

        this.boxItems = [];
        this.levelItems = [];
        this.container = scene.add.container(0, 0);

        this.clicks = 0;
        this.solution = "";

        this.levels = [this.level1, this.level2, this.level3, this.level4, this.level5, this.level6, this.level7, this.level8, this.level9, this.level10, this.level11]

        this.goalText = this.scene.add.text(32, 28, 'GOAL', { font: '20px Monospace', fill: '#ffffff', stroke: 'rgba(0,0,0,0.6)', strokeThickness: 1 }).setOrigin(0.5)
        this.counterText = this.scene.add.text(32, 46, '5', { font: '20px Monospace', fill: '#ffffff', stroke: 'rgba(0,0,0,0.6)', strokeThickness: 1 }).setOrigin(0.5)

        
    }

    boxMoved(box1) {

        if(box1.gameObject.x < 0 || box1.gameObject.x > 63 || box1.gameObject.y < 0 || box1.gameObject.y > 63) {
            this.scene.scene.start('LevelScene');
        }

        var boxes = this.boxItems.filter((i) => i.id !== box1.id && i.xPos == box1.xPos && i.yPos == box1.yPos)

        if(boxes.length === 1)
        {
            const box2 = boxes[0];

            var mixedColor = box2.color.level > box1.color.level ? box2.color.mix(box1.color) : box1.color.mix(box2.color);

            if(box1.color.name !== box2.color.name)
            {
                box1.setColor(mixedColor)
            }

            this.boxItems.splice(this.boxItems.findIndex(item => item.id === box2.id), 1)
            box2.gameObject.destroy();



        }

        const currentSolution = this.getCurrentSolution();
        console.log(currentSolution);

        console.log((this.solution.match(/-/g)  || []).length)
        console.log((currentSolution.match(/-/g)  || []).length)


        if( (currentSolution.match(/-/g) || []).length < (this.solution.match(/-/g)  || []).length) {
            console.log("can not solve")

            const failedBg = this.scene.add.rectangle(32, 32, 64, 64, 0x000000, 0.5);

            const failed = this.scene.add.text(32, 32, '😓', { font: '28px Monospace', fill: '#ffffff' }).setOrigin(0.5)
            
            failed.setInteractive();
            failed.on("pointerdown", () => {
                failedBg.destroy();
                failed.destroy();
                this.startLevel(this.currentLevel);
            })
            
        }

        if(currentSolution === this.solution) {
            state.save(this.currentLevel, {completed: true})

            this.scene.add.rectangle(32, 32, 64, 64, 0x000000, 0.5);

            const success = this.scene.add.text(32, 32, '👍', { font: '28px Monospace', fill: '#ffffff' }).setOrigin(0.5)
            
            success.setInteractive();
            success.on("pointerdown", () => {
                this.scene.scene.start('LevelScene');
            })

        }

    }

    startLevel(level) {
        this.currentLevel = level;
        this.boxItems.forEach((i) => this.container.remove(i.gameObject, true));
        this.boxItems = [];

        this.levelItems.forEach((i) => i.destroy());
        this.levelItems = [];

        this.goalText.setText("GOAL");
        this.counterText.setText("5");
        
        this.solution = "";
        this.levels[level].bind(this)();
    }

    getCurrentSolution() {
        this.boxItems.sort( (a,b) => a.sortKey-b.sortKey);
        return this.boxItems.map(i => i.sortKey + "_" + i.color.name).join('-');
       
    }

    setupSolutionCountdown(solution, initialPlacement) {
        solution();
        this.boxItems.forEach((i) => this.container.add(i.gameObject));
        this.solution = this.getCurrentSolution();

        this.scene.tweens.addCounter({
            from: 0,
            to: 5,
            duration: 5000,
            repeat: 0,
            yoyo: false,
            onUpdate: tween => {
                this.counterText.setText(5 - Math.floor(tween.getValue()));
                
            },
            onComplete: () => {
                this.boxItems.forEach((i) => this.container.remove(i.gameObject, true));
                this.boxItems = [];
                this.goalText.setText("");
                this.counterText.setText("");

                initialPlacement();

                this.boxItems.forEach((i) => this.container.add(i.gameObject));
            }
            
            
        });

    }

    

    level1() {

        this.setupSolutionCountdown(
            () => {
                this.boxItems.push(new Box(this.scene, this, 1, 1, 16, colors.Red, true));
                this.boxItems.push(new Box(this.scene, this, 1, 2, 16, colors.Red, true));
                this.boxItems.push(new Box(this.scene, this, 2, 1, 16, colors.Red, true));
                this.boxItems.push(new Box(this.scene, this, 2, 2, 16, colors.Red, true));
            }, 
            () => {
                this.boxItems.push(new MovingBox(this.scene, this, 0, 0, 16, colors.Red));
                this.boxItems.push(new MovingBox(this.scene, this, 0, 3, 16, colors.Red));
                this.boxItems.push(new MovingBox(this.scene, this, 3, 0, 16, colors.Red));
                this.boxItems.push(new MovingBox(this.scene, this, 3, 3, 16, colors.Red));

               
        });
    }

    level2() {
        this.setupSolutionCountdown(
            () => {
                this.boxItems.push(new Box(this.scene, this, 1, 1, 16, colors.Red, true));
                this.boxItems.push(new Box(this.scene, this, 1, 2, 16, colors.Blue, true));
                this.boxItems.push(new Box(this.scene, this, 2, 1, 16, colors.Red, true));
                this.boxItems.push(new Box(this.scene, this, 2, 2, 16, colors.Yellow, true));
            }, 
            () => {
                this.boxItems.push(new MovingBox(this.scene, this, 0, 0, 16, colors.Red));
                this.boxItems.push(new MovingBox(this.scene, this, 0, 3, 16, colors.Red));
                this.boxItems.push(new MovingBox(this.scene, this, 3, 0, 16, colors.Blue));
                this.boxItems.push(new MovingBox(this.scene, this, 3, 3, 16, colors.Yellow));

               
        });
    }

    level3() {
        this.setupSolutionCountdown(
            () => {
                this.boxItems.push(new Box(this.scene, this, 2, 1, 16, colors.Red, true));
                this.boxItems.push(new Box(this.scene, this, 1, 2, 16, colors.Blue, true));
            }, 
            () => {
                this.boxItems.push(new MovingBox(this.scene, this, 0, 1, 16, colors.Red));
                this.boxItems.push(new MovingBox(this.scene, this, 0, 2, 16, colors.Blue));
                this.boxItems.push(new MovingBox(this.scene, this, 3, 1, 16, colors.Blue));
                this.boxItems.push(new MovingBox(this.scene, this, 3, 2, 16, colors.Red));
        });
    }

    level4() {
        this.setupSolutionCountdown(
            () => {
                this.boxItems.push(new Box(this.scene, this, 1, 1, 16, colors.Purple, true));
                this.boxItems.push(new Box(this.scene, this, 2, 2, 16, colors.Purple, true));
            }, 
            () => {
                this.boxItems.push(new MovingBox(this.scene, this, 0, 1, 16, colors.Red));
                this.boxItems.push(new MovingBox(this.scene, this, 0, 2, 16, colors.Blue));
                this.boxItems.push(new MovingBox(this.scene, this, 3, 1, 16, colors.Blue));
                this.boxItems.push(new MovingBox(this.scene, this, 3, 2, 16, colors.Red));
        });
    }

    level5() {
        this.setupSolutionCountdown(
            () => {
                this.boxItems.push(new Box(this.scene, this, 0, 0, 16, colors.Blue, true));
                this.boxItems.push(new Box(this.scene, this, 1, 0, 16, colors.Blue, true));
                this.boxItems.push(new Box(this.scene, this, 2, 0, 16, colors.Blue, true));
                this.boxItems.push(new Box(this.scene, this, 3, 0, 16, colors.Blue, true));
                this.boxItems.push(new Box(this.scene, this, 1, 1, 16, colors.Green, true));
                this.boxItems.push(new Box(this.scene, this, 2, 1, 16, colors.Green, true));
            }, 
            () => {
                this.boxItems.push(new MovingBox(this.scene, this, 0, 1, 16, colors.Yellow));
                this.boxItems.push(new MovingBox(this.scene, this, 0, 2, 16, colors.Blue));
                this.boxItems.push(new MovingBox(this.scene, this, 3, 1, 16, colors.Blue));
                this.boxItems.push(new MovingBox(this.scene, this, 3, 2, 16, colors.Yellow));

                this.boxItems.push(new MovingBox(this.scene, this, 1, 1, 16, colors.Blue));
                this.boxItems.push(new MovingBox(this.scene, this, 1, 2, 16, colors.Blue));
                this.boxItems.push(new MovingBox(this.scene, this, 2, 1, 16, colors.Blue));
                this.boxItems.push(new MovingBox(this.scene, this, 2, 2, 16, colors.Blue));
        });
    }

    level6() {
        this.setupSolutionCountdown(
            () => {
                this.boxItems.push(new Box(this.scene, this, 0, 0, 16, colors.Green, true));
                this.boxItems.push(new Box(this.scene, this, 1, 1, 16, colors.Yellow, true));

                const yellowOverlay = this.scene.add.rectangle(-32, 16, 64, 32, colors.Yellow.color, 0.4);

                this.levelItems.push(yellowOverlay)

                this.scene.tweens.add({
                    targets: yellowOverlay,
                    x: 32,
                    ease: 'Linear',
                    delay: 3000,
                    duration: 1000,
                    repeat: 0,
                    yoyo: false
                });
            }, 
            () => {
                this.boxItems.push(new MovingBox(this.scene, this, 0, 0, 16, colors.Yellow));
                this.boxItems.push(new MovingBox(this.scene, this, 2, 3, 16, colors.Yellow));
                this.boxItems.push(new MovingBox(this.scene, this, 3, 2, 16, colors.Blue));
                this.boxItems.push(new MovingBox(this.scene, this, 3, 0, 16, colors.Green));

                
        });
    }

    level7() {
        this.setupSolutionCountdown(
            () => {
                this.boxItems.push(new Box(this.scene, this, 0, 0, 16, colors.Green, true));
                this.boxItems.push(new Box(this.scene, this, 1, 1, 16, colors.Yellow, true));
                this.boxItems.push(new Box(this.scene, this, 2, 2, 16, colors.Yellow, true));
                this.boxItems.push(new Box(this.scene, this, 3, 3, 16, colors.Green, true));

                const yellowOverlay = this.scene.add.rectangle(-32, 32, 64, 64, colors.Yellow.color, 0.4);

                this.levelItems.push(yellowOverlay)

                this.scene.tweens.add({
                    targets: yellowOverlay,
                    x: 32,
                    ease: 'Linear',
                    delay: 3000,
                    duration: 1000,
                    repeat: 0,
                    yoyo: false
                });
            }, 
            () => {
                this.boxItems.push(new MovingBox(this.scene, this, 0, 0, 16, colors.Yellow));
                this.boxItems.push(new MovingBox(this.scene, this, 0, 1, 16, colors.Blue));
                this.boxItems.push(new MovingBox(this.scene, this, 0, 2, 16, colors.Blue));
                this.boxItems.push(new MovingBox(this.scene, this, 1, 1, 16, colors.Yellow));
                this.boxItems.push(new MovingBox(this.scene, this, 1, 2, 16, colors.Yellow));
                this.boxItems.push(new MovingBox(this.scene, this, 0, 3, 16, colors.Green));

                
        });
    }

    level8() {
        this.setupSolutionCountdown(
            () => {
                this.boxItems.push(new Box(this.scene, this, 1, 0, 16, colors.Green, true));
                this.boxItems.push(new Box(this.scene, this, 2, 1, 16, colors.Purple, true));
                this.boxItems.push(new Box(this.scene, this, 1, 2, 16, colors.Orange, true));
            }, 
            () => {
                this.boxItems.push(new MovingBox(this.scene, this, 0, 0, 16, colors.Blue));
                this.boxItems.push(new MovingBox(this.scene, this, 0, 1, 16, colors.Blue));
                this.boxItems.push(new MovingBox(this.scene, this, 0, 2, 16, colors.Yellow));
                this.boxItems.push(new MovingBox(this.scene, this, 0, 3, 16, colors.Yellow));
                this.boxItems.push(new MovingBox(this.scene, this, 1, 0, 16, colors.Blue));
                this.boxItems.push(new MovingBox(this.scene, this, 1, 1, 16, colors.Blue));
                this.boxItems.push(new MovingBox(this.scene, this, 1, 2, 16, colors.Blue));
                this.boxItems.push(new MovingBox(this.scene, this, 1, 3, 16, colors.Blue));
                this.boxItems.push(new MovingBox(this.scene, this, 2, 0, 16, colors.Red));
                this.boxItems.push(new MovingBox(this.scene, this, 2, 1, 16, colors.Red));
                this.boxItems.push(new MovingBox(this.scene, this, 2, 2, 16, colors.Red));
                this.boxItems.push(new MovingBox(this.scene, this, 2, 3, 16, colors.Red));
                this.boxItems.push(new MovingBox(this.scene, this, 3, 0, 16, colors.Red));
                this.boxItems.push(new MovingBox(this.scene, this, 3, 1, 16, colors.Red));
                this.boxItems.push(new MovingBox(this.scene, this, 3, 2, 16, colors.Red));
                this.boxItems.push(new MovingBox(this.scene, this, 3, 3, 16, colors.Red));

        });
    }

    level9() {
        this.setupSolutionCountdown(
            () => {
                this.boxItems.push(new Box(this.scene, this, 1, 1, 16, colors.Green, true));
                this.boxItems.push(new Box(this.scene, this, 1, 2, 16, colors.Green, true));
                this.boxItems.push(new Box(this.scene, this, 2, 1, 16, colors.Orange, true));
                this.boxItems.push(new Box(this.scene, this, 2, 2, 16, colors.Blue, true));

                const orangeOverlay = this.scene.add.rectangle(-32, 40, 64, 16, colors.Orange.color, 0.4);
                const redOverlay = this.scene.add.rectangle(24,-32, 16, 64, colors.Red.color, 0.4);

                this.levelItems.push(orangeOverlay)
                this.levelItems.push(redOverlay)

                this.scene.tweens.add({
                    targets: orangeOverlay,
                    x: 32,
                    ease: 'Linear',
                    delay: 3000,
                    duration: 1000,
                    repeat: 0,
                    yoyo: false
                });

                this.scene.tweens.add({
                    targets: redOverlay,
                    y: 32,
                    ease: 'Linear',
                    delay: 3000,
                    duration: 1000,
                    repeat: 0,
                    yoyo: false
                });
            }, 
            () => {
                this.boxItems.push(new MovingBox(this.scene, this, 0, 0, 16, colors.Blue));
                this.boxItems.push(new RotatingMovingBox(this.scene, this, 0, 1, 16, colors.Blue));
                this.boxItems.push(new MovingBox(this.scene, this, 0, 2, 16, colors.Yellow));
                this.boxItems.push(new MovingBox(this.scene, this, 0, 3, 16, colors.Yellow));
                this.boxItems.push(new MovingBox(this.scene, this, 1, 0, 16, colors.Blue));
                this.boxItems.push(new MovingBox(this.scene, this, 1, 1, 16, colors.Blue));
                this.boxItems.push(new RotatingMovingBox(this.scene, this, 1, 2, 16, colors.Blue));
                this.boxItems.push(new MovingBox(this.scene, this, 1, 3, 16, colors.Blue));
                this.boxItems.push(new MovingBox(this.scene, this, 2, 0, 16, colors.Red));
                this.boxItems.push(new MovingBox(this.scene, this, 2, 1, 16, colors.Red));
                this.boxItems.push(new RotatingMovingBox(this.scene, this, 2, 2, 16, colors.Yellow));
        });
    }

    level10() {
        this.setupSolutionCountdown(
            () => {
                this.boxItems.push(new Box(this.scene, this, 3, 3, 16, colors.Brown, true));
            }, 
            () => {
                this.boxItems.push(new MovingBox(this.scene, this, 0, 0, 16, colors.Blue));
                this.boxItems.push(new MovingBox(this.scene, this, 0, 2, 16, colors.Yellow));
                this.boxItems.push(new MovingBox(this.scene, this, 0, 3, 16, colors.Yellow));
                this.boxItems.push(new MovingBox(this.scene, this, 2, 0, 16, colors.Red));
        });
    }

    level11() {
        this.setupSolutionCountdown(
            () => {
                this.boxItems.push(new Box(this.scene, this, 0, 0, 16, colors.Green, true));
                this.boxItems.push(new Box(this.scene, this, 1, 1, 16, colors.Purple, true));
                this.boxItems.push(new Box(this.scene, this, 2, 2, 16, colors.Red, true));
                this.boxItems.push(new Box(this.scene, this, 3, 3, 16, colors.Brown, true));
            }, 
            () => {
                this.boxItems.push(new MovingBox(this.scene, this, 0, 0, 16, colors.Blue, moves.XOnlyMove));
                this.boxItems.push(new MovingBox(this.scene, this, 0, 1, 16, colors.Blue, moves.XOnlyMove));
                this.boxItems.push(new MovingBox(this.scene, this, 0, 2, 16, colors.Yellow));
                this.boxItems.push(new MovingBox(this.scene, this, 3, 0, 16, colors.Yellow));
                this.boxItems.push(new MovingBox(this.scene, this, 1, 3, 16, colors.Red));
                this.boxItems.push(new MovingBox(this.scene, this, 2, 0, 16, colors.Red));
                this.boxItems.push(new MovingBox(this.scene, this, 2, 3, 16, colors.Red));
                this.boxItems.push(new MovingBox(this.scene, this, 2, 2, 16, colors.Blue, moves.XOnlyMove));
                this.boxItems.push(new MovingBox(this.scene, this, 3, 3, 16, colors.Yellow, moves.XOnlyMove));

                

        });
    }
}