import React from "react"
import { Selector } from "../components/selector";
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import '../components/plant.css';
import { Navbar } from "../components/navbar";
import LabelledSlider from "../components/labelled_slider";

export default function PlantSettingsSubpage({settings, setSettings, hasMoistureSensor, sensorUnderPlate}) {
    const [page, setPage] = React.useState("Settings");

    const start_mode_opts = [{value: "Interval", label: "at regular intervals"},].concat(hasMoistureSensor ? (sensorUnderPlate ? [{value: "PlateDry", label: "when the plate is dry"},] : [{ value: "Moisture", label: "soil moisture"},]) : []);
    const quantity_mode_opts = [{ value: "Volume", label: "volume"},].concat(hasMoistureSensor ? (sensorUnderPlate ? [{value: "PlateWet", label: "when the plate is wet"},] : [{value: "Moisture", label: "soil moisture"},]) : []);

    return (
        <>
            <Navbar headings={["Settings", "Modes", "Limits"]} open_page={page} set_open_page={setPage}/>
            {(page == "Settings") && <>
                {(settings.start_signal == "Moisture") && 
                <LabelledSlider id="start_moisture_thresh"
                                label="Water when soil moisture falls below"
                                val={settings.start_moisture_thresh}
                                setVal={(v) => setSettings({...settings, start_moisture_thresh: v})}
                                min={0} max={100} step={1} unit={"%"}/>} 

                {(settings.start_signal == "Interval") &&
                 <LabelledSlider id="interval"
                                label="Water frequency"
                                val={settings.interval}
                                setVal={(v) => setSettings({...settings, interval: v})}
                                min={settings.min_interval} max={settings.max_interval} step={4} unit={"hours"}/>} 

                {(settings.quantity_signal == "Volume") && 
                 <LabelledSlider id="volume_ml"
                                label="Water volume"
                                val={settings.volume_ml}
                                setVal={(v) => setSettings({...settings, volume_ml: v})}
                                min={0} max={settings.max_volume_ml} step={10} unit={"ml"}/>}

                {(settings.quantity_signal == "Moisture") && 
                 <LabelledSlider id="stop_moisture_thresh"
                                label="Stop watering when soil moisture reaches"
                                val={settings.stop_moisture_thresh}
                                setVal={(v) => setSettings({...settings, stop_moisture_thresh: v})}
                                min={0} max={100} step={1} unit={"%"}/>}

            </>}

            {(page == "Modes") && <>
                <Selector id="start_signal" 
                            label="Start watering"
                            options={start_mode_opts}
                            onChange={(val) => setSettings({...settings, start_signal: val.value})}
                            selected={settings.start_signal}/>

                <Selector id="quantity_signal" 
                            label="Stop after"
                            options={quantity_mode_opts}
                            onChange={(val) => setSettings({...settings, quantity_signal: val.value})}
                            selected={settings.quantity_signal}/>
            </>}

            {(page == "Limits") && <>
                <LabelledSlider id="min_interval"
                                label="Don't water more frequently than every"
                                val={settings.min_interval}
                                setVal={(v) => setSettings({...settings, min_interval: v})}
                                min={0} max={96} step={1} unit={"hours"}/>

                <LabelledSlider id="max_interval"
                                label="Water if not watered for over"
                                val={settings.max_interval}
                                setVal={(v) => setSettings({...settings, max_interval: v})}
                                min={0} max={14*24} step={1} unit={"hours"}/>

                <LabelledSlider id="min_interval"
                                label="Don't water more than "
                                val={settings.max_volume_ml}
                                setVal={(v) => setSettings({...settings, max_volume_ml: v})}
                                min={0} max={1000} step={10} unit={"ml"}/>
            </>}
        </>);
}