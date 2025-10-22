import { Ability, AbilityBuilder } from '@casl/ability';

export type Actions = 'manage' | 'read' | 'update' | 'create' | 'delete';
export type Subjects = 'dashboard' | 'residents' | 'access-control' | 'settings' | 'estate-info' | 'profile' | 'support' | 'estate' | 'all';

export type AppAbility = Ability<[Actions, Subjects]>;

export function defineAbilityFor(role: string): AppAbility {
    const { can, cannot, build } = new AbilityBuilder<AppAbility>(Ability);

    switch (role?.toLowerCase()) {
        case 'admin':
            can('manage', 'all');
            cannot('read', 'settings'); // Admin cannot access settings
            break;
        case 'owner':
            can('manage', 'all'); // Owner has full access including settings
            break;
        case 'viewer':
            can('read', 'all');
            cannot('update', 'all');
            cannot('create', 'all');
            cannot('delete', 'all');
            cannot('read', 'settings'); // Admin cannot access settings
            break;
        case 'security':
            can('read', 'dashboard');
            can('read', 'access-control');
            can('update', 'access-control');
            can('read', 'estate-info');
            can('read', 'profile');
            can('read', 'support');
            cannot('read', 'settings'); // Admin cannot access settings
            break;
        case 'account_manager':
            can('read', 'dashboard');
            can('read', 'residents');
            can('update', 'residents');
            can('read', 'estate-info');
            can('read', 'profile');
            can('read', 'support');
            cannot('read', 'settings'); // Admin cannot access settings
            break;
        default:
            // No permissions for unknown roles
            break;
    }

    return build();
}