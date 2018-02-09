import React, { Component, PropTypes } from 'react';
import { connect } from '@folio/stripes-connect'; // eslint-disable-line
import ModuleForm from './ModuleForm';
import removeEmpty from '../utils/removeEmptyObjectsFromArrays';


class ModuleEdit extends Component {
  static propTypes = {
    mutator: PropTypes.shape({
      modules: PropTypes.shape({
        PUT: PropTypes.func.isRequired,
      }),
    }),
    data: PropTypes.object,
    match: React.PropTypes.shape({
      params: React.PropTypes.shape({}),
    }),
  };

  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  static manifest = {
    modules: {
      type: 'okapi',
      path: '_/proxy/modules/:{moduleid}',
      fetch: false,
    },
  };

  constructor(props) {
    super(props);
    this.update = this.update.bind(this);
    this.cancel = this.cancel.bind(this);
  }

  update(data) {
    removeEmpty(data);
    this.props.mutator.modules.PUT(data).then(() =>
      this.context.router.history.replace('/okapi-console/modules'));
  }

  cancel() {
    this.context.router.history.goBack();
  }

  render() {
    const { data: { modules }, match: { params: { moduleid } } } = this.props;

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
