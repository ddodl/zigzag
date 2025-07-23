import { Scene } from 'phaser';
import { EventBus } from '../EventBus';

export class Game extends Scene
{
    constructor ()
    {
        super('Game');
    }

    preload ()
    {
        this.load.setPath('assets');
        
        this.load.image('squirtle', '7.png');
        this.load.image('totodile', '159.png');
        this.load.image('fieldBackground', 'field1.png');
    }

    create ()
    {
        
        this.add.image(400, 300, 'fieldBackground');
        const b = this.physics.add.image(100,300, "squirtle").setScale(3).setFlipX(true)
        const s = this.physics.add.image(700,300, "totodile").setScale(3)

        b.setCollideWorldBounds(true);
        s.setCollideWorldBounds(true);
        b.setVelocity(100, 0)
        s.setVelocity(-100,0)
        b.setCircle(10, 25, 35)
        s.setCircle(10, 25, 35)
       
        this.physics.add.collider(b, s)


        EventBus.emit('current-scene-ready', this);
    }
}
