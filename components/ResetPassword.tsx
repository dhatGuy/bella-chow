// @ts-nocheck
// TODO: remove ts-nocheck

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
  useToast,
} from "@chakra-ui/react";
import { useRef } from "react";
import useResetPassword from "~hooks/auth/useResetPassword";

interface ResetPasswordProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ResetPassword({ isOpen, onClose }: ResetPasswordProps) {
  const resetPasswordMutation = useResetPassword();
  const emailRef = useRef<HTMLInputElement>();
  const toast = useToast();

  const onReset = async () => {
    const email = emailRef.current!.value;
    resetPasswordMutation.mutate(
      { email },
      {
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
      }
    );
  };
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Reset password</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isInvalid={resetPasswordMutation.isError}>
              <FormLabel>Email address</FormLabel>
              <Input type="email" ref={emailRef} />
              {resetPasswordMutation.isError && (
                <FormErrorMessage color="red.500">
                  {resetPasswordMutation.error.message}
                </FormErrorMessage>
              )}
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button
              colorScheme="blue"
              isLoading={resetPasswordMutation.isLoading}
              // disabled={!emailRef.current.value.length}
              onClick={onReset}
            >
              Reset
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
