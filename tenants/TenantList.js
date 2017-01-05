import React, { Component } from 'react';
import { connect } from 'stripes-connect'; // eslint-disable-line
import { Link } from 'react-router';

class TenantList extends Component {
  static propTypes = {
    mutator: React.PropTypes.shape({
      tenants: React.PropTypes.shape({
        PUT: React.PropTypes.func.isRequired,
      }),
    }),
    data: React.PropTypes.shape({}),
    pathname: React.PropTypes.string,
  };

  static manifest = {
    tenants: {
      type: 'okapi',
      path: '_/proxy/tenants'
    }
  };

  render() {
    const { data: { tenants }, mutator, pathname } = this.props;

    if (!tenants) return null;
    const tenantNodes = tenants.map(tenant =>
      <li key={tenant.id}>
        {tenant.name}&nbsp;ID: {tenant.id}&nbsp;
        <Link to={`${pathname}/edit/${tenant.id}`}><button>Edit</button></Link>
        <button onClick={() => mutator.tenants.DELETE(tenant)}>Delete</button>
      </li>
    );
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
