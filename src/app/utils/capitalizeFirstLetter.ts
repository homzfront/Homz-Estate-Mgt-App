function capitalizeFirstLetter(str: string | null | undefined): string {
  if (str && typeof str === "string") {
    return str.charAt(0).toUpperCase() + str.slice(1);
  } else {
    return "";
  }
}

export default capitalizeFirstLetter;
