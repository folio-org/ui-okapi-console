import React, { Component } from 'react';
import fetch from 'isomorphic-fetch';

class Row extends Component {
  render() {
    const { instId, srvcId, healthMessage, healthStatus } = this.props.h;

    let href = "#/okapi-console/modules/edit/" + srvcId;
    return <tr>
      <td>{instId}</td>
      <td><a href={href}>{srvcId}</a></td>
      <td>{this.props.map[srvcId]}</td>
      <td>{healthMessage}</td>
      <td>{healthStatus ? "true" : "false"}</td>
    </tr>
  }
}

class Health extends Component {
  componentDidMount() {
    var sys = require('stripes-loader!');
    var okapi_url = sys.okapi.url;
    fetch(okapi_url + '/_/discovery/health', {}).
     then((response) => {
      if (response.status != 200) {
        console.log('health fetch error ' + response.status);
        this.setState({ health: "error " + response.status });
      } else {
        console.log('health fetch success ' + response.status);
        response.json().then((json) => {
          this.setState({ health: json });
        });
      }
    });
    fetch(okapi_url + '/_/proxy/modules', {}).
     then((response) => {
      if (response.status != 200) {
        console.log('modules fetch error ' + response.status);
        this.setState({ health: "error " + response.status });
      } else {
        console.log('modules fetch success ' + response.status);
        response.json().then((json) => {
          this.setState({ modules: json });
        });
      }
    });
  }

  render() {
    let health = this.state ? this.state.health : undefined;
    let modules = this.state ? this.state.modules : undefined;
    if (!health) {
      return <div/>
    }

    console.log("Health.render: ",
                "health = " + typeof(health) + ": ", health, "; ",
                "modules = " + typeof(modules) + ": ", modules);
    let moduleId2name = {};
    if (modules) {
      for (let i = 0; i < modules.length; i++) {
        let module = modules[i];
        moduleId2name[module.id] = module.name;
      }
    }

    return <table>
             <thead>
              <tr>
               <th>Instance ID</th>
               <th>Service ID</th>
               <th>Module Name</th>
               <th>Message</th>
               <th>Status</th>
              </tr>
             </thead>
             <tbody>
              {health.map((h, index) => { return <Row key={index} h={h} map={moduleId2name}/> })}
             </tbody>
            </table>
  }
}

export default Health;
