import BashedEye from "@/components/icons/BashedEye";
import Eye from "@/components/icons/Eye";
import React, { useState } from "react";

interface InputVisibleProps {
  password: string;
  setPassword: (value: string) => void;
  label: string;
  placeholder: string;
  setError: (error: string) => void;
  autoComplete?: string;
  username?: string;
}

const InputVisible = ({
  password,
  setPassword,
  label,
  placeholder,
  setError,
  autoComplete = "new-password",
  username = "",
}: InputVisibleProps) => {
  const [visible, setVisible] = useState(false);

  const toggleVisible = () => setVisible(!visible);

  return (
    <div className="relative flex flex-col gap-2 items-start">
      <input
        type="text"
        name="username"
        autoComplete="username"
        value={username}
        hidden
        readOnly
      />

      <label className="text-center text-[14px] font-[500] text-BlackHomz">
        {label}
      </label>
      <input
        className="border w-full rounded-[4px] h-[47px] px-2 placeholder:text-[14px]
             focus:outline-none focus:ring-0 focus:border-GrayHomz"
        type={visible ? "text" : "password"}
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          setError("");
        }}
        placeholder={placeholder}
        autoComplete={autoComplete}
      />
      <div
        className="absolute top-11 left-[90%] md:left-[465px] cursor-pointer"
        onClick={toggleVisible}
      >
        {visible ? <Eye className="w-4 h-4" /> : <BashedEye className="w-4 h-4" />}
      </div>
    </div>
  );
};

export default InputVisible;
