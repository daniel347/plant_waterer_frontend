import React from "react";
import 'rc-slider/assets/index.css';
import './maintenance_button.css';
import './plant.css';
import { MaintenanceModal } from "../modals/maintenance_modal";
import MaintenanceIcon from "../assets/MaintenanceIcon";

export function MaintenanceButton({dbRef, plants}){
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
            {modalVisible && <MaintenanceModal dbRef={dbRef}
                                              plants={plants}
                                              close={closeModal}/>}
            <div className="maintenance_button" onClick={openModal}>
                <MaintenanceIcon className="icon"/>
            </div>
        </div>
    );
}