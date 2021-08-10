class Box {
    constructor(scene, parent, x, y, size, color) {
        this.scene = scene;
        this.parent = parent;
        this.offset = size/2;
        this.size = size;
        this.color = color;
        this.strokeColor = Phaser.Display.Color.ValueToColor(this.color).darken(20).color
        this.id = `${x}${y}`

        this.gameObject = scene.add.rectangle(this.offset+this.size*x, this.offset+this.size*y, this.size, this.size, this.color.color);

        this.updatePos();
    }


    updatePos() {
        this.xPos = (this.gameObject.x - this.offset)/this.size;
        this.yPos = (this.gameObject.y - this.offset)/this.size;
        this.sortKey = parseInt(`${this.xPos}${this.yPos}`)
    }

    setColor(color) {

        const currentColor = this.color;
        this.color = color;

        this.scene.tweens.addCounter({
            from: 0,
            to: 100,
            duration: 200,
            repeat: 0,
            yoyo: false,
            onUpdate: tween => {
                const transitionColor = Phaser.Display.Color.Interpolate.ColorWithColor(currentColor, color, 100, tween.getValue())

                this.gameObject.fillColor = Phaser.Display.Color.GetColor(transitionColor.r, transitionColor.g, transitionColor.b);
            },
            
        });
    }
}

class MovingBox extends Box {
    constructor(scene, parent, x, y, size, color, move) {
        super(scene, parent, x, y, size, color);

        if(move) {
            this.move = move
        } else {
            this.move = moves.standardMove;
        }

        
        this.gameObject
            .setInteractive({ draggable: true, cursor: 'grab', bounds: new Phaser.Geom.Rectangle(0, 0, 32, 32) })
            .on('dragstart', (pointer, dragX, dragY) => {
                this.parent.container.bringToTop(this.gameObject);
                this.gameObject.setStrokeStyle(1,this.strokeColor)
                this.startX = this.gameObject.x;
                this.startY = this.gameObject.y;
            })
            .on('drag', (pointer, dragX, dragY) => {
                
                const pos = this.move(pointer, dragX, dragY);
                
                console.log(x + "," + y)
                this.gameObject.setPosition(Phaser.Math.Snap.To(pos.x, this.gameObject.width, this.gameObject.width/2), Phaser.Math.Snap.To(pos.y, this.gameObject.width, this.gameObject.width/2));
            })
            .on('dragend', (pointer, dragX, dragY, dropped) => {
                this.gameObject.setStrokeStyle(0,0xffffff, 0.7)
                this.updatePos();
                this.parent.boxMoved(this);

            })
    }
}

class RotatingMovingBox extends MovingBox {
    constructor(scene, parent, x, y, size, color, move) {
        super(scene, parent, x, y, size, color, move);
        
        this.scene.tweens.add({
            targets: this.gameObject,
            angle: 360,
            duration: Phaser.Math.RND.between(1000,5000),
            repeat: -1,
            yoyo: false
        });
    }
}

function standardMove(pointer, dragX, dragY) {
    return {x: dragX, y: dragY};
}

function XYSwitchMove(pointer, dragX, dragY) {
    const deltaX = dragX - this.startX;
    const deltaY = dragY - this.startY;

    const x = this.startX + deltaY;
    const y = this.startY + deltaX;
    return {x: x, y: y};
}

function XOnlyMove(pointer, dragX, dragY) {
    return {x: dragX, y: this.startY};
}

const moves = {
    standardMove,
    XYSwitchMove,
    XOnlyMove
}

export { Box, MovingBox, RotatingMovingBox, moves }