import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Chip,
  ClickAwayListener,
  IconButton,
  InputAdornment,
  Popper,
  Stack,
  TextField,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import CircularProgress from "@mui/material/CircularProgress";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { arrayMoveImmutable } from "array-move";
import PropTypes from "prop-types";
import OptionList from "./optionList";

const getFromPath = (row, accessor = "") => {
  const pathArr = accessor?.split(".");
  let clone = { ...row };

  let current = 0;
  while (pathArr[current] && current < pathArr.length - 1) {
    clone = clone[pathArr[current++]];
  }
  return clone?.[pathArr?.[current]] || "";
};

export default function CustomAutoCompleteMulti({
  value,
  name,
  onChange,
  fetchOptions,
  popperStyle,
  showCheckBox,
  showSelectAll,
  onDragEnd,
  isDragable,
  isClearAble,
  isSearchAble,
  sx,
  labelAccessor,
  size,
  multi,
  ...rest
}) {
  const inputRef = useRef();
  const popperRef = useRef();

  const [search, setSearch] = useState("");
  const [focus, setFocus] = useState(false);
  const [popperPosition, setPopperPosition] = useState({});
  const [selectedOption, setSelectedOption] = useState([]);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const isSelectedAll = selectedOption.length === options.length;

  const selectedOptionMap = selectedOption.reduce((prev, cur, ind) => {
    prev[cur[labelAccessor]] = `${ind}`;
    return prev;
  }, {});

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
    setSelectedOption(multi ? value || [] : !value ? [] : [value]);
  }, []);

  useEffect(() => {
    adjustPopperPosition();
  }, [options, focus, loading, selectedOption]);

  useEffect(() => {
    window.addEventListener("resize", adjustPopperPosition);
    window.addEventListener("scroll", adjustPopperPosition);
  }, []);

  const onSortEnd = ({ oldIndex, newIndex }) => {
    const reOrderedList = arrayMoveImmutable(options, oldIndex, newIndex);
    setOptions(reOrderedList);
    onDragEnd?.({ newOrder: reOrderedList, oldIndex, newIndex });
  };

  const adjustPopperPosition = () => {
    if (!inputRef.current && !popperPosition.current) return;
    const inputPosition = inputRef.current.getBoundingClientRect();

    if (focus) {
      const popperPosition = popperRef.current?.getBoundingClientRect();

      const newTop =
        inputPosition.bottom + popperPosition?.height > screen.height
          ? inputPosition.top - popperPosition?.height
          : inputPosition.bottom;

      setPopperPosition({
        width: inputPosition.width,
        left: inputPosition.left,
        right: inputPosition.right,
        top: !options.length ? inputPosition.bottom : newTop,
      });
    }
  };

  const onFocus = (e) => {
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
      if (!multi) newSelectedOption = [];
      newSelectedOption.push(clickedOption);
    }
    setSelectedOption(newSelectedOption);

    const event = {
      name,
      value: multi ? newSelectedOption : newSelectedOption[0],
      [isSelected ? "diselected" : "selected"]: clickedOption,
    };

    onChange(event);

    if (!multi) setFocus(false);
  };

  const handleSelectAll = () => {
    if (isSelectedAll) {
      clearAll();
    } else {
      setSelectedOption(options);
      onChange({ value: options, name, selectedAll: true });
    }
  };

  const clearAll = (evt) => {
    evt?.stopPropagation?.();
    setSelectedOption([]);
    onChange({ value: options, name, deSelectedAll: true });
  };

  const onSearch = (evt) => {
    if (!isSearchAble) return;
    setSearch(evt.target.value);
  };

  const startAdornment = () => {
    return !!selectedOption.length ? (
      <InputAdornment position="start">
        <Stack direction="row" spacing="4px">
          {selectedOption.slice(0, 2).map((option) => (
            <Chip
              size={size}
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
      <Box style={{ width: "100%" }}>
        <TextField
          {...rest}
          size={size}
          sx={{
            ...sx,
            caretColor: isSearchAble ? "inherit" : "transparent",
          }}
          ref={inputRef}
          value={search}
          onChange={onSearch}
          onClick={onFocus}
          onFocus={onFocus}
          autoComplete="off"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                {loading && <CircularProgress size={20} />}
                {isClearAble && (
                  <IconButton size={size} onClick={clearAll}>
                    <ClearIcon size={20} />
                  </IconButton>
                )}
                {focus ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
              </InputAdornment>
            ),
            startAdornment: startAdornment(),
          }}
        />
        <Popper
          {...popperStyle}
          open={focus && !!popperPosition?.top}
          disablePortal={true}
          ref={popperRef}
          style={{
            position: "absolute",
            width: `${popperPosition?.width}px`,
            top: `${popperPosition?.top + window.scrollY}px`,
            left: `${popperPosition?.left}px`,
            right: `${popperPosition?.right}px`,
            zIndex: 5,
          }}
          transition
        >
          {({ TransitionProps }) => (
            <OptionList
              distance={1}
              onSortEnd={onSortEnd}
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
              disabledDrag={!!search || !isDragable}
              size={size}
              multi={multi}
            />
          )}
        </Popper>
      </Box>
    </ClickAwayListener>
  );
}

CustomAutoCompleteMulti.propTypes = {
  multi: PropTypes.bool,
  name: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  fetchOptions: PropTypes.func.isRequired,
  showCheckBox: PropTypes.bool,
  showSelectAll: PropTypes.bool,
  isDragable: PropTypes.bool,
  onDragEnd: function ({ isDragable, onDragEnd }) {
    return isDragable
      ? !(onDragEnd instanceof Function)
        ? new Error("onDragEnd is required")
        : null
      : null;
  },
};

CustomAutoCompleteMulti.defaultProps = {
  multi: false,
  name: "",
  showCheckBox: false,
  showSelectAll: false,
  isSearchAble: true,
  isClearAble: false,
  isDragable: false,
  size: "small",
};
