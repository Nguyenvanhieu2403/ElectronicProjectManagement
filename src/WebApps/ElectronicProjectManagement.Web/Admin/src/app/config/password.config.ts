const passRequirement = {
  passwordMinLowerCase: 1,
  passwordMinNumber: 1,
  passwordMinSymbol: 1,
  passwordMinUpperCase: 1,
  passwordMinCharacters: 8
};
export const passwordPattern = [
  `(?=([^a-z]*[a-z])\{${passRequirement.passwordMinLowerCase},\})`,
  `(?=([^A-Z]*[A-Z])\{${passRequirement.passwordMinUpperCase},\})`,
  `(?=([^0-9]*[0-9])\{${passRequirement.passwordMinNumber},\})`,
  `(?=(\.\*[\$\@\$\!\%\*\?\&])\{${passRequirement.passwordMinSymbol},\})`,
  `[A-Za-z\\d\$\@\$\!\%\*\?\&\.]{${passRequirement.passwordMinCharacters},}`
].map(item => item.toString())
  .join("");
