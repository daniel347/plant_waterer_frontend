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


export function NewPlantModal({add, close, available_pins, available_sensor_pins}) {


    const [plantName, setPlantName] = React.useState("");
    const [scientificName, setScientificName] = React.useState("");
    const [imgPath, setImgPath] = React.useState("");
    const [valvePin, setValvePin] = React.useState("");
    const [sensorPin, setSensorPin] = React.useState(-1);
    const sensorUnderPlate = useCheckboxState();

    const [startSignal, setStartSignal] = React.useState("");
    const [freq, setFreq] = React.useState(24);
    const [startMoisture, setStartMoisture] = React.useState(40);

    const [quantitySignal, setQuantitySignal] = React.useState("");
    const [vol, setVol] = React.useState(0);
    const [quantityMoisture, setQuantityMoisture] = React.useState(60);

    const handleSubmit = (e) => {
        e.preventDefault();

        // Read the form data
        const form = e.target;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        data.valve_pin = Number(valvePin);

        const name = data.plant_name.replace(/ /g, '_');
        delete data.plant_name;
        delete data.start_signal;
        delete data.quantity_signal;
        delete data.sensor_under_plate;

        data.disabled = false;
        data.settings = {interval: freq,
                        start_moisture_thresh: startMoisture,
                        max_interval: 14 * 24,
                        min_interval: 12,
                        volume_ml: vol,
                        stop_moisture_thresh: quantityMoisture,
                        max_volume_ml: 300,
                        sensor_under_plate: sensorUnderPlate.state,
                        start_signal: startSignal,
                        quantity_signal: quantitySignal}
        
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

                    <Selector id="valve_pin" 
                                label="Pin"
                                 options={available_pins.map((v) => {return({ value: v, label: v})})}
                                  onChange={setValvePinNumber}/>

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

                    <Selector id="start_signal" 
                                label="Start watering"
                                 options={[{ value: "Moisture", label: "soil moisture"},
                                           {value: "PlateDry", label: "when the plate is dry"},
                                           {value: "Interval", label: "at regular intervals"}]}
                                  onChange={(val) => setStartSignal(val.value)}/>

                    {(startSignal == "Moisture") && <>
                    <h2>{startMoisture} %</h2>
                    <Slider min={0} max={100} step={1} defaultValue={startMoisture} onChange={setStartMoisture}/></> } 

                    {(startSignal == "Interval") && <>
                    <h2>{freq} hours</h2>
                    <Slider min={0} max={168} step={4} defaultValue={freq} onChange={setFreq}/></>} 

                    <Selector id="quantity_signal" 
                                label="Stop after"
                                 options={[{ value: "Volume", label: "volume"},
                                     {value: "Moisture", label: "soil moisture"},
                                      {value: "PlateWet", label: "when the plate is wet"}]}
                                  onChange={(val) => setQuantitySignal(val.value)}/>


                    {(quantitySignal == "Volume") && <>
                    <h2>{vol} ml</h2>
                    <Slider min={0} max={500} step={10} defaultValue={vol} onChange={setVol}/></>}

                    {(quantitySignal == "Moisture") && <>
                    <h2>{quantityMoisture} %</h2>
                    <Slider min={0} max={100} step={1} defaultValue={quantityMoisture} onChange={setQuantityMoisture}/></>}

                    <button type="submit" className="button">Done</button>
                    <button type="button" className="button" onClick={close}>Cancel</button>
                </form>
            </div>
        </div>
    );
}