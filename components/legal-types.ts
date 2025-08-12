import type { ReactNode } from "react";

export type LegalParagraph = { type: "p"; text: string };
export type LegalList = { type: "ul" | "ol"; items: string[] };
export type LegalCustom = { type: "custom"; render: () => ReactNode };
export type LegalBlock = LegalParagraph | LegalList | LegalCustom;

export type LegalSection = {
  title: string;
  blocks: LegalBlock[];
};

export type LegalDoc = {
  title: string;
  updatedAt: string;
  intro?: LegalBlock[];
  sections: LegalSection[];
};


