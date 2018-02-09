import React, { Component, PropTypes } from 'react';
import { connect } from '@folio/stripes-connect'; // eslint-disable-line
import Link from 'react-router-dom/Link';

class ModuleList extends Component {
  static propTypes = {
    mutator: React.PropTypes.shape({
      modules: React.PropTypes.shape({
        DELETE: React.PropTypes.func.isRequired,
      }),
    }),
    data: PropTypes.shape({}),
    location: PropTypes.shape({
      pathname: PropTypes.string.isRequired,
    }),
  };

  static manifest = {
    modules: {
      type: 'okapi',
      path: '_/proxy/modules',
    },
  };

  render() {
    const { data: { modules }, mutator, location: { pathname } } = this.props;

    if (!modules) return null;
    const moduleNodes = modules.map(amodule =>
      <li key={amodule.id}>
        {amodule.name}&nbsp;
        <button><Link to={`${pathname}/edit/${amodule.id}`}>Edit</Link></button>
        <button onClick={() => mutator.modules.DELETE(amodule)}>Delete</button>
      </li>);

    return (
      <div>
        <div>
          <h3>Module list:</h3>
          <ul>
            {moduleNodes}
          </ul>
        </div>
        <Link to={`${pathname}/add`}>Add module</Link>
      </div>
    );
  }
}

export default connect(ModuleList, 'okapi-console');
