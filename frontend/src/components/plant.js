import React from "react";
import Slider from 'rc-slider';
import {Graph} from "./graph";
import 'rc-slider/assets/index.css';
import './plant.css';

import TimeIcon from "../assets/TimeIcon";
import WaterIcon from "../assets/WaterIcon";
import PlateDryIcon from "../assets/PlateDryIcon"
import PlateWetIcon from "../assets/PlateWetIcon"
import StartMoisture from "../assets/StartMoisture"
import StopMoisture from "../assets/StopMoisture"

import {PlantEditModal} from "../modals/plant_edit_modal";
import {ConfirmModal} from "../modals/confirm_modal";
import ClickAndHoldWrapper from "react-click-and-hold/core";
import {DisableSwitch} from "./disable_plant_switch";

export function Plant({plant_name, data, update, remove, db_ref}){
    const [modalVisible, setModalVisible] = React.useState(false);
    const [closeConfirmVisible, setCloseConfirmVisible] = React.useState(false);
    const [disabled, setDisabled] = React.useState(data.disabled);

    const handleClick = (e) => {
        if (e.nativeEvent.button === 0) {
            console.log('Left click');
            console.log("Opening modal!");
            setModalVisible(true);
        }
    }

    const handleLongPress = (e) => {
        console.log('Long press detected');
        setCloseConfirmVisible(true);
    }

    const closeModal = () => {
        console.log("Closing modal");
        setModalVisible(false);
    }

    const confirmDelete = () => {
        setCloseConfirmVisible(false);
        remove()
    }

    const updateDisabled = (disabled) => {
        setDisabled(disabled);
        update({disabled: disabled});
    }

    const plant_display_name = plant_name.replace(/_/g, ' ');

    return (
        <div>
            {modalVisible && <PlantEditModal plant_name={plant_name} data={data} update={update} close={closeModal} db_ref={db_ref}/>}
            {closeConfirmVisible && <ConfirmModal message={"This will permenantly delete this plant and associated data."}
                confirm={confirmDelete}
                close={() => setCloseConfirmVisible(false)}/>}
            <DisableSwitch disabled={disabled} setDisabled={updateDisabled}/>
            <ClickAndHoldWrapper
                id={1}
                elmType={"div"}
                onHold={(e) => handleLongPress(e)}
                onClick={(e) => handleClick(e)}
                timeOut={300}
            >
                <div className="plant_container">
                    {disabled && <div className="disabled_overlay"/>}
                    <h2 className="plant_title">{plant_display_name}</h2>
                    <h4 className="scientific_name">{data.scientific_name}</h4>

                    <div  style={{margin: "1rem"}}>
                        <img src={data.image_file} width="150mm" height="150mm"/>
                    </div>

                    <Graph db_ref={db_ref} plant_name={plant_name}/>

                    <div className="icon_container">
                        {(data.settings.start_signal == "Interval") && 
                        <div className="icon_text_container">
                            <TimeIcon className="icon"/>
                            <h2>{data.settings.interval} hours</h2>
                        </div>}

                        {(data.settings.start_signal == "Moisture") && 
                        <div className="icon_text_container">
                            <StartMoisture className="icon"/>
                            <h2>{data.settings.start_moisture_thresh} %</h2>
                        </div>}

                        {(data.settings.start_signal == "PlateDry") && 
                        <div className="icon_text_container">
                            <PlateDryIcon className="icon"/>
                        </div>}


                        {(data.settings.quantity_signal == "Volume") && 
                        <div className="icon_text_container">
                            <WaterIcon className="icon"/>
                            <h2>{data.settings.volume_ml} ml</h2>
                        </div>}
                        
                        {(data.settings.quantity_signal == "Moisture") && 
                        <div className="icon_text_container">
                            <StopMoisture className="icon"/>
                            <h2>{data.settings.stop_moisture_thresh} %</h2>
                        </div>}

                        {(data.settings.quantity_signal == "PlateWet") && 
                        <div className="icon_text_container">
                            <PlateWetIcon className="icon"/>
                        </div>}
                    </div>
                </div>
            </ClickAndHoldWrapper>
        </div>
    );
}