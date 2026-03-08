import React from "react";
import Select, {StylesConfig} from 'react-select';
import "./selector.css"

export function Selector({label, options, id, onChange, selected}) {
    const selectStyles: StylesConfig<StateOption, false> = {
    control: (provided) => ({
        ...provided,
        borderRadius: "1.25rem",
    }),
    container: (provided) => ({
        ...provided,
        margin: "1rem",
    }),};

    return (
        <div className="selector">
            <label htmlFor={id} className={"label"}>
                {label}
            </label>
            <Select options={options} id={id} onChange={onChange} value={options.filter((opt) => {return opt.value == selected})[0]} styles={selectStyles}/>
        </div>
    );
}