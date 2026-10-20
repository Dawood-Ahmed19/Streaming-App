const ConfirmDialog = ({
  title,
  message,
  confirmLabel = "Delete",
  onConfirm,
  onCancel,
}) => {
  return (
    <div
      onClick={onCancel}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex w-full max-w-sm flex-col gap-4 rounded-3xl border border-line bg-cardBg p-6"
      >
        <h2 className="text-lg font-bold text-text">{title}</h2>
        <p className="text-sm text-muted">{message}</p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 cursor-pointer rounded-lg border border-line bg-surface py-3 text-sm text-text hover:border-text/30"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 cursor-pointer rounded-lg bg-accent py-3 text-sm text-white hover:shadow-lg hover:shadow-red-500/20"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
