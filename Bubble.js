import React from 'react';
import createPlotlyComponent from 'react-plotlyjs';
//See the list of possible plotly bundles at https://github.com/plotly/plotly.js/blob/master/dist/README.md#partial-bundles or roll your own
import Plotly from 'plotly.js/dist/plotly-cartesian';
const PlotlyComponent = createPlotlyComponent(Plotly);

class Bubble extends React.Component {


    constructor(props) {
      super(props);
      this.state = { data: props.data, layout: props.layout, config: props.config};
      this.nextState = this.state;
      this.bubble = <PlotlyComponent className="whatever" data={this.state.data} layout={this.state.layout} config={this.state.config}/>;
      this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    }
    
    componentDidMount() {
      this.updateWindowDimensions();
      window.addEventListener('resize', this.updateWindowDimensions);
    }
    
    componentWillUnmount() {
      window.removeEventListener('resize', this.updateWindowDimensions);
    }
    
    updateWindowDimensions() {
      this.nextState = this.state;
      this.bubble = '';
      this.nextState.layout.width = window.innerWidth;
      this.nextState.layout.height = window.innerHeight;
      this.setState(this.nextState);
      this.bubble = <PlotlyComponent className="whatever" data={this.state.data} layout={this.state.layout} config={this.state.config}/>;
      this.forceUpdate();
    }

    render() {
        console.log(this.state.layout);
        return (
          <div>
            {this.bubble}
          </div>
        );
      }
}

export default Bubble;