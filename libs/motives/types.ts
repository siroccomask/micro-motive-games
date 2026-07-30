export type Evidence = {
  situation: string;
  reaction: string;
  feelings: string[];
};

export type MicroMotive = {
  id: string;
  title: string;
  statement: string;
  whyItMatters: string;
  boundaryConditions?: string;
  evidence: Evidence[];
  createdAt: string;
  status: "confirmed" | "archived";
  derivedFrom?: string;
};
