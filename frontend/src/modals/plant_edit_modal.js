import React from "react";
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import '../components/plant.css';
import '../index.css'
import {Graph} from "../components/graph";
import { Navbar } from "../components/navbar";
import { Selector } from "../components/selector";

export function PlantEditModal({plant_name, data, update, close, db_ref}) {
    const [startSignal, setStartSignal] = React.useState(data.settings.start_signal);
    const [freq, setFreq] = React.useState(data.settings.interval_millis / (3600 * 1000));
    const [startMoisture, setStartMoisture] = React.useState(data.settings.start_moisture_thresh);

    const [quantitySignal, setQuantitySignal] = React.useState(data.settings.quantity_signal);
    const [vol, setVol] = React.useState(data.settings.volume_ml);
    const [quantityMoisture, setQuantityMoisture] = React.useState(data.settings.stop_moisture_thresh);

    const [page, setPage] = React.useState("Settings");

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

                <Navbar headings={["Settings", "Modes"]} open_page={page} set_open_page={setPage}/>

                {(page == "Settings") && <>
                    {(startSignal == "Moisture") && <>
                        <h2>{startMoisture} %</h2>
                        <Slider min={0} max={100} step={1} defaultValue={startMoisture} onChange={setStartMoisture}/></> } 

                    {(startSignal == "Interval") && <>
                        <h2>{freq} hours</h2>
                        <Slider min={0} max={168} step={4} defaultValue={freq} onChange={setFreq}/></>} 

                    {(quantitySignal == "Volume") && <>
                        <h2>{vol} ml</h2>
                        <Slider min={0} max={500} step={10} defaultValue={vol} onChange={setVol}/></>}

                    {(quantitySignal == "Moisture") && <>
                        <h2>{quantityMoisture} %</h2>
                        <Slider min={0} max={100} step={1} defaultValue={quantityMoisture} onChange={setQuantityMoisture}/></>}

                </>}

                {(page == "Modes") && <>
                    <Selector id="start_signal" 
                                label="Start watering"
                                options={[{ value: "Moisture", label: "soil moisture"},
                                        {value: "PlateDry", label: "when the plate is dry"},
                                        {value: "Interval", label: "at regular intervals"}]}
                                onChange={(val) => setStartSignal(val.value)}
                                selected={startSignal}/>

                    <Selector id="quantity_signal" 
                                label="Stop after"
                                options={[{ value: "Volume", label: "volume"},
                                    {value: "Moisture", label: "soil moisture"},
                                    {value: "PlateWet", label: "when the plate is wet"}]}
                                onChange={(val) => setQuantitySignal(val.value)}
                                selected={quantitySignal}/>
                </>}

                <button className="button" onClick={finish}>Done</button>
                <button className="button" onClick={close}>Cancel</button>
            </div>
        </div>

    );
}