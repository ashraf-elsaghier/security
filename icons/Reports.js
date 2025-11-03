import * as React from "react";
const SvgComponent = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={22}
    height={23}
    viewBox="0 0 48 64"
    {...props}
  >
    <path
      fill="currentColor"
      d="M17 40h-2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1V41a1 1 0 0 0-1-1Zm8-12h-2a1 1 0 0 0-1 1v24a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1V29a1 1 0 0 0-1-1Zm5 9v16a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1V37a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1Zm16.24-24.75L35.75 1.76A6 6 0 0 0 31.52 0H6a6 6 0 0 0-6 6v52a6 6 0 0 0 6 6h36a6 6 0 0 0 6-6V16.5a6 6 0 0 0-1.76-4.25ZM32 4.07a2 2 0 0 1 .93.53l10.48 10.48a2 2 0 0 1 .53.93H32ZM44 58a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h22v13a3 3 0 0 0 3 3h13Z"
    />
  </svg>
);
export default SvgComponent;
