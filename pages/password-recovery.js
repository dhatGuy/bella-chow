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
  useToast,
} from "@chakra-ui/react";
import { supabase } from "api";
import { useRouter } from "next/router";
import { useRef, useState } from "react";

export const Password = () => {
  const confirmPasswordRef = useRef();
  const passwordRef = useRef();
  const [error, setError] = useState(null);
  const [resetting, setResetting] = useState(false);
  const router = useRouter();
  const toast = useToast();

  const updatePassword = async (e) => {
    e.preventDefault();
    setResetting(true);
    setError(null);
    const password = passwordRef.current.value;
    const confirmPassword = confirmPasswordRef.current.value;

    try {
      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }

      if (password.length <= 6) {
        setError("Password must be greater than 5 characters");
        return;
      }

      const { user, error } = await supabase.auth.update({
        password,
      });
      if (error) {
        setError(error.message);
        setResetting(false);
      } else {
        toast({
          position: "top-right",
          title: "Password Reset",
          description: "Password reset successful",
          status: "success",
          duration: 4000,
        });
        router.push("/");
        setResetting(false);
      }
    } catch (error) {
      setError(error.message || error);
      setResetting(false);
    }
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
                {error && (
                  <FormHelperText textColor="red" as="i">
                    {error?.message || error}
                  </FormHelperText>
                )}
              </FormControl>
              <Stack spacing={10}>
                <Button
                  bg={"blue.400"}
                  color={"white"}
                  _hover={{
                    bg: "blue.500",
                  }}
                  type="submit"
                  isLoading={resetting}
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
