import Phaser from "phaser";

class BlueColor extends Phaser.Display.Color  {
    constructor() {
        super(124, 169, 252);
        this.name = "Blue";
        this.level = 1;
    }

    mix(color) {
        if(color === colors.Red) return colors.Purple;
        if(color === colors.Yellow) return colors.Green;
        return this;
    }
}

class YellowColor extends Phaser.Display.Color  {
    constructor() {
        super(253, 253, 149);
        this.name = "Yellow";
        this.level = 1;
    }

    mix(color) {
        if(color === colors.Red) return colors.Orange;
        if(color === colors.Blue) return colors.Green;
        return this;
    }
}

class RedColor extends Phaser.Display.Color  {
    constructor() {
        super(255, 106, 106);
        this.name = "Red";
        this.level = 1;
    }

    mix(color) {
        if(color === colors.Blue) return colors.Purple;
        if(color === colors.Yellow) return colors.Orange;

        return this;
    }
}

class PurpleColor extends Phaser.Display.Color  {
    constructor() {
        super(229, 170, 255);
        this.name = "Purple";
        this.level = 2;
    }

    mix(color) {
        return color.level === 2 ? colors.Brown : this;
    }
}

class OrangeColor extends Phaser.Display.Color  {
    constructor() {
        super(255, 204, 120);
        this.name = "Orange";
        this.level = 2;
    }

    mix(color) {
        return color.level === 2 ? colors.Brown : this;

    }
}

class GreenColor extends Phaser.Display.Color  {
    constructor() {
        super(205, 253, 181);
        this.name = "Green";
        this.level = 2;
    }

    mix(color) {
        return color.level === 2 ? colors.Brown : this;
    }
}

class BrownColor extends Phaser.Display.Color {
    constructor() {
        super(223,199,167);
        this.name = "Brown";
        this.level = 3;
    }

    mix(color) {
        return colors.Brown;
    }
}

const colors = {
    Red: new RedColor(),
    Blue: new BlueColor(),
    Yellow: new YellowColor(),
    Purple: new PurpleColor(),
    Green: new GreenColor(),
    Orange: new OrangeColor(),
    Brown: new BrownColor(),
};

export {
    colors
}