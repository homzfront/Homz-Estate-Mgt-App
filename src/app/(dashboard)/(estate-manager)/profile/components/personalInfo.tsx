import CustomInput from '@/components/general/customInput';
import React from 'react'
import UpdateButtonPassword from '../(changePassword)/components/updateButtonPassword';

const PersonalInfo = () => {
  const [formData, setFormData] = React.useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
  });

  const [doneUpdate, setDoneUpdate] = React.useState(false);
  const [showDialogue, setShowDialogue] = React.useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateDone = async (e:
    React.FormEvent
  ) => {
    e.preventDefault();
    // Handle the update logic here
    console.log("Update done with data:", formData);
  }


  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#FCFCFC] rounded-[12px] p-4">
        <CustomInput
          label="First Name"
          placeholder="e.g Daniel"
          value={formData.firstName}
          onValueChange={(value) => handleInputChange('firstName', value)}
          required
          className='h-[45px] pl-4'
        />
        <CustomInput
          label="Last Name"
          placeholder="e.g Dee"
          value={formData.lastName}
          onValueChange={(value) => handleInputChange('lastName', value)}
          required
          className='h-[45px] pl-4'
        />
        <CustomInput
          label="Phone Number"
          placeholder="e.g 070 0000 0000"
          value={formData.phoneNumber}
          onValueChange={(value) => handleInputChange('phoneNumber', value)}
          required
          className='h-[45px] pl-4'
        />
      </div>
      <UpdateButtonPassword
        updateDone={updateDone}
        doneUpdate={doneUpdate}
        setDoneUpdate={setDoneUpdate}
        loading={false}
        showDialogue={showDialogue}
        setShowDialogue={setShowDialogue}
      />
    </div>
  )
}

export default PersonalInfo