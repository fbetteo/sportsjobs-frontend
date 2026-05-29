import {
    Button,
    FormControl,
    FormHelperText,
    FormLabel,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Select,
    Stack,
    Text,
    Textarea,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';

export type CancellationFeedback =
    | 'too_expensive'
    | 'unused'
    | 'missing_features'
    | 'low_quality'
    | 'switched_service'
    | 'too_complex'
    | 'customer_service'
    | 'other';

export interface CancellationFeedbackPayload {
    cancellationFeedback?: CancellationFeedback;
    cancellationComment?: string;
}

interface ConfirmCancelModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (payload: CancellationFeedbackPayload) => void;
    isSubmitting?: boolean;
}

const feedbackOptions: Array<{ id: string; value: CancellationFeedback; label: string }> = [
    { id: 'too_expensive', value: 'too_expensive', label: 'Too expensive' },
    { id: 'unused', value: 'unused', label: "I'm not using it enough" },
    { id: 'found_job', value: 'unused', label: "I found a job / don't need it right now" },
    { id: 'missing_features', value: 'missing_features', label: 'Missing jobs or features I need' },
    { id: 'low_quality', value: 'low_quality', label: 'Job quality was not what I expected' },
    { id: 'switched_service', value: 'switched_service', label: "I'm switching to another service" },
    { id: 'too_complex', value: 'too_complex', label: 'Too hard to use' },
    { id: 'customer_service', value: 'customer_service', label: 'Support experience' },
    { id: 'other', value: 'other', label: 'Other' },
];

const ConfirmCancelModal = ({ isOpen, onClose, onConfirm, isSubmitting = false }: ConfirmCancelModalProps) => {
    const [selectedFeedbackId, setSelectedFeedbackId] = useState('');
    const [comment, setComment] = useState('');

    useEffect(() => {
        if (!isOpen) {
            setSelectedFeedbackId('');
            setComment('');
        }
    }, [isOpen]);

    const handleConfirm = () => {
        const selectedFeedback = feedbackOptions.find((option) => option.id === selectedFeedbackId);

        onConfirm({
            cancellationFeedback: selectedFeedback?.value,
            cancellationComment: comment.trim() || undefined,
        });
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            isCentered
            size="lg"
            closeOnEsc={!isSubmitting}
            closeOnOverlayClick={!isSubmitting}
        >
            <ModalOverlay />
            <ModalContent bg="purple.900" color="white" borderColor="whiteAlpha.200" borderWidth="1px">
                <ModalHeader>Cancel subscription</ModalHeader>
                <ModalBody>
                    <Stack spacing={5}>
                        <Text>
                            Your Stripe subscription will be scheduled to end, and access to member-only jobs will be removed after cancellation.
                        </Text>

                        <FormControl>
                            <FormLabel>What made you decide to cancel?</FormLabel>
                            <Select
                                placeholder="Choose a reason (optional)"
                                value={selectedFeedbackId}
                                onChange={(event) => setSelectedFeedbackId(event.target.value)}
                                bg="whiteAlpha.100"
                                borderColor="whiteAlpha.300"
                                _hover={{ borderColor: 'purple.200' }}
                            >
                                {feedbackOptions.map((option) => (
                                    <option key={option.id} value={option.id} style={{ color: 'black' }}>
                                        {option.label}
                                    </option>
                                ))}
                            </Select>
                            <FormHelperText color="gray.300">
                                Optional, but it helps improve SportsJobs for future subscribers.
                            </FormHelperText>
                        </FormControl>

                        <FormControl>
                            <FormLabel>Anything else you want to share?</FormLabel>
                            <Textarea
                                value={comment}
                                onChange={(event) => setComment(event.target.value.slice(0, 500))}
                                placeholder="Optional note"
                                bg="whiteAlpha.100"
                                borderColor="whiteAlpha.300"
                                _hover={{ borderColor: 'purple.200' }}
                                resize="vertical"
                                rows={4}
                            />
                            <FormHelperText color="gray.300">{comment.length}/500 characters</FormHelperText>
                        </FormControl>

                        <Text fontSize="sm" color="gray.300">
                        If you encounter any issues, please contact support at franco@sportsjobs.online
                        </Text>
                    </Stack>
                </ModalBody>
                <ModalFooter>
                    <Button
                        bg="green.400"
                        color="white"
                        _hover={{ bg: 'green.500' }}
                        _active={{ bg: 'green.600' }}
                        mr={3}
                        onClick={onClose}
                        isDisabled={isSubmitting}
                    >
                        Keep subscription
                    </Button>
                    <Button
                        colorScheme="red"
                        onClick={handleConfirm}
                        isLoading={isSubmitting}
                        loadingText="Canceling"
                    >
                        Cancel subscription
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default ConfirmCancelModal;
