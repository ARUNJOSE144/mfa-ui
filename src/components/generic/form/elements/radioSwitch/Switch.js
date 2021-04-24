import React from 'react';

const Switch = ({ handleChange, checked = false, disabled = false }) => {
    return (
        <div className="radio-switch">
            <label className="radio-switch-light">
                <input type="checkbox" checked={checked} onChange={handleChange} disabled={disabled} />
                <span className="radio-switch-status">
                    <span className="status-off">NO</span>
                    <span className="status-on">YES</span>
                </span>
                <div className="indicator"></div>
            </label>
        </div>
    )
}

export default Switch;