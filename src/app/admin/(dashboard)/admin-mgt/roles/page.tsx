'use client';
import React, { useEffect, useState } from 'react';
import api from '@/utils/api';
import toast from 'react-hot-toast';

interface Role {
    _id: string;
    name: string;
    description?: string;
    permissions: string[];
    adminCount?: number;
    createdAt: string;
}

const PERMISSION_GROUPS: Record<string, string[]> = {
    'Users': ['users:view', 'users:create', 'users:edit', 'users:delete'],
    'Estates': ['estates:view', 'estates:create', 'estates:edit', 'estates:delete'],
    'Transactions': ['transactions:view', 'transactions:export'],
    'Wallets': ['wallets:view', 'wallets:credit', 'wallets:debit'],
    'Subscriptions': ['subscriptions:view', 'subscriptions:manage'],
    'Security': ['security:view'],
    'Reports': ['reports:view', 'reports:export'],
    'Support': ['support:view', 'support:respond'],
    'KYC': ['kyc:view', 'kyc:approve', 'kyc:reject'],
    'Admin Mgt': ['admin:view', 'admin:create', 'admin:edit', 'admin:delete'],
    'Activity': ['activity:view'],
};

const ALL_PERMISSIONS = Object.values(PERMISSION_GROUPS).flat();

interface RoleModalProps {
    role?: Role | null;
    onClose: () => void;
    onSave: () => void;
}

function RoleModal({ role, onClose, onSave }: RoleModalProps) {
    const [name, setName] = useState(role?.name || '');
    const [description, setDescription] = useState(role?.description || '');
    const [permissions, setPermissions] = useState<string[]>(role?.permissions || []);
    const [saving, setSaving] = useState(false);

    const togglePermission = (p: string) => {
        setPermissions(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]);
    };

    const toggleGroup = (group: string) => {
        const groupPerms = PERMISSION_GROUPS[group];
        const allSelected = groupPerms.every(p => permissions.includes(p));
        if (allSelected) {
            setPermissions(prev => prev.filter(p => !groupPerms.includes(p)));
        } else {
            setPermissions(prev => [...new Set([...prev, ...groupPerms])]);
        }
    };

    const handleSave = async () => {
        if (!name.trim()) return toast.error('Role name is required');
        setSaving(true);
        try {
            if (role?._id) {
                await api.patch(`/admin/roles/${role._id}`, { name, description, permissions });
                toast.success('Role updated');
            } else {
                await api.post('/admin/roles', { name, description, permissions });
                toast.success('Role created');
            }
            onSave();
            onClose();
        } catch (e: unknown) {
            const err = e as { response?: { data?: { message?: string } } };
            toast.error(err?.response?.data?.message || 'Failed to save role');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className='fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4'>
            <div className='bg-white rounded-[16px] w-full max-w-[600px] max-h-[90vh] flex flex-col shadow-xl'>
                <div className='flex items-center justify-between px-6 py-5 border-b border-[#F0F0F0]'>
                    <h2 className='text-[16px] font-bold text-[#1A1A1A]'>{role ? 'Edit Role' : 'Create Role'}</h2>
                    <button onClick={onClose} className='w-8 h-8 rounded-full hover:bg-[#F5F5F5] flex items-center justify-center'>
                        <svg width='16' height='16' viewBox='0 0 24 24' fill='none'>
                            <path d='M18 6L6 18M6 6l12 12' stroke='#1A1A1A' strokeWidth='1.5' strokeLinecap='round' />
                        </svg>
                    </button>
                </div>

                <div className='overflow-y-auto flex-1 px-6 py-5 space-y-5'>
                    <div>
                        <label className='block text-[12px] font-medium text-[#1A1A1A] mb-1.5'>Role Name</label>
                        <input value={name} onChange={e => setName(e.target.value)}
                            placeholder='e.g. Super Admin'
                            className='w-full h-[44px] border border-[#E8E8E8] rounded-[8px] px-3 text-[13px] outline-none focus:border-[#006AFF]' />
                    </div>
                    <div>
                        <label className='block text-[12px] font-medium text-[#1A1A1A] mb-1.5'>Description <span className='text-[#9E9E9E] font-normal'>(optional)</span></label>
                        <textarea value={description} onChange={e => setDescription(e.target.value)}
                            rows={2} placeholder='Brief description of this role'
                            className='w-full border border-[#E8E8E8] rounded-[8px] px-3 py-2 text-[13px] outline-none focus:border-[#006AFF] resize-none' />
                    </div>

                    <div>
                        <label className='block text-[12px] font-medium text-[#1A1A1A] mb-3'>Permissions</label>
                        <div className='space-y-4'>
                            {Object.entries(PERMISSION_GROUPS).map(([group, perms]) => {
                                const allSelected = perms.every(p => permissions.includes(p));
                                const someSelected = perms.some(p => permissions.includes(p));
                                return (
                                    <div key={group} className='border border-[#F0F0F0] rounded-[10px] overflow-hidden'>
                                        <button onClick={() => toggleGroup(group)}
                                            className='w-full flex items-center justify-between px-4 py-3 bg-[#FAFAFA] hover:bg-[#F5F5F5] transition-colors'>
                                            <span className='text-[13px] font-semibold text-[#1A1A1A]'>{group}</span>
                                            <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${allSelected ? 'border-[#006AFF] bg-[#006AFF]' : someSelected ? 'border-[#006AFF]' : 'border-[#BDBDBD]'}`}>
                                                {allSelected && <svg width='8' height='6' viewBox='0 0 10 8' fill='none'><path d='M1 4l3 3 5-6' stroke='white' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' /></svg>}
                                                {someSelected && !allSelected && <div className='w-2 h-0.5 bg-[#006AFF]' />}
                                            </div>
                                        </button>
                                        <div className='px-4 py-3 grid grid-cols-2 gap-2'>
                                            {perms.map(p => (
                                                <label key={p} className='flex items-center gap-2 cursor-pointer'>
                                                    <div onClick={() => togglePermission(p)}
                                                        className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors cursor-pointer ${permissions.includes(p) ? 'border-[#006AFF] bg-[#006AFF]' : 'border-[#BDBDBD]'}`}>
                                                        {permissions.includes(p) && <svg width='8' height='6' viewBox='0 0 10 8' fill='none'><path d='M1 4l3 3 5-6' stroke='white' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' /></svg>}
                                                    </div>
                                                    <span className='text-[12px] text-[#3A3A3A]'>{p.split(':')[1]?.replace(/_/g, ' ')}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className='px-6 py-4 border-t border-[#F0F0F0] flex gap-3'>
                    <button onClick={onClose} className='flex-1 h-[44px] border border-[#E8E8E8] rounded-[8px] text-[13px] font-medium text-[#1A1A1A] hover:bg-[#F5F5F5]'>
                        Cancel
                    </button>
                    <button onClick={handleSave} disabled={saving}
                        className='flex-1 h-[44px] bg-[#006AFF] text-white rounded-[8px] text-[13px] font-medium hover:bg-[#0055CC] disabled:opacity-60 flex items-center justify-center gap-2'>
                        {saving && <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />}
                        {saving ? 'Saving...' : 'Save Role'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function AdminRolesPage() {
    const [roles, setRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editRole, setEditRole] = useState<Role | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => { fetchRoles(); }, []);

    const fetchRoles = async () => {
        setLoading(true);
        try {
            const res = await api.get('/admin/roles');
            setRoles(res.data?.data?.results || res.data?.data || []);
        } catch {
            // Roles endpoint not yet available - show empty state
            setRoles([]);
        } finally { setLoading(false); }
    };

    const handleDelete = async (id: string) => {
        setDeleting(true);
        try {
            await api.delete(`/admin/roles/${id}`);
            toast.success('Role deleted');
            fetchRoles();
        } catch (e: unknown) {
            const err = e as { response?: { data?: { message?: string } } };
            toast.error(err?.response?.data?.message || 'Failed to delete');
        } finally {
            setDeleting(false);
            setDeleteId(null);
        }
    };

    return (
        <div className='p-8 w-full'>
            <div className='flex items-center justify-between mb-6'>
                <div>
                    <h1 className='text-[22px] font-bold text-[#1A1A1A]'>Roles & Permissions</h1>
                    <p className='text-[13px] text-[#9E9E9E] mt-0.5'>Manage admin roles and their access permissions</p>
                </div>
                <button onClick={() => { setEditRole(null); setShowModal(true); }}
                    className='h-[44px] px-5 bg-[#006AFF] text-white rounded-[8px] text-[13px] font-medium hover:bg-[#0055CC] flex items-center gap-2'>
                    <svg width='14' height='14' viewBox='0 0 24 24' fill='none'>
                        <path d='M12 5v14M5 12h14' stroke='white' strokeWidth='2' strokeLinecap='round' />
                    </svg>
                    Create Role
                </button>
            </div>

            {loading ? (
                <div className='flex justify-center py-16'>
                    <div className='w-6 h-6 border-2 border-[#006AFF] border-t-transparent rounded-full animate-spin' />
                </div>
            ) : roles.length === 0 ? (
                <div className='bg-white rounded-[12px] border border-[#F0F0F0] text-center py-16'>
                    <p className='text-[13px] text-[#9E9E9E]'>No roles created yet</p>
                </div>
            ) : (
                <div className='grid grid-cols-1 gap-4'>
                    {roles.map(role => (
                        <div key={role._id} className='bg-white rounded-[12px] border border-[#F0F0F0] p-5'>
                            <div className='flex items-start justify-between mb-3'>
                                <div>
                                    <h3 className='text-[15px] font-bold text-[#1A1A1A]'>{role.name}</h3>
                                    {role.description && (
                                        <p className='text-[12px] text-[#9E9E9E] mt-0.5'>{role.description}</p>
                                    )}
                                    <p className='text-[11px] text-[#BDBDBD] mt-1'>
                                        {role.adminCount ?? 0} admin{role.adminCount !== 1 ? 's' : ''} · Created {new Date(role.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                    </p>
                                </div>
                                <div className='flex items-center gap-2'>
                                    <button onClick={() => { setEditRole(role); setShowModal(true); }}
                                        className='h-[34px] px-4 border border-[#E8E8E8] rounded-[6px] text-[12px] font-medium text-[#1A1A1A] hover:bg-[#F5F5F5]'>
                                        Edit
                                    </button>
                                    <button onClick={() => setDeleteId(role._id)}
                                        className='h-[34px] px-4 border border-[#FFE0E0] rounded-[6px] text-[12px] font-medium text-[#C62828] hover:bg-[#FFF5F5]'>
                                        Delete
                                    </button>
                                </div>
                            </div>
                            <div className='flex flex-wrap gap-1.5'>
                                {role.permissions.slice(0, 10).map(p => (
                                    <span key={p} className='text-[10px] font-medium text-[#006AFF] bg-[#EEF5FF] px-2 py-0.5 rounded-full'>
                                        {p}
                                    </span>
                                ))}
                                {role.permissions.length > 10 && (
                                    <span className='text-[10px] font-medium text-[#9E9E9E] bg-[#F5F5F5] px-2 py-0.5 rounded-full'>
                                        +{role.permissions.length - 10} more
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showModal && (
                <RoleModal role={editRole} onClose={() => setShowModal(false)} onSave={fetchRoles} />
            )}

            {deleteId && (
                <div className='fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4'>
                    <div className='bg-white rounded-[16px] p-6 w-full max-w-[360px] shadow-xl'>
                        <h3 className='text-[16px] font-bold text-[#1A1A1A] mb-2'>Delete Role</h3>
                        <p className='text-[13px] text-[#9E9E9E] mb-5'>This action cannot be undone. Admins with this role will lose their permissions.</p>
                        <div className='flex gap-3'>
                            <button onClick={() => setDeleteId(null)}
                                className='flex-1 h-[44px] border border-[#E8E8E8] rounded-[8px] text-[13px] font-medium hover:bg-[#F5F5F5]'>
                                Cancel
                            </button>
                            <button onClick={() => handleDelete(deleteId)} disabled={deleting}
                                className='flex-1 h-[44px] bg-[#C62828] text-white rounded-[8px] text-[13px] font-medium hover:bg-[#B71C1C] disabled:opacity-60 flex items-center justify-center gap-2'>
                                {deleting && <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />}
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}