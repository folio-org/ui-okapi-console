import React, { Component, PropTypes } from 'react';
import { connect } from '@folio/stripes-connect'; // eslint-disable-line

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
  static propTypes = {
    data: React.PropTypes.object.isRequired,
  };

  static manifest = Object.freeze({
    health: {
      type: 'okapi',
      pk: 'srvcId',
      path: '_/discovery/health'
    },
    modules: {
      type: 'okapi',
      path: '_/proxy/modules'
    }
  });

  render() {
    const { health, modules } = this.props.data;

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

export default connect(Health, 'okapi-console');
