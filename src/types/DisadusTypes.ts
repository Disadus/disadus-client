export type Community = {
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
export type User = {
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
export type PublicUser = {
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
export type UserCommunityData = {
  courses: {
    [key: string]: number;
  };
  schoology?: boolean;
};
export type DisadusToast = {
  title: string;
  message: string;
  type: "success" | "error" | "info" | "warning";
  image?: string;
  duration?: number;
};
