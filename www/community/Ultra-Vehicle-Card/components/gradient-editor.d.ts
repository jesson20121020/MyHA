import { LitElement } from 'lit';
export interface GradientStop {
    id: string;
    position: number;
    color: string;
}
<<<<<<< HEAD
export interface GradientConfig {
    stops: GradientStop[];
    displayMode: 'value_based' | 'full' | 'cropped';
}
export declare function generateGradientString(stops: GradientStop[]): string;
export declare function createLinearGradient(stops: GradientStop[], direction?: string): string;
export declare function getColorAtPosition(stops: GradientStop[], position: number): string;
export declare function createDefaultGradientStops(): GradientStop[];
export declare function createStopAtLargestGap(stops: GradientStop[]): GradientStop | null;
export declare class GradientEditor extends LitElement {
    stops: GradientStop[];
    key: number;
    private _draggedStopId;
    private _dropTargetId;
    private _dropTargetPosition;
    private readonly MAX_STOPS;
    disconnectedCallback(): void;
    updated(changedProperties: any): void;
    private _getStopsSortedByPosition;
    private _generatePreviewGradient;
    private _handleColorChange;
    private _handlePositionInput;
    private _handleDuplicateClick;
    private _handleDeleteClick;
    private _handleDragStart;
    private _handleDragOver;
    private _handleDragLeave;
    private _handleDrop;
    private _handleDragEnd;
    private _clearDropTargetStyles;
    private _cleanupDragState;
    static styles: import("lit").CSSResult;
    render(): import("lit").TemplateResult<1>;
}
export declare class UltraVehicleGradientEditor extends GradientEditor {
=======
export declare function generateGradientString(stops: GradientStop[]): string;
export declare function createDefaultGradientStops(): GradientStop[];
export declare function createLinearGradient(stops: GradientStop[]): string;
export declare function getColorAtPosition(stops: GradientStop[], position: number): string;
export declare function createStopAtLargestGap(stops: GradientStop[]): GradientStop;
export declare function normalizeBoundaryStops(stops: GradientStop[]): GradientStop[];
export declare class GradientEditor extends LitElement {
    stops: GradientStop[];
    barSize: 'thin' | 'regular' | 'thick' | 'thiccc';
    barRadius: 'round' | 'square' | 'rounded-square';
    barStyle: string;
    private _draggedIndex;
    static styles: import("lit").CSSResult;
    render(): import("lit").TemplateResult<1>;
    private _renderStopItem;
    private _addStop;
    private _resetStops;
    private _deleteStop;
    private _handleColorChange;
    private _handlePositionChange;
    private _validateAndSortStops;
    private _notifyChange;
    private _dispatchResetEvent;
    private _handleDragStart;
    private _handleDragEnd;
    private _handleDragOver;
    private _handleDrop;
}
declare global {
    interface HTMLElementTagNameMap {
        'gradient-editor': GradientEditor;
    }
>>>>>>> 4a04363 (新增灯的卡片控制相关)
}
