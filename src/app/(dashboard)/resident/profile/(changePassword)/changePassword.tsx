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

  const isValidPassword = (password: string) => password.length >= 8;

  const updateDone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);

    if (!isValidPassword(newPassword)) {
      setPasswordError("New password should be at least 8 characters");
      setLoading(false);
      setShowDialogue(false);
      return;
    }

    if (newPassword === password) {
      setPasswordError("New password must be different from the current password");
      setLoading(false);
      setShowDialogue(false);
      return;
    }

    if (newPassword !== reEnterPassword) {
      setPasswordError("Passwords do not match. Please check again.");
      setLoading(false);
      setShowDialogue(false);
      return;
    }

    try {
      // Simulate success
      setPassword("");
      setNewPassword("");
      setReEnterPassword("");
      setPasswordError("");
      setLoading(false);
      setDoneUpdate(true);
    } catch (error) {
      console.error("Update error", error);
      setLoading(false);
      setShowDialogue(false);
    }
  };

  return (
    <form
      className="w-full max-w-md  flex flex-col pt-10 gap-5 px-4 md:px-0"
      onSubmit={updateDone}
    >
      <h2 className="text-xl font-semibold text-gray-800">Change Password</h2>

      <InputVisible
        password={password}
        setPassword={setPassword}
        label="Current Password"
        placeholder="Enter your current password"
        setError={setPasswordError}
        autoComplete="current-password"
      />

      <InputVisible
        password={newPassword}
        setPassword={setNewPassword}
        label="New Password"
        placeholder="Enter new password"
        setError={setPasswordError}
        autoComplete="new-password"
      />
      <p className="text-gray-500 text-sm -mt-1 mb-2">
        Must be at least 8 characters.<br />
        Must be different from your current password.
      </p>

      <InputVisible
        password={reEnterPassword}
        setPassword={setReEnterPassword}
        label="Re-enter Password"
        placeholder="Re-enter password"
        setError={setPasswordError}
        autoComplete="new-password"
      />

      {passwordError && (
        <p className="text-red-500 text-sm italic">{passwordError}</p>
      )}

      <UpdateButtonPassword
        updateDone={updateDone}
        doneUpdate={doneUpdate}
        setDoneUpdate={setDoneUpdate}
        loading={loading}
        showDialogue={showDialogue}
        setShowDialogue={setShowDialogue}
        password={password}
        newPassword={newPassword}
        reEnterPassword={reEnterPassword}
      />
    </form>
  );
};

export default ChangePassword;
