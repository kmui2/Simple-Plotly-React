import React from 'react';
import Papa from 'papaparse';
import Dropzone from 'react-dropzone'
import _ from 'lodash';
import createPlotlyComponent from 'react-plotlyjs';
//See the list of possible plotly bundles at https://github.com/plotly/plotly.js/blob/master/dist/README.md#partial-bundles or roll your own
import Plotly from 'plotly.js/dist/plotly-cartesian';
import Bubble from './Bubble.js';
import Rx from 'rxjs';

const PlotlyComponent = createPlotlyComponent(Plotly);
class App extends React.Component {
    constructor() {
        super()
        this.state = { files: [], data: [] , layout: {}, ready: false};
        this.plotBubbleChart = this.plotBubbleChart.bind(this);
        this.renderBubbleChart = this.renderBubbleChart.bind(this);
    }

    onDrop(files) {
        this.setState({
            files
        });
        console.log(files);
        Papa.parse(files[0], {
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
            height: 600,
            width: 600
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
        var trace1 = {
            x: [1, 2, 3, 4],
            y: [10, 11, 12, 13],
            text: ['A<br>size: 40', 'B<br>size: 60', 'C<br>size: 80', 'D<br>size: 100'],
            mode: 'markers',
            marker: {
              color: ['rgb(93, 164, 214)', 'rgb(255, 144, 14)',  'rgb(44, 160, 101)', 'rgb(255, 65, 54)'],
              size: [40, 60, 80, 100]
            }
        };
          
        var data = [trace1];
          
        var layout = {
            title: 'Bubble Chart Hover Text',
            showlegend: false,
            height: 600,
            width: 600
        };
        let config = {
            showLink: false,
            displayModeBar: true
        };
        return (
            <div className="App">
                <section>
                    <div className="dropzone">
                        <Dropzone onDrop={this.onDrop.bind(this)}>
                            <p>Try dropping some files here, or click to select files to upload.</p>
                        </Dropzone>
                    </div>
                    <aside>
                        <h2>Dropped files</h2>
                        <ul>
                            {
                                this.state.files.map(f => <li key={f.name}>{f.name} - {f.size} bytes</li>)
                            }
                        </ul>
                    </aside>
                </section>
                {this.state.ready ? this.renderBubbleChart() : 'Upload file TWICE to plot'}
            </div>
        );
    }
}
export default App;