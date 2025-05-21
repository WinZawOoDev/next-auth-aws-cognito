import { Client, Entry } from 'ldapts'

const domainName = process.env.ACTIVE_DIRECTORY_DOMAIN || '';
const url = `ldap://${domainName}:389`;

const client = new Client({
    url,
    timeout: 0,
    connectTimeout: 0,
});

export async function authenticate(username: string, password: string): Promise<boolean> {
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


export async function getUserInfo(username: string, password: string): Promise<Entry[] | null> {
    try {

        await client.bind(username, password);

        const { searchEntries, searchReferences } = await client.search('dc=winzawoo,dc=site', {
            filter: `(userPrincipalName=${username})`,
            scope: 'sub',
            attributes: [
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
            ],
        });
        return searchEntries;
    } catch (error) {
        console.error('Error fetching user info:', error);
        return null;
    } finally {
        await client.unbind();
    }
}

function formatTime(ldapTime: string): string {
    const cleaned = ldapTime.replace(/\.\d+Z$/, "Z");
    const date = new Date(cleaned);
    const readable = date.toLocaleString();
    return readable;
}

