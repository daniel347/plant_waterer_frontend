import React from 'react';
import Slider from 'rc-slider';
import "./component.css"

export default function LabelledSlider({id, label, unit, val, setVal, min, max, step}) {
    return (
    <div className="input_container">
        <label htmlFor={id} className={"label"}>
            {label}
        </label>
        <h2>{val} {unit}</h2>
        <Slider id={id} min={min} max={max} step={step} defaultValue={val} onChange={setVal}/> 
    </div>);
}