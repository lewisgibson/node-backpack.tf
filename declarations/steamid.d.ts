declare enum Universe {
    INVALID = 0,
    PUBLIC = 1,
    BETA = 2,
    INTERNAL = 3,
    DEV = 4
}

declare enum Type {
    INVALID = 0,
    INDIVIDUAL = 1,
    MULTISEAT = 2,
    GAMESERVER = 3,
    ANON_GAMESERVER = 4,
    PENDING = 5,
    CONTENT_SERVER = 6,
    CLAN = 7,
    CHAT = 8,
    P2P_SUPER_SEEDER = 9,
    ANON_USER = 10
}

declare enum Instance {
    ALL = 0,
    DESKTOP = 1,
    CONSOLE = 2,
    WEB = 4
}

declare type Parseable = string | number;

declare class SteamID {
    public static readonly AccountIDMask = 0xffffffff;
    public static readonly AccountInstanceMask = 0x000fffff;

    public static fromIndividualAccountID(DesktopID: Parseable): SteamID;

    public universe: Universe;
    public type: Instance;
    public instance: Instance;
    public accountid: number;

    public constructor(AccountInfo?: Parseable);

    public isValid(): boolean;
    public isGroupChat(): boolean;
    public isLobby(): boolean;

    public getSteam2RenderedID(newerFormat?: boolean): string;
    public steam2(newerFormat?: boolean): string;

    public getSteam3RenderedID(): string;
    public steam3(): string;

    public getSteamID64(): string;
}

declare module 'steamid' {
    export = SteamID;
}
