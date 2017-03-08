import React, { Component, PropTypes } from 'react';
import { connect } from '@folio/stripes-connect';
import DeploymentForm from './DeploymentForm';

export class tmpDeployments extends Component {
  static propTypes = {
    data: PropTypes.object,
    mutator: PropTypes.shape({
      deployment_modules: PropTypes.shape({
        DELETE: PropTypes.func.isRequired,
        POST: PropTypes.func.isRequired,
      })
    }),
    refreshRemote: PropTypes.func,
    srvcId: PropTypes.string,
  };

  static manifest = {
    discovery_modules: {
      type: 'okapi',
      path: '_/discovery/modules',
      pk: 'instId'
    },
    discovery_nodes: {
      type: 'okapi',
      path: '_/discovery/nodes',
      pk: 'nodeId'
    },
    deployment_modules: {
      type: 'okapi',
      path: '_/deployment/modules',
      pk: 'instId',
      clientGeneratePk: false
    }
  };

  constructor(props) {
    super(props);
    this.deleteDeploy = this.deleteDeploy.bind(this);
    this.addDeploy = this.addDeploy.bind(this);
  }

  addDeploy(data) {
    this.props.mutator.deployment_modules.POST(data).then(() =>
      this.props.refreshRemote(this.props)
    );
  }

  deleteDeploy(data) {
    this.props.mutator.deployment_modules.DELETE(data).then(() =>
      this.props.refreshRemote(this.props)
    );
  }

  render() {
    const { data: { discovery_modules: dm, discovery_nodes: dn },
            srvcId
          } = this.props;

    if (!dn || dn.length === 0) return <div />;
    const nextindex = (dm ? dm.length : 0);
    return (
      <div>
        {dm.map((deployment, index) => {
          if (deployment.srvcId !== srvcId)
            return <span />;

          return <DeploymentForm
            form={'dep-' + index.toString()}
            key={'dep-' + index.toString()}
            deployNodes={dn}
            initialValues={deployment}
            onSubmit={this.deleteDeploy}
            disable
          />;
        })}
        <br />
        <DeploymentForm
          form={'dep-' + nextindex.toString()}
          key={'dep-' + nextindex.toString()}
          deployNodes={dn}
          initialValues={{ srvcId }}
          onSubmit={this.addDeploy}
          disable={false}
        />
      </div>
    );
  }
}

export default connect(tmpDeployments, 'okapi-console');
