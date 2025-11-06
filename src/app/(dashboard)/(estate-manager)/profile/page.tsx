"use client";
import React, { Suspense } from "react";
import Widget from "./components/widget";
import WidgetMobile from "./components/widgetMobile";
import { useAbility } from '@/contexts/AbilityContext';
import { useRouter } from 'next/navigation';

const Profile = () => {
  const router = useRouter();
  const ability = useAbility();

  // Redirect if user doesn't have access to profile
  React.useEffect(() => {
    if (!ability.can('read', 'profile')) {
      router.push('/dashboard');
    }
  }, [ability, router]);

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <div className="p-8 w-full">
        <p className="font-[500] text-[20px] text-GrayHomz">Profile</p>
        <div>
          <div className="hidden md:block">
            <Widget />
          </div>
          <div className="md:hidden">
            <WidgetMobile />
          </div>
        </div>
      </div>
    </Suspense>
  );
};

export default Profile;
