import { Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Box } from '@chakra-ui/react';

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
                    <Box mb={4}>
                        Are you sure you want to cancel your subscription? This will immediately remove access to jobs.
                    </Box>
                    <Box fontSize="sm" color="gray.200">
                        If you encounter any issues, please contact support at franco@sportsjobs.online
                    </Box>
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