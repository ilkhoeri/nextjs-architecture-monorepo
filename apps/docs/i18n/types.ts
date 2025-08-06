import { mockLocales } from "./config";
import { dictionaries } from "./intl";
// import messages from "./dictionaries/en.json" with { type: "json" };

type DictionariesType = typeof dictionaries;
type DictionaryKeys = keyof DictionariesType;
export type Dictionaries = Awaited<ReturnType<DictionariesType[DictionaryKeys]>>;
// export type Dictionaries = typeof messages;
export type Locale = (typeof mockLocales)[number]["code"];
// export type Locale = DictionaryKeys;

export interface i18nLocale {
  /** dictionaries */
  dict?: Dictionaries;
  lang?: Locale;
}
