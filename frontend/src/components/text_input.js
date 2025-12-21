import React from "react";
import './text_input.css';

export function TextInput({id, label, text, setText, className="", secureTextEntry=false}) {
    return (
        <div className={"label_container" + " " + className}>
            <label htmlFor={id} className={text.length > 0 ? "inner_label_up inner_label" : "inner_label"}>
                {label}
            </label>
            <input name={id} className="input" id={id} value={text} onChange={(e) => {setText(e.target.value)}}/>
        </div>
    )
}