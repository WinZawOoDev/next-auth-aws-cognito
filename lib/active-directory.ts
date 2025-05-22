import { Client, Entry } from 'ldapts'

type UserCredential = {
    username: string;
    password: string;
}

const domainName = process.env.ACTIVE_DIRECTORY_DOMAIN || '';
const url = `ldap://${domainName}:389`;
const searchDN = 'dc=kbz,dc=bank';

const client = new Client({
    url,
    timeout: 0,
    connectTimeout: 0,
});

const attributes: string[] = [
    'userPrincipalName',
    'sAMAccountName',
    'operatingSystem',
    'operatingSystemVersion',
    'ou',
    'displayName',
    'mail',
    'telephoneNumber',
    'dNSHostName',
    'mobile',
    'department',
    'title',
    'distinguishedName',
    'whenCreated',
    'whenChanged',
    'lastLogonTimestamp',
    'pwdLastSet',
    'accountExpires',
    'userAccountControl',
    'memberOf',
    'mail'
];

export async function authenticate({ username, password }: UserCredential): Promise<boolean> {
    let isAuthenticated = false;
    try {
        await client.bind(username, password);
        isAuthenticated = true;
    } catch (error) {
        console.error('Authentication failed:', error);
        isAuthenticated = false;
    } finally {
        await client.unbind();
    }
    return isAuthenticated;
}

export async function getUserInfo({ username, password }: UserCredential): Promise<Entry[] | null> {
    const fetchUser = await fetchAD({ username, password, filterBy: `(userPrincipalName=${username})` });
    return fetchUser;
}

export async function getAllUsers({ username, password }: UserCredential): Promise<Entry[] | null> {
    const fetchUsers = await fetchAD({ username, password, filterBy: '(&(objectClass=user)(sAMAccountName=*))' });
    return fetchUsers;
}

async function fetchAD({ username, password, filterBy }: UserCredential & { filterBy: string }) {
    try {
        await client.bind(username, password);
        const { searchEntries } = await client.search(searchDN, {
            filter: filterBy,
            scope: 'sub',
            attributes,
        });
        return searchEntries;
    } catch (error) {
        console.error('Error fetching user info:', error);
        return null;
    } finally {
        await client.unbind();
    }
}
