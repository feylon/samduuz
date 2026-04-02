export enum Language {
  Uz = 'uz',
  Kr = 'kr',
  Ru = 'ru',
  En = 'en',
}

export const LANGUAGE_SUFFIX: Record<Language, 'Uz' | 'Kr' | 'Ru' | 'En'> = {
  [Language.Uz]: 'Uz',
  [Language.Kr]: 'Kr',
  [Language.Ru]: 'Ru',
  [Language.En]: 'En',
};
