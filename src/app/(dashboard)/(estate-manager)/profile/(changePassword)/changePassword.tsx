/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import InputVisible from "./components/inputVisible";
import UpdateButtonPassword from "./components/updateButtonPassword";

const ChangePassword = () => {
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [reEnterPassword, setReEnterPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [doneUpdate, setDoneUpdate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showDialogue, setShowDialogue] = useState(false);

  // Password requirements checker
  const getPasswordRequirements = (password: string) => {
    return {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[\W_]/.test(password),
    };
  };

  const passwordRequirements = getPasswordRequirements(newPassword);

  const isValidPassword = (password: any) => {
    return password.length >= 8;
  };

  const updateDone = async (e:
    React.FormEvent
  ) => {
    e.preventDefault();

    if (loading) return; // Do nothing if already loading

    setLoading(true); // Set loading to true when submitting the form

    if (!isValidPassword(newPassword)) {
      setPasswordError("New password should be at least 8 characters");
      setLoading(false);
      setShowDialogue(false);
      return;
    }

    if (newPassword === password) {
      setPasswordError(
        "New password must be different from the current password"
      );
      setLoading(false);
      setShowDialogue(false);
      return;
    }

    if (newPassword !== reEnterPassword) {
      setPasswordError("The entered passwords do not match. Please make sure your passwords match.");
      setLoading(false);
      setShowDialogue(false);
      return;
    }

    try {
      // const updatedData = {
      //   currentPassword: password,
      //   confirmPassword: newPassword,
      //   newPassword: reEnterPassword,
      // };

      // const { success, upDateddata, error } = await updatePassword(updatedData);

      // if (success) {
      setPassword("");
      setNewPassword("");
      setReEnterPassword("");
      setLoading(false);
      setDoneUpdate(true);
      // setShowDialogue(false);
      setPasswordError('')
      // toast.success("Update successful");
      // } else {
      //   setPasswordError(error);
      //   toast.error(error);
      //   setLoading(false);
      //   setShowDialogue(false);
      // }
    } catch (error) {
      console.error("Update error", error);
      //
      setLoading(false);
      // if (
      //   error?.response?.data?.error?.errors &&
      //   error.response.data.error.errors.length > 0
      // ) {
      //   const errorMessage = error.response.data.error.errors[0];
      //   setPasswordError("Error message:", errorMessage);
      //   toast.error(`Update failed: ${errorMessage}`);
      // } else if (error?.response?.data?.message) {
      //   const errorMessage = error.response.data.message;
      //   setPasswordError("Unexpected status code:", errorMessage);
      //   toast.error(`Update failed: ${errorMessage}`);
      // } else {
      //   toast.error("Update failed");
      //   setPasswordError(
      //     "Error changing password",
      //     error.response?.data?.message
      //   );
      // }
      setShowDialogue(false);
    }
  };

  return (
    <div>
      <div className="w-full md:w-[498px] flex flex-col gap-4">
        <InputVisible
          password={password}
          setPassword={setPassword}
          label={"Password"}
          placeholder={"Enter your current password"}
          setError={setPasswordError}
          autoComplete="current-password"  // For current password field
        />

        <InputVisible
          password={newPassword}
          setPassword={setNewPassword}
          label={"New Password"}
          placeholder={"Enter New password"}
          setError={setPasswordError}
          autoComplete="new-password"  // For new password fields
        />
        <div>
          <p className="mt-[-5px] text-GrayHomz2 text-[13px] font-[400] mb-2">
            Password must meet these requirements:
          </p>

          {/* Password Requirements Display */}
          <div className="bg-gray-50 rounded-md p-2 border text-xs">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className={`text-[10px] ${passwordRequirements.length ? 'text-green-600' : 'text-gray-400'}`}>
                  {passwordRequirements.length ? '✓' : '○'}
                </span>
                <span className="text-[10px] text-gray-600">At least 8 characters</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] ${passwordRequirements.uppercase ? 'text-green-600' : 'text-gray-400'}`}>
                  {passwordRequirements.uppercase ? '✓' : '○'}
                </span>
                <span className="text-[10px] text-gray-600">One uppercase (A-Z)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] ${passwordRequirements.lowercase ? 'text-green-600' : 'text-gray-400'}`}>
                  {passwordRequirements.lowercase ? '✓' : '○'}
                </span>
                <span className="text-[10px] text-gray-600">One lowercase (a-z)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] ${passwordRequirements.number ? 'text-green-600' : 'text-gray-400'}`}>
                  {passwordRequirements.number ? '✓' : '○'}
                </span>
                <span className="text-[10px] text-gray-600">One number (0-9)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] ${passwordRequirements.special ? 'text-green-600' : 'text-gray-400'}`}>
                  {passwordRequirements.special ? '✓' : '○'}
                </span>
                <span className="text-[10px] text-gray-600">One special character</span>
              </div>
            </div>
            <div className="mt-1 pt-1 border-t border-gray-200">
              <p className="text-[9px] text-gray-500">Must be different from current password</p>
            </div>
          </div>
        </div>
        <InputVisible
          password={reEnterPassword}
          setPassword={setReEnterPassword}
          label={"Re-enter Password"}
          placeholder={"Re-enter password"}
          setError={setPasswordError}
          autoComplete="new-password"  // For confirmation field
        />
        {passwordError && (
          <div className="text-error italic text-[11px]">{passwordError}</div>
        )}
      </div>
      <UpdateButtonPassword
        updateDone={updateDone}
        doneUpdate={doneUpdate}
        setDoneUpdate={setDoneUpdate}
        loading={loading}
        showDialogue={showDialogue}
        setShowDialogue={setShowDialogue}
      />
    </div>
  );
};

export default ChangePassword;
