import React, { Component, PropTypes } from 'react';
import uuid from 'uuid';
import { connect } from 'stripes-connect'; // eslint-disable-line
import ModuleForm from './ModuleForm';
import removeEmpty from '../utils/removeEmptyObjectsFromArrays';

class ModuleAdd extends Component {
  static propTypes = {
    mutator: PropTypes.shape({
      modules: PropTypes.shape({
        POST: PropTypes.func.isRequired,
      })
    })
  };

  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  static manifest = {
    modules: {
      type: 'okapi',
      path: '_/proxy/modules',
      fetch: false
    }
  };

  constructor(props) {
    super(props);
    this.create = this.create.bind(this);
    this.cancel = this.cancel.bind(this);
  }

  create(data) {
    const d2 = Object.assign({}, data, { id: uuid() });
    removeEmpty(d2);
    this.props.mutator.modules.POST(d2).then(() => {
      this.context.router.transitionTo('/okapi-console/modules/edit/' + d2.id);
    });
  }

  cancel() {
    this.context.router.transitionTo('/okapi-console/modules');
  }

  render() {
    return (
      <ModuleForm
        onSubmit={this.create}
        cancelForm={this.cancel}
        submitLabel="Add"
      />
    );
  }
}

export default connect(ModuleAdd, 'okapi-console');
