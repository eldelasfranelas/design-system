import { scalePoint, scaleBand, scaleTime, scaleLinear } from 'd3-scale';
import { extent } from 'd3-array';
import helpers from '../../helpers/charting';

class XScale {
  constructor(categories, options, dimensions) {
    this.categories = categories;
    this.options = options;
    this.scale = helpers.detectScaleType(categories, options.type);
    this.dimensions = dimensions;
    this.type = options.type;
  }

  generate() {
    const categories = this.categories;
    const { width, height } = this.dimensions;
    const type = this.type;
    const options = this.options;

    // If the domain is all strings we'll use an ordinal type instead of a
    // linear one.
    if (this.scale === 'ordinal') {
      if (type === 'column' || type === 'bar' || type === 'combination') {
        this.x = scaleBand();
      } else {
        this.x = scalePoint();
      }

      this.x.padding(0.05)
        .domain(categories);
    } else {
      if (this.scale === 'time') {
        this.x = scaleTime();
      } else {
        this.x = scaleLinear();
      }

      this.x.domain(extent(categories));
    }

    const orientation = options.axis.x.orientation;

    if (orientation === 'left' || orientation === 'right') {
      this.x.range([0, height]);
    } else {
      this.x.range([0, width]);
    }

    return this.x;
  }

  update(categories, options, dimensions) {
    this.categories = categories;
    this.options = options;
    this.dimensions = dimensions;
    this.type = options.type;

    return this.generate();
  }
}

export default XScale;
