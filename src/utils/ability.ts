import { Ability, AbilityBuilder } from '@casl/ability';

export type Actions = 'manage' | 'read' | 'update' | 'create' | 'delete';
export type Subjects = 'dashboard' | 'residents' | 'access-control' | 'settings' | 'estate-info' | 'profile' | 'support' | 'estate' | 'finance' | 'all';

export type AppAbility = Ability<[Actions, Subjects]>;

export function defineAbilityFor(role: string): AppAbility {
    const { can, cannot, build } = new AbilityBuilder<AppAbility>(Ability);

    switch (role?.toLowerCase()) {
        case 'admin':
            can('manage', 'all');
            can('create', 'residents'); // Admin can create/invite residents
            // Admin should also access settings
            can('read', 'settings');
            break;
        case 'owner':
            can('manage', 'all'); // Owner has full access including settings
            can('update', 'estate-info'); // Explicitly allow update for estate-info
            break;
        case 'viewer':
            can('read', 'all');
            cannot('update', 'all');
            cannot('create', 'all');
            cannot('delete', 'all');
            cannot('read', 'settings');
            break;
        case 'security':
            can('read', 'access-control');
            can('update', 'access-control');
            cannot('read', 'dashboard');
            cannot('read', 'estate-info');
            cannot('read', 'profile');
            cannot('read', 'support');
            cannot('read', 'settings');
            cannot('create', 'access-control'); // Security cannot create access codes
            break;
        case 'account_manager':
            can('read', 'dashboard');
            can('read', 'residents');
            cannot('update', 'residents');
            cannot('create', 'residents');
            can('read', 'finance');
            can('update', 'finance');
            can('create', 'finance');
            can('delete', 'finance');
            can('read', 'estate-info');
            can('read', 'profile');
            can('read', 'support');
            can('read', 'settings');
            break;
        default:
            // No permissions for unknown roles
            break;
    }

    return build();
}