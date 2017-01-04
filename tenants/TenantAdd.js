import React, { Component, PropTypes } from 'react';
import { connect } from 'stripes-connect'; // eslint-disable-line
import TenantForm from './TenantForm';

class TenantAdd extends Component {
  static propTypes = {
    mutator: React.PropTypes.shape({
      tenants: React.PropTypes.shape({
        POST: React.PropTypes.func.isRequired,
      })
    }),
  };

  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  static manifest = {
    tenants: {
      type: 'okapi',
      path: '_/proxy/tenants',
      fetch: false
    }
  };

  constructor(props) {
    super(props);
    this.create = this.create.bind(this);
    this.cancel = this.cancel.bind(this);
  }

  create(data) {
    this.props.mutator.tenants.POST(data).then(() =>
      this.context.router.transitionTo('/okapi-console/tenants')
      );
  }

  cancel() {
    this.context.router.transitionTo('/okapi-console/tenants');
  }

  render() {
    return <TenantForm
      onSubmit={this.create}
      cancelForm={this.cancel}
      submitLabel="Add"
    />;
  }
}

export default connect(TenantAdd, 'okapi-console');
