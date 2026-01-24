import React from "react";
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import '../components/plant.css';
import '../index.css'
import {Graph} from "../components/graph";


export function PlantEditModal({plant_name, data, update, close, db_ref}) {
    const [freq, setFreq] = React.useState(data.mode_params.interval.water_frequency);
    const [vol, setVol] = React.useState(data.mode_params.interval.water_volume);

    const finish = () => {
        console.log("finish");
        const new_data = {mode_params: {interval: {water_frequency: freq, water_volume: vol}}};
        update(new_data);
        close();
    }

        const plant_display_name = plant_name.replace(/_/g, ' ');

    return (
        <div>
            <div className="modal_background" onClick={close}/>
            <div className="modal edit_plant_modal_size plant_container">
                <h2 className="plant_title">{plant_display_name}</h2>
                <h4 className="scientific_name">{data.scientific_name}</h4>

                <Graph db_ref={db_ref} plant_name={plant_name}/>

                <h3>Water frequency</h3>
                <h2>{freq} hours</h2>
                <Slider min={0} max={168} step={4} defaultValue={freq} onChange={(val) => setFreq(val)}/>

                <h3>Water volume</h3>
                <h2>{vol} ml</h2>
                <Slider min={0} max={500} step={10} defaultValue={vol} onChange={(val) => setVol(val)}/>

                <button className="button" onClick={finish}>Done</button>
                <button className="button" onClick={close}>Cancel</button>
            </div>
        </div>

    );
}