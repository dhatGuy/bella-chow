import {
  Button,
  FormControl,
  FormHelperText,
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
import { useAuth } from "@context/AuthContext";
import React, { useRef, useState } from "react";

export default function ResetPassword({ isOpen, onClose }) {
  const { forgotPassword } = useAuth();
  const emailRef = useRef();
  const toast = useToast();
  const [error, setError] = useState("");

  const onReset = async () => {
    setError("");
    const { data, error } = await forgotPassword(emailRef.current.value);
    if (error) {
      setError(error.message);
      return;
    }
    toast({
      position: "top-right",
      title: "Password Reset",
      description: "Check your mail",
      status: "success",
      duration: 5000,
    });
    onClose();
  };
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Reset password</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl id="email">
              <FormLabel>Email address</FormLabel>
              <Input type="email" ref={emailRef} />
              {error && (
                <FormHelperText color="red.500">{error}</FormHelperText>
              )}
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button
              colorScheme="blue"
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
