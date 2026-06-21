import Modal from "../UI/Modal";
import Input from "../UI/Input";
import Button from "../UI/Button";

function CreateVisitorModal({
  isOpen,
  onClose,
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Visitor"
    >

      <div className="space-y-4">

        <Input
          label="Full Name"
          placeholder="Enter visitor name"
        />

        <Input
          label="Phone Number"
          placeholder="Enter phone number"
        />

        <Input
          label="Company"
          placeholder="Enter company"
        />

        <div className="flex justify-end gap-3 pt-4">

          <Button
            className="bg-gray-300 hover:bg-gray-400 text-black"
            onClick={onClose}
          >
            Cancel
          </Button>

          <Button>
            Save Visitor
          </Button>

        </div>

      </div>

    </Modal>
  );
}

export default CreateVisitorModal;