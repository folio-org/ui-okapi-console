import React, { Component } from 'react';
import { connect } from 'stripes-connect'; // eslint-disable-line
import { Grid, Row, Col } from 'react-bootstrap';

const availableModules = (allModules, enabledModules) => {
  const moduleList = [];
  for (let i = 0; i < allModules.length; i++) {
    const amodule = {};
    amodule.name = allModules[i].name;
    amodule.id = allModules[i].id;
    amodule.enabled = false;
    for (let j = 0; j < enabledModules.length; j++) {
      if (enabledModules[j].id === amodule.id) {
        amodule.enabled = true;
      }
    }
    moduleList.push(amodule);
  }
  return moduleList;
};

class ModuleSelector extends Component {
  static propTypes = {
    mutator: React.PropTypes.shape({
      enabledmodules: React.PropTypes.shape({
        DELETE: React.PropTypes.func.isRequired,
        POST: React.PropTypes.func.isRequired,
      })
    }),
    data: React.PropTypes.shape({})
  };

  static manifest = {
    enabledmodules: {
      type: 'okapi',
      path: '_/proxy/tenants/:{tenantid}/modules',
      clientGeneratePk: false
    },
    modules: {
      type: 'okapi',
      path: '_/proxy/modules'
    },

    // Clearly the "magic" entry is only good when loading the Users module.
    // This is a nasty short-term hack: see STRIPES-126.
    magic: {
      type: 'okapi',
      path: 'tenant',
      headers: {
        'X-Okapi-Tenant': 'diku',
        'Content-Type': 'application/json', // ### Shouldn't need to be re-specified as this is the default
      },
      fetch: false,
    }
  };

  enableModule(moduleId) {
    const data = {
      id: moduleId
    };
    const ret = this.props.mutator.enabledmodules.POST(data).then(() => {
      console.log("enableModule: main POST returned -- sending Kurt's magic POST");
      this.props.mutator.magic.POST({});
    });
  }

  disableModule(moduleId) {
    const data = {
      id: moduleId
    };
    this.props.mutator.enabledmodules.DELETE(data);
  }

  render() {
    const styles = {
      bold: {
        fontWeight: 'bold'
      },
      normal: {
        fontWeight: 'normal'
      }
    };

    const { data: { modules, enabledmodules } } = this.props;
    if (!modules || !enabledmodules) return <div />;

    const availableModuleNodes = availableModules(modules, enabledmodules).map(amodule =>
      <li key={amodule.id}>
        <span style={(amodule.enabled ? styles.bold : styles.normal)}>{amodule.name}</span>
        {' '}{' '}
        <button
          key={amodule.id}
          onClick={(e) => {
            e.preventDefault();
            return amodule.enabled ? this.disableModule(amodule.id) : this.enableModule(amodule.id);
          }}
        >
          {amodule.enabled ? 'Disable' : 'Enable'}
        </button>
      </li>
    );

    return (
      <div>
        <Grid>
          <Row className="show-grid">
            <Col xs={6} md={6}><h3>Available modules</h3></Col>
          </Row>
          <Row className="show-grid">
            <Col xs={6} md={6}>{availableModuleNodes}</Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default connect(ModuleSelector, 'okapi-console');
