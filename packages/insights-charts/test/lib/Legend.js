/* eslint-disable no-new */
// TODO: We should introduce a generate method instead of using the constructor.

import { expect } from 'chai';
import Legend from '../../source/js/lib/Legend';

describe('Legend', () => {
  let options = { enabled: true };
  const margins = {};
  const dispatchers = { on: () => {} };

  it('should properly render the legend', () => {
    const seriesData = [{ label: 'blah', data: [{ y: 1 }, { y: 2 }] }];

    new Legend(global.chart, seriesData, options, margins, dispatchers);

    expect(global.chart.selectAll('.reflect-charts-legend').size()).to.eql(1);
  });

  it('should render aggregates', () => {
    const seriesData = [{
      label: 'blah',
      aggregate: 45,
      data: [{ y: 1 }, { y: 2 }],
    }];

    new Legend(global.chart, seriesData, options, margins, dispatchers);

    expect(global.chart.selectAll('.reflect-charts-legend-item').text()).to.eql('blah: 45');
  });

  describe('when expanded', () => {
    it('should list data points as series', () => {
      options = { enabled: true, expanded: true };

      const seriesData = [{
        data: [{ y: 1, x: 'test1' }, { y: 2, x: 'test2' }],
      }];

      new Legend(global.chart, seriesData, options, margins, dispatchers);

      expect(global.chart.selectAll('.reflect-charts-legend-item').size()).to.eql(2);
      expect(global.chart.select('.reflect-charts-legend-item').text()).to.eql('test1');
    });
  });
});