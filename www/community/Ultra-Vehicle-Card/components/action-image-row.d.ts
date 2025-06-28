<<<<<<< HEAD
import { LitElement } from 'lit';
=======
import { LitElement, TemplateResult } from 'lit';
>>>>>>> 4a04363 (新增灯的卡片控制相关)
import { HomeAssistant } from 'custom-card-helpers';
import { ActionImageConfig } from '../types';
export declare class ActionImageRow extends LitElement {
    hass: HomeAssistant;
    config: ActionImageConfig;
    lang: string;
<<<<<<< HEAD
    private expanded;
    private _cropExpanded;
    private _sliderInputValue?;
    protected render(): import("lit").TemplateResult<1>;
=======
    initialExpanded: boolean;
    private expanded;
    private _cropExpanded;
    private _sliderInputValue?;
    private _hasInitialized;
    protected updated(changedProperties: Map<string, any>): void;
    protected render(): TemplateResult<1>;
>>>>>>> 4a04363 (新增灯的卡片控制相关)
    private _renderPreview;
    private _renderImageInput;
    private _toggleExpand;
    private _handleDelete;
    private _handleDuplicate;
<<<<<<< HEAD
    private _handleEntityChange;
    private _handleStateChange;
    private _handleImageTypeChange;
    private _handleImageUrlChange;
    private _handleImageEntityChange;
    private _handleFileUpload;
    private _handleConfigChange;
    private _getImageTypeName;
    private _getFileName;
=======
    private _handleEntityFormChange;
    private _handleStateChange;
    private _handleImageTypeChange;
    private _handleImageUrlChange;
    private _handleImageEntityFormChange;
    private _handleFileUpload;
    private _handleConfigChange;
    private _getImageTypeName;
    private _truncatePath;
>>>>>>> 4a04363 (新增灯的卡片控制相关)
    private _handleDragStart;
    private _handleDragEnd;
    private _renderCropControls;
    private _createDefaultCropSettings;
    private _updateImageCrop;
    private _handleWidthChange;
    private _handleSliderInput;
    private _handleWidthInput;
    private _handleWidthInputChange;
    static styles: import("lit").CSSResult;
}
