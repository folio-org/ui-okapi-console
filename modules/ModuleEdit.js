import React, { Component, PropTypes } from 'react';
import { connect } from 'stripes-connect'; // eslint-disable-line
import ModuleForm from './ModuleForm';
import removeEmpty from '../utils/removeEmptyObjectsFromArrays';


class ModuleEdit extends Component {
  static propTypes = {
    mutator: PropTypes.shape({
      modules: PropTypes.shape({
        PUT: PropTypes.func.isRequired,
      })
    }),
    data: PropTypes.object,
    params: PropTypes.object
  };

  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  static manifest = {
    modules: {
      type: 'okapi',
      path: '_/proxy/modules/:{moduleid}'
    }
  };

  constructor(props) {
    super(props);
    this.update = this.update.bind(this);
    this.cancel = this.cancel.bind(this);
  }

  update(data) {
    removeEmpty(data);
    this.props.mutator.modules.PUT(data).then(() =>
      this.context.router.transitionTo('/okapi-console/modules')
    );
  }

  cancel() {
    this.context.router.transitionTo('/okapi-console/modules');
  }

  render() {
    const { data: { modules }, params: { moduleid } } = this.props;

    if (!modules) {
      return <div />;
    }
    const module = modules.find(m => m.id === moduleid);
    if (!module) {
      return <div />;
    }
    return <ModuleForm initialValues={module} onSubmit={this.update} cancelForm={this.cancel} />;
  }
}

export default connect(ModuleEdit, 'okapi-console');

