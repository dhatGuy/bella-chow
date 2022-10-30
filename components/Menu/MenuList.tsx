import {
  Box,
  Button,
  List,
  TabList,
  TabProps,
  Tabs,
  Text,
  useMultiStyleConfig,
  useTab,
} from "@chakra-ui/react";
import { forwardRef } from "react";
import { Element, ScrollLink } from "react-scroll";
import { MenuCategoryWithMenus } from "~types";
import MenuItem from "./MenuItem";

interface MenuListProps {
  menuCategories: MenuCategoryWithMenus[];
}

const CustomTab = forwardRef<HTMLButtonElement, TabProps>((props, ref) => {
  const tabProps = useTab({ ...props, ref });
  const styles = useMultiStyleConfig("Tabs", tabProps);

  return (
    <Button __css={styles.tab} {...tabProps}>
      {tabProps.children}
    </Button>
  );
});

CustomTab.displayName = "CustomTab";

const ScrollTab = ScrollLink(CustomTab);

const MenuList = ({ menuCategories }: MenuListProps) => {
  return (
    <Box>
      <Tabs pos={"sticky"} top={0} bgColor="white" zIndex={"docked"}>
        <TabList
          overflowY="hidden"
          pl={{
            base: 0,
            lg: 8,
          }}
        >
          {menuCategories.map((category) =>
            category.menus.length ? (
              <ScrollTab
                offset={-50}
                to={category.name}
                duration={1000}
                smooth={true}
                spy={true}
                key={category.id}
              >
                {category.name.toUpperCase()}
              </ScrollTab>
            ) : null
          )}
        </TabList>
      </Tabs>
      {menuCategories.map((category) =>
        category.menus.length ? (
          <Box
            pl={{
              base: 0,
              lg: 8,
            }}
            key={category.id}
          >
            <Element name={category.name}>
              <Text fontWeight={"semibold"} mx={5} my={5}>
                {category.name.toUpperCase()}
              </Text>
            </Element>
            <List spacing="30px" justifyItems="center" mx={5} my={5}>
              {category.menus.map((menu) => (
                <MenuItem key={menu.id} menu={menu} />
              ))}
            </List>
          </Box>
        ) : null
      )}
    </Box>
  );
};

export default MenuList;
