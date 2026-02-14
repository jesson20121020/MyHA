// Customize the more-info-climate dialog by hiding specific elements
// Created on: 04/22/2025
// Last modified:

customElements.whenDefined('more-info-climate').then(() => {
  const MoreInfoClimate = customElements.get('more-info-climate');
  const { html, css } = MoreInfoClimate.prototype;

  // Define added styles to hide label, value, and ha-state-control-climate-temperature
  const newStyle = css`
    div.current {
      display: none !important;
    }
    div.controls {
      display: none !important;
    }      
    ha-state-control-climate-temperature {
      display: none !important;
    }
  `; 
  
  const newStyles = [].concat(MoreInfoClimate.styles || [], newStyle);
  Object.defineProperty(MoreInfoClimate, 'styles', { value: newStyles, configurable: true, enumerable: true });
  Object.defineProperty(MoreInfoClimate, 'elementStyles', { value: newStyles, configurable: true, enumerable: true });

  console.log('more-info-climate styles customized');
});
