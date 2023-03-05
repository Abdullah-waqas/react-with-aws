import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as Sentry from '@sentry/react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null, errorInfo: null, eventId: null };
    this.clearState = this.clearState.bind(this);
  }

  componentDidCatch(error, errorInfo) {
    console.log('ERROR_____');
    this.setState({ error, errorInfo });
    console.log(error, errorInfo);
    if (process.env.NODE_ENV === 'production') {
      Sentry.withScope((scope) => {
        scope.setTag('Custom-Tag', 'ErrorBoundary');
        scope.setLevel('Error');
        scope.setExtras(errorInfo);
        const eventId = Sentry.captureException(error);
        this.setState({ eventId });
      });
    }
  }

  clearState() {
    this.setState({ error: null, errorInfo: null, eventId: null });
  }

  render() {
    if (this.state.error) {
      return (
        <div>
          <span>Oops Something went wrong!! Please contact admin.</span>
        </div>
      );
    }
    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.any
};

export default ErrorBoundary;
