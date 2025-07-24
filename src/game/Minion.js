export class Minion extends Phaser.GameObjects.Image {
    imageClone;// this is what gets tweened/animated without affect physics position
    state = "none";
    goalPoint = 1;
    startPosition;
    health = 100;
    maxHealth = 100;
    currentOpps;
    lastAttackTime = null;
    aspd = 500;
    dmg = 5;
    attackTween;

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
            .setCollideWorldBounds(true)
            .setBounce(1)


        this.stateText = scene.add.text(600, 10, "", { fill: "#00ff00" });
        this.changeState("none")

        //hp bars
        this.redBar = this.scene.add.rectangle(x, y - 50, 30, 4, 0xff0000)
        this.greenBar = this.scene.add.rectangle(x, y - 50, 30, 4, 0x00ff00)
    }

    moveHp() {
        const x = this.x;
        const y = this.y;
        const offset = -50
        this.redBar.x = x;
        this.greenBar.x = x;
        this.redBar.y = y + offset
        this.greenBar.y = y + offset
    }

    changeState(state, arg = null) {
        if (state === "attacking") {
            this.body.setVelocity(0, 0)
            this.playAttackTween()
            this.currentOpps = arg
        }
        if (state === "defeated") {
            this.attackTween.stop()
            this.body.setEnable(false)
        }
        this.stateText.setText(`state: ${state}`)
        this.state = state;
    }

    playAttackTween() {
        //attack animation
        const recoil = 20 * this.f;
        this.attackTween = this.scene.tweens.add({
            targets: this.imageClone,
            x: `-=${recoil}`,
            ease: "sine.out",
            duration: this.aspd,
            yoyo: false,
            repeat: -1,
        })
    }

    update(time) {
        this.moveHp()
        if (this.state === "none") {
        }
        if (this.state === "moving") {
            this.imageClone.copyPosition(this)
            this.processMove();
        }

        if (this.state === "attacking") this.processAttack(time);
    }

    takeDmg(dmg) {
        this.health -= dmg
        this.greenBar.setScale(this.health / this.maxHealth)
        if (this.health <= 0) this.changeState("defeated")
    }

    processAttack(time) {
        if (time > this.lastAttackTime + this.aspd) {
            this.currentOpps.takeDmg(this.dmg)
            this.lastAttackTime = time;
            if (this.currentOpps.state === "defeated") {
                this.attackTween.stop();
                this.changeState("moving")
            }
        }
    }

    processMove() {
        if (this.goalPoint === this.path.length) {//reached last point
            this.body.stop()//stop velocity
            this.changeState("none")
            //this.reset()
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
        this.imageClone.copyPosition(this)
    }
}