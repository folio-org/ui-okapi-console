import React, { PropTypes, Component } from 'react';
import Route from 'react-router-dom/Route';
import Switch from 'react-router-dom/Switch';

import ConsoleMenu from './ConsoleMenu';
import TenantList from './tenants/TenantList';
import TenantAdd from './tenants/TenantAdd';
import TenantEdit from './tenants/TenantEdit';
import ModuleList from './modules/ModuleList';
import ModuleAdd from './modules/ModuleAdd';
import ModuleEdit from './modules/ModuleEdit';
import Health from './health/Health';
import HealthConnected from './health/HealthConnected';

const Users = ({ match: { path } }) => <div>
  <ConsoleMenu />
  <hr />
  <Switch>
    <Route exact path={`${path}/tenants`} component={TenantList} />
    <Route path={`${path}/tenants/edit/:tenantid`} component={TenantEdit} />
    <Route path={`${path}/tenants/add`} component={TenantAdd} />
    <Route exact path={`${path}/modules`} component={ModuleList} />
    <Route path={`${path}/modules/edit/:moduleid`} component={ModuleEdit} />
    <Route path={`${path}/modules/add`} component={ModuleAdd} />
    <Route exact path={`${path}/health/health`} component={Health} />
    <Route exact path={`${path}/health/healthconnected`} component={HealthConnected} />
  </Switch>
</div>;

Users.propTypes = {
  match: PropTypes.shape({
    path: PropTypes.string.isRequired,
  }).isRequired,
};

export default Users;
