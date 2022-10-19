import {
  Box,
  Button,
  chakra,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import useUpdatePassword from "~hooks/auth/useUpdatePassword";

export const Password = () => {
  const confirmPasswordRef = useRef();
  const passwordRef = useRef();
  const [error, setError] = useState<string | null>(null);
  const updatePasswordMutation = useUpdatePassword();

  const updatePassword = async (e) => {
    e.preventDefault();
    setError(null);
    const password = passwordRef.current.value;
    const confirmPassword = confirmPasswordRef.current.value;

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length <= 6) {
      setError("Password must be greater than 5 characters");
      return;
    }

    updatePasswordMutation.mutate(password);
  };
  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"}>Recover your password</Heading>
        </Stack>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={8}
        >
          <chakra.form onSubmit={updatePassword}>
            <Stack spacing={4}>
              <FormControl id="password">
                <FormLabel>New Password</FormLabel>
                <Input type="password" ref={passwordRef} />
              </FormControl>
              <FormControl id="confirmPassword">
                <FormLabel>Confirm Password</FormLabel>
                <Input type="password" ref={confirmPasswordRef} />
                {error ||
                  (updatePasswordMutation.isError && (
                    <FormHelperText textColor="red" as="i">
                      {updatePasswordMutation.error?.message || error}
                    </FormHelperText>
                  ))}
              </FormControl>
              <Stack spacing={10}>
                <Button
                  bg={"blue.400"}
                  color={"white"}
                  _hover={{
                    bg: "blue.500",
                  }}
                  type="submit"
                  isLoading={updatePasswordMutation.isLoading}
                >
                  reset password
                </Button>
              </Stack>
            </Stack>
          </chakra.form>
        </Box>
      </Stack>
    </Flex>
  );
};

export default Password;
