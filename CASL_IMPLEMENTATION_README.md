# Implementing Role-Based Access Control with CASL in Estate Management App

## Overview
This document outlines the steps to implement role-based access control (RBAC) using CASL (Centralized Access Control Library) in the estate management application. The system will support four roles: Viewer, Admin, Security, and Account Manager, each with specific permissions.

## Roles and Permissions

### Viewer
- Can view all data and settings within the estate
- Cannot edit or change any data

### Admin
- Can view and edit all data within the estate
- Full access to all sections

### Security
- Can only view and edit the access control section
- Can change visitation status (time in & out)

### Account Manager
- Can only view and edit the account section
- Includes residents' management section

## Current App Structure Analysis

### Dashboard Sections
- **Dashboard**: Main overview with access control and resident data
- **Residents**: Manage residents and join requests
- **Access Control**: Manage visitation and access records
- **Settings**: Application settings (to be restricted)
- **Estate Information**: Estate details
- **Add Estate**: Create new estates
- **Profile**: User profile
- **Support**: Support section

### Key Components
- `sidebar.tsx`: Main navigation menu
- `pickEstate.tsx`: Estate selector with role display
- Various page components under each section

## Implementation Steps

### 1. Install CASL Dependencies
```bash
npm install @casl/ability @casl/react
```

### 2. Create Ability Configuration
Create `src/utils/ability.ts`:

```typescript
import { Ability, AbilityBuilder } from '@casl/ability';

export type Actions = 'manage' | 'read' | 'update' | 'create' | 'delete';
export type Subjects = 'dashboard' | 'residents' | 'access-control' | 'settings' | 'estate-info' | 'profile' | 'support' | 'all';

export type AppAbility = Ability<[Actions, Subjects]>;

export function defineAbilityFor(role: string): AppAbility {
  const { can, cannot, build } = new AbilityBuilder<AppAbility>(Ability);

  switch (role?.toLowerCase()) {
    case 'admin':
      can('manage', 'all');
      break;
    case 'viewer':
      can('read', 'all');
      cannot('update', 'all');
      cannot('create', 'all');
      cannot('delete', 'all');
      break;
    case 'security':
      can('read', 'dashboard');
      can('read', 'access-control');
      can('update', 'access-control');
      can('read', 'estate-info');
      break;
    case 'account manager':
      can('read', 'dashboard');
      can('read', 'residents');
      can('update', 'residents');
      can('read', 'estate-info');
      break;
    default:
      // No permissions for unknown roles
      break;
  }

  return build();
}
```

### 3. Create Ability Context Provider
Create `src/contexts/AbilityContext.tsx`:

```typescript
'use client';

import { createContext, useContext, useMemo } from 'react';
import { AppAbility, defineAbilityFor } from '@/utils/ability';
import { useSelectedCommunity } from '@/store/useSelectedCommunity';

const AbilityContext = createContext<AppAbility | null>(null);

export function AbilityProvider({ children }: { children: React.ReactNode }) {
  const selectedCommunity = useSelectedCommunity((state) => state.selectedCommunity);
  const ability = useMemo(() => {
    return defineAbilityFor(selectedCommunity?.role || '');
  }, [selectedCommunity?.role]);

  return (
    <AbilityContext.Provider value={ability}>
      {children}
    </AbilityContext.Provider>
  );
}

export function useAbility() {
  const ability = useContext(AbilityContext);
  if (!ability) {
    throw new Error('useAbility must be used within AbilityProvider');
  }
  return ability;
}
```

### 4. Wrap App with Ability Provider
Update `src/app/layout.tsx` to include the provider:

```typescript
import { AbilityProvider } from '@/contexts/AbilityContext';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AbilityProvider>
          {children}
        </AbilityProvider>
      </body>
    </html>
  );
}
```

### 5. Update Sidebar with Role-Based Filtering
Modify `src/app/(dashboard)/(estate-manager)/components/sidebar.tsx`:

```typescript
import { useAbility } from '@/contexts/AbilityContext';

// Inside the Sidebar component:
const ability = useAbility();

// Filter menu items based on permissions
const filteredData = Data.filter(item => {
  const subject = item.name.toLowerCase().replace(' ', '-') as Subjects;
  return ability.can('read', subject);
});

const filteredMore = More.map(section => ({
  ...section,
  subMenuItems: section.subMenuItems?.filter(subItem => {
    if (subItem.title.toLowerCase() === 'settings') {
      return ability.can('read', 'settings');
    }
    return true; // Always show logout
  })
})).filter(section => 
  section.subMenuItems && section.subMenuItems.length > 0
);

// Use filteredData and filteredMore in the render
```

### 6. Update PickEstate to Show Roles for All Estates
Modify `src/app/(dashboard)/(estate-manager)/components/pickEstate.tsx`:

In the estate list mapping, add role display:

```typescript
{estatesData && estatesData?.filter(/* existing filter */)?.map((item) => (
  <div key={item._id} className='flex items-center justify-between gap-2 py-3'>
    <div className='flex flex-col'>
      <span className='text-sm font-medium text-BlackHpmz'>{item.estate?.basicDetails?.name}</span>
      <span className='text-[11px] font-normal text-GrayHomz'>{item.estate?.buildings?.[0]?.name}, {item.estate?.apartments?.[0]?.name}</span>
      <span className='text-xs font-medium text-BlueHomz capitalize'>{item.role}</span>
    </div>
    {/* existing switch button */}
  </div>
))}
```

### 7. Add Permission Guards to Pages
Create a permission guard component `src/components/PermissionGuard.tsx`:

```typescript
import { useAbility } from '@/contexts/AbilityContext';
import { Actions, Subjects } from '@/utils/ability';

interface PermissionGuardProps {
  action: Actions;
  subject: Subjects;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function PermissionGuard({ 
  action, 
  subject, 
  children, 
  fallback = null 
}: PermissionGuardProps) {
  const ability = useAbility();
  
  if (ability.can(action, subject)) {
    return <>{children}</>;
  }
  
  return <>{fallback}</>;
}
```

### 8. Protect Actions in Components
For example, in access control page, wrap edit buttons:

```typescript
import { PermissionGuard } from '@/components/PermissionGuard';

// In AccessControl component:
<PermissionGuard action="update" subject="access-control">
  <button>Edit Access</button>
</PermissionGuard>
```

### 9. Improve Estate Loading Logic
Update the dashboard layout to ensure role is available before showing content:

Modify `src/app/(dashboard)/(estate-manager)/layout.tsx`:

```typescript
const Layout = ({ children }: { children: React.ReactNode }) => {
  const selectedCommunity = useSelectedCommunity((state) => state.selectedCommunity);
  const { estatesData, estateLoading } = useAuthSlice();

  // Show loading until we have estate data and role
  if (estateLoading || !selectedCommunity?.role) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    // existing layout
  );
};
```

### 10. Update Dashboard Page Logic
Modify `src/app/(dashboard)/(estate-manager)/dashboard/page.tsx` to conditionally show sections:

```typescript
import { useAbility } from '@/contexts/AbilityContext';

const Dashboard = () => {
  const ability = useAbility();

  return (
    <div>
      {/* Always show some basic info */}
      
      {/* Conditionally show access control section */}
      {ability.can('read', 'access-control') && (
        <AccessTable />
      )}
      
      {/* Conditionally show residents section */}
      {ability.can('read', 'residents') && (
        <ResidentsSection />
      )}
    </div>
  );
};
```

## Testing

### Test Cases
1. **Admin User**: Should see all menu items and have full edit permissions
2. **Viewer User**: Should see all menu items but no edit buttons
3. **Security User**: Should only see Dashboard and Access Control menu items
4. **Account Manager**: Should only see Dashboard and Residents menu items
5. **Settings**: Only Admin should see Settings in the More menu

### Manual Testing Steps
1. Create test users with different roles
2. Log in with each role and verify menu visibility
3. Test that restricted actions are properly hidden or disabled
4. Verify that estate switching shows correct role for each estate

## Additional Considerations

### Performance
- Abilities are recalculated only when role changes
- Menu filtering happens on component render

### Security
- All permission checks happen on the client side
- Server-side validation should be implemented for sensitive operations
- API endpoints should validate user permissions

### Future Enhancements
- Add more granular permissions (e.g., specific fields)
- Implement permission caching
- Add audit logging for permission checks

## Troubleshooting

### Common Issues
1. **Menu not updating**: Ensure AbilityProvider wraps the entire app
2. **Permissions not working**: Check role string matching in defineAbilityFor
3. **Estate loading issues**: Verify selectedCommunity has role property

### Debug Tips
- Use React DevTools to inspect AbilityContext
- Console log the current ability rules
- Check selectedCommunity object structure</content>
<parameter name="filePath">CASL_IMPLEMENTATION_README.md