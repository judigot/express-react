import { useModalStore } from '@/components/Modal/base/modalStore';
import CustomModal from '@/components/Modal/base/CustomModal';

function ModalProvider() {
  const { modals, closeModal } = useModalStore();

  return (
    <>
      {modals.map((modal) => (
        <CustomModal
          key={modal.id}
          isOpen={true}
          title={modal.title}
          onClose={() => {
            closeModal(modal.id);
          }}
        >
          {modal.content}
        </CustomModal>
      ))}
    </>
  );
}

export default ModalProvider;
