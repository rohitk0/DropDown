import {
  Box,
  Checkbox,
  Chip,
  ClickAwayListener,
  InputAdornment,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Popper,
  Stack,
  TextField
} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { SortableContainer, SortableElement } from "react-sortable-hoc";
import { arrayMoveImmutable } from "array-move";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import React, { useState, useRef, useEffect } from "react";

const getFromPath = (row, accessor = "") => {
  const pathArr = accessor?.split(".");
  let clone = { ...row };

  let current = 0;
  while (pathArr[current] && current < pathArr.length - 1) {
    clone = clone[pathArr[current++]];
  }
  return clone?.[pathArr?.[current]] || "";
};

export default function Demo({
  value = [],
  name = "",
  onChange,
  fetchOptions,
  popperStyle,
  showCheckBox,
  showSelectAll
}) {
  const inputRef = useRef();
  const labelAccessor = "label";

  const [search, setSearch] = useState("");
  const [focus, setFocus] = useState(false);
  const [popperPosition, setPopperPosition] = useState({});
  const [selectedOption, setSelectedOption] = useState([]);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!focus) {
      setOptions([]);
      setSearch("");
    } else {
      (async () => {
        setLoading(true);
        const options = await fetchOptions();
        setLoading(false);
        setOptions(options);
      })();
    }
  }, [focus]);

  useEffect(() => {
    setSelectedOption(value);
  }, []);

  const isSelectedAll = selectedOption.length === options.length;

  const selectedOptionMap = selectedOption.reduce((prev, cur, ind) => {
    prev[cur[labelAccessor]] = `${ind}`;
    return prev;
  }, {});

  useEffect(() => {
    const {
      top,
      heigth,
      width,
      left
    } = inputRef.current.getBoundingClientRect();

    setPopperPosition({ width, top: top + heigth, left });
  }, []);

  const onFocus = () => {
    setFocus(true);
  };

  const handleSelect = (clickedOption) => {
    const label = getFromPath(clickedOption, labelAccessor);
    const isSelected = !!selectedOptionMap[label];
    let newSelectedOption = [...selectedOption];

    if (isSelected) {
      const index = +selectedOptionMap[label];
      newSelectedOption.splice(index, 1);
    } else {
      newSelectedOption.push(clickedOption);
    }
    setSelectedOption(newSelectedOption);
  };

  const handleSelectAll = () => {
    if (isSelectedAll) {
      setSelectedOption([]);
      onChange([]);
    } else {
      setSelectedOption(options);
      onChange({ value: options, name });
    }
  };

  const startAdornment = () => {
    return !!selectedOption.length ? (
      <InputAdornment position="start">
        <Stack direction="row" spacing="4px">
          {selectedOption.slice(0, 2).map((option) => (
            <Chip
              size="small"
              label={getFromPath(option, labelAccessor)}
              onDelete={() => handleSelect(option)}
            />
          ))}

          <span>
            {selectedOption.length > 2
              ? `+${selectedOption.slice(2).length}`
              : ``}
          </span>
        </Stack>
      </InputAdornment>
    ) : null;
  };

  const filteredOptions = options.filter(
    (option) =>
      !search ||
      getFromPath(option, labelAccessor)
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  return (
    <ClickAwayListener onClickAway={() => setFocus(false)}>
      <Box>
        <TextField
          fullWidth
          ref={inputRef}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onClick={onFocus}
          onFocus={onFocus}
          autoComplete="off"
          label="select"
          size="small"
          autoFocus={focus}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                {loading && <CircularProgress size={20} />}
                {focus ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
              </InputAdornment>
            ),
            startAdornment: startAdornment()
          }}
        />
        <Popper
          {...popperStyle}
          open={focus}
          placement="button"
          disablePortal={true}
          style={{
            width: `${popperPosition?.width}px`,
            top: `${popperPosition?.top}px`,
            left: `${popperPosition?.left}px`,
            position: "absolute"
          }}
          transition
        >
          {({ TransitionProps }) => (
            <SortableList
              TransitionProps={TransitionProps}
              handleSelectAll={handleSelectAll}
              showCheckBox={showCheckBox}
              showSelectAll={showSelectAll}
              options={options}
              search={search}
              isSelectedAll={isSelectedAll}
              filteredOptions={filteredOptions}
              loading={loading}
              handleSelect={handleSelect}
              labelAccessor={labelAccessor}
              selectedOptionMap={selectedOptionMap}
            />
          )}
        </Popper>
      </Box>
    </ClickAwayListener>
  );
}

const SortableList = SortableContainer(
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
    selectedOptionMap
  }) => {
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
          borderRadius: 1
        }}
      >
        <ListItem disablePadding onClick={handleSelectAll}>
          <ListItemButton
            role={undefined}
            dense
            sx={{
              display:
                showCheckBox &&
                showSelectAll &&
                options.length &&
                !search.trim()
                  ? "flex"
                  : "none"
            }}
          >
            <ListItemIcon>
              <Checkbox
                edge="start"
                checked={isSelectedAll}
                tabIndex={-1}
                size="small"
                disableRipple
              />
            </ListItemIcon>
            <ListItemText primary={`Select All`} />
          </ListItemButton>
        </ListItem>
        {filteredOptions.map((option, index) => (
          <SortableItem
            option={option}
            index={index}
            handleSelect={handleSelect}
            selectedOptionMap={selectedOptionMap}
            labelAccessor={labelAccessor}
            showCheckBox={showCheckBox}
          />
        ))}
        <ListItem
          key={"no option"}
          disablePadding
          sx={{
            display: !filteredOptions.length && !loading ? "block" : "none"
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

const SortableItem = SortableElement(
  ({
    option,
    index,
    handleSelect,
    selectedOptionMap,
    labelAccessor,
    showCheckBox
  }) => {
    return (
      <ListItem
        key={index}
        onClick={(e) => handleSelect(option)}
        sx={{
          background: !!selectedOptionMap[getFromPath(option, labelAccessor)]
            ? "#F5F5F5"
            : "inherit"
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
                  minWidth: "2rem"
                }}
              >
                <Checkbox
                  edge="start"
                  checked={
                    !!selectedOptionMap[getFromPath(option, labelAccessor)]
                  }
                  size="small"
                  tabIndex={-1}
                  disableRipple
                />
              </ListItemIcon>
              <ListItemText
                id={index}
                primary={`${getFromPath(option, labelAccessor)}`}
              />
            </Stack>
            <ListItemIcon>
              <DragIndicatorIcon />
            </ListItemIcon>
          </Stack>
        </ListItemButton>
      </ListItem>
    );
  }
);
