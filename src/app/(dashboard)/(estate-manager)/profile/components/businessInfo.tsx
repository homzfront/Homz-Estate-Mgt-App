import CustomInput from '@/components/general/customInput';
import React from 'react'
import UpdateButtonPassword from '../(changePassword)/components/updateButtonPassword';
import CameraBig from '@/components/icons/cameraBig';
import Camera from '@/components/icons/camera';

const BusinessInfo = () => {
  const [formData, setFormData] = React.useState({
    businessName: '',
    businessAddress: '',
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-0 md:mb-8">
        <div className='rounded-[12px] p-4 bg-[#FCFCFC] flex gap-4 items-center'>
          <button className='h-[152px] w-[152px] rounded-full bg-[#D5D5D5] hidden md:flex items-center justify-center'>
            <CameraBig />
          </button>
          <button className='h-[72px] w-[72px] rounded-full bg-[#D5D5D5] md:hidden flex items-center justify-center'>
            <CameraBig h={16} w={16} />
          </button>
          <div className='flex flex-col items-start justify-center gap-1'>
            <button className='flex items-center gap-1 cursor-pointer'>
              <Camera />
              <span className='mt-[1.5px] text-[14px] font-normal md:font-semibold text-BlueHomz'>Click to upload</span>
            </button>
            <p className='text-[11px] font-normal text-GrayHomz'>
              PDF, JPG (max. 5mb)
            </p>
          </div>
        </div>
        <div />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#FCFCFC] rounded-[12px] p-4">
        <CustomInput
          label="Business Name"
          placeholder="e.g Builders Group Ltd"
          value={formData.businessName}
          onValueChange={(value) => handleInputChange('businessName', value)}
          className='h-[45px] pl-4'
        />
        <div />
        <CustomInput
          label="Business Address"
          placeholder="e.g Shomolu estate, Lagos"
          value={formData.businessAddress}
          onValueChange={(value) => handleInputChange('businessAddress', value)}
          className='h-[45px] pl-4'
        />
        <div />
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

export default BusinessInfo