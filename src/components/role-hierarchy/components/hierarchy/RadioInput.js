import React from 'react';

const RadioInput = ({ label, handleChange, checked = false, disabled=false }) => {
    return (
        <label className="labeled-radio-input">
            <input type="checkbox" className="d-none" checked={checked} onChange={handleChange} disabled={disabled} />
            <span className="radio-checkbox"></span>
            <span className="radio-label">{label}</span>
        </label>
    )
}

export default RadioInput;