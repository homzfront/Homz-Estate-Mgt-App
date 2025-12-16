import React from 'react'
import Image from 'next/image';
import CustomModal from '@/components/general/customModal';
import DotLoader from '@/components/general/dotLoader';
import { useAbility } from '@/contexts/AbilityContext';

interface UpdateButtonProps {
    updateDone: (e: React.FormEvent) => Promise<void>;
    doneUpdate: boolean;
    setDoneUpdate: React.Dispatch<React.SetStateAction<boolean>>;
    loading: boolean;
    showDialogue: boolean;
    setShowDialogue: React.Dispatch<React.SetStateAction<boolean>>;
}

const UpdateButtonPassword = ({ updateDone, doneUpdate, setDoneUpdate, loading, showDialogue, setShowDialogue }: UpdateButtonProps) => {
    const ability = useAbility();
    const handleUpdate = () => {
        setShowDialogue(!showDialogue)
    }

    const returnHomeTwo = () => {
        setDoneUpdate(false)
        setShowDialogue(false)
    }

    const returnHome = () => {
        setDoneUpdate(false)
        setShowDialogue(false)
    }

    return (
        <div className="">
            <div className="mt-[5%] flex justify-end">
                {(ability.can('update', 'estate-info') &&
                    <button onClick={handleUpdate} className="w-full md:w-auto text-[14px] font-[500] h-[42px] px-4 rounded-md text-white bg-BlueHomz flex justify-center items-center">
                        Save Update
                    </button>
                )}
            </div>
            <CustomModal isOpen={showDialogue} onRequestClose={() => setShowDialogue(false)}>
                {doneUpdate ?
                    (
                        <div>
                            <div className="w-full md:max-w-[464px] m-auto bg-white h-[220px] rounded-md">
                                <div className="md:w-[464px] flex flex-col justify-around p-8 items-center gap-3">
                                    <Image
                                        src={
                                            "/Featured-icon.png"
                                        }
                                        alt=""
                                        height={48}
                                        width={48}
                                    />
                                    <h1 className="text-BlackHomz font-[700] text-[20px]">Update Saved</h1>
                                    {/* <p className="text-[16px] font-[400] text-GrayHomz text-center">{body}</p> */}
                                    <button
                                        onClick={returnHome}
                                        className="h-[48px] rounded-md w-full bg-BlueHomz text-white text-[16px] font-[700]"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    )
                    : (
                        <div>
                            <div className="max-w-[464px] p-2 m-auto bg-white md:h-[245px] rounded-md">
                                <div className="flex flex-col justify-around items-center h-full p-6">
                                    <h1 className="text-BlackHomz font-[500] text-[20px] text-center">
                                        Save Updates
                                    </h1>
                                    <p className="text-[16px] font-[500] text-GrayHomz text-center">
                                        Proceed with saving changes?
                                    </p>
                                    <button
                                        onClick={
                                            updateDone}
                                        className={`mt-4 h-[48px] px-4 rounded-md w-full bg-BlueHomz text-white text-[16px] font-[500] ${loading ? "pointer-events-none w-full flex justify-center items-center" : ""} `}
                                    >
                                        {loading ? <DotLoader /> : "Yes"}
                                    </button>
                                    <button
                                        onClick={
                                            returnHomeTwo
                                        }
                                        disabled={loading}
                                        className={`mt-4 h-[48px] px-4 rounded-md w-full border border-BlueHomz text-BlueHomz text-[16px] font-[500] ${loading ? "pointer-events-none" : ""} `}
                                    >
                                        No, don’t save
                                    </button>
                                </div>
                            </div>
                        </div>
                    )

                }
            </CustomModal>
        </div>
    );
}

export default UpdateButtonPassword