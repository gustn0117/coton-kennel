"use client";

import { createContext, ReactNode, useContext } from "react";
import type { Lang } from "./i18n";

const LangContext = createContext<Lang>("ko");

export function LangProvider({
  lang,
  children,
}: {
  lang: Lang;
  children: ReactNode;
}) {
  return <LangContext.Provider value={lang}>{children}</LangContext.Provider>;
}

export function useLang(): Lang {
  return useContext(LangContext);
}

export function setLangCookie(lang: Lang) {
  document.cookie = `lang=${lang};path=/;max-age=${365 * 24 * 60 * 60}`;
}
