/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { useMembersStore, MemberItem } from '@/store/useMembersStore';
import { useSelectedCommunity } from '@/store/useSelectedCommunity';
import toast from 'react-hot-toast';
import DotLoader from '@/components/general/dotLoader';
import LoadingSpinner from '@/components/general/loadingSpinner';
import { useAbility } from '@/contexts/AbilityContext';
import { useRouter } from 'next/navigation';
import HourGlassLoader from '@/components/general/hourGlassLoader';

const Settings = () => {
  const router = useRouter();
  const ability = useAbility();

  // Redirect if user doesn't have access to settings
  React.useEffect(() => {
    if (!ability.can('read', 'settings')) {
      router.push('/dashboard');
    }
  }, [ability, router]);

  const [isOpen, setIsOpen] = React.useState(false);
  const [active, setActive] = React.useState(false);
  const [openSuccess, setOpenSuccess] = React.useState(false);
  const [selectedData, setSelectedData] = React.useState<MemberItem | null>(null);
  const [openDetails, setOpenDetails] = React.useState(false);
  const [activePage, setActivePage] = React.useState(0);
  const [sendingInvite, setSendingInvite] = React.useState(false);
  const [updatingRoleId, setUpdatingRoleId] = React.useState<string | null>(null);
  
  const selectedCommunity = useSelectedCommunity((state) => state.selectedCommunity);
  const { 
    members, 
    initialLoading, 
    pageLoading, 
    fetchMembers, 
    sendInvitation,
    setRoleFilter,
    hasAnyData,
    updateMemberRole
  } = useMembersStore();

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  
  const [formData, setFormData] = React.useState({
    email: '',
    role: '',
  });
  
  const options = [
    { id: 1, label: 'Admin', value: 'admin' },
    { id: 2, label: 'Account Manager', value: 'account_manager' },
    { id: 4, label: 'Security', value: 'security' },
    { id: 5, label: 'Viewer', value: 'viewer' },
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

  // Fetch members on mount or when community changes
  React.useEffect(() => {
    if (selectedCommunity?.estate?._id) {
      fetchMembers({ page: 1, limit: 50 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCommunity?.estate?._id]);

  const handleSendInvite = async () => {
    if (!active) return;
    
    setSendingInvite(true);
    try {
      await sendInvitation(formData.email, formData.role);
      setOpenSuccess(true);
    } catch (error: any) {
      toast.error(error.message || "Failed to send invitation", {
        position: "top-center",
        duration: 3000,
        style: {
          background: "#FFEBEE",
          color: "#C62828",
          fontWeight: 500,
          padding: "12px 20px",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        },
      });
    } finally {
      setSendingInvite(false);
    }
  };
  
  const handleSubmit = () => {
    setOpenSuccess(false);
    setIsOpen(false);
    setActive(false);
    setFormData({ email: '', role: '' });
  };
  
  const handleRoleChange = async (member: MemberItem, selectedOption: { id: number | string; label: string }) => {
    const roleOption = options.find(opt => opt.label === selectedOption.label);
    const roleValue = roleOption?.value || selectedOption.label;

    setUpdatingRoleId(member._id);
    try {
      await updateMemberRole(member._id, roleValue, member.email);
      toast.success("Role updated successfully!", {
        position: "top-center",
        duration: 2000,
        style: {
          background: "#E8F5E9",
          color: "#2E7D32",
          fontWeight: 500,
          padding: "12px 20px",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        },
      });
      // Fetch members for the current role filter after update
      const currentRole = pages[activePage].value;
      fetchMembers({ page: 1, role: currentRole });
    } catch (error: any) {
      toast.error(error.message || "Failed to update role", {
        position: "top-center",
        duration: 2000,
        style: {
          background: "#FFEBEE",
          color: "#C62828",
          fontWeight: 500,
          padding: "12px 20px",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        },
      });
    } finally {
      setUpdatingRoleId(null);
    }
  };
  
  const pages = [
    { label: "All", value: null },
    { label: "Admin", value: "admin" },
    { label: "Account Manager", value: "account_manager" },
    { label: "Security", value: "security" },
    { label: "Viewer", value: "viewer" },
  ];

  const handlePageChange = (index: number) => {
    setActivePage(index);
    const role = pages[index].value;
    setRoleFilter(role);
    fetchMembers({ page: 1, role });
  };

  // Filter members based on active page (client-side for backup)
  const filteredMembers = React.useMemo(() => {
    if (activePage === 0 || !pages[activePage].value) return members; // All
    const selectedRole = pages[activePage].value;
    return members.filter(member => member.role === selectedRole);
  }, [members, activePage, pages]);

  // Helper function to get display label for role
  const getRoleLabel = (roleValue: string) => {
    const roleOption = options.find(opt => opt.value === roleValue);
    return roleOption ? roleOption.label : roleValue;
  };

  return (
    <div className='py-8'>
      {openSuccess &&
        <SuccessModal
          title='Invitation Sent Successfully'
          successText={`Your invite link has successfully been sent to ${formData.email}`}
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
                <h3 className='w-[150px] flex items-start'>{selectedData?.firstName || 'N/A'}</h3>
              </div>
              <div className='flex flex-row gap-8 items-center'>
                <h3 className='w-[80px]'>Last Name</h3>
                <h3 className='w-[150px] flex items-start'>{selectedData?.lastName || 'N/A'}</h3>
              </div>
              <div className="flex flex-row gap-8 items-start flex-wrap">
                <h3 className="w-[80px]">Email</h3>
                <h3 className="break-all w-[150px]">{selectedData?.email}</h3>
              </div>

              <div className='flex flex-row gap-8 items-center'>
                <h3 className='w-[80px]'>Role</h3>
                <div className='w-[150px]'>
                  {updatingRoleId === selectedData?._id ? (
                    <div className="flex justify-center items-center">
                      <HourGlassLoader />
                    </div>
                  ) : (
                    <Dropdown
                      options={options}
                      onSelect={(option) => selectedData && handleRoleChange(selectedData, option)}
                      selectOption={getRoleLabel(selectedData?.role || '')}
                      showSearch={false}
                      borderColor="border-[#A9A9A9]"
                      arrowColor="#A9A9A9"
                      bgColor="bg-transparent"
                    />
                  )}
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
      <p className='px-8 mt-7 text-sm md:text-[16px] font-normal text-GrayHomz'>Invite and assign roles to trusted users to help manage communities, Residents, bills, and visitor access</p>
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
                  onSelect={(option) => {
                    const selectedOption = options.find(opt => opt.label === option.label);
                    handleInputChange('role', selectedOption?.value || option.label);
                  }}
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
              onClick={handleSendInvite}
              disabled={!active || sendingInvite}
              className={`mt-4 w-full md:w-auto h-[45px] flex justify-center items-center ${active ? "bg-BlueHomz text-white" : "bg-GrayHomz6 text-GrayHomz5"}  text-sm md:text-[16px] font-normal rounded-[4px] px-6 py-2 ${sendingInvite ? "pointer-events-none" : ""}`}
            >
              {sendingInvite ? <DotLoader /> : "Send Invite"}
            </button>
          }
        </div>
        
        {/* Members List */}
        {initialLoading ? (
          <div className='mt-8 h-[400px] w-full flex items-center justify-center'>
            <LoadingSpinner />
          </div>
        ) : hasAnyData || members.length > 0 ? (
          <div className='mt-8 border-t py-4 md:py-0 md:p-4 border-GrayHomz6 text-sm font-normal md:font-medium'>
            <div className='flex flex-wrap items-center gap-4 mt-8'>
              {pages.map((page, index) => (
                <span 
                  key={index} 
                  onClick={() => handlePageChange(index)} 
                  className={`${index === activePage ? "px-3 py-2 rounded-[4px] bg-BlueHomz text-white" : "px-3 py-2 md:px-0 md:py-0 rounded-[4px] md:rounded-none bg-whiteblue md:bg-transparent text-BlueHomz md:text-GrayHomz"} cursor-pointer`}
                >
                  {page.label}
                </span>
              ))}
            </div>

            {pageLoading ? (
              <div className='mt-8 h-[300px] w-full flex items-center justify-center'>
                <LoadingSpinner />
              </div>
            ) : filteredMembers.length > 0 ? (
              <Table
                currentData={filteredMembers}
                setOpenDetails={setOpenDetails}
                setSelectedData={setSelectedData}
                onRoleChange={handleRoleChange}
                updatingRoleId={updatingRoleId}
              />
            ) : (
              <div className='mt-8 h-[300px] w-full flex items-center justify-center'>
                <p className='text-GrayHomz text-sm'>No members found for this role</p>
              </div>
            )}
          </div>
        ) : (
         null
        )}
      </div>
    </div>
  )
}

export default Settings