import {
  Box,
  Button,
  chakra,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Spinner from "~components/Spinner";
import useUpdatePassword from "~hooks/auth/useUpdatePassword";

type FormData = {
  password: string;
  confirmPassword: string;
};

export const Password = () => {
  const updatePasswordMutation = useUpdatePassword();
  const {
    handleSubmit,
    register,
    watch,
    formState: { errors },
  } = useForm<FormData>();
  const bg = useColorModeValue("gray.50", "gray.800");
  const bg2 = useColorModeValue("white", "gray.700");
  const [loading, setLoading] = useState(true);
  const [hash, setHash] = useState<Record<string, string>>({});

  useEffect(() => {
    let hash = window.location.hash;
    if (hash) {
      const hashObj = hash
        .substring(1)
        .split("&")
        .reduce((acc, item) => {
          const [key, value] = item.split("=");
          acc[key] = value;
          return acc;
        }, {} as Record<string, string>);
      setHash(hashObj);
    }
    setLoading(false);
  }, []);

  const onSubmit = handleSubmit((data) => {
    updatePasswordMutation.mutate(data.password);
  });

  if (loading) return <Spinner />;

  if (hash.error) {
    return <Box>{hash.error_description.split("+").join(" ")}</Box>;
  }

  return (
    <Flex minH={"100vh"} align={"center"} justify={"center"} bg={bg}>
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"}>Update your password</Heading>
        </Stack>
        <Box rounded={"lg"} bg={bg2} boxShadow={"lg"} p={8}>
          <chakra.form onSubmit={onSubmit}>
            <Stack spacing={4}>
              <FormControl id="password" isInvalid={!!errors.password}>
                <FormLabel>New Password</FormLabel>
                <Input
                  type="password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Minimum length should be 6",
                    },
                  })}
                />
                <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
              </FormControl>
              <FormControl
                id="confirmPassword"
                isInvalid={!!errors.confirmPassword}
              >
                <FormLabel>Confirm Password</FormLabel>
                <Input
                  type="password"
                  {...register("confirmPassword", {
                    required: "Confirm Password is required",
                    validate: (val: string) => {
                      if (watch("password") != val) {
                        return "Your passwords do no match";
                      }
                    },
                  })}
                />
                <FormErrorMessage>
                  {errors.confirmPassword?.message}
                </FormErrorMessage>
                {updatePasswordMutation.isError && (
                  <FormHelperText textColor="red" as="i">
                    {updatePasswordMutation.error instanceof Error
                      ? updatePasswordMutation.error.message
                      : "Something went wrong"}
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
                  isLoading={updatePasswordMutation.isLoading}
                >
                  Reset Password
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
