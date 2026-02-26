import React, { Component, ErrorInfo, ReactNode } from 'react';

export interface Ad402ErrorBoundaryProps {
    children: ReactNode;
    fallback?: ReactNode;
    onError?: (error: Error, info: ErrorInfo) => void;
    debug?: boolean;
}

interface Ad402ErrorBoundaryState {
    hasError: boolean;
    error?: Error;
    errorInfo?: ErrorInfo;
}

export class Ad402ErrorBoundary extends Component<Ad402ErrorBoundaryProps, Ad402ErrorBoundaryState> {
    constructor(props: Ad402ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): Ad402ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        this.setState({ errorInfo });

        // Log the error using the provided tracking callback or default to console.error in debug mode
        if (this.props.onError) {
            this.props.onError(error, errorInfo);
        } else if (this.props.debug) {
            console.error('Ad402 SDK Error Boundary Caught an Error:', error, errorInfo);
        }
    }

    render() {
        if (this.state.hasError) {
            // Render user-defined fallback if provided
            if (this.props.fallback) {
                return this.props.fallback;
            }

            // Default error UI
            return (
                <div style={{
                    padding: '24px',
                    margin: '16px 0',
                    border: '1px solid #ffcccc',
                    borderRadius: '8px',
                    backgroundColor: '#ffe6e6',
                    color: '#c00000',
                    fontFamily: 'sans-serif',
                    fontSize: '14px',
                    textAlign: 'left'
                }} role="alert">
                    <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: 'bold' }}>
                        We're having trouble loading this component.
                    </h3>
                    <p style={{ margin: '0' }}>Please try refreshing the page or contact support if the problem persists.</p>

                    {this.props.debug && this.state.error && (
                        <details style={{ marginTop: '16px', backgroundColor: '#fff', padding: '12px', borderRadius: '4px', overflowX: 'auto' }}>
                            <summary style={{ cursor: 'pointer', fontWeight: 'bold', marginBottom: '8px' }}>Debug Details (Hidden in Production)</summary>
                            <pre style={{ margin: 0, fontSize: '12px', color: '#333' }}>
                                {this.state.error.toString()}
                                <br />
                                {this.state.errorInfo?.componentStack}
                            </pre>
                        </details>
                    )}
                </div>
            );
        }

        return this.props.children;
    }
}
