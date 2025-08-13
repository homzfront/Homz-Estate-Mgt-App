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
          <p className="mt-[-5px] text-GrayHomz2 text-[13px] font-[400]">
            Must be at least 8 characters <br />
            New password must be different from the previous password
          </p>
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
