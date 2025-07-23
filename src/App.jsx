import { useRef } from 'react';

import Phaser from 'phaser';
import { PhaserGame } from './PhaserGame';

function App() {

    //  References to the PhaserGame component (game and scene are exposed)
    const phaserRef = useRef();

    const addSprite = () => {

        const scene = phaserRef.current.scene;

        if (scene) {
            // Add a new sprite to the current scene at a random position
            const x = Phaser.Math.Between(64, scene.scale.width - 64);
            const y = Phaser.Math.Between(64, scene.scale.height - 64);

            //  `add.sprite` is a Phaser GameObjectFactory method and it returns a Sprite Game Object instance
            scene.add.sprite(x, y, 'squirtle');
        }
    }

    return (
        <div id="app">
            <PhaserGame id="phaserCanvas" ref={phaserRef} />
            <div class="buttonContainer">
                <button className="button" onClick={addSprite}>Add New Sprite</button>
                <button className="button" onClick={addSprite}>Add New Sprite</button>
            </div>
            <div class="buttonContainer">
                <button className="button" onClick={addSprite}>Add New Sprite</button>
                <button className="button" onClick={addSprite}>Add New Sprite</button>
            </div>
        </div>
    )
}

export default App
