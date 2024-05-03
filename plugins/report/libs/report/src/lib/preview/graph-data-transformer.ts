import {DataTransformationInfo, DontCodeModelManager, DontCodeReportDisplayType} from "@dontcode/core";
import {Observable, ReplaySubject} from "rxjs";
import {ChartData, ChartOptions, ChartType, DefaultDataPoint, TooltipItem} from "chart.js";
import {EntityListManager} from "@dontcode/plugin-common";

/**
 * Calculates the correct data to generate a graph based on the configuration of the model
 */
export class GraphDataTransformer {

  protected config?: DontCodeReportDisplayType;

  protected labelFieldName?:string;

  protected data = new ReplaySubject<ChartData<ChartType, DefaultDataPoint<ChartType>>>(1);
  protected option = new ReplaySubject<ChartOptions<ChartType>>(1);

  protected targetType:string|null=null;

  constructor(protected modelMgr:DontCodeModelManager, graphConfig?: DontCodeReportDisplayType) {
    this.config=graphConfig;
  }

  setConfig (graphConfig?: DontCodeReportDisplayType) : void {
    this.config = graphConfig;
  }

  setTargetType (newType:string|null): void {
    this.targetType=newType;
  }

  translatedGraphType (): string|undefined {
    if( this.config?.type!=null) {
      return this.config.type.toLowerCase();
    }
    return;
  }

  changeGraphType (newType:string) {
    if (this.config==null)
      throw new Error ("No config to change type to "+ newType);
    this.config.type=newType;
  }

  dataObservable (): Observable<ChartData<ChartType, DefaultDataPoint<ChartType>>> {
    return this.data.asObservable();
  }

  optionObservable():Observable<ChartOptions<ChartType>> {
    return this.option.asObservable();
  }

  updateSourceData (srcData:EntityListManager): void {
    if (this.config==null) {
      throw new Error ("Cannot process source data without graph configuration");
    }

    const isAmount = this.targetType == 'Dollar' || this.targetType == 'Euro' || this.targetType == 'Other currency';
    let byDate = false;

    if (this.config.type!="Table") {
      const data: any[] = [];
      const labels = [];
      let count = 1;

      const metaData = new DataTransformationInfo();
      const isBiDirectional = this.config.type!='Pie';

      let xFieldName=this.labelFieldName;
      if( this.config.by!=null)
        xFieldName = this.config.by;
      for (const elt of (srcData.entities as any[])) {

        let label;
        if (xFieldName != null) {
          if (elt[xFieldName] instanceof Date) byDate=true;
          label = this.translateDateValue (elt[xFieldName]);
        }
        else {
          label = count;
          count++;
        }

        const newVal = this.translateDateValue (this.modelMgr.extractValue (elt[this.config.of], metaData));
          // Aggregates values for same label
        let posLabel = labels.indexOf(label);
        if (posLabel==-1)
          labels.push(label);

        if (!isBiDirectional) {
          if (posLabel==-1) {
            data.push(newVal);
          } else {
            if (typeof data[posLabel]=='number')  // Aggregate values for the same label
              data[posLabel]=(newVal!=null)?data[posLabel]+newVal:data[posLabel];
            else if (data[posLabel]==null) {
              data[posLabel]=newVal;
            } else {
              // We cannot add values, so we create a separate data point
              posLabel=-1;
              labels.push(label);
              data.push(newVal);
            }
          }
        } else {
          if (posLabel==-1) {
            // We store the complete object in src field in case it's an amount with currency for example
            data.push({x: label, y: newVal, src: elt[this.config.of]});
          } else {
            if (typeof (data[posLabel].y)=='number') { // Aggregate values for the same label
              data[posLabel].y=(newVal!=null)?data[posLabel].y+newVal:data[posLabel].y;
              data[posLabel].src= this.modelMgr.modifyValues (data[posLabel].src, elt[this.config.of], metaData, 
                (first, second) => {
                  if (first==null) return second;
                  if (second==null) return first;
                  return first+second;
                });
            } else if (data[posLabel].y == null) {
              data[posLabel].y=newVal;
              data[posLabel].src = elt[this.config.of];
            } else {
              // There is no numeric values to sum up, so let's create a separate data point
              data.push({x: label, y:newVal, src: elt[this.config.of]});
            }
          }
        }
      }

      const chartData: ChartData<ChartType, DefaultDataPoint<ChartType>> = {
        datasets: [
          {
            label: this.config.of,
            data
          }
        ]
      };

      const chartOption: ChartOptions<ChartType> = {}

      chartOption.plugins = {};
      chartOption.plugins.title = {
        align: "center",
        position: "top",
        display: true,
        text: this.config.title
      }

      if (!isAmount || !isBiDirectional) {
        chartData.labels = labels;
      }

      if( byDate) {
        chartOption.scales = {
            x: {
              type: 'time'
          }
        }
      }
      if( this.config.type!="Line") {
        chartOption.plugins.autocolors = {
            mode: 'data',
            offset:2
        }
      } else {
        chartOption.plugins.autocolors = {
          mode: 'dataset',
          offset:2
        }

      }

      if (isAmount)
      {
        chartOption.plugins.tooltip = {
          callbacks: {
            label: function (context: TooltipItem<any>): string {
              if ((context.raw as any)?.src?.currencyCode != null) {
                return Intl.NumberFormat(undefined, {
                  style: 'currency',
                  currency: (context.raw as any).src.currencyCode
                }).format(context.parsed.y);
              
              } else
                return context.parsed.y;
            }
          }
        }
      }

      if (this.config.type == 'Bar') {
        const barChartConfig = chartData as ChartData<'bar'>;

        /*for (const dataSet of barChartConfig.datasets) {
          dataSet.backgroundColor = ChartsColors.fillColors;
        }*/
      } else if (this.config.type == 'Pie') {
        const pieChartConfig = chartData as ChartData<'pie'>;

        for (const dataSet of pieChartConfig.datasets) {
          //dataSet.backgroundColor = ChartsColors.fillColors;
          dataSet.hoverOffset = 20;
        }

      } else if (this.config.type == 'Line') {
        const lineChartConfig = chartData as ChartData<'line'>;

        /*let position = 0;
        for (const dataSet of lineChartConfig.datasets) {
          dataSet.borderColor = ChartsColors.fillColors[position];
          position++;
        }*/
      }
      this.data.next(chartData);
      this.option.next(chartOption);
    }
  }

  setLabelFieldName(fieldName: string) {
    this.labelFieldName = fieldName;
  }

  private translateDateValue(eltElement: any) {
    if (eltElement instanceof Date) {
      return (eltElement as Date).valueOf();
    }else return eltElement;
  }
}

/* class ChartsColors {
  public static fillColors=[
    '#42A5F5',
    '#7E57C2',
    '#66BB6A',
    '#FFCA28',
    '#26A69A',
    '#EC407A',
    '#AB47BC'
  ]
}*/

