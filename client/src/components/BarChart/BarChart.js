import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { scaleBand, scaleLinear } from 'd3-scale';
import ResponsiveWrapper from './ResponsiveWrapper';
import Axes from './Axes';
import Bars from './Bars';
import '../../css/BarChart.css';

class BarChart extends Component {
  constructor() {
    super();
    this.xScale = scaleBand();
    this.yScale = scaleLinear();
  }

  render() {
    const { features, song, parentWidth } = this.props;
    const data = [
      { feature: 'Acousticness', value: features.acousticness * 100 },
      { feature: 'Danceability', value: features.danceability * 100 },
      { feature: 'Energy', value: features.energy * 100 },
      { feature: 'Instrumentalness', value: features.instrumentalness * 100 },
      { feature: 'Speechiness', value: features.speechiness * 100 },
      { feature: 'Liveness', value: features.liveness * 100 },
      { feature: 'Valence', value: features.valence * 100 },
      { feature: 'Popularity', value: song.popularity }];

    const margins = {
      top: 5, right: 5, bottom: 85, left: 33,
    };

    const svgDimensions = {
      width: Math.max(parentWidth, 230),
      height: Math.min(parentWidth, 380),
    };

    const maxValue = 100;

    // scaleBand type
    const xScale = this.xScale
      .padding(0.5)
    // scaleBand domain should be an array of specific values
    // in our case, we want to use movie titles
      .domain(data.map(d => d.feature))
      .range([margins.left, svgDimensions.width - margins.right]);

    // scaleLinear type
    const yScale = this.yScale
    // scaleLinear domain required at least two values, min and max
      .domain([0, maxValue])
      .range([svgDimensions.height - margins.bottom, margins.top]);

    return (
      <svg width={svgDimensions.width} height={svgDimensions.height}>
        <Axes
          scales={{ xScale, yScale }}
          margins={margins}
          svgDimensions={svgDimensions}
        />
        <Bars
          scales={{ xScale, yScale }}
          margins={margins}
          data={data}
          maxValue={maxValue}
          svgDimensions={svgDimensions}
        />
      </svg>
    );
  }
}

BarChart.propTypes = {
  features: PropTypes.shape({}).isRequired,
  song: PropTypes.shape({}).isRequired,
  parentWidth: PropTypes.number.isRequired,
};

export default ResponsiveWrapper(BarChart);
