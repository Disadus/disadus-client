export declare type Community = {
    name: string;
    description: string;
    image: string;
    id: string;
    members: string[];
    admins: PublicUser[] | string[];
    memberIDs: string[];
    adminIDs: string[];
    creator: string;
    createdAt: string;
    colors: {
        primary: string;
        secondary: string;
    };
    provider: "schoology";
    vanitybg?: string;
    verified?: boolean;
};
export declare type User = {
    username: string;
    email: string;
    id: string;
    firstName: string;
    lastName: string;
    bio: string;
    pfp: string;
    createdAt: number;
    communities?: string[];
    communityObjects?: Community[];
    primaryCommunity?: string;
    theme?: number;
    openLinkStyle?: number;
    premiumUntil?: number;
    staffLevel?: number;
    tester?: boolean;
};
export declare type PublicUser = {
    id: string;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    bio: string;
    pfp: string;
    premiumUntil: number;
    staffLevel?: number;
    tester?: boolean;
};
export declare type UserCommunityData = {
    courses: {
        [key: string]: number;
    };
    schoology?: boolean;
};
export declare type DisadusToast = {
    title: string;
    message: string;
    type: "success" | "error" | "info" | "warning";
    image?: string;
    duration?: number;
};
//# sourceMappingURL=DisadusTypes.d.ts.map