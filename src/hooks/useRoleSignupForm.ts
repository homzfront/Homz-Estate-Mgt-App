import { useState } from 'react';

export type SignupForm = {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  businessName: string;
  businessAddress: string;
  password: string;
  confirmPassword: string;
};

export function useRoleSignupForm(initial: SignupForm) {
  const [form, setForm] = useState(initial);
  const handleInputChange = (field: keyof SignupForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };
  return { form, setForm, handleInputChange };
}
