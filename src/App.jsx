import { useRef, useState } from 'react';

import Phaser from 'phaser';
import { PhaserGame } from './PhaserGame';

function App() {

    //References to the PhaserGame component (game and scene are exposed)
    const phaserRef = useRef();
    const [editingPath, setEditingPath] = useState(null)

    const editPath = (editIndex) => {
        const scene = phaserRef.current.scene;
        if (scene) {
            if (editingPath === editIndex) {
                //done editing
                setEditingPath(null)
                scene.changeState("none")
                return
            }
            //force user to reset button before editing another
            if (editingPath === null) {
                setEditingPath(editIndex)
                scene.pathIndex = editIndex;//make sure this is before next line
                scene.changeState("editing")
            }

        }
    }

    const erasePath = () => {
        const scene = phaserRef.current.scene;
        if (scene) {
            scene.eraseSegment()
        }
    }

    return (
        <div id="app">
            <PhaserGame id="phaserCanvas" ref={phaserRef} />
            <div class="buttonContainer">
                {[1, 2, 3, 4].map((n, index) => <button className="button" style={{ backgroundColor: editingPath === n - 1 ? "green" : null }}
                    onClick={() => editPath(n - 1)} key={index}>edit path {n}</button>
                )}
            </div>
            <div>
                <button onClick={erasePath}class="button">erase segment</button>
            </div>
        </div>
    )
}

export default App
