import {
  Checkbox,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { SortableContainer } from "react-sortable-hoc";
import EachOption from "./eachOption";

const OptionList = SortableContainer(
  ({
    TransitionProps,
    handleSelectAll,
    showCheckBox,
    showSelectAll,
    options,
    search,
    isSelectedAll,
    filteredOptions,
    loading,
    handleSelect,
    labelAccessor,
    selectedOptionMap,
    disabledDrag,
    multi,
    size,
  }) => {
    const showSelectALl =
      multi && showSelectAll && !!options.length && !search.trim();

    return (
      <List
        {...TransitionProps}
        timeout={350}
        sx={{
          width: "100%",
          bgcolor: "background.paper",
          boxShadow: 3,
          maxHeight: "200px",
          overflowY: "auto",
          borderRadius: 1,
        }}
      >
        <ListItem disablePadding onClick={handleSelectAll}>
          <ListItemButton
            role={undefined}
            dense
            sx={{
              display: showSelectALl ? "flex" : "none",
              background: isSelectedAll ? "#F5F5F5" : "inherit",
            }}
          >
            <ListItemIcon
              sx={{
                display: showCheckBox ? "block" : "none",
                minWidth: "2rem",
              }}
            >
              <Checkbox
                edge="start"
                checked={isSelectedAll}
                tabIndex={-1}
                size={size}
                disableRipple
              />
            </ListItemIcon>
            <ListItemText primary={`Select All`} />
          </ListItemButton>
        </ListItem>
        {filteredOptions.map((option, index) => (
          <EachOption
            option={option}
            index={index}
            handleSelect={handleSelect}
            selectedOptionMap={selectedOptionMap}
            labelAccessor={labelAccessor}
            showCheckBox={showCheckBox}
            disabled={disabledDrag}
            disabledDrag={disabledDrag}
            size={size}
          />
        ))}
        <ListItem
          key={"no option"}
          disablePadding
          sx={{
            display: !filteredOptions.length && !loading ? "block" : "none",
          }}
        >
          <ListItemButton dense disabled={true}>
            <ListItemText id={"no option"} primary={`No Option`} />
          </ListItemButton>
        </ListItem>

        <ListItem
          key={"loading"}
          disablePadding
          sx={{ display: loading ? "block" : "none" }}
        >
          <ListItemButton dense disabled={true}>
            <ListItemText id={"loading"} primary={`Loading...`} />
          </ListItemButton>
        </ListItem>
      </List>
    );
  }
);

export default OptionList;
