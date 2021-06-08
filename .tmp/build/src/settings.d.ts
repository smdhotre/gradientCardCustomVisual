import { dataViewObjectsParser } from "powerbi-visuals-utils-dataviewutils";
import DataViewObjectsParser = dataViewObjectsParser.DataViewObjectsParser;
export declare class DataLabelSettings {
    displayUnits: number;
    valueDecimalPlaces: number;
    textSize: number;
    fontFamily: string;
}
export declare class CategoryLabelSettings {
    show: boolean;
    color: string;
    textSize: number;
    fontFamily: string;
}
export declare class GradientSettings {
    offset1: string;
    offset2: string;
    offset3: string;
}
export declare class IndecatorSettings {
    show: boolean;
}
export declare class ColorSelectSettings {
    fill: string;
}
export declare class VisualSettings extends DataViewObjectsParser {
    dataLabel: DataLabelSettings;
    categoryLabel: CategoryLabelSettings;
    grad: GradientSettings;
    ind: IndecatorSettings;
    colorSelect: ColorSelectSettings;
}
