import React from 'react';
import Link from 'react-router-dom/Link';

export default () => <div>
  Okapi Console Menu
  [<Link to={'/okapi-console/tenants'}>Tenants</Link>]
  [<Link to={'/okapi-console/modules'}>Modules</Link>]
  [<Link to={'/okapi-console/health/health'}>Health</Link>]
  [<Link to={'/okapi-console/health/healthconnected'}>Health Connected</Link>]
</div>;
