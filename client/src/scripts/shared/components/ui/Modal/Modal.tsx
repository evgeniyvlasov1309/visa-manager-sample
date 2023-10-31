import closeIcon from "@assets/icons/close.svg";
import type { ReactNode } from "react";
import React, { useEffect, useRef } from "react";
import "./Modal.scss";

interface ModalProps {
    isOpen: boolean;
    children: ReactNode;
    onClose: () => void;
}

export default function Modal(props: ModalProps) {
    const { isOpen, children, onClose } = props;
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                modalRef.current &&
                !modalRef.current.contains(event.target as Node)
            ) {
                onClose();
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [onClose]);

    return (
        <div className={`modal ${isOpen ? "open" : "close"}`}>
            <div ref={modalRef} className="modal-content">
                <button
                    type="button"
                    className="close-button"
                    onClick={onClose}
                >
                    <img src={closeIcon} width={8} height={8} alt="close" />
                </button>
                {children}
            </div>
        </div>
    );
}
