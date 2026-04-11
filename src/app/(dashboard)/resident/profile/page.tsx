"use client"

import CustomInput from '@/components/general/customInput'
import React, { useState, useEffect } from 'react'
import ChangePassword from './(changePassword)/changePassword'
import { useAuthSlice } from '@/store/authStore'
import { useResidentStore } from '@/store/useResidentStore'
import { useSelectedEsate } from '@/store/useSelectedEstate'
import { useResidentCommunity } from '@/store/useResidentCommunity'
import api from '@/utils/api'
import toast from 'react-hot-toast'
import DotLoader from '@/components/general/dotLoader'

const Profile = () => {
  const { residentProfile, getResidentProfile, communityProfile, getCommunityManaProfile } = useAuthSlice()
  const { isResident } = useResidentStore()
  const selectedEstate = useSelectedEsate((state) => state.selectedEstate)
  const { residentCommunity } = useResidentCommunity()

  // Use the resident document ID from residentCommunity (not user account ID)
  const activeCommunity = selectedEstate || residentCommunity?.[0]
  const residentId = activeCommunity?.associatedIds?.residentId
  const orgId = activeCommunity?.associatedIds?.organizationId
  const estateId = activeCommunity?.estateId

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
  })

  const [activeTab, setActiveTab] = useState<'personal' | 'password'>('personal')
  const [isSaving, setIsSaving] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // Fetch resident profile on mount
  useEffect(() => {
    if (!isResident || !residentId) return
    getResidentProfile(residentId)
  }, [isResident, residentId, getResidentProfile])

  // Populate form from residentProfile + communityProfile (for phone)
  useEffect(() => {
    if (!residentProfile) return
    setFormData({
      firstName: residentProfile.firstName || '',
      lastName: residentProfile.lastName || '',
      email: residentProfile.email || '',
      // Phone lives on the community manager / user profile, not the resident record
      phoneNumber: communityProfile?.personal?.phoneNumber || '',
    })
  }, [residentProfile, communityProfile])

  const handleSave = async () => {
    if (!residentId || !orgId || !estateId) {
      toast.error('Missing profile information. Please refresh and try again.')
      return
    }

    setIsSaving(true)
    try {
      // Update resident name fields
      await api.patch(
        `/resident/update-profile/organizations/${orgId}/estates/${estateId}/residents/${residentId}`,
        { firstName: formData.firstName, lastName: formData.lastName }
      )

      // Update phone number on the user/CM account if it changed
      const originalPhone = communityProfile?.personal?.phoneNumber || ''
      if (formData.phoneNumber && formData.phoneNumber !== originalPhone) {
        if (communityProfile?._id) {
          await api.patch(`/community-manager/update-profile/${communityProfile._id}`, {
            phoneNumber: formData.phoneNumber,
          })
          await getCommunityManaProfile()
        }
      }

      toast.success('Profile updated successfully!', {
        position: 'top-center',
        duration: 2000,
        style: { background: '#E8F5E9', color: '#2E7D32', fontWeight: 500, padding: '12px 20px', borderRadius: '8px' },
      })
      await getResidentProfile(residentId)
    } catch (error: any) {
      const msg = error?.response?.data?.message || error?.response?.data?.message?.[0] || error?.message || 'Failed to update profile'
      toast.error(msg, { position: 'top-center', duration: 4000 })
    } finally {
      setIsSaving(false)
    }
  }

  const canSave = Boolean(formData.firstName && formData.lastName)

  return (
    <div className='p-8 mb-[150px]'>
      <h1 className='text-[16px] md:text-[20px] text-BlackHomz font-normal md:font-medium'>Profile</h1>

      <div className='mt-4 flex flex-col md:flex-row gap-4'>
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('personal')}
            className={`px-4 py-2 rounded-md ${activeTab === 'personal' ? 'bg-BlueHomz text-white' : 'bg-gray-200 text-gray-600'}`}
          >
            Personal Info
          </button>
          <button
            onClick={() => setActiveTab('password')}
            className={`px-4 py-2 rounded-md ${activeTab === 'password' ? 'bg-BlueHomz text-white' : 'bg-blue-200 text-blue-600'}`}
          >
            Change Password
          </button>
        </div>
        <div className="md:hidden mt-2 mb-4 h-[10px] bg-black w-max rounded-full"></div>
      </div>

      <div className='mt-4'>
        {activeTab === 'personal' && (
          <div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='bg-[#FCFCFC] md:bg-[#F6F6F6] rounded-[12px] p-6 flex flex-col gap-8'>
                <div className='flex flex-col gap-1 w-full text-sm'>
                  <h3 className='mb-1 text-sm font-medium text-GrayHomz'>Email</h3>
                  <span className='h-[45px] rounded-[4px] bg-[#E6E6E6] w-full flex items-center pl-4'>
                    {formData.email || "Auto-filled"}
                  </span>
                </div>
                <div className='flex flex-col md:flex-row items-center gap-4'>
                  <CustomInput
                    borderColor="#A9A9A9"
                    label="First Name"
                    placeholder="e.g Dele"
                    value={formData.firstName}
                    onValueChange={(value) => handleInputChange('firstName', value)}
                    className='h-[45px] pl-4 bg-[#FCFCFC] md:bg-[#F6F6F6]'
                  />
                  <CustomInput
                    borderColor="#A9A9A9"
                    label="Last Name"
                    placeholder="e.g Dayo"
                    value={formData.lastName}
                    onValueChange={(value) => handleInputChange('lastName', value)}
                    className='h-[45px] pl-4 bg-[#FCFCFC] md:bg-[#F6F6F6]'
                  />
                </div>
                <CustomInput
                  borderColor="#A9A9A9"
                  type='number'
                  label="Phone Number"
                  placeholder="[0000 - 000 - 0000]"
                  value={formData.phoneNumber}
                  onValueChange={(value) => handleInputChange('phoneNumber', value)}
                  className='h-[45px] pl-4 bg-[#FCFCFC] md:bg-[#F6F6F6]'
                />
              </div>
            </div>
            <div className='mt-8 flex justify-end'>
              <button
                onClick={handleSave}
                disabled={!canSave || isSaving}
                className={`${!canSave ? "bg-GrayHomz6 text-GrayHomz5 cursor-not-allowed" : "text-white bg-BlueHomz hover:bg-blue-700"} rounded-[4px] md:text-[16px] text-sm font-normal h-[48px] px-6 flex justify-center items-center w-full md:w-auto ${isSaving ? 'pointer-events-none opacity-70' : ''}`}
              >
                {isSaving ? <DotLoader /> : 'Save Update'}
              </button>
            </div>
          </div>
        )}
        {activeTab === 'password' && (
          <div className='mt-4'>
            <ChangePassword />
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile