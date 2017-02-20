import React, { Component, PropTypes } from 'react';
import { connect } from '@folio/stripes-connect';; // eslint-disable-line
import TenantForm from './TenantForm';


class TenantEdit extends Component {
  static propTypes = {
    mutator: React.PropTypes.shape({
      tenants: React.PropTypes.shape({
        PUT: React.PropTypes.func.isRequired,
      }),
    }),
    data: React.PropTypes.shape({}),
    params: React.PropTypes.shape({}),
  };

  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  static manifest = {
    tenants: {
      type: 'okapi',
      path: '_/proxy/tenants/:{tenantid}'
    }
  };

  constructor(props) {
    super(props);
    this.update = this.update.bind(this);
    this.cancel = this.cancel.bind(this);
  }

  cancel() {
    this.context.router.transitionTo('/okapi-console/tenants');
  }

  update(data) {
    this.props.mutator.tenants.PUT(data).then(() =>
      this.context.router.transitionTo('/okapi-console/tenants')
      );
  }

  render() {
    const { data: { tenants }, params: { tenantid } } = this.props;
    const tenant = tenants.find(t => t.id === tenantid);

    return <TenantForm
      onSubmit={this.update}
      cancelForm={this.cancel}
      submitLabel="Save"
      initialValues={tenant}
      params={this.props.params}
    />;
  }
}

export default connect(TenantEdit, 'okapi-console');
