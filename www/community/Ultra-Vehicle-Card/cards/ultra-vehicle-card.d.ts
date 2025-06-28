<<<<<<< HEAD
import { LitElement } from 'lit';
=======
import { LitElement, TemplateResult } from 'lit';
>>>>>>> 4a04363 (新增灯的卡片控制相关)
import { HomeAssistant } from 'custom-card-helpers';
import { UltraVehicleCardConfig } from '../types';
declare module 'custom-card-helpers' {
    interface HomeAssistant {
        __uvc_template_strings?: {
            [key: string]: string;
        };
    }
}
export declare class UltraVehicleCard extends LitElement {
    hass: HomeAssistant;
    private config;
    private _templateService?;
    private static readonly DEFAULT_ACTIVE_STATES;
    private static readonly DEFAULT_INACTIVE_STATES;
    private _lastRenderTime;
    private _lastImageUrl;
    private _mapPopupData;
    private _iconActiveStates;
    private _iconsAwaitingConfirmation;
    private _templateSubscriptions;
    private _templateResults;
    private _confirmationCancelListeners;
<<<<<<< HEAD
=======
    private _iconStateDebounceTimers;
    private _highlightedSections;
>>>>>>> 4a04363 (新增灯的卡片控制相关)
    static getConfigElement(): HTMLElement;
    static getStubConfig(): {
        title: string;
        title_alignment: string;
        title_size: number;
        formatted_entities: boolean;
        show_units: boolean;
        vehicle_image_type: string;
        sections_order: string[];
    };
    static get properties(): {
        hass: {};
        config: {};
    };
    static get styles(): import("lit").CSSResult;
    setConfig(config: UltraVehicleCardConfig): void;
    private _migrateBarsToIndividual;
<<<<<<< HEAD
    private _saveConfigChanges;
    private _checkForGradientOrAnimationChanges;
    private _forceFullRender;
    protected render(): import("lit").TemplateResult<1>;
    private _renderImage;
    private _getFriendlyName;
=======
    private _cleanupInfoSections;
    private _saveConfigChanges;
    private _checkForGradientOrAnimationChanges;
    private _forceFullRender;
    protected render(): TemplateResult<1>;
    private _renderImage;
    private _getFriendlyName;
    /**
     * Check if an entity is a location tracking entity with coordinate data
     */
    private _isLocationTrackingEntity;
    /**
     * Render a map view for location tracking entities
     */
    private _renderMapImage;
>>>>>>> 4a04363 (新增灯的卡片控制相关)
    private _formatValue;
    private _handleImageError;
    private _renderBar;
    private _renderPercentageText;
    private _getBarAnimationClass;
    private _getEntityState;
    private _renderIconRows;
    private _renderIconRow;
    private _renderCardIcon;
<<<<<<< HEAD
=======
    private _debouncedIconStateUpdate;
>>>>>>> 4a04363 (新增灯的卡片控制相关)
    private _handleIconClick;
    /**
     * Shows a toast notification
     * @param message The message to display
     * @param type The type of toast (success, error, or info)
     */
    private _showToast;
    /**
     * Opens a location map for the entity
     */
    private _openLocationMap;
    private _handleDragStart;
    private _handleDragEnd;
    private _hexToRgb;
<<<<<<< HEAD
=======
    private _hsToRgb;
    private _colorTempToRgb;
>>>>>>> 4a04363 (新增灯的卡片控制相关)
    private _getZoneInfo;
    private _renderVehicleInfo;
    private _computeImageStyle;
    private _normalizeState;
    private _renderBarLabels;
    /**
     * Process bar template and return the rendered result
     * Similar to how templates are handled for icons
     */
    private _processBarTemplate;
    private _showMoreInfo;
    firstUpdated(): void;
    connectedCallback(): void;
    disconnectedCallback(): void;
    private _handleForceGradientRefresh;
    private _refreshInterval;
    private _setupRefreshInterval;
    private _entityStates;
    private _entityImageUrls;
    protected updated(changedProperties: Map<string, any>): void;
    private _evaluateTemplate;
    private _subscribeToTemplate;
    private _parseTemplateResult;
    private _unsubscribeAllTemplates;
    private _renderMapPopup;
    private _formatCoordinates;
    private _getEntityForCoordinates;
    private _isDarkMode;
    private _closeMapPopup;
    private _shouldRenderSection;
    private _cancelConfirmation;
    private _checkBarSideCondition;
    private _processPercentageTemplate;
<<<<<<< HEAD
=======
    private _renderInfoRowsFromConfig;
    private _renderSingleInfoRow;
    private _renderSingleInfoEntity;
    private _handleInfoEntityClick;
    private _getDisplaySections;
    private _cleanupSectionsOrder;
    private _ensureInfoAndIconRowsInSectionsOrder;
    private _handleHighlightSections;
    private _isHighlighted;
    private _getHighlightClass;
    private _getImageHighlightStyle;
    private _handleClearHighlight;
>>>>>>> 4a04363 (新增灯的卡片控制相关)
}
