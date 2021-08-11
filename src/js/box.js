class Box {
    constructor(scene, parent, x, y, size, color) {
        this.scene = scene;
        this.parent = parent;
        this.offset = size/2;
        this.size = size;
        this.color = color;
        this.id = `${x}${y}`

        this.rectangle = scene.add.rectangle(0, 0, this.size, this.size, this.color.color);
        this.rectangleOverlay = scene.add.rectangle(0, 0, this.size, this.size, 0x343434);
        this.rectangleOverlay.alpha = 0;

        this.gameObject = scene.add.container(this.offset+this.size*x, this.offset+this.size*y, [this.rectangle, this.rectangleOverlay])
        this.gameObject.setSize(this.size, this.size)

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

                this.rectangle.fillColor = Phaser.Display.Color.GetColor(transitionColor.r, transitionColor.g, transitionColor.b);
            },
            
        });
    }
}

class UnknownBox extends Box {
    constructor(scene, parent, x, y, size, color) {
        super(scene, parent, x, y, size, color);
        this.gameObject.add(this.scene.add.rectangle(0, 0, 16, 16, 0xffffff, 1))
    }
    
}

class MovingBox extends Box {
    constructor(scene, parent, x, y, size, color, moveFunction) {
        super(scene, parent, x, y, size, color);

        if(moveFunction) {
            console.log(moveFunction)
            this.move = moveFunction.move;
            console.log(this)
            moveFunction.render(this);
        } else {
            this.move = moves.standardMove.move;
        }

        
        this.gameObject
            .setInteractive({ draggable: true, cursor: 'grab', bounds: new Phaser.Geom.Rectangle(0, 0, 32, 32) })
            .on('dragstart', (pointer, dragX, dragY) => {

                this.scene.sound.playAudioSprite('box', this.color.name);

                this.parent.container.bringToTop(this.gameObject);
                this.rectangleOverlay.alpha = 0.3;
                this.startX = this.gameObject.x;
                this.startY = this.gameObject.y;
            })
            .on('drag', (pointer, dragX, dragY) => {
                
                const pos = this.move(this, pointer, dragX, dragY);
                
                this.gameObject.setPosition(Phaser.Math.Snap.To(pos.x, this.gameObject.width, this.gameObject.width/2), Phaser.Math.Snap.To(pos.y, this.gameObject.width, this.gameObject.width/2));
            })
            .on('dragend', (pointer, dragX, dragY, dropped) => {
                this.rectangleOverlay.alpha = 0;
                this.updatePos();
                this.parent.boxMoved(this);

            })
    }
}

class RotatingMovingBox extends MovingBox {
    constructor(scene, parent, x, y, size, color, moveFunction) {
        super(scene, parent, x, y, size, color, moveFunction);
        
        this.scene.tweens.add({
            targets: this.gameObject,
            angle: 360,
            duration: Phaser.Math.RND.between(1000,5000),
            repeat: -1,
            yoyo: false
        });
    }
}

class UnknownMovingBox extends MovingBox {
    constructor(scene, parent, x, y, size, color, moveFunction) {
        super(scene, parent, x, y, size, color, moveFunction);
        
        this.gameObject.add(this.scene.add.rectangle(0, 0, 16, 16, 0xffffff, 1))
    }
}

const standardMove = {
    move: function(that, pointer, dragX, dragY) {
        
        return {x: dragX, y: dragY};
    }
}

const XYSwitchMove = {
    render: function(that) {
        const xrectangle = that.scene.add.rectangle(-6, 0, 2, 2, 0x000000, 0.2);

        that.scene.tweens.add({
            targets: xrectangle,
            x: {from: -6, to: -4},
            duration: 500,
            repeat: -1,
            yoyo: true,
        })

        const yrectangle = that.scene.add.rectangle(5, -4, 2, 2, 0x000000, 0.2);

        that.scene.tweens.add({
            targets: yrectangle,
            y: {from: -4, to: 4},
            duration: 500,
            repeat: -1,
            yoyo: true,
        })

        that.gameObject.add([xrectangle, yrectangle, that.scene.add.rectangle(0, -2, 4, 1, 0x000000, 0.2), that.scene.add.rectangle(0, 1, 4, 1, 0x000000, 0.2)])
    },
    move: function(that, pointer, dragX, dragY) {
        const deltaX = dragX - that.startX;
        const deltaY = dragY - that.startY;

        const x = that.startX + deltaY;
        const y = that.startY + deltaX;
        return {x: x, y: y};
    }
}

const XOnlyMove = {
    render: function(that) {
        const rectangle = that.scene.add.rectangle(0, 0, 2, 2, 0x000000, 0.2);

        that.scene.tweens.add({
            targets: rectangle,
            x: {from: 4, to: -4},
            duration: 1000,
            repeat: -1,
            yoyo: true,
            repeatDelay: 1000
        })

        that.gameObject.add([rectangle])
    },
    move: function(that, pointer, dragX, dragY) {
        return {x: dragX, y: that.startY};
    }
}

const YOnlyMove = {
    render: function(that) {
        const rectangle = that.scene.add.rectangle(0, 0, 2, 2, 0x000000, 0.2);

        that.scene.tweens.add({
            targets: rectangle,
            y: {from: 4, to: -4},
            duration: 1000,
            repeat: -1,
            yoyo: true,
            repeatDelay: 1000
        })

        that.gameObject.add([rectangle])
    },
    move: function(that, pointer, dragX, dragY) {
        return {x: that.startX, y: dragY};
    }
}

const moves = {
    standardMove,
    XYSwitchMove,
    XOnlyMove,
    YOnlyMove
}

export { Box, UnknownBox, MovingBox, RotatingMovingBox, UnknownMovingBox, moves }