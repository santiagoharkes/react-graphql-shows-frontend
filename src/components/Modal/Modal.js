import React, { useContext } from "react";
import authContext from "../../context/auth-context";

import "./Modal.css";

function Modal(props) {
  const context = useContext(authContext);
  return (
    <div className="modal">
      <header className="modal__header">{props.title}</header>
      <section className="modal__content">{props.children}</section>
      <section className="modal__actions">
        {props.canCancel && (
          <button className="btn" onClick={props.onCancel}>
            Close
          </button>
        )}
        {props.canConfirm && context.token && (
          <button className="btn" onClick={props.onConfirm}>
            {props.dinamicText}
          </button>
        )}
      </section>
    </div>
  );
}

export default Modal;
