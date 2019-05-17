import React from "react";

export default () => {
  return (
    <footer
      className="bg-dark text-white mt-5 p-4 text-center"
      style={{ position: "absolute", left: 0, bottom: 0, right: 0 }}
    >
      Copyright &copy; {new Date().getFullYear()} efi
    </footer>
  );
};
