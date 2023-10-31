import approveIcon from "@assets/icons/approve.svg";
import declineIcon from "@assets/icons/decline.svg";
import editIcon from "@assets/icons/edit.svg";
import { TextField } from "@shared/components/ui/TextField/TextField";
import React, { useState } from "react";
import "./EditInput.scss";

interface EditInputProps {
    value: string;
    label?: string;
    type?: string;
    onConfirm: (value: string) => void;
}

export default function EditInput(props: EditInputProps) {
    const { label, type = "text", value: initialValue } = props;

    const [editMode, setEditMode] = useState(false);
    const [value, setValue] = useState(initialValue);

    const onConfirm = () => {
        setEditMode(false);
        props.onConfirm(value);
    };

    const onDecline = () => {
        setEditMode(false);
        setValue(initialValue);
    };

    return (
        <div className="edit-input">
            {label ? <div className="edit-input__label">{label}</div> : null}
            {editMode && (
                <TextField
                    flat
                    type={type}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                />
            )}

            {editMode ? (
                <div className="edit-number-input__controls">
                    <img
                        className="edit-number-input__icon"
                        src={approveIcon}
                        width="17"
                        height="17"
                        alt="approve"
                        onClick={() => onConfirm()}
                    />
                    <img
                        className="edit-number-input__icon"
                        src={declineIcon}
                        width="17"
                        height="17"
                        alt="decline"
                        onClick={() => onDecline()}
                    />
                </div>
            ) : (
                <div
                    className="edit-number-input__controls"
                    onClick={() => setEditMode(true)}
                >
                    <div className="edit-number-input__value">{value}</div>
                    <img
                        className="edit-number-input__icon"
                        src={editIcon}
                        width="15"
                        height="15"
                        alt="edit"
                    />
                </div>
            )}
        </div>
    );
}
