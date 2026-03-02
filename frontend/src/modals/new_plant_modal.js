import React from "react";
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import '../components/plant.css';
import './modal.css';
import '../index.css'
import {Graph} from "../components/graph";
import {TextInput} from "../components/text_input";
import { Selector } from "../components/selector";


export function NewPlantModal({add, close}) {
    const [freq, setFreq] = React.useState(24);
    const [vol, setVol] = React.useState(0);
    const [plantName, setPlantName] = React.useState("");
    const [scientificName, setScientificName] = React.useState("");
    const [imgPath, setImgPath] = React.useState("");
    const [valvePin, setValvePin] = React.useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        // Read the form data
        const form = e.target;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        data.valve_pin = Number(valvePin);

        const name = data.plant_name.replace(/ /g, '_');
        delete data.plant_name;

        // add slider data
        data.mode = "interval";
        data.mode_params = {interval: {water_frequency: freq, water_volume: vol}};
        data.disabled = false;

        add(name, data);
        close();
    }

    const setValvePinNumber = (string) => {
        // only allow numbers
        const regex = /^[0-9\b]+$/;
        if (string === '' || regex.test(string)) {
            setValvePin(string);
        }
    }

    return (
        <div>
            <div className="modal_background" onClick={close}/>
            <div className="modal add_plant_modal_size plant_container">
                <form method="post" onSubmit={handleSubmit}>
                    <TextInput id="plant_name" label="Plant name" text={plantName} setText={setPlantName}/>
                    <TextInput id="scientific_name" label="Scientific name" text={scientificName} setText={setScientificName}/>
                    <TextInput id="image_file" label="Image file" text={imgPath} setText={setImgPath}/>

                    <TextInput id="valve_pin" label="Pin" text={valvePin} setText={setValvePinNumber}/>

                    <Selector id="moisture_sensor" label="Moisture sensor">
                        <option value="None">Some option</option>
                        <option value="S">Some option</option>
                        <option value="Every">Other option</option>
                    </Selector>

                    <Selector id="start_signal" label="Start watering">
                        <option value="moisture">When moisture is below"</option>
                        <option value="plate_dry">When the plate is dry</option>
                        <option value="inverval">Every</option>
                    </Selector>

                    <h3>Water frequency</h3>
                    <h2>{freq} hours</h2>
                    <Slider min={0} max={168} step={4} defaultValue={freq} onChange={(val) => setFreq(val)}/>

                    <h3>Water volume</h3>
                    <h2>{vol} ml</h2>
                    <Slider min={0} max={500} step={10} defaultValue={vol} onChange={(val) => setVol(val)}/>

                    <button type="submit" className="button">Done</button>
                    <button type="button" className="button" onClick={close}>Cancel</button>
                </form>
            </div>
        </div>
    );
}