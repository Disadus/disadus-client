export type DisadusUser = {
  username: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
  id: string;
  bio: string;
  pfp?: string;
  createdAt: number;
  communities?: string[];
  theme?: number;
  primaryCommunity?: string;
  community?: DisadusUserCommunities;
  premiumUntil?: number;
  openLinkStyle?: number;
  staffLevel?: 1 | 2 | 3 | 4 | 5;
  tester?: boolean;
  devMode?: boolean;
  pluginMode?: boolean;
  tags?: string[];
};
export type DisadusUserCommunities = {
  [communityName: string]: DisadusUserCommunityObject;
};
export type LMSTypes = "schoology";
export type DisadusUserCommunityObject = {
  schoology?: {
    key: string;
    secret: string;
  };
  courses?: {
    [courseId: string]: number;
  };
};

export type CleanedDisadusUserCommunities = {
  [communityName: string]: CleanedDisadusUserCommunityObject;
};
export type CleanedDisadusUserCommunityObject = {
  schoology?: boolean;
  courses?: {
    [courseId: string]: number;
  };
};

export type CleanedPrivateDisadusUser = {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  bio: string;
  pfp: string;
  communities: string[];
  createdAt: number;
  primaryCommunity: string;
  community?: CleanedDisadusUserCommunities;
  isAdmin: boolean;
  theme: number;
  staffLevel: number;
  tester: boolean;
  premiumUntil: number;
  openLinkStyle: number;
  tags?: string[];
};
export type CleanedPublicDisadusUser = {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  bio: string;
  pfp: string;
  premiumUntil: number;
  staffLevel: number;
  tester: boolean;
  tags?: string[];
  theme?: number;
};
export type CleanedDisadusCommunity = {
  name: string;
  description: string;
  image: string;
  id: string;
  members: string[];
  admins: string[];
  creator: string;
  createdAt: number;
  colors: {
    primary: string;
    secondary: string;
  };
  provider: string;
  vanitybg?: string;
  plugins?: string[];
  verified?: boolean;
  schoology?: {
    domain: string;
  };
};

export type LMSUser = {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  bio: string;
  pfp: string;
  type: string;
};
