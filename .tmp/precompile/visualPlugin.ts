import { Visual } from "../../src/visual";
import powerbiVisualsApi from "powerbi-visuals-api";
import IVisualPlugin = powerbiVisualsApi.visuals.plugins.IVisualPlugin;
import VisualConstructorOptions = powerbiVisualsApi.extensibility.visual.VisualConstructorOptions;
var powerbiKey: any = "powerbi";
var powerbi: any = window[powerbiKey];

var gradientCardVisualF970A66B74994F6AB9F90CDD237FB527_DEBUG: IVisualPlugin = {
    name: 'gradientCardVisualF970A66B74994F6AB9F90CDD237FB527_DEBUG',
    displayName: 'Gradient Card Visual',
    class: 'Visual',
    apiVersion: '3.8.0',
    create: (options: VisualConstructorOptions) => {
        if (Visual) {
            return new Visual(options);
        }

        throw 'Visual instance not found';
    },
    custom: true
};

if (typeof powerbi !== "undefined") {
    powerbi.visuals = powerbi.visuals || {};
    powerbi.visuals.plugins = powerbi.visuals.plugins || {};
    powerbi.visuals.plugins["gradientCardVisualF970A66B74994F6AB9F90CDD237FB527_DEBUG"] = gradientCardVisualF970A66B74994F6AB9F90CDD237FB527_DEBUG;
}

export default gradientCardVisualF970A66B74994F6AB9F90CDD237FB527_DEBUG;