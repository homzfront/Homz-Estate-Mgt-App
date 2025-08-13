"use client";
import React from 'react'
import ArrowDown from '@/components/icons/arrowDown';
import ArrowLeft16Long from '@/components/icons/arrowLeft16Long';
import Dropdown from '@/components/general/dropDown';
import CustomInput from '@/components/general/customInput';
import SuccessModal from '../../components/successModal';
import Table from './components/table';
import CustomModal from '@/components/general/customModal';
import CloseTransluscentIcon from '@/components/icons/closeTransluscentIcon';

const currentData = [
  { firstName: "Bigabanibo", lastName: "Iwowari", email: "Ibigabanibo@gmail.com", role: "Security" },
  { firstName: "Margaret", lastName: "Nasiru", email: "Ibigabanibo@gmail.com", role: "Account Officer" },
  { firstName: "Paul", lastName: "Lawan", email: "Ibigabanibo@gmail.com", role: "Landlord" },
  { firstName: "Martha", lastName: "Omísore", email: "Ibigabanibo@gmail.com", role: "Security" },
  { firstName: "Michael", lastName: "Ekisagha", email: "Ibigabanibo@gmail.com", role: "Landlord" },
  { firstName: "Joseph", lastName: "Nasiru", email: "Ibigabanibo@gmail.com", role: "Admin" },
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
  const [selectedData, setSelectedData] = React.useState<User | null>(null);
  const [openDetails, setOpenDetails] = React.useState(false);
  const [activePage, setActivePage] = React.useState(0);
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  const [formData, setFormData] = React.useState({
    email: '',
    role: '',
  });
  const options = [
    { id: 1, label: 'Admin' },
    { id: 2, label: 'Account Officer' },
    { id: 3, label: 'Landlord' },
    { id: 4, label: 'Security' },
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
    setFormData({ email: '', role: '' });
    setData(true);
  };
  const pages = [
    "All", "Landlord", "Account Officer", "Security"
  ];

  return (
    <div className='py-8'>
      {openSuccess &&
        <SuccessModal
          title='Invitation Sent Successfully'
          successText='Your invite link has successfully been sent to Address@gmail.com'
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
              <p className='text-sm font-normal text-BlueHomz'>Manage User</p>
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
          Manage Users
        </button>
      </div>
      <p className='px-8 mt-7 text-sm md:text-[16px] font-normal text-GrayHomz'>Invite and assign roles to trusted users to help manage estates, Residents, bills, and visitor access</p>
      <div className='px-8 py-4'>
        <div className='bg-inputBg p-4 rounded-[12px]'>
          <button onClick={toggleDropdown} className="flex justify-between w-full">
            <p className='text-sm md:text-[16px] font-normal text-GrayHomz text-left'>
              Add a working email and select a user role
            </p>
            <span className={`w-5 h-5 transition-transform duration-200 ${isOpen ? "transform rotate-180" : "mt-1"}`}>
              <ArrowDown size={20} className="#4E4E4E" />
            </span>
          </button>
          {isOpen && (
            <div className='mt-4 border-t border-GrayHomz6 pt-5'>
              <div className='flex md:grid flex-col grid-cols-2 gap-4 w-full text-sm'>
                <CustomInput
                  type='email'
                  placeholder='Enter email address'
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className='w-full border border-[#A9A9A9] rounded-[4px] px-3 py-2 bg-transparent'
                />
                <div className='hidden md:inline' />
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
            </div>
          )}
          {isOpen &&
            <button
              onClick={() => {
                if (active) setOpenSuccess(true)
              }}
              className={`mt-4 w-full md:w-auto h-[45px] flex justify-center items-center ${active ? "bg-BlueHomz text-white" : "bg-GrayHomz6 text-GrayHomz5"}  text-sm md:text-[16px] font-normal rounded-[4px] px-6 py-2`}
            >
              Send Invite
            </button>
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
              setOpenDetails={setOpenDetails}
              setSelectedData={setSelectedData}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default Settings