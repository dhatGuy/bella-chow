import { AddIcon } from "@chakra-ui/icons";
import { Badge, Box, Button, Image, Stack, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useCart } from "~context/CartContext";

const MenuItem = ({ menu }) => {
  const { image, description, name, price, available, id } = menu;
  const { addItem } = useCart();
  const router = useRouter();

  const showDetails = () => router.push("/menus/" + id);

  return (
    <Box maxW="sm" borderWidth="1px" borderRadius="lg" overflow="hidden">
      <Box w="full">
        <Image w="full" h="200px" objectFit="cover" src={image} alt={name} />
      </Box>

      <Stack d="flex" spacing={6} p={6} justify="space-between">
        <Box>
          <Badge
            borderRadius="full"
            px="2"
            colorScheme={available ? "teal" : "red"}
          >
            {available ? "available" : "not available"}
          </Badge>
          <Text mt="1" fontWeight="semibold" as="h4" lineHeight="tight">
            {name}
          </Text>
          <Text
            mt="1"
            fontWeight="normal"
            as="p"
            lineHeight="tight"
            noOfLines={[1, 2, 3]}
          >
            {description}
          </Text>
        </Box>
        <Box d="flex" mt="2" alignItems="center" justifyContent="space-between">
          <Text>₦{price}</Text>
          <Button
            colorScheme="blue"
            onClick={() => addItem(menu)}
            variant="outline"
            leftIcon={<AddIcon />}
            disabled={!available}
          >
            Add to cart
          </Button>
        </Box>
      </Stack>
    </Box>
  );
};

export default MenuItem;
