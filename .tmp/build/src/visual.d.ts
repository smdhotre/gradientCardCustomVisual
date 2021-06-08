import "core-js/stable";
import powerbi from "powerbi-visuals-api";
import "./../style/visual.less";
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
import EnumerateVisualObjectInstancesOptions = powerbi.EnumerateVisualObjectInstancesOptions;
import VisualObjectInstanceEnumeration = powerbi.VisualObjectInstanceEnumeration;
export declare class Visual implements IVisual {
    private target;
    private updateCount;
    private textNode;
    private settings;
    private dataView;
    private host;
    private svg;
    private container;
    private textValue;
    private textLabel;
    helpLinkElement: Element;
    private visualSettings;
    constructor(options: VisualConstructorOptions);
    enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstanceEnumeration;
    setArrowIndecatorFill: (dataView: any) => string;
    setArrowIndecatorArrow: (dataView: any) => string;
    update(options: VisualUpdateOptions): void;
}
