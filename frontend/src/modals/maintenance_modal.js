import React, { useState } from "react";
import { Selector } from "../components/selector";
import {child, set} from "firebase/database";
import './modal.css';
import '../index.css'

export function MaintenanceModal({dbRef, plants, close}) {
    const [plateDryPlantRef, setPlateDryPlantRef] = useState("");

    const setPurge = () => {set(child(dbRef, "command/purge"), true);}
    const setClean = () => {set(child(dbRef, "command/clean"), true);}
    const setPlateDry = () => {
        set(child(dbRef, "command/calibrate_plate_dry"), plateDryPlantRef);

    }

    return (
        <div>
            <div className="modal_background" onClick={close}/>
            <div className="modal maintenance_modal_size">
                <h2>Maintenance</h2>
                
                <button className="button" onClick={setPurge}>Purge pipes</button>
                <button className="button" onClick={setClean}>Run cleaning</button>

                <Selector id="plate_dry_ref" 
                          label="Plant"
                          options={Object.entries(plants).map((plant) => {return({ value: plant[0], label: plant[0]})})}
                          onChange={(obj) => {setPlateDryPlantRef(obj.value)}}/>
                <button className="button" onClick={setPlateDry}>Calibrate plate water sensor</button>
            </div>
        </div>
    );
}