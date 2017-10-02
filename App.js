import React from 'react';
import Papa from 'papaparse';
import Dropzone from 'react-dropzone'
import _ from 'lodash';
import createPlotlyComponent from 'react-plotlyjs';
//See the list of possible plotly bundles at https://github.com/plotly/plotly.js/blob/master/dist/README.md#partial-bundles or roll your own
import Plotly from 'plotly.js/dist/plotly-cartesian';
import Bubble from './Bubble.js';
import Rx from 'rxjs';

const csv = `ageinterval10,sex,total_survived,mean_survived
,female,36,0.68
,male,16,0.13
0 to 9,female,19,0.63
0 to 9,male,19,0.59
10 to 19,female,34,0.76
10 to 19,male,7,0.12
20 to 29,female,52,0.73
20 to 29,male,25,0.17
30 to 39,female,50,0.83
30 to 39,male,23,0.21
40 to 49,female,22,0.69
40 to 49,male,12,0.21
50 to 59,female,16,0.89
50 to 59,male,4,0.13
60 to 69,female,4,1
60 to 69,male,2,0.13
70 to 79,male,0,0.00
80 to 89,male,1,1.00
`

const PlotlyComponent = createPlotlyComponent(Plotly);
class App extends React.Component {
    constructor() {
        super()
        this.state = { files: [], data: [] , layout: {}, ready: false};
        this.plotBubbleChart = this.plotBubbleChart.bind(this);
        this.renderBubbleChart = this.renderBubbleChart.bind(this);
        this.onDrop([csv]);

    }

    onDrop(files) {
        console.log(files[0]);
        Papa.parse(csv, {
            delimiter: ",",
            header: true,
            dynamicTyping: true,
            complete: this.plotBubbleChart,
        });
        Papa.parse(files[0], {
            config: {
                delimiter: ",",
                header: true,
                complete: function (results) {
                    console.log(results);
                },
            },
        });
    }

    plotBubbleChart(results) {
        let maleData = [];
        let femaleData = [];
    
        for (let pt of results.data){
            if (pt.sex == 'male')
                maleData.push(pt);
            else if (pt.sex == 'female')
                femaleData.push(pt);
        }
    
        console.log(maleData);
        console.log(femaleData);
        var male = {
            x: _.map(maleData, (pt) => {
                let arr = pt.ageinterval10.split(' ');
                let start = parseInt(arr[0]);
                let end = parseInt(arr[2]);
                return (start+end+1)/2;
            }),
            y: _.map(maleData, (pt) => {
                return 'Male';
            }),
            text: _.map(maleData, (pt) => {
                let line = '';
                for (let attr in pt)
                    line += attr+': '+pt[attr]+'<br>';
                return line
            }),
            mode: 'markers',
            marker: {
              size: _.map(maleData, (pt) => {
                  return pt.total_survived;
              }),
              color: _.map(maleData, (pt) => {
                    if (pt.mean_survived < 0.5)
                        return 'rgb(255,165,0)';
                    else if (pt.mean_survived >= 0.5)
                        return 'rgb(135,206,250)';
              })  
            },
            name: 'Male'
        };
    
        var female = {
            x: _.map(maleData, (pt) => {
                let arr = pt.ageinterval10.split(' ');
                let start = parseInt(arr[0]);
                let end = parseInt(arr[2]);
                return (start+end+1)/2;
            }),
            y: _.map(femaleData, (pt) => {
                return 'Female';
            }),
            text: _.map(maleData, (pt) => {
                let line = '';
                for (let attr in pt)
                    line += attr+': '+pt[attr]+'<br>';
                return line
            }),
            mode: 'markers',
            marker: {
              size: _.map(femaleData, (pt) => {
                  return pt.total_survived;
              }),
              color: _.map(femaleData, (pt) => {
                    if (pt.mean_survived < 0.5)
                        return 'rgb(255,165,0)';
                    else if (pt.mean_survived >= 0.5)
                        return 'rgb(135,206,250)';
              })  
            },
            name: 'Female'
        };
    
          
        this.state.data = [male, female];
        
        this.state.layout = {
            title: 'Marker Size',
            showlegend: true,
            // Do these in Bubble.js
            // height: 600,
            // width: 600
        };    
        this.state.config = {
            showLink: false,
            displayModeBar: true
        };
        this.state.ready = true;
        this.renderBubbleChart();
    }

    renderBubbleChart() {
        console.log(this.state);
        return (
            <Bubble 
                data={this.state.data}
                layout={this.state.layout}
                config={this.state.config}/>
        );
    }

    render() {
       
        return (
            <div className="App">
                {this.state.ready ? this.renderBubbleChart() : 'Upload file TWICE to plot'}
                <section>
                    <div className="dropzone">
                        <Dropzone onDrop={this.onDrop.bind(this)}>
                            <p>Try dropping some files here, or click to select files to upload.</p>
                        </Dropzone>
                    </div>
                    <aside>
                        <h2>Dropped files</h2>
                        <ul>
                            {this.state.files.map(f => <li key={f.name}>{f.name} - {f.size} bytes</li>)}
                        </ul>
                    </aside>
                </section>
            </div>
        );
    }
}
export default App;