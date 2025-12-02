import React from "react";
import Switch from "react-switch";
import './plant.css';

export function DisableSwitch({disabled, setDisabled}){
    const offColour = window.getComputedStyle(document.body).getPropertyValue('--active-colour');
    const onColour = window.getComputedStyle(document.body).getPropertyValue('--error-colour');
    return (
        <Switch onChange={setDisabled}
                checked={disabled}
                offColor={offColour}
                onColor={onColour}
                checkedIcon={false}
                uncheckedIcon={false}/>
    );
}