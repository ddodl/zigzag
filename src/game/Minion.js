export class Minion extends Phaser.GameObjects.Image {
    imageClone;// this is what gets tweened/animated without affect physics position
    state = "none"
    goalPoint = 1;
    startPosition
    constructor(scene, x, y, texture, isFacingRight, path) {
        super(scene)

        this.startPosition = { x, y }
        this.scene = scene;
        this.path = path;
        this.f = isFacingRight ? 1 : -1
        this.imageClone = scene.add.image(x, y, texture)
            .setScale(3).setFlipX(isFacingRight).setOrigin(0.5, 0.8)//origin set using trial and error to align to circle

        this.setTexture().setPosition(x, y).setScale(3);//setting empty texture for creating imageless physics body
        scene.physics.add
            .existing(this)
            .body.setCircle(8, 8, 7.5)//circle set using trial and error to align
            .setCollideWorldBounds(true);

        this.stateText = scene.add.text(600, 10, "", { fill: "#00ff00" });
        this.changeState("none")

    }

    changeState(state) {
        this.stateText.setText(`state: ${state}`)
        this.state = state;
    }

    update() {
        this.imageClone.copyPosition(this)
        if (this.state === "none") {

        }
        if (this.state === "moving") this.processMove();
        if (this.state === "attacking") {
        }
    }

    processMove() {
        if (this.goalPoint === this.path.length) {//reached last point
            this.body.setVelocity(0, 0)//stop velocity
            this.changeState("none")
            this.reset()
            return
        }
        const destination = this.path[this.goalPoint]
        const dist = Phaser.Math.Distance.BetweenPoints({ x: this.x, y: this.y }, destination)
        if (dist < 10) {//does the game update fast enough to see 10pixels in distance
            //reached turn point, need new destination
            this.goalPoint += 1;
        } else {
            //continue to destination
            this.scene.physics.moveTo(this, destination.x, destination.y, 300)
        }
    }

    reset() {
        this.goalPoint = 1;
        this.setPosition(this.startPosition.x, this.startPosition.y)
    }
}