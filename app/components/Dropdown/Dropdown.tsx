import { Controller, FieldValues } from "react-hook-form";
import Select, { StylesConfig } from "react-select";
import styles from "./Dropdown.module.css";

interface OptionType {
  value: string;
  label: string;
}

type DropdownProps = {
  disabled: boolean;
  placeholder: string;
  options: Array<OptionType>;
  isRequired: boolean;
  control: any;
  name: string;
  multiple: boolean;
  nonFormOnChange: (value: any) => void;
  selectedValues: OptionType[] | null;
};

const Dropdown = ({
  disabled,
  placeholder,
  options,
  isRequired,
  control,
  name,
  multiple,
  nonFormOnChange,
  selectedValues,
}: DropdownProps) => {
  const customStyles = {
    control: (styles: any) => ({
      ...styles,
      display: "flex",
      flexWrap: "wrap",
      borderRadius: "12px",
      width: "100%",
      minHeight: "48px",
      gap: "10px",
      alignSelf: "stretch",
      border: "2px solid #f1e2c2",
      background: "#FFFF",
      boxShadow: "none",
      "&:hover": {
        border: "2px solid #f1e2c2",
      },
    }),
    placeholder: (styles: any) => ({
      ...styles,
      color: "#7c6d6a",
      paddingLeft: "4px",
    }),
    dropdownIndicator: (styles: any, data: any) => ({
      ...styles,
      color: "#5F8670",
      transition: "all .2s ease",
      transform: data.selectProps.menuIsOpen ? "rotate(180deg)" : null,
    }),
    indicatorSeparator: (styles: any) => ({
      ...styles,
      display: "none",
    }),
    option: (
      styles: any,
      { data, isDisabled, isFocused, isSelected }: any
    ) => ({
      ...styles,
      padding: "12px",
      cursor: "pointer",
      ":active": {
        ...styles[":active"],
        backgroundColor: !isDisabled
          ? isSelected
            ? "#F2ECBE"
            : "#F2ECBE"
          : undefined,
        color: "#FFF",
      },
      ":hover": {
        backgroundColor: "#FF9800",
      },

      backgroundColor: isDisabled
        ? undefined
        : isSelected
        ? "#F2ECBE"
        : isFocused
        ? "#F2ECBE"
        : undefined,
      color: isDisabled
        ? undefined
        : isSelected
        ? "#322C2B"
        : isFocused
        ? "#322C2B"
        : undefined,
    }),
    menuList: (styles: any) => ({
      ...styles,
      paddingTop: 0,
      marginRight: "8px",
      cursor: "pointer",
      "::-webkit-scrollbar": {
        width: "8px",
      },
      "::-webkit-scrollbar-track": {
        background: "#FFFFFF",
        marginTop: "8px",
      },
      "::-webkit-scrollbar-thumb": {
        background: "#5F8670",
      },
      "::-webkit-scrollbar-thumb:hover": {
        background: "#5F8670",
      },
    }),
    menu: (styles: any) => ({
      ...styles,
      marginTop: "10px",
    }),
    multiValue: (styles: any) => ({
      ...styles,
      backgroundColor: "#F2ECBE",
      border: "1px solid #5F8670",
      borderRadius: "12px",
    }),
    multiValueLabel: (styles: any) => ({
      ...styles,
      color: "#322C2B",
      fontSize: "16px",
      fontWeight: "400",
      lineHeight: "23px",
    }),
    multiValueRemove: (styles: any) => ({
      ...styles,
      color: "#5F8670",
      ":hover": {
        borderRadius: "16px",
        backgroundColor: "#F2ECBE",
        color: "#977D6E",
      },
    }),
  };

  const showTick = (selectContext: any, value: any) => {
    return (
      selectContext &&
      selectContext.selectValue &&
      selectContext.selectValue.length > 0 &&
      selectContext.selectValue[0].value === value
    );
  };

  type FormatOptionLabelItem = {
    value: any;
    label: any;
  };

  const formatOptionLabel = (
    { value, label }: FormatOptionLabelItem,
    selectContext: any
  ) => (
    <div style={{ display: "flex" }}>
      <div
        className={showTick(selectContext, value) ? "tick" : styles.hiddenTick}
        style={{ marginRight: "8px", color: "#ccc" }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
        >
          <mask
            id="mask0_7801_11338"
            style={{ maskType: "alpha" }}
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="24"
            height="24"
          >
            <rect width="24" height="24" fill="#D9D9D9" />
          </mask>
          <g mask="url(#mask0_7801_11338)">
            <path
              d="M11.6396 17.8862C11.299 18.3526 10.6352 18.4343 10.1916 18.0644L4.88298 13.6376C4.41648 13.2486 4.40167 12.537 4.85157 12.1289L4.93948 12.0492C5.32065 11.7035 5.90199 11.7035 6.28316 12.0492L9.63467 15.0892C10.07 15.4841 10.7505 15.4201 11.1046 14.951L17.7633 6.13013C18.0704 5.7233 18.6354 5.61455 19.0716 5.87831C19.5708 6.18014 19.7041 6.84478 19.3601 7.31583L11.6396 17.8862Z"
              fill="#53270E"
            />
          </g>
        </svg>
      </div>
      <div>{label}</div>
    </div>
  );

  return (
    <>
      {control && (
        <Controller
          name={name}
          rules={{ required: isRequired }}
          control={control}
          render={({ field }) => (
            <Select
              formatOptionLabel={formatOptionLabel}
              onChange={(val: any) => field.onChange(val.value)}
              placeholder={placeholder}
              options={options}
              isDisabled={disabled}
              isMulti={multiple}
              noOptionsMessage={() => "No options"}
              styles={customStyles}
            ></Select>
          )}
        />
      )}
      {!control && nonFormOnChange && (
        <Select
          onChange={(value) => nonFormOnChange(value)}
          placeholder={placeholder}
          options={options}
          isMulti={multiple}
          noOptionsMessage={() => "No options"}
          styles={customStyles}
          isClearable={false}
          value={selectedValues || []}
        ></Select>
      )}
    </>
  );
};

export default Dropdown;
