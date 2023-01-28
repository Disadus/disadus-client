//convert above to a type
export type LMSLinkedUser = SchoologySelf;
export type SchoologySelf = {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  pfp: string;
  type: "schoology";
};
