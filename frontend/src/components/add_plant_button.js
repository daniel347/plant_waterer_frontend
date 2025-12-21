import React from "react";
import 'rc-slider/assets/index.css';
import './plant.css';
import './add_plant_button.css';
import {PlantEditModal} from "../modals/plant_edit_modal";
import Plus from "../assets/Plus";
import {NewPlantModal} from "../modals/new_plant_modal";

export function AddPlant({add}){
    const [modalVisible, setModalVisible] = React.useState(false);

    const openModal = () => {
        console.log("Opening modal!");
        setModalVisible(true);
    };
    const closeModal = () => {
        console.log("Closing modal");
        setModalVisible(false);
    }

    return (
        <div>
            {modalVisible && <NewPlantModal add={add} close={closeModal}/>}
            <div className="plant_container add_plant_container" onClick={openModal}>
                <Plus className="add_plant_icon"/>
            </div>
        </div>
    );
}