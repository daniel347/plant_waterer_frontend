import React from "react"

export default function PlantSettingsSubpage({current_settings}) {
    const [settings, setSettings] = React.useState(current_settings);
    const [page, setPage] = React.useState("Settings");

    function update_settings(name, value) {
        setSettings({...settings, })
    }

    return (
        <>
            <Navbar headings={["Settings", "Modes"]} open_page={page} set_open_page={setPage}/>
            {(page == "Settings") && <>
                {(settings.start_signal == "Moisture") && <>
                    <h2>{startMoisture} %</h2>
                    <Slider min={0} max={100} step={1} defaultValue={settings.start_moisture_thresh}
                            onChange={(v) => setSettings({...settings, start_moisture_thresh: v})}/></> } 

                {(settings.start_signal == "Interval") && <>
                    <h2>{freq} hours</h2>
                    <Slider min={0} max={168} step={4} defaultValue={settings.interval}
                            onChange={(v) => setSettings({...settings, interval: v})}/></>} 

                {(settings.quantity_signal == "Volume") && <>
                    <h2>{vol} ml</h2>
                    <Slider min={0} max={500} step={10} defaultValue={settings.volume_ml}
                            onChange={(v) => setSettings({...settings, volume_ml: v})}/></>}

                {(settings.quantity_signal == "Moisture") && <>
                    <h2>{quantityMoisture} %</h2>
                    <Slider min={0} max={100} step={1} defaultValue={settings.stop_moisture_thresh}
                            onChange={(v) => setSettings({...settings, stop_moisture_thresh: v})}/></>}

            </>}

            {(page == "Modes") && <>
                <Selector id="start_signal" 
                            label="Start watering"
                            options={[{ value: "Moisture", label: "soil moisture"},
                                    {value: "PlateDry", label: "when the plate is dry"},
                                    {value: "Interval", label: "at regular intervals"}]}
                            onChange={(val) => setSettings({...settings, start_signal: val.value})}
                            selected={settings.start_signal}/>

                <Selector id="quantity_signal" 
                            label="Stop after"
                            options={[{ value: "Volume", label: "volume"},
                                {value: "Moisture", label: "soil moisture"},
                                {value: "PlateWet", label: "when the plate is wet"}]}
                            onChange={(val) => setSettings({...settings, quantity_signal: val.value})}
                            selected={settings.quantity_signal}/>
            </>}
        </>);
}