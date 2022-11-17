import * as React from "react";
import ReactDOM from "react-dom/client";
import { StyledEngineProvider } from "@mui/material/styles";
import CustomAutoCompleteMulti from "./CustomAutoCompleteMulti";
import {
  Autocomplete,
  Link,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";

const App = () => {
  const options = [
    { label: "label 1", value: "1" },
    { label: "label 2", value: "2" },
    { label: "label 3", value: "1" },
    { label: "label 4", value: "2" },
    { label: "label 5", value: "1" },
    { label: "label 6", value: "2" },
    { label: "label 7", value: "1" },
    { label: "label 8", value: "2" },
    { label: "label 9", value: "1" },
    { label: "label 10", value: "2" },
  ];

  const [multiSelectValue, setMultiSelectValue] = React.useState([]);
  const [defaultMultiSelectValue, setDefaultMultiSelectValue] = React.useState([
    { label: "label 5", value: "1" },
  ]);
  const [singleSelectValue, setSingleSelectValue] = React.useState(null);
  const [defaultSingleSelectValue, setDefaultSingleSelectValue] =
    React.useState({ label: "label 5", value: "1" });

  const fetchOptions = async () => {
    return await new Promise((res, rej) => {
      setTimeout(() => res(options), 2000);
    });
  };

  const instantOptions = async () => {
    return options;
  };

  return (
    <>
      <Link href=" https://github.com/rohitk0/DropDown" underline="hover">
        Github
      </Link>
      <Stack gap={"50px"} marginBottom="50px">
        <Typography>Single Select</Typography>
        <CustomAutoCompleteMulti
          fullWidth
          fetchOptions={instantOptions}
          label="Select"
          labelAccessor="label"
          value={singleSelectValue}
          onChange={(...args) => {
            console.log(...args);
          }}
        />
        <CustomAutoCompleteMulti
          fullWidth
          fetchOptions={instantOptions}
          label="Disabled Search"
          isSearchAble={false}
          labelAccessor="label"
          value={singleSelectValue}
          onChange={(...args) => {
            console.log(...args);
          }}
        />
        <CustomAutoCompleteMulti
          fullWidth
          fetchOptions={instantOptions}
          label="Default Select"
          labelAccessor="label"
          value={defaultSingleSelectValue}
          onChange={(...args) => {
            console.log(...args);
          }}
        />
        <CustomAutoCompleteMulti
          fullWidth
          isClearAble={true}
          fetchOptions={instantOptions}
          label="Clearable Select"
          labelAccessor="label"
          value={defaultSingleSelectValue}
          isSearchAble={true}
          onChange={(...args) => {
            console.log(...args);
          }}
        />
        <CustomAutoCompleteMulti
          fullWidth
          isClearAble={true}
          fetchOptions={fetchOptions}
          label="Async Select"
          labelAccessor="label"
          onDragEnd={(option) => console.log(option)}
          value={singleSelectValue}
          isSearchAble={true}
          onChange={(...args) => {
            console.log(...args);
          }}
        />
        <CustomAutoCompleteMulti
          fullWidth
          isClearAble={true}
          fetchOptions={() => []}
          label="No option"
          labelAccessor="label"
          value={null}
          onChange={(...args) => {
            console.log(...args);
          }}
        />
        <CustomAutoCompleteMulti
          fullWidth
          isClearAble={true}
          fetchOptions={fetchOptions}
          label="Dragable"
          isDragable={true}
          onDragEnd={(e) => console.log(e)}
          labelAccessor="label"
          value={null}
          onChange={(...args) => {
            console.log(...args);
          }}
        />
        <CustomAutoCompleteMulti
          fullWidth
          isClearAble={true}
          showCheckBox={true}
          fetchOptions={fetchOptions}
          label="Dragable"
          isDragable={true}
          onDragEnd={(e) => console.log(e)}
          labelAccessor="label"
          value={null}
          onChange={(...args) => {
            console.log(...args);
          }}
        />
      </Stack>

      <Stack rowGap={"50px"}>
        <Typography>Multi Select</Typography>
        <CustomAutoCompleteMulti
          fullWidth
          multi
          fetchOptions={instantOptions}
          label="Select"
          labelAccessor="label"
          value={multiSelectValue}
          onChange={({ value }) => {
            setValue(value);
          }}
        />
        <CustomAutoCompleteMulti
          fullWidth
          multi
          fetchOptions={instantOptions}
          label="Default Select"
          labelAccessor="label"
          onDragEnd={(option) => console.log(option)}
          value={multiSelectValue}
          onChange={(...args) => {
            console.log(...args);
          }}
        />
        <CustomAutoCompleteMulti
          fullWidth
          multi
          showSelectAll={true}
          isClearAble={true}
          fetchOptions={instantOptions}
          label="Select All"
          labelAccessor="label"
          onDragEnd={(option) => console.log(option)}
          value={multiSelectValue}
          onChange={(...args) => {
            console.log(...args);
          }}
        />
        <CustomAutoCompleteMulti
          fullWidth
          multi
          isClearAble={true}
          fetchOptions={instantOptions}
          label="Clearable Select"
          labelAccessor="label"
          onDragEnd={(option) => console.log(option)}
          value={defaultMultiSelectValue}
          isSearchAble={multiSelectValue}
          onChange={(...args) => {
            console.log(...args);
          }}
        />
        <CustomAutoCompleteMulti
          fullWidth
          multi
          isClearAble={true}
          fetchOptions={fetchOptions}
          label="Async Select"
          labelAccessor="label"
          onDragEnd={(option) => console.log(option)}
          value={singleSelectValue}
          isSearchAble={multiSelectValue}
          onChange={(...args) => {
            console.log(...args);
          }}
        />
        <CustomAutoCompleteMulti
          fullWidth
          multi
          isClearAble={true}
          fetchOptions={() => []}
          label="No option"
          labelAccessor="label"
          value={multiSelectValue}
          onChange={(...args) => {
            console.log(...args);
          }}
        />
        <CustomAutoCompleteMulti
          fullWidth
          multi
          isClearAble={true}
          fetchOptions={fetchOptions}
          label="Dragable"
          isDragable={true}
          onDragEnd={(e) => console.log(e)}
          labelAccessor="label"
          value={multiSelectValue}
          onChange={(...args) => {
            console.log(...args);
          }}
        />
        <CustomAutoCompleteMulti
          fullWidth
          multi
          isClearAble={true}
          showCheckBox={true}
          fetchOptions={fetchOptions}
          label="CheckBox"
          isDragable={true}
          onDragEnd={(e) => console.log(e)}
          labelAccessor="label"
          value={multiSelectValue}
          onChange={(...args) => {
            console.log(...args);
          }}
        />{" "}
        <CustomAutoCompleteMulti
          fullWidth
          multi
          showSelectAll={true}
          isClearAble={true}
          showCheckBox={true}
          fetchOptions={instantOptions}
          label="Select All Checkbox"
          labelAccessor="label"
          onDragEnd={(option) => console.log(option)}
          value={multiSelectValue}
          onChange={(...args) => {
            console.log(...args);
          }}
        />
      </Stack>
    </>
  );
};

ReactDOM.createRoot(document.querySelector("#root")).render(
  <React.StrictMode>
    <StyledEngineProvider injectFirst>
      <App />
    </StyledEngineProvider>
  </React.StrictMode>
);
