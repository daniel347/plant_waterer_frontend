import React from "react";
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import '../components/plant.css';
import '../index.css'
import {Graph} from "../components/graph";
import { Navbar } from "../components/navbar";
import { Selector } from "../components/selector";
import PlantSettingsSubpage from "../components/plant_settings_subpage";

export function PlantEditModal({plant_name, data, update, close, db_ref}) {
    const [_settings, setSettings] = React.useState(data.settings);

    const finish = () => {
        console.log("finish");
        const new_data = {settings: _settings};
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

                <PlantSettingsSubpage settings={_settings} setSettings={setSettings} hasMoistureSensor={data.sensor_pin != -1} sensorUnderPlate={data.sensor_under_plate}/>

                <div className="button_container">
                    <button className="button" onClick={finish}>Done</button>
                    <button className="button" onClick={close}>Cancel</button>
                </div>
            </div>
        </div>

    );
}