class LanguageHelper {
  static getLanguage(languageSelection) {
    const language = (languageSelection || 'en').toLowerCase();
    switch (language) {
      case 'fr':
        return language;
      case 'en': // in case a user enters a language code that is not supported
      default:
        return 'en';
    }
  }
}

export default LanguageHelper;
