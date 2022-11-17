import {
  Checkbox,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack
} from "@mui/material";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { SortableElement } from "react-sortable-hoc";

const getFromPath = (row, accessor = "") => {
  const pathArr = accessor?.split(".");
  let clone = { ...row };

  let current = 0;
  while (pathArr[current] && current < pathArr.length - 1) {
    clone = clone[pathArr[current++]];
  }
  return clone?.[pathArr?.[current]] || "";
};

const EachOption = SortableElement(
  ({
    option,
    index,
    handleSelect,
    selectedOptionMap,
    labelAccessor,
    showCheckBox,
    disabledDrag,
    size,
  }) => {
    return (
      <ListItem
        key={index}
        onClick={(e) => handleSelect(option)}
        sx={{
          background: !!selectedOptionMap[getFromPath(option, labelAccessor)]
            ? "#F5F5F5"
            : "inherit",
          zIndex: 20,
        }}
        disablePadding
      >
        <ListItemButton dense>
          <Stack
            sx={{ width: "100%" }}
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Stack
              direction="row"
              justifyContent="flex-start"
              alignItems="center"
            >
              <ListItemIcon
                sx={{
                  display: showCheckBox ? "block" : "none",
                  minWidth: "2rem",
                }}
              >
                <Checkbox
                  edge="start"
                  checked={
                    !!selectedOptionMap[getFromPath(option, labelAccessor)]
                  }
                  size={size}
                  tabIndex={-1}
                  disableRipple
                />
              </ListItemIcon>
              <ListItemText
                id={index}
                primary={`${getFromPath(option, labelAccessor)}`}
              />
            </Stack>
            {!disabledDrag && (
              <ListItemIcon sx={{ minWidth: "2rem" }}>
                <DragIndicatorIcon />
              </ListItemIcon>
            )}
          </Stack>
        </ListItemButton>
      </ListItem>
    );
  }
);

export default EachOption;
