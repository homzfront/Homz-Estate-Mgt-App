"use client";
import React from 'react'
import ArrowDown from '@/components/icons/arrowDown';
import ArrowLeft16Long from '@/components/icons/arrowLeft16Long';
import Dropdown from '@/components/general/dropDown';
import CustomInput from '@/components/general/customInput';
import SuccessModal from '../../components/successModal';
import Table from './components/table';
import CloseTransluscentIcon from '@/components/icons/closeTransluscentIcon';
import CustomModal from '@/components/general/customModal';

const currentData = [
  { firstName: "Bigabanibo", lastName: "Iwowari", email: "Ibigabanibo@gmail.com", role: "Security", relationship: "Spouse", phone: "09093999292" },
  { firstName: "Margaret", lastName: "Nasiru", email: "Ibigabanibo@gmail.com", role: "Account Officer", relationship: "None", phone: "09093999292" },
  { firstName: "Paul", lastName: "Lawan", email: "Ibigabanibo@gmail.com", role: "Landlord", relationship: "Other", phone: "09093999292" },
  { firstName: "Martha", lastName: "Omísore", email: "Ibigabanibo@gmail.com", role: "Security", relationship: "Housemate", phone: "09093999292" },
  { firstName: "Michael", lastName: "Ekisagha", email: "Ibigabanibo@gmail.com", role: "Landlord", relationship: "Parent", phone: "09093999292" },
  { firstName: "Joseph", lastName: "Nasiru", email: "Ibigabanibo@gmail.com", role: "Admin", relationship: "Sibling", phone: "09093999292" },
];
type User = {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
};

const Settings = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [active, setActive] = React.useState(false);
  const [data, setData] = React.useState(false);
  const [openSuccess, setOpenSuccess] = React.useState(false);
  const [openDetails, setOpenDetails] = React.useState(false);
  const [selectedData, setSelectedData] = React.useState<User | null>(null);
  const [activePage, setActivePage] = React.useState(0);
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  const [formData, setFormData] = React.useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    relationship: '',
    role: '',
  });
  const options = [
    { id: 1, label: "Co-Owner" },
    { id: 2, label: "Renter" },
    { id: 3, label: "Household Member" },
  ];

  const relationshipOptions = [
    { id: 1, label: "None" },
    { id: 2, label: "Spouse" },
    { id: 3, label: "Housemate" },
    { id: 4, label: "Sibling" },
    { id: 5, label: "Parent" },
    { id: 6, label: "Other" },
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  React.useEffect(() => {
    if (formData.email && formData.role) {
      setActive(true);
    } else {
      setActive(false);
    }
  }, [formData]);
  const handleSubmit = () => {
    setOpenSuccess(false);
    setIsOpen(false);
    setActive(false);
    setFormData({ email: '', role: '', relationship: '', firstName: '', lastName: '', phone: '' });
    setData(true);
  };
  const pages = [
    "All", "Co-Owner", "Renter", "Household Member"
  ];

  return (
    <div className='py-8'>
      {openSuccess &&
        <SuccessModal
          title='Invitation Sent Successfully'
          successText='An email has been sent to [Co-Resident Name] inviting them to join your property on the platform.'
          submitText='Close'
          handleSubmit={handleSubmit}
          isOpen={openSuccess}
          closeSuccessModal={() => handleSubmit()}
        />
      }
      {openDetails &&
        <CustomModal isOpen={openDetails} onRequestClose={() => setOpenDetails(false)}>
          <div className='bg-white px-4 py-5 rounded-[12px] w-full'>
            <div className='flex justify-between items-center'>
              <p className='text-sm font-normal text-BlueHomz'> Co-Residents</p>
              <button onClick={() => setOpenDetails(false)}
              >
                <CloseTransluscentIcon />
              </button>
            </div>
            <div className='mt-4 rounded-[12px] bg-inputBg p-4 flex flex-col gap-4 text-xs'>
              <div className='flex flex-row gap-8 items-center'>
                <h3 className='w-[80px]'>First Name</h3>
                <h3 className='w-[150px] flex items-start'>{selectedData?.firstName}</h3>
              </div>
              <div className='flex flex-row gap-8 items-center'>
                <h3 className='w-[80px]'>Last Name</h3>
                <h3 className='w-[150px] flex items-start'>{selectedData?.lastName}</h3>
              </div>
              <div className="flex flex-row gap-8 items-start flex-wrap">
                <h3 className="w-[80px]">Email</h3>
                <h3 className="break-all w-[150px]">{selectedData?.email}</h3>
              </div>

              <div className='flex flex-row gap-8 items-center'>
                <h3 className='w-[80px]'>Role</h3>
                <div className='w-[150px]'>
                  <Dropdown
                    options={options}
                    onSelect={() => { }}
                    selectOption={selectedData?.role || 'Select role'}
                    showSearch={false}
                    borderColor="border-[#A9A9A9]"
                    arrowColor="#A9A9A9"
                    bgColor="bg-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        </CustomModal>
      }
      <h1 className='text-[16px] md:text-[20px] font-normal text-BlackHomz px-8 flex items-center gap-1'><span className='md:hidden'><ArrowLeft16Long /></span>Settings</h1>
      <div className='flex justify-start pb-8 border-b border-GrayHomz6 px-8'>
        <button className='h-[37px] bg-BlueHomz text-white text-[11px] md:text-sm font-normal rounded-[4px] px-3 py-2 mt-4'>
          Co-Residents
        </button>
      </div>
      <p className='px-8 mt-7 text-sm md:text-[16px] font-normal text-GrayHomz'>Invite someone who lives with you to join and access this property on the platform. <br />They’ll be able to view property information, receive updates, and more.</p>
      <div className='px-8 py-4'>
        <div className='bg-inputBg p-4 rounded-[12px]'>
          <button onClick={toggleDropdown} className="flex justify-between w-full">
            <p className='text-sm md:text-[16px] font-normal text-GrayHomz text-left'>
              Invite a Co-Resident
            </p>
            <span className={`w-5 h-5 transition-transform duration-200 ${isOpen ? "transform rotate-180" : "mt-1"}`}>
              <ArrowDown size={20} className="#4E4E4E" />
            </span>
          </button>
          {isOpen &&
            <div className="mt-4 border-t border-GrayHomz6 pt-5 space-y-5">
              {/* First & Last Name */}
              <div className='bg-[#FCFCFC] px-4 py-6 rounded-[8px]'>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <CustomInput
                    label="First Name"
                    required
                    placeholder="e.g Dele"
                    value={formData.firstName || ""}
                    className='w-full border border-[#A9A9A9] rounded-[4px] px-3 py-2 bg-transparent'
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                  />
                  <CustomInput
                    label="Last Name"
                    required
                    placeholder="e.g Dayo"
                    value={formData.lastName || ""}
                    className='w-full border border-[#A9A9A9] rounded-[4px] px-3 py-2 bg-transparent'
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                  />
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <CustomInput
                    label="Email"
                    required
                    placeholder="e.g Deledayo@gmail.com"
                    type="email"
                    className='w-full border border-[#A9A9A9] rounded-[4px] px-3 py-2 bg-transparent'
                    value={formData.email || ""}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                  />
                  <CustomInput
                    label="Phone Number (Optional)"
                    placeholder="e.g 08012345678"
                    className='w-full border border-[#A9A9A9] rounded-[4px] px-3 py-2 bg-transparent'
                    value={formData.phone || ""}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                  />
                </div>
              </div>

              {/* Role & Relationship */}
              <div className='bg-[#FCFCFC] px-4 py-6 rounded-[8px]'>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor={"roleOptions"}
                      className="block text-sm font-medium text-BlackHomz mb-1"
                    >
                      What is the co-resident’s role in this property? <span className="text-red-500 ml-1">*</span>
                    </label>
                    <Dropdown
                      options={options}
                      onSelect={(option) => handleInputChange('role', option.label)}
                      selectOption="Select role"
                      showSearch={false}
                      borderColor='border-[#A9A9A9]'
                      arrowColor='#A9A9A9'
                      bgColor='bg-transparent'
                    />
                  </div>
                  <div>
                    <label
                      htmlFor={"relationshipOptions"}
                      className="block text-sm font-medium text-BlackHomz mb-1"
                    >
                      How are you related to the co-resident? (Optional)
                    </label>
                    <Dropdown
                      options={relationshipOptions}
                      onSelect={(val) => handleInputChange("relationship", val.label)}
                      selectOption={formData.relationship || "Select relationship"}
                      showSearch={false}
                      borderColor="border-[#A9A9A9]"
                      arrowColor="#A9A9A9"
                      bgColor="bg-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>
          }

          {isOpen &&
            <div className='flex justify-end w-full'>
              <button
                onClick={() => {
                  if (active) setOpenSuccess(true)
                }}
                className={`mt-4 w-full md:w-auto h-[45px] flex justify-center items-center ${active ? "bg-BlueHomz text-white" : "bg-GrayHomz6 text-GrayHomz5"}  text-sm md:text-[16px] font-normal rounded-[4px] px-6 py-2`}
              >
                Send Invite
              </button>
            </div>
          }
        </div>
        {data && (
          <div className='mt-8 border-t py-4 md:py-0 md:p-4 border-GrayHomz6 text-sm font-normal md:font-medium'>
            <div className='flex flex-wrap items-center gap-4 mt-8'>
              {pages.map((page, index) => (
                <span key={index} onClick={() => setActivePage(index)} className={`${index === activePage ? "px-3 py-2 rounded-[4px] bg-BlueHomz text-white" : "px-3 py-2 md:px-0 md:py-0 rounded-[4px] md:rounded-none bg-whiteblue md:bg-transparent text-BlueHomz md:text-GrayHomz"} cursor-pointer`}>{page}</span>
              ))}
            </div>

            <Table
              currentData={currentData}
              setSelectedData={setSelectedData}
              setOpenDetails={setOpenDetails}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default Settings