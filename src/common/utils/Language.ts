export interface LanguageService {
  getLanguage(): string;
}
 
export class NavigatorLanguageService implements LanguageService {
  getLanguage(): string {
    return navigator.language;
  }
}