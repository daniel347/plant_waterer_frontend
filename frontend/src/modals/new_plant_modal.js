import React from "react";
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import '../components/plant.css';
import './modal.css';
import '../index.css'
import {Graph} from "../components/graph";
import {TextInput} from "../components/text_input";
import { Selector } from "../components/selector";
import { Checkbox, useCheckboxState } from 'pretty-checkbox-react';
import PlantSettingsSubpage from "../components/plant_settings_subpage";


export function NewPlantModal({add, close, available_pins, available_sensor_pins}) {
    const [plantName, setPlantName] = React.useState("");
    const [scientificName, setScientificName] = React.useState("");
    const [imgPath, setImgPath] = React.useState("");
    const [valvePin, setValvePin] = React.useState(-1);
    const [sensorPin, setSensorPin] = React.useState(-1);
    const sensorUnderPlate = useCheckboxState();

    const [settings, setSettings] = React.useState({interval: 24,
                                                    start_moisture_thresh: 30,
                                                    max_interval: 14 * 24,
                                                    min_interval: 12,
                                                    volume_ml: 100,
                                                    stop_moisture_thresh: 60,
                                                    max_volume_ml: 300,
                                                    start_signal: "Interval",
                                                    quantity_signal: "Volume"});

    const handleSubmit = (e) => {
        e.preventDefault();

        // Read the form data
        const form = e.target;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        data.valve_pin = valvePin;
        data.sensor_pin = sensorPin;

        const name = data.plant_name.replace(/ /g, '_');
        data.sensor_under_plate = sensorUnderPlate.state;
        delete data.plant_name;
        delete data.start_signal;
        delete data.quantity_signal;
        

        data.disabled = false;
        data.settings = settings;
        
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
                <form className="full_width" method="post" onSubmit={handleSubmit}>
                    <TextInput id="plant_name" label="Plant name" text={plantName} setText={setPlantName}/>
                    <TextInput id="scientific_name" label="Scientific name" text={scientificName} setText={setScientificName}/>
                    <TextInput id="image_file" label="Image file" text={imgPath} setText={setImgPath}/>

                    <Selector id="valve_pin" 
                                label="Pin"
                                 options={available_pins.map((v) => {return({ value: v, label: v})})}
                                  onChange={(val) => setValvePin(val.value)}/>

                    <Selector id="sensor_pin" 
                                label="Moisture sensor"
                                 options={[...available_sensor_pins.map((v) => {return({ value: v, label: v})}), {value: -1, label: "None"}]}
                                  onChange={(val) => setSensorPin(val.value)}/>

                    {(sensorPin != -1) && <Checkbox bigger
                                                    shape="curve"
                                                    variant="thick"
                                                    name="sensor_under_plate"
                                                    className={"checkbox"}
                                                    value="" {...sensorUnderPlate}>
                                    Sensor under plate
                        </Checkbox>}

                    <PlantSettingsSubpage settings={settings} setSettings={setSettings} hasMoistureSensor={sensorPin != -1} sensorUnderPlate={sensorUnderPlate.state}/>

                    <button type="submit" className="button">Done</button>
                    <button type="button" className="button" onClick={close}>Cancel</button>
                </form>
            </div>
        </div>
    );
}