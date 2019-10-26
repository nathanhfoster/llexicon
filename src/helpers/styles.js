/*clearIndicator container control dropdownIndicator 
group groupHeading indicatorsContainer indicatorSeparator 
input loadingIndicator loadingMessage menu menuList multiValue 
multiValueLabel multiValueRemove noOptionsMessage option placeholder singleValue valueContainer */
const selectStyles = props => {
  return {
    /* 
  clearIndicator function (Object) => Object
  container function (Object) => Object
  control function (Object) => Object
  dropdownIndicator function (Object) => Object
  group function (Object) => Object
  groupHeading function (Object) => Object
  indicatorsContainer function (Object) => Object
  indicatorSeparator function (Object) => Object
  input function (Object) => Object
  loadingIndicator function (Object) => Object
  loadingMessageCSS function (Object) => Object
  menu function (Object) => Object
  menuList function (Object) => Object
  menuPortal function (Object) => Object
  multiValue function (Object) => Object
  multiValueLabel function (Object) => Object
  multiValueRemove function (Object) => Object
  noOptionsMessageCSS function (Object) => Object
  option function (Object) => Object
  placeholder function (Object) => Object
  singleValue function (Object) => Object
  valueContainer functionrequired (Object) => Object
  */
    menu: (base, state) => ({
      ...base,
      backgroundColor: "var(--slate_grey)",
      zIndex: "9999"
    }),
    menuList: (base, state) => ({
      ...base,
      backgroundColor: "transparent"
    }),
    menuPortal: (base, state) => ({
      ...base
    }),
    container: (base, state) => ({
      ...base,
      fontSize: "medium",
      opacity: state.isDisabled ? ".5" : "1",
      backgroundColor: "transparent"
    }),
    clearIndicator: (base, state) => ({
      ...base,
      color: "var(--tertiarycolor)",
      ":hover": { color: "var(--primaryColor)" }
    }),
    dropdownIndicator: (base, state) => ({
      ...base,
      color: "var(--tertiarycolor)",
      ":hover": { color: "var(--primaryColor)" }
    }),
    control: (base, state) => ({
      ...base,
      minHeight: "var(--inputButtonHeight)",
      margin: "0 auto",
      backgroundColor: "var(--slate_grey)",
      borderColor: state.isFocused
        ? "var(--primaryColor)"
        : "var(--light_grey)",
      ":hover": { borderColor: "var(--primaryColor)" }, // border style on hover
      border: "1px solid var(--light_grey)", // default border color
      boxShadow: "var(--primaryColor)" // no box-shadow
    }),
    option: (base, state) => ({
      ...base,
      borderBottom: "1px solid var(--primaryColor)",
      backgroundColor:
        // state.isSelected ? "var(--secondaryColor)": 
        state.isFocused ? "var(--primaryColor)"
          : switchRoleColor(state.value),
      color: "var(--tertiarycolor)",
      ":active": {
        backgroundColor: !state.isSelected
          ? "var(--secondaryColor)"
          : "var(--slate_grey)"
      }
    }),
    placeholder: (base, state) => ({
      ...base,
      color: "var(--tertiarycolor)"
    }),
    singleValue: (base, state) => ({
      ...base,
      color: "var(--tertiarycolor)"
    }),
    valueContainer: (base, state) => ({
      ...base,
      backgroundColor: "inherit",
      maxHeight: "var(--inputButtonHeight)",
      // flexWrap: "nowrap",
      overflowY: "scroll",
      "::-webkit-scrollbar": { display: "initial", height: 2, width: 2 }
    }),
    multiValue: (base, state) => {
      const { isFixed } = state.data;
      return {
        ...base,
        fontSize: 20,
        backgroundColor: isFixed ? "var(--grey)" : "var(--primaryColor)"
      };
    },
    multiValueLabel: (base, state) => {
      const { isFixed } = state.data;
      return isFixed
        ? {
          ...base,
          fontWeight: "bold",
          color: "var(--tertiarycolor)",
          paddingRight: 6
        }
        : {
          ...base,
          color: "var(--tertiarycolor)"
        };
    },
    multiValueRemove: (base, state) =>
      state.data.isFixed
        ? { ...base, display: "none" }
        : {
          ...base,
          ":hover": {
            backgroundColor: "var(--secondaryColor)",
            color: "var(--tertiarycolor)"
          }
        }
  };
};

const switchRoleColor = role => {
  //console.log(role);
  switch (role) {
    // case "Random":
    //   return "var(--slate_grey)";
    // case "Crowd Control":
    //   return "var(--slate_grey)";
    // case "Healer":
    //   return "var(--slate_grey)";
    // case "Melee Dps":
    //   return "var(--slate_grey)";
    // case "Off Tank":
    //   return "var(--slate_grey)";
    // case "Ranged Dps":
    //   return "var(--slate_grey)";
    // case "Support":
    //   return "var(--slate_grey)";
    // case "Tank":
    //   return "var(--slate_grey)";
    // case "Utility":
    //   return "var(--slate_grey)";
    default:
      return "var(--slate_grey)";
  }
};

export { selectStyles };
