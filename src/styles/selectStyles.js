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
      backgroundColor: "white",
      zIndex: "9999"
    }),
    menuList: (base, state) => ({
      ...base,
      backgroundColor: "transparent",
      maxHeight: 185
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
      backgroundColor: "white",
      borderColor: state.isFocused ? "var(--primaryColor)" : "var(--light_grey)",
      ":hover": { borderColor: "var(--primaryColor)" }, // border style on hover
      border: "1px solid var(--light_grey)", // default border color
      boxShadow: "var(--primaryColor)" // no box-shadow
    }),
    option: (base, state) => ({
      ...base,
      borderBottom: "1px solid var(--primaryColor)",
      backgroundColor:
        // state.isSelected ? "var(--secondaryColor)":
        state.isFocused ? "var(--primaryColor)" : switchRoleColor(state.value),
      color: "var(--tertiarycolor)",
      ":active": {
        backgroundColor: !state.isSelected ? "var(--secondaryColor)" : "white"
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
              backgroundColor: "var(--dark_border)",
              color: "var(--secondaryColor)"
            }
          }
  };
};

const switchRoleColor = role => {
  //console.log(role);
  switch (role) {
    // case "Random":
    //   return "white";
    // case "Crowd Control":
    //   return "white";
    // case "Healer":
    //   return "white";
    // case "Melee Dps":
    //   return "white";
    // case "Off Tank":
    //   return "white";
    // case "Ranged Dps":
    //   return "white";
    // case "Support":
    //   return "white";
    // case "Tank":
    //   return "white";
    // case "Utility":
    //   return "white";
    default:
      return "white";
  }
};

export { selectStyles };
