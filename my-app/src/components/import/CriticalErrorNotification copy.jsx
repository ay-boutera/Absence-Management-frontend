export default function CriticalErrorNotification() {
  return (
    <div className="critical-import-error" role="alert" aria-live="assertive">
      <p className="critical-import-error__title">
        ⚠️ Critical error during import
      </p>
      <p className="critical-import-error__message">
        The server encountered an unexpected error. Please try again or contact
        support.
      </p>
    </div>
  );
}
