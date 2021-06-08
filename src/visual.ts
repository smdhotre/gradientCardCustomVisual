/*
*  Power BI Visual CLI
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

import "core-js/stable";
// import IVisualHost = powerbi.extensibility.IVisualHost;
import * as d3 from "d3";
import powerbi from "powerbi-visuals-api";
import { textMeasurementService, valueFormatter } from "powerbi-visuals-utils-formattingutils";
import "./../style/visual.less";
import { VisualSettings } from "./settings";
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
import EnumerateVisualObjectInstancesOptions = powerbi.EnumerateVisualObjectInstancesOptions;
import VisualObjectInstance = powerbi.VisualObjectInstance;
import DataView = powerbi.DataView;
import VisualObjectInstanceEnumerationObject = powerbi.VisualObjectInstanceEnumerationObject;
import IVisualHost = powerbi.extensibility.visual.IVisualHost;
import VisualObjectInstanceEnumeration = powerbi.VisualObjectInstanceEnumeration;
import DataViewMetadataColumn = powerbi.DataViewMetadataColumn;
import powerbiVisualsApi from "powerbi-visuals-api";
import VisualEnumerationInstanceKinds = powerbiVisualsApi.VisualEnumerationInstanceKinds;

type Selection<T extends d3.BaseType> = d3.Selection<T, any, any, any>;

// import { VisualSettings } from "./settings";
export class Visual implements IVisual {
  private target: HTMLElement;
  private updateCount: number;
  // private settings: VisualSettings;
  private textNode: Text;

  private settings: VisualSettings;
  private dataView: DataView;
  private host: IVisualHost;
  private svg: Selection<SVGElement>;
  private container: Selection<SVGElement>;
  private textValue: Selection<SVGElement>;
  private textLabel: Selection<SVGElement>;
  helpLinkElement: Element;

  private visualSettings: VisualSettings;

  constructor(options: VisualConstructorOptions) {
    console.log('Visual constructor', options);
    this.host = options.host;

    this.svg = d3.select(options.element)
      .append('svg')
      .classed('circleCard', true);
    const defs = this.svg.append('defs');
    const bgGradient = defs
      .append('linearGradient')
      .attr('id', 'bg-gradient');
    // .attr('gradientTransform', 'rotate(90)');
    bgGradient
      .append('stop')
      .attr('stop-color', '#C41974')
      .attr('offset', '0');
    bgGradient
      .append('stop')
      .attr('stop-color', '#FF007F')
      .attr('offset', '0.5');
    bgGradient
      .append('stop')
      .attr('stop-color', '#FF593D')
      .attr('offset', '1');
    this.container = this.svg.append("g")
      .classed('container', true);
    this.textValue = this.container.append("text")
      .classed("textValue", true);
    this.textLabel = this.container.append("text")
      .classed("textLabel", true);
    this.host = options.host;

    // this.helpLinkElement = this.createHelpLinkElement();
    // options.element.appendChild(this.helpLinkElement);
    // this.target = options.element;
    // this.updateCount = 0;
    // if (document) {
    //     const new_p: HTMLElement = document.createElement("p");
    //     new_p.appendChild(document.createTextNode("Update count:"));
    //     const new_em: HTMLElement = document.createElement("em");
    //     this.textNode = document.createTextNode(this.updateCount.toString());
    //     new_em.appendChild(this.textNode);
    //     new_p.appendChild(new_em);
    //     this.target.appendChild(new_p);
    // }
  }

  public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstanceEnumeration {
    let objectName = options.objectName;
    let objectEnumeration: VisualObjectInstance[] = [];

    var metadataColumns: DataViewMetadataColumn[] = this.dataView.metadata.columns;

    switch (objectName) {
      case 'colorSelect':
        var col = (metadataColumns[0].objects &&
          metadataColumns[0].objects.colorSelect &&
          metadataColumns[0].objects.colorSelect.fill &&
          metadataColumns[0].objects.colorSelect.fill['solid'] &&
          metadataColumns[0].objects.colorSelect.fill['solid'].color) || '#417505';
        objectEnumeration.push({
          objectName: objectName,
          displayName: 'Color',
          properties: {
            fill: {
              solid: {
                color: col
              }
            }
          },
          selector: {
            metadata: metadataColumns[0].queryName
          },
          // altConstantValueSelector: barDataPoint.selectionId.getSelector(),
          // List your conditional formatting properties
          propertyInstanceKind: {
            fill: VisualEnumerationInstanceKinds.ConstantOrRule
          }
        });
        break;
    }

    if (objectName === 'colorSelect')
      return objectEnumeration;
    else
      return VisualSettings.enumerateObjectInstances(this.settings || VisualSettings.getDefault(), options);
  }

  setArrowIndecatorFill = (dataView) => {
    var indColor = '#417505';
    if (
      dataView &&
      dataView.metadata &&
      dataView.metadata.objectRules &&
      dataView.metadata.objectRules.colorSelect &&
      dataView.metadata.objectRules.colorSelect.fill &&
      dataView.metadata.objectRules.colorSelect.fill.options &&
      dataView.metadata.objectRules.colorSelect.fill.options.linearGradient2
    ) {
      var min = (
        dataView.metadata.objectRules.colorSelect.fill.options.linearGradient2 &&
        dataView.metadata.objectRules.colorSelect.fill.options.linearGradient2.min &&
        dataView.metadata.objectRules.colorSelect.fill.options.linearGradient2.min.value
      ) || 0;
      var max = (
        dataView.metadata.objectRules.colorSelect.fill.options.linearGradient2 &&
        dataView.metadata.objectRules.colorSelect.fill.options.linearGradient2.max &&
        dataView.metadata.objectRules.colorSelect.fill.options.linearGradient2.max.value
      ) || 0;
      var val = (
        dataView.metadata &&
        dataView.metadata.columns &&
        dataView.metadata.columns.filter(c => Object.keys(c.roles).length <= 0) &&
        dataView.metadata.columns.filter(c => Object.keys(c.roles).length <= 0)[0] &&
        dataView.metadata.columns.filter(c => Object.keys(c.roles).length <= 0)[0].aggregates &&
        dataView.metadata.columns.filter(c => Object.keys(c.roles).length <= 0)[0].aggregates.single
      )
      var avg = (min + max) / 2;
      if (avg < val) {
        indColor = (
          dataView.metadata.objectRules.colorSelect.fill.options.linearGradient2.max &&
          dataView.metadata.objectRules.colorSelect.fill.options.linearGradient2.max.color
        )
      } else if (avg > val) {
        indColor = (
          dataView.metadata.objectRules.colorSelect.fill.options.linearGradient2.min &&
          dataView.metadata.objectRules.colorSelect.fill.options.linearGradient2.min.color
        )
      }
    } else if (
      dataView &&
      dataView.metadata &&
      dataView.metadata.objectRules &&
      dataView.metadata.objectRules.colorSelect &&
      dataView.metadata.objectRules.colorSelect.fill &&
      dataView.metadata.objectRules.colorSelect.fill.options &&
      dataView.metadata.objectRules.colorSelect.fill.options.linearGradient3
    ) {
      var min = (
        dataView.metadata.objectRules.colorSelect.fill.options.linearGradient3 &&
        dataView.metadata.objectRules.colorSelect.fill.options.linearGradient3.min &&
        dataView.metadata.objectRules.colorSelect.fill.options.linearGradient3.min.value
      ) || 0;
      var mid = (
        dataView.metadata.objectRules.colorSelect.fill.options.linearGradient3 &&
        dataView.metadata.objectRules.colorSelect.fill.options.linearGradient3.mid &&
        dataView.metadata.objectRules.colorSelect.fill.options.linearGradient3.mid.value
      ) || 0;
      var max = (
        dataView.metadata.objectRules.colorSelect.fill.options.linearGradient3 &&
        dataView.metadata.objectRules.colorSelect.fill.options.linearGradient3.max &&
        dataView.metadata.objectRules.colorSelect.fill.options.linearGradient3.max.value
      ) || 0;
      var val = (
        dataView.metadata &&
        dataView.metadata.columns &&
        dataView.metadata.columns.filter(c => Object.keys(c.roles).length <= 0) &&
        dataView.metadata.columns.filter(c => Object.keys(c.roles).length <= 0)[0] &&
        dataView.metadata.columns.filter(c => Object.keys(c.roles).length <= 0)[0].aggregates &&
        dataView.metadata.columns.filter(c => Object.keys(c.roles).length <= 0)[0].aggregates.single
      )
      var avg1 = (min + mid) / 2;
      var avg2 = (mid + max) / 2;
      if (val <= avg1) {
        indColor = (
          dataView.metadata.objectRules.colorSelect.fill.options.linearGradient3.min &&
          dataView.metadata.objectRules.colorSelect.fill.options.linearGradient3.min.color
        )
      } else if (val > avg1 && val < avg2) {
        indColor = (
          dataView.metadata.objectRules.colorSelect.fill.options.linearGradient3.mid &&
          dataView.metadata.objectRules.colorSelect.fill.options.linearGradient3.mid.color
        )
      } else if (val >= avg2) {
        indColor = (
          dataView.metadata.objectRules.colorSelect.fill.options.linearGradient3.max &&
          dataView.metadata.objectRules.colorSelect.fill.options.linearGradient3.max.color
        )
      }
    } else {
      if (
        dataView &&
        dataView.single &&
        dataView.single['column'] &&
        dataView.single['column'].objects &&
        dataView.single['column'].objects.colorSelect
      ) {
        indColor = (
          dataView.single['column'].objects &&
          dataView.single['column'].objects.colorSelect &&
          dataView.single['column'].objects.colorSelect.fill &&
          dataView.single['column'].objects.colorSelect.fill.solid &&
          dataView.single['column'].objects.colorSelect.fill.solid.color
        );
      } else if (
        this.visualSettings &&
        this.visualSettings.colorSelect &&
        this.visualSettings.colorSelect.fill
      ) {
        indColor = (
          this.visualSettings &&
          this.visualSettings.colorSelect &&
          this.visualSettings.colorSelect.fill
        )
      }
    }
    return indColor;//#417505 green //#EB5757 red
  }

  setArrowIndecatorArrow = (dataView) => {
    var indArrow = '';
    if (
      dataView &&
      dataView.metadata &&
      dataView.metadata.objectRules &&
      dataView.metadata.objectRules.colorSelect &&
      dataView.metadata.objectRules.colorSelect.fill &&
      dataView.metadata.objectRules.colorSelect.fill.options &&
      dataView.metadata.objectRules.colorSelect.fill.options.linearGradient2
    ) {
      var min = (
        dataView.metadata.objectRules.colorSelect.fill.options.linearGradient2 &&
        dataView.metadata.objectRules.colorSelect.fill.options.linearGradient2.min &&
        dataView.metadata.objectRules.colorSelect.fill.options.linearGradient2.min.value
      ) || 0;
      var max = (
        dataView.metadata.objectRules.colorSelect.fill.options.linearGradient2 &&
        dataView.metadata.objectRules.colorSelect.fill.options.linearGradient2.max &&
        dataView.metadata.objectRules.colorSelect.fill.options.linearGradient2.max.value
      ) || 0;
      var val = (
        dataView.metadata &&
        dataView.metadata.columns &&
        dataView.metadata.columns.filter(c => Object.keys(c.roles).length <= 0) &&
        dataView.metadata.columns.filter(c => Object.keys(c.roles).length <= 0)[0] &&
        dataView.metadata.columns.filter(c => Object.keys(c.roles).length <= 0)[0].aggregates &&
        dataView.metadata.columns.filter(c => Object.keys(c.roles).length <= 0)[0].aggregates.single
      )
      var avg = (min + max) / 2;
      if (avg < val) {
        indArrow = '🡩';
      } else if (avg > val) {
        indArrow = '🡫';
      }
    } else if (
      dataView &&
      dataView.metadata &&
      dataView.metadata.objectRules &&
      dataView.metadata.objectRules.colorSelect &&
      dataView.metadata.objectRules.colorSelect.fill &&
      dataView.metadata.objectRules.colorSelect.fill.options &&
      dataView.metadata.objectRules.colorSelect.fill.options.linearGradient3
    ) {
      var min = (
        dataView.metadata.objectRules.colorSelect.fill.options.linearGradient3 &&
        dataView.metadata.objectRules.colorSelect.fill.options.linearGradient3.min &&
        dataView.metadata.objectRules.colorSelect.fill.options.linearGradient3.min.value
      ) || 0;
      var mid = (
        dataView.metadata.objectRules.colorSelect.fill.options.linearGradient3 &&
        dataView.metadata.objectRules.colorSelect.fill.options.linearGradient3.mid &&
        dataView.metadata.objectRules.colorSelect.fill.options.linearGradient3.mid.value
      ) || 0;
      var max = (
        dataView.metadata.objectRules.colorSelect.fill.options.linearGradient3 &&
        dataView.metadata.objectRules.colorSelect.fill.options.linearGradient3.max &&
        dataView.metadata.objectRules.colorSelect.fill.options.linearGradient3.max.value
      ) || 0;
      var val = (
        dataView.metadata &&
        dataView.metadata.columns &&
        dataView.metadata.columns.filter(c => Object.keys(c.roles).length <= 0) &&
        dataView.metadata.columns.filter(c => Object.keys(c.roles).length <= 0)[0] &&
        dataView.metadata.columns.filter(c => Object.keys(c.roles).length <= 0)[0].aggregates &&
        dataView.metadata.columns.filter(c => Object.keys(c.roles).length <= 0)[0].aggregates.single
      )
      var avg1 = (min + mid) / 2;
      var avg2 = (mid + max) / 2;
      if (val <= avg1) {
        indArrow = '🡫';
      } else if (val > avg1 && val < avg2) {
        indArrow = '🡩';
      } else if (val >= avg2) {
        indArrow = '🡩';
      }
    } else {
      if (
        dataView &&
        dataView.single &&
        dataView.single['column'] &&
        dataView.single['column'].objects &&
        dataView.single['column'].objects.colorSelect
      ) {
        indArrow = '🡩';
        this.host.displayWarningIcon('Showing Default Icon', `Please use Color Scale in format pane > Arrow Color Select > Color > fx`);
      } else if (
        this.visualSettings &&
        this.visualSettings.colorSelect &&
        this.visualSettings.colorSelect.fill
      ) {
        this.host.displayWarningIcon('Showing Default Icon', 'Please use Color Scale in format pane > Arrow Color Select > Color > fx');
        indArrow = '🡩';
      }
    }
    return indArrow;//#417505 green //#EB5757 red
  }

  public update(options: VisualUpdateOptions) {
    // this.settings = Visual.parseSettings(options && options.dataViews && options.dataViews[0]);
    // console.log('Visual update', options);
    // if (this.textNode) {
    //     this.textNode.textContent = (this.updateCount++).toString();
    // }

    let dataView: DataView = options.dataViews[0];
    this.dataView = dataView;
    this.settings = VisualSettings.parse(dataView) as VisualSettings;

    let width: number = options.viewport.width;
    let height: number = options.viewport.height;
    this.svg.attr("width", width);
    this.svg.attr("height", height);
    let radius: number = Math.min(width, height) / 2.2;

    this.visualSettings = VisualSettings.parse<VisualSettings>(dataView);

    let iValueFormatter = valueFormatter.create({
      value: this.visualSettings.dataLabel.displayUnits,
      precision: this.visualSettings.dataLabel.valueDecimalPlaces,
      format: dataView.single['column'].format
    });

    const bgGradient = this.svg.select('#bg-gradient')
    if (bgGradient) {
      bgGradient.selectAll('stop').remove();
      bgGradient
        .append('stop')
        .attr('stop-color', this.visualSettings.grad.offset1)
        .attr('offset', '0');
      bgGradient
        .append('stop')
        .attr('stop-color', this.visualSettings.grad.offset2)
        .attr('offset', '0.5');
      bgGradient
        .append('stop')
        .attr('stop-color', this.visualSettings.grad.offset3)
        .attr('offset', '1');
    }

    let textProperties = {
      text: <string>iValueFormatter.format(dataView.single.value),
      fontFamily: this.visualSettings.dataLabel.fontFamily,
      fontSize: "" + this.visualSettings.dataLabel.textSize + "px"
    };

    let fontSizeValue: number = this.visualSettings.dataLabel.textSize;
    this.textValue
      .text(
        textMeasurementService.getTailoredTextOrDefault(textProperties, width - this.visualSettings.dataLabel.textSize)
      )
      .attr("x", "50%")
      .attr("y", "50%")
      .attr("dy", "0.35em")
      .style("fill", "url(#bg-gradient)")
      .attr("text-anchor", "middle")
      .style("font-size", fontSizeValue + "px")
      .style('font-family', this.visualSettings.dataLabel.fontFamily)
      .append('tspan')
      .attr('fill', () => this.setArrowIndecatorFill(dataView))
      .attr('font-size', (fontSizeValue - 10) + "px")
      .attr("dy", '-0.6em')
      .text(() => this.visualSettings.ind.show ? this.setArrowIndecatorArrow(dataView) : '') //🡫🡩
    let fontSizeLabel: number = this.visualSettings.categoryLabel.textSize;
    this.textLabel
      .text(this.visualSettings.categoryLabel.show ? dataView.metadata.columns[0].displayName : '')
      .attr("x", "50%")
      .attr("y", height / 2)
      .attr("dy", fontSizeValue / 1.2)
      .style("fill", this.visualSettings.categoryLabel.color)
      .attr("text-anchor", "middle")
      .style('font-family', this.visualSettings.categoryLabel.fontFamily)
      .style("font-size", fontSizeLabel + "px")
  }

  // private static parseSettings(dataView: DataView): VisualSettings {
  //     return <VisualSettings>VisualSettings.parse(dataView);
  // }

  /**
   * This function gets called for each of the objects defined in the capabilities files and allows you to select which of the
   * objects and properties you want to expose to the users in the property pane.
   *
   */
  // public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstance[] | VisualObjectInstanceEnumerationObject {
  //     return VisualSettings.enumerateObjectInstances(this.settings || VisualSettings.getDefault(), options);
  // }
}