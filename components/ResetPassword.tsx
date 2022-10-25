import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import useResetPassword from "~hooks/auth/useResetPassword";

interface ResetPasswordProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ResetPassword({ isOpen, onClose }: ResetPasswordProps) {
  const resetPasswordMutation = useResetPassword();
  const toast = useToast();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<{
    email: string;
  }>();

  const onReset = handleSubmit((data) => {
    resetPasswordMutation.mutate(data, {
      onSuccess: () => {
        toast({
          position: "top-right",
          title: "Password Reset",
          description: "Check your mail",
          status: "success",
          duration: 5000,
        });
        onClose();
      },
    });
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Reset password</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl isInvalid={!!errors.email}>
            <FormLabel>Email address</FormLabel>
            <Input
              type="email"
              {...register("email", {
                required: "Email is required",
              })}
            />
            <FormErrorMessage color="red.500">
              {errors.email?.message}
            </FormErrorMessage>
          </FormControl>
          {resetPasswordMutation.isError && (
            <Text textColor="red" as="i">
              {(resetPasswordMutation.error instanceof Error &&
                resetPasswordMutation.error.message) ||
                "Something went wrong"}
            </Text>
          )}
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Close
          </Button>
          <Button
            colorScheme="blue"
            isLoading={resetPasswordMutation.isLoading}
            onClick={onReset}
          >
            Reset
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
