import { Client } from 'ldapts'

const domainName = process.env.ACTIVE_DIRECTORY_DOMAIN || '';

const client = new Client({
    url: `ldap://${domainName}:389`,
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


export async function getUserInfo(username: string, password: string): Promise<any> {
    try {
        await client.bind(username, password);
        const { searchEntries } = await client.search('dc=winzawoo,dc=site', {
            filter: `(uid=${username})`,
            scope: 'sub',
            attributes: ['dn', 'sn', 'cn', 'mail'],
        });
        return searchEntries;
    } catch (error) {
        console.error('Error fetching user info:', error);
        return null;
    } finally {
        await client.unbind();
    }
}

