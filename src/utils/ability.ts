import { Ability, AbilityBuilder } from '@casl/ability';

export type Actions = 'manage' | 'read' | 'update' | 'create' | 'delete';
export type Subjects = 'dashboard' | 'residents' | 'access-control' | 'settings' | 'estate-info' | 'profile' | 'support' | 'estate' | 'finance' | 'all';

export type AppAbility = Ability<[Actions, Subjects]>;

export function defineAbilityFor(role: string): AppAbility {
    const { can, cannot, build } = new AbilityBuilder<AppAbility>(Ability);

    switch (role?.toLowerCase()) {
        case 'admin':
            can('manage', 'all');
            can('create', 'residents');
            can('read', 'settings');
            break;

        case 'owner':
            can('manage', 'all');
            can('update', 'estate-info');
            break;

        case 'viewer':
            // Read everything + can update their own profile, but nothing else
            can('read', 'all');
            can('update', 'profile');   // Can edit their own profile
            cannot('update', 'estate-info');
            cannot('update', 'residents');
            cannot('update', 'finance');
            cannot('update', 'access-control');
            cannot('create', 'all');
            cannot('delete', 'all');
            cannot('read', 'settings');
            break;

        case 'security':
            // Can access access-control, estate-info (read-only), and own profile
            can('read', 'access-control');
            can('update', 'access-control'); // sign in/out visitors
            can('read', 'estate-info');
            can('read', 'profile');
            can('update', 'profile');   // Can edit their own profile
            cannot('read', 'dashboard');
            cannot('read', 'residents');
            cannot('read', 'finance');
            cannot('read', 'support');
            cannot('read', 'settings');
            cannot('create', 'access-control'); // Cannot create access codes
            break;

        case 'account_manager':
            can('read', 'dashboard');
            can('read', 'residents');
            can('read', 'finance');
            can('update', 'finance');
            can('create', 'finance');
            can('delete', 'finance');
            can('read', 'estate-info');
            can('read', 'profile');
            can('update', 'profile');   // Can edit their own profile
            can('read', 'support');
            can('read', 'access-control');
            cannot('update', 'residents');
            cannot('create', 'residents');
            cannot('delete', 'residents');
            cannot('read', 'settings');
            break;

        default:
            break;
    }

    return build();
}