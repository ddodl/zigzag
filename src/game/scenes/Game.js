import { Scene } from 'phaser';
import { EventBus } from '../EventBus';
import { Minion } from '../Minion'

export class Game extends Scene {
    //from starting point to center of enemy base
    paths = [[{ x: 30, y: 100 }, { x: 800 - 55, y: 300 }],
    [{ x: 30, y: 200 }, { x: 800 - 55, y: 300 }],
    [{ x: 30, y: 400 }, { x: 800 - 55, y: 300 }],
    [{ x: 30, y: 500 }, { x: 800 - 55, y: 300 }]]
    pathIndex = null;
    state = "none"
    constructor() {
        super('Game');
    }

    preload() {
        this.load.setPath('zigzag/assets');

        this.load.image('squirtle', '7.png');
        this.load.image('totodile', '159.png');
        this.load.image('fieldBackground', 'field1.png');
    }

    create() {
        this.add.image(400, 300, 'fieldBackground');
        this.graphics = this.add.graphics();//allows drawing shapes

        this.mon = this.children.add(new Minion(this, 30, 100, "totodile", true, this.paths[0]))
        this.opps = this.children.add(new Minion(this, 500, 250, "squirtle", false, this.paths[0]))

        this.physics.add.collider(this.mon, this.opps, (obj1, obj2) => {
            obj1.changeState("attacking", obj2)
            obj2.changeState("attacking", obj1)

        });

        // const s = this.physics.add.image(700, 300, "totodile").setScale(3)
        var homeBase = this.add.rectangle(30, 300, 50, 100, 0x0000ff);
        var enemyBase = this.add.rectangle(770, 300, 50, 100, 0xff0000);
        // this.physics.add.existing(homeBase)
        // this.physics.add.existing(enemyBase)
        // this.add.circle(30, 100, 8, 0x0f0)
        // this.add.circle(30, 200, 8, 0x0f0)
        // this.add.circle(30, 400, 8, 0x0f0)
        // this.add.circle(30, 500, 8, 0x0f0)

        // this.add.circle(55, 300, 8, 0x0f0)
        // this.add.circle(800 - 55, 300, 8, 0x00ff00)


        this.physics.add.existing(homeBase)
        this.physics.add.existing(enemyBase)

        // b.setCollideWorldBounds(true);
        // s.setCollideWorldBounds(true);
        // b.setVelocity(100, 0)
        // s.setVelocity(-100, 0)
        // b.setCircle(10, 25, 35)
        // s.setCircle(10, 25, 35)

        // this.physics.add.collider(b, s)

        this.stateText = this.add.text(10, 10, "", { fill: "#00ff00" });
        this.changeState("none")


        this.input.on("pointerdown", (pointer, gameObj) => {
            if (gameObj.length > 0) return;//if clicked on another clickable item
            if (this.state === "editing") {
                this.paths[this.pathIndex].push({ x: pointer.x, y: pointer.y })
                this.drawPath()
            }
        })

        EventBus.emit('current-scene-ready', this);
    }

    update(time) {
        this.mon.update(time)
        this.opps.update(time)
    }
    
    reset() {
        this.mon.reset()
        this.opps.health = 100;
        this.opps.body.setEnable(true)
    }

    go() {
        this.changeState("Battle")
        this.mon.changeState("moving")
    }

    changeState(state) {
        if (state === "editing") this.drawPath();
        if (state === "none") this.graphics.clear();
        this.stateText.setText(`state: ${state}`)
        this.state = state;
    }

    eraseSegment() {
        if (this.state === "editing") {
            if (this.paths[this.pathIndex].length === 1) return//dont erase first point
            this.paths[this.pathIndex].pop()
            this.graphics.clear();
            this.drawPath();
        }
    }

    drawPath() {
        let p;
        this.paths[this.pathIndex].forEach((point, i) => {
            if (i === 0) { p = this.add.path(point.x, point.y) }
            else { p.lineTo(point) }
        })
        this.graphics.lineStyle(4, 0xffffff);
        p.draw(this.graphics);
    }
}
