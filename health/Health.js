import React, { Component, PropTypes } from 'react';
import fetch from 'isomorphic-fetch';

const Row = (props) => {
  const { instId, srvcId, healthMessage, healthStatus } = props.h;

  const href = '#/okapi-console/modules/edit/' + srvcId;
  return <tr>
    <td>{instId}</td>
    <td><a href={href}>{srvcId}</a></td>
    <td>{props.map[srvcId]}</td>
    <td>{healthMessage}</td>
    <td>{healthStatus ? 'true' : 'false'}</td>
  </tr>;
};
Row.propTypes = {
  h: PropTypes.object.isRequired,
  map: PropTypes.object.isRequired,
};


class Health extends Component {
  componentDidMount() {
    var sys = require('stripes-loader!'); // eslint-disable-line
    const okapiUrl = sys.okapi.url;
    fetch(okapiUrl + '/_/discovery/health', {})
      .then((response) => {
        if (response.status >= 400) {
          console.log('health fetch error ' + response.status);
          this.setState({ health: 'error ' + response.status });
        } else {
          console.log('health fetch success ' + response.status);
          response.json().then((json) => {
            this.setState({ health: json });
          });
        }
      });
    fetch(okapiUrl + '/_/proxy/modules', {})
      .then((response) => {
        if (response.status >= 400) {
          console.log('modules fetch error ' + response.status);
          this.setState({ health: 'error ' + response.status });
        } else {
          console.log('modules fetch success ' + response.status);
          response.json().then((json) => {
            this.setState({ modules: json });
          });
        }
      });
  }

  render() {
    const health = this.state ? this.state.health : undefined;
    const modules = this.state ? this.state.modules : undefined;

    if (!health) {
      return <div />;
    }

    console.log('Health.render: ',
                'health = ' + typeof health + ': ', health, '; ',
                'modules = ' + typeof modules + ': ', modules);
    const moduleId2name = {};
    if (modules) {
      for (let i = 0; i < modules.length; i++) {
        const module = modules[i];
        moduleId2name[module.id] = module.name;
      }
    }

    return <table>
      <thead>
        <tr>
          <th>Instance ID</th>
          <th>Service ID</th>
          <th>Module Name</th>
          <th>Message</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {health.map((h, index) => <Row key={index} h={h} map={moduleId2name} />)}
      </tbody>
    </table>;
  }
}

export default Health;
