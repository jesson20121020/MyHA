// Customize the more-info-cover dialog by hiding specific elements
// Created on: 04/22/2025
// Last modified:

customElements.whenDefined('more-info-cover').then(() => {
  const MoreInfoCover = customElements.get('more-info-cover');
  const { html, css } = MoreInfoCover.prototype;

  // Define added styles
  const newStyle = css`
    ha-attributes {
      display: none;
    }
    ha-more-info-state-header {
      display: none !important;
    }
  `;
  
  const newStyles = [].concat(MoreInfoCover.styles || [], newStyle);
  Object.defineProperty(MoreInfoCover, 'styles', { value: newStyles, configurable: true, enumerable: true });
  Object.defineProperty(MoreInfoCover, 'elementStyles', { value: newStyles, configurable: true, enumerable: true });

  console.log('more-info-cover styles customized');
});
