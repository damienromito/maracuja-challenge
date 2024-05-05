import { Button, Modal } from "react-materialize"
const ConfirmModal = ({
  trigger,
  confirmAction,
  title,
  children = null,
  confirmText = "OK",
  cancelText = "Annuler",
  open = false,
}) => {
  return (
    <Modal
      open={open}
      header={title}
      trigger={trigger}
      actions={[
        <div>
          <Button waves="green" modal="close" onClick={confirmAction} flat>
            {confirmText}
          </Button>
          <Button waves="green" modal="close" flat>
            {cancelText}
          </Button>
        </div>,
      ]}
    >
      {children}
    </Modal>
  )
}

export default ConfirmModal
