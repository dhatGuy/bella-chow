/* eslint-disable react/no-children-prop */
import {
  Box,
  Button,
  Divider,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";

import { FaRegEnvelope, FaUser } from "react-icons/fa";
import { IoFastFoodOutline, IoLockClosedOutline } from "react-icons/io5";
import useCreateCafe from "~hooks/cafe/useCreateCafe";

type FormData = {
  email: string;
  password: string;
  cafeName: string;
  role: "CAFE_OWNER";
  username: string;
  // file?: Array<FilePondInitialFile | FilePondFile | Blob | string>;
};

export default function Register() {
  const createCafe = useCreateCafe();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      role: "CAFE_OWNER",
    },
  });

  // const FilePondProcess = (
  //   fieldName,
  //   file,
  //   metadata,
  //   load,
  //   error,
  //   progress,
  //   abort,
  //   transfer,
  //   options
  // ) => {
  //   console.log("file", file);
  //   const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/food-app/cafe-banner/${file.name}`;

  //   const formData = new FormData();
  //   formData.append(fieldName, file, file.name);
  //   formData.append("key", `food-app/${file.name}`);

  //   const request = new XMLHttpRequest();
  //   request.open("POST", url);
  //   // set authorization header
  //   // request.setRequestHeader(
  //   //   "Authorization",
  //   //   `Bearer ${session?.access_token}`
  //   // );

  //   // Should call the progress method to update the progress to 100% before calling load
  //   request.upload.onprogress = (e) => {
  //     progress(e.lengthComputable, e.loaded, e.total);
  //   };

  //   // Should call the load method when done and pass the returned server file id
  //   // this server file id is then used later on when reverting or restoring a file
  //   // so your server knows which file to return without exposing that info to the client
  //   request.onload = function () {
  //     if (request.status >= 200 && request.status < 300) {
  //       // the load method accepts either a string (id) or an object
  //       load(request.responseText);
  //     } else {
  //       // Can call the error method if something is wrong, should exit after
  //       error("oh no");
  //     }
  //   };

  //   request.send(formData);

  //   // Should expose an abort method so the request can be cancelled
  //   return {
  //     abort: () => {
  //       // This function is entered if the user has tapped the cancel button
  //       request.abort();

  //       // Let FilePond know the request has been cancelled
  //       abort();
  //     },
  //   };
  // };

  // const FilePondRevert = (uniqueFileId, load, error) => {
  //   console.log("uniqueFileId", uniqueFileId);
  //   const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/food-app/cafe-banner/${uniqueFileId}`;

  //   const request = new XMLHttpRequest();
  //   request.open("DELETE", url);
  //   // set authorization header
  //   request.setRequestHeader(
  //     "Authorization",
  //     `Bearer ${session?.access_token}`
  //   );

  //   request.onload = function () {
  //     if (request.status >= 200 && request.status < 300) {
  //       // the load method accepts either a string (id) or an object
  //       load();
  //     } else {
  //       // Can call the error method if something is wrong, should exit after
  //       error("oh no");
  //     }
  //   };

  //   request.send();
  // };

  const onSubmit = handleSubmit((formData) => {
    console.log(formData);
    createCafe.mutate(formData);
  });

  return (
    <Box
      width={{ base: "90%", md: "400px" }}
      bg="secondary.card"
      rounded="lg"
      p={5}
    >
      <Heading marginBottom="1.5rem">Sign up</Heading>
      <form onSubmit={onSubmit}>
        <Stack spacing={4} marginBottom="1rem">
          <FormControl id="cafeName" isInvalid={!!errors.cafeName}>
            <FormLabel htmlFor="cafeName">Cafeteria Name</FormLabel>
            <InputGroup>
              <InputLeftElement
                children={
                  <Icon as={IoFastFoodOutline} color="secondary.inputHelper" />
                }
              />
              <Input
                type="text"
                focusBorderColor="main.500"
                id="cafeName"
                placeholder="Cafe Name"
                {...register("cafeName", {
                  required: "Cafe Name is required",
                  minLength: {
                    value: 3,
                    message: "Cafe Name must be at least 3 characters",
                  },
                  maxLength: {
                    value: 20,
                    message: "Cafe Name must be at most 20 characters",
                  },
                })}
              />
            </InputGroup>
            <FormErrorMessage>{errors.cafeName?.message}</FormErrorMessage>
          </FormControl>
          <FormControl id="email" isInvalid={!!errors.username}>
            <FormLabel htmlFor="email">Username</FormLabel>
            <InputGroup>
              <InputLeftElement
                children={<Icon as={FaUser} color="secondary.inputHelper" />}
              />
              <Input
                type="text"
                focusBorderColor="main.500"
                id="email"
                placeholder="username"
                {...register("username", {
                  required: "Username is required",
                })}
              />
            </InputGroup>
            <FormErrorMessage>{errors.username?.message}</FormErrorMessage>
          </FormControl>
          <FormControl id="email" isInvalid={!!errors.email}>
            <FormLabel htmlFor="email">Email Address</FormLabel>
            <InputGroup>
              <InputLeftElement
                children={
                  <Icon as={FaRegEnvelope} color="secondary.inputHelper" />
                }
              />
              <Input
                type="email"
                focusBorderColor="main.500"
                id="email"
                placeholder="name@example.com"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
              />
            </InputGroup>
            <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
          </FormControl>
          <FormControl id="password" isInvalid={!!errors.password}>
            <FormLabel htmlFor="password">Password</FormLabel>
            <InputGroup>
              <InputLeftElement
                children={
                  <Icon
                    as={IoLockClosedOutline}
                    color="secondary.inputHelper"
                  />
                }
              />
              <Input
                focusBorderColor="main.500"
                id="password"
                type="password"
                placeholder="Enter your password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must have at least 6 characters",
                  },
                })}
              />
            </InputGroup>
            <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
          </FormControl>
        </Stack>
        {createCafe.isError && (
          <Text textColor="red" mb="1">
            {(createCafe.error instanceof Error && createCafe.error.message) ||
              "Something went wrong"}
          </Text>
        )}
        <Stack marginBottom="1rem">
          <Button
            type="submit"
            isLoading={createCafe.isLoading}
            loadingText="Please wait.."
            colorScheme="teal"
          >
            Sign up
          </Button>
        </Stack>
      </form>
      <Divider marginBottom="1rem" />
      <Stack>
        <Text textAlign="center" fontWeight="500">
          Already have an account?
        </Text>
        <Button colorScheme="teal" variant="outline">
          Sign in
        </Button>
      </Stack>
    </Box>
  );
}
