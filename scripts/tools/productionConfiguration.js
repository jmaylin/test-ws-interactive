/* global applicationConfiguration */
import i18n from './i18n';
import AccountStore from '../stores/AccountStore';


export default class ProductionConfiguration {
  constructor () {
  }

  convertDictionnaryToOptions(dictionnaryKey) {
    var dictionnary = i18n.getDictionnary(dictionnaryKey);
    return Object.keys(dictionnary).map(function(key) {
      return {
        value: key,
        text: dictionnary[key]
      };
    });
  }

  convertTranslationToOptions(_key) {
    var translation = '';
    return applicationConfiguration.submitProduction.radiometricProcessing.map(function(key) {
      translation = i18n.get(_key + '-' + key);
      return {
        value: key,
        text: translation
      };
    });
  }

  getProdPriorityOptions() {
    var autorizedValues = this.convertDictionnaryToOptions('prodPriority');
    if(!AccountStore.priorityRushAvailable()) {
      autorizedValues = autorizedValues.filter(function(option) {
        return option.value !== 'Rush';
      });
    }
    return autorizedValues;
  }

  getProdProcessingLevelOptions() {
    return this.convertDictionnaryToOptions('prodProcessingLevel');
  }

  getProdCompressionImageOptions() {
    return this.convertDictionnaryToOptions('prodCompressionImage');
  }

  getProdImageFormatOptions() {
    return this.convertDictionnaryToOptions('prodImageFormat');
  }

  getProdLicenceOptions() {
    return this.convertDictionnaryToOptions('prodLicence');
  }

  getProdPixelCodingOptions() {
    return this.convertDictionnaryToOptions('prodPixelCoding');
  }

  getProdProductFormatOptions() {
    return this.convertDictionnaryToOptions('prodProductFormat');
  }

  getProdProjectionCodeOptions() {
    return this.convertDictionnaryToOptions('prodProjectionCode');
  }

  getProdSpectralProcessingOptions() {
    return this.convertDictionnaryToOptions('prodSpectralProcessing');
  }

  getProdStereoModeOptions() {
    return this.convertDictionnaryToOptions('prodStereoMode');
  }

  getProdRadiometricAdaptationOptions() {
    return this.convertTranslationToOptions('prodRadiometricAdaptation');
  }

}

