import React, { Component, PropTypes } from 'react';
import { connect } from '@folio/stripes-connect';
import Link from 'react-router-dom/Link';

class TenantList extends Component {
  static propTypes = {
    mutator: React.PropTypes.shape({
      tenants: React.PropTypes.shape({
        PUT: React.PropTypes.func.isRequired,
      }),
    }),
    data: PropTypes.shape({}),
    location: PropTypes.shape({
      pathname: PropTypes.string.isRequired,
    }).isRequired,
  };

  static manifest = {
    tenants: {
      type: 'okapi',
      path: '_/proxy/tenants',
    },
  };

  render() {
    const { data: { tenants }, mutator, location: { pathname } } = this.props;

    if (!tenants) return null;
    const tenantNodes = tenants.map(tenant =>
      <li key={tenant.id}>
        {tenant.name}&nbsp;ID: {tenant.id}&nbsp;
        <Link to={`${pathname}/edit/${tenant.id}`}><button>Edit</button></Link>
        <button onClick={() => mutator.tenants.DELETE(tenant)}>Delete</button>
      </li>);
    return (
      <div>
        <div>
          <h3>Tenant list:</h3>
          <ul>
            {tenantNodes}
          </ul>
        </div>
        <Link to={`${pathname}/add`}>Add tenant</Link>
      </div>
    );
  }
}

export default connect(TenantList, 'okapi-console');
