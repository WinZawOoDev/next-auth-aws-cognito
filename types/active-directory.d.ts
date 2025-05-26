type ActiveDirectoryUser = {
    dn: string;
    title: string;
    telephoneNumber: string;
    distinguishedName: string;
    whenCreated: string;
    whenChanged: string;
    displayName: string;
    department: string;
    userAccountControl: string;
    pwdLastSet: string;
    accountExpires: string;
    sAMAccountName: string;
    userPrincipalName: string;
    mail: string;
    operatingSystem: string[];
    operatingSystemVersion: string[];
    ou: string[];
    dNSHostName: string[];
    mobile: string[];
    lastLogonTimestamp: string[]
    memberOf: string[];
}