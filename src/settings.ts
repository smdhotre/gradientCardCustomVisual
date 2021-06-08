/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */

"use strict";

import { dataViewObjectsParser } from "powerbi-visuals-utils-dataviewutils";
import DataViewObjectsParser = dataViewObjectsParser.DataViewObjectsParser;

export class DataLabelSettings {
    public displayUnits: number = 0;
    public valueDecimalPlaces: number = 0;
    public textSize: number = 45;
    public fontFamily: string = 'wf_standard-font, helvetica, arial, sans-serif';
}

export class CategoryLabelSettings {
    public show: boolean = true;
    public color: string = '#000';
    public textSize: number = 12;
    public fontFamily: string = 'wf_standard-font, helvetica, arial, sans-serif';
}

export class GradientSettings {
    public offset1: string = '#C41974';
    public offset2: string = '#FF007F';
    public offset3: string = '#FF593D';
}

export class IndecatorSettings {
    public show: boolean = false;
}

export class ColorSelectSettings {
    public fill: string = '#417505';
}

export class VisualSettings extends DataViewObjectsParser {
    public dataLabel: DataLabelSettings = new DataLabelSettings();
    public categoryLabel: CategoryLabelSettings = new CategoryLabelSettings();
    public grad: GradientSettings = new GradientSettings();
    public ind: IndecatorSettings = new IndecatorSettings();
    public colorSelect: ColorSelectSettings = new ColorSelectSettings();
}