// Simple ConfirmDialog component
import { useState } from "react";
export default function ConfirmDialog({
  message = "Are you sure?",
  onConfirm,
  onCancel,
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        Confirm
      </button>
      {open && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "#0002",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: 24,
              borderRadius: 8,
              minWidth: 240,
            }}
          >
            <p>{message}</p>
            <button
              onClick={() => {
                setOpen(false);
                onConfirm && onConfirm();
              }}
              style={{ marginRight: 8 }}
            >
              Yes
            </button>
            <button
              onClick={() => {
                setOpen(false);
                onCancel && onCancel();
              }}
            >
              No
            </button>
          </div>
        </div>
      )}
    </>
  );
}
