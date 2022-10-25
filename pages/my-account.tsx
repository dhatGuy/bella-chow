import {
  Box,
  Button,
  chakra,
  FormControl,
  FormLabel,
  GridItem,
  Heading,
  Input,
  Select,
  SimpleGrid,
  Stack,
  Text,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { withPageAuth } from "@supabase/auth-helpers-nextjs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FormEvent, useState } from "react";
import useProfile from "~hooks/auth/useProfile";
import { supabase } from "~lib/api";

interface FormData {
  address: string;
  lastname: string;
  firstname: string;
  gender: string;
  phone: string;
}

const Account = () => {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");

  const queryClient = useQueryClient();

  const toast = useToast();

  const mutation = useMutation(
    async (data: FormData) => {
      try {
        return await supabase.from("users").update(data);
      } catch (error) {
        console.log(error);
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["account"]);
        toast({
          position: "top-right",
          title: "Profile update",
          description: "Success",
          status: "success",
          duration: 5000,
        });
      },
      onError: () => {
        toast({
          position: "top-right",
          title: "Profile update",
          description: "An error occurred",
          status: "error",
          duration: 5000,
        });
      },
    }
  );

  const { data: user } = useProfile();

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    mutation.mutate({
      address,
      lastname,
      firstname,
      gender,
      phone,
    });
  };

  return (
    <Box bg={useColorModeValue("gray.50", "inherit")} p={10}>
      <Heading py={5} textAlign="center" as="h1">
        Edit Profile
      </Heading>

      <Box mt={[10, 0]}>
        <SimpleGrid
          display={{ base: "initial", md: "grid" }}
          columns={{ md: 3 }}
          spacing={{ md: 6 }}
        >
          <GridItem colSpan={{ md: 1 }}>
            <Box px={[4, 0]}>
              <Heading fontSize="lg" fontWeight="medium" lineHeight="6">
                Personal Information
              </Heading>
              <Text
                mt={1}
                fontSize="sm"
                color={useColorModeValue("gray.600", "gray.400")}
              >
                Basic details here
              </Text>
            </Box>
          </GridItem>
          <GridItem mt={[5, null, 0]} colSpan={{ md: 2 }}>
            <chakra.form
              onSubmit={onSubmit}
              shadow="base"
              rounded={[null, "md"]}
              overflow={{ sm: "hidden" }}
            >
              <Stack
                px={4}
                py={5}
                p={[null, 6]}
                bg={useColorModeValue("white", "gray.700")}
                spacing={6}
              >
                <SimpleGrid columns={6} spacing={6}>
                  <FormControl as={GridItem} colSpan={[6, 3]}>
                    <FormLabel
                      fontSize="sm"
                      fontWeight="md"
                      color={useColorModeValue("gray.700", "gray.50")}
                    >
                      First name
                    </FormLabel>
                    <Input
                      name="first_name"
                      id="first_name"
                      autoComplete="given-name"
                      mt={1}
                      focusBorderColor="brand.400"
                      shadow="sm"
                      size="sm"
                      w="full"
                      rounded="md"
                      value={user?.firstname || firstname}
                      onChange={(e) => setFirstname(e.target.value)}
                    />
                  </FormControl>

                  <FormControl as={GridItem} colSpan={[6, 3]}>
                    <FormLabel
                      fontSize="sm"
                      fontWeight="md"
                      color={useColorModeValue("gray.700", "gray.50")}
                    >
                      Last name
                    </FormLabel>
                    <Input
                      name="last_name"
                      id="last_name"
                      autoComplete="family-name"
                      mt={1}
                      focusBorderColor="brand.400"
                      shadow="sm"
                      size="sm"
                      w="full"
                      rounded="md"
                      value={user?.lastname || lastname}
                      onChange={(e) => setLastname(e.target.value)}
                    />
                  </FormControl>

                  <FormControl as={GridItem} colSpan={[6, 3]}>
                    <FormLabel
                      htmlFor="phone"
                      fontSize="sm"
                      fontWeight="md"
                      color={useColorModeValue("gray.700", "gray.50")}
                    >
                      Phone
                    </FormLabel>
                    <Input
                      name="phone"
                      id="phone"
                      autoComplete="phone"
                      mt={1}
                      focusBorderColor="brand.400"
                      shadow="sm"
                      size="sm"
                      w="full"
                      rounded="md"
                      value={user?.phone || phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </FormControl>
                  <FormControl as={GridItem} colSpan={[6, 3]}>
                    <FormLabel
                      htmlFor="gender"
                      fontSize="sm"
                      fontWeight="md"
                      color={useColorModeValue("gray.700", "gray.50")}
                    >
                      Gender
                    </FormLabel>
                    <Select
                      id="gender"
                      name="gender"
                      autoComplete="gender"
                      placeholder="Select option"
                      mt={1}
                      focusBorderColor="brand.400"
                      shadow="sm"
                      size="sm"
                      w="full"
                      rounded="md"
                      title="gender"
                      value={user?.gender || gender}
                      onChange={(e) => setGender(e.target.value)}
                    >
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                    </Select>
                  </FormControl>

                  <FormControl as={GridItem} colSpan={6}>
                    <FormLabel
                      htmlFor="street_address"
                      fontSize="sm"
                      fontWeight="md"
                      color={useColorModeValue("gray.700", "gray.50")}
                    >
                      Address
                    </FormLabel>
                    <Input
                      type="text"
                      name="street_address"
                      id="street_address"
                      autoComplete="street-address"
                      mt={1}
                      focusBorderColor="brand.400"
                      shadow="sm"
                      size="sm"
                      w="full"
                      rounded="md"
                      value={user?.address || address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </FormControl>
                </SimpleGrid>
              </Stack>
              <Box
                px={{ base: 4, sm: 6 }}
                py={3}
                bg={useColorModeValue("gray.50", "gray.900")}
                textAlign="right"
              >
                <Button
                  type="submit"
                  colorScheme="twitter"
                  _focus={{ shadow: "" }}
                  fontWeight="md"
                  isLoading={mutation.isLoading}
                  loadingText="Saving..."
                >
                  Save
                </Button>
              </Box>
            </chakra.form>
          </GridItem>
        </SimpleGrid>
      </Box>
    </Box>
  );
};

export default Account;

export const getServerSideProps = withPageAuth({
  redirectTo: "/login",
});
