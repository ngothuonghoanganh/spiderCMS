import React from 'react';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import './index.css';
export function alertPopup(title, message) {
  return confirmAlert({
    title,
    message,
    customUI: ({ title, message, onClose }) => (
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close"
              onClick={onClose}>
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <p>{message}</p>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary ml-1"
              data-dismiss="modal"
              onClick={onClose}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    ),
  });
}

export function confirmPopup(title, message, actionYes) {
  return confirmAlert({
    title,
    message,
    buttons: [
      {
        label: 'OK',
        onClick: () => false,
      },
      {
        label: 'Cancel',
        onClick: () => false,
      },
    ],
    customUI: ({ title, message, onClose }) => (
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close"
              onClick={onClose}>
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <p>{message}</p>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-orange"
              onClick={() => {
                actionYes();
                onClose();
              }}>
              OK
            </button>
            <button
              type="button"
              className="btn btn-secondary ml-3"
              data-dismiss="modal"
              onClick={onClose}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    ),
  });
}
