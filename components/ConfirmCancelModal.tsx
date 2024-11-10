import { Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@chakra-ui/react';

interface ConfirmCancelModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

const ConfirmCancelModal = ({ isOpen, onClose, onConfirm }: ConfirmCancelModalProps) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent bg="purple.700" color="white">
                <ModalHeader>Confirm Cancellation</ModalHeader>
                <ModalBody>
                    Are you sure you want to cancel your subscription? This will immediately remove access to jobs.
                </ModalBody>
                <ModalFooter>
                    <Button bg="green.400" color="white" _hover={{ bg: 'green.500' }} _active={{ bg: 'green.600' }} mr={3} onClick={onClose}>
                        No, Keep Subscription
                    </Button>
                    <Button variant="ghost" onClick={onConfirm}>
                        Yes, Cancel
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default ConfirmCancelModal;