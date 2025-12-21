import React from "react";
import './modal.css';
import '../index.css'

export function ConfirmModal({message, confirm, close}) {

    return (
        <div>
            <div className="modal_background" onClick={close}/>
            <div className="modal ">
                <h2>Are you sure?</h2>
                <h3>{message}</h3>
                <div>
                    <button type="submit" className="button" onClick={confirm}>Continue</button>
                    <button type="button" className="button" onClick={close}>Cancel</button>
                </div>
            </div>
        </div>
    );
}