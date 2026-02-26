import React from 'react';
import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Ad402ErrorBoundary } from '../Ad402ErrorBoundary';

const ThrowingComponent = ({ message }: { message: string }) => {
    throw new Error(message);
    return <div>Will not render</div>;
};

describe('Ad402ErrorBoundary', () => {
    beforeEach(() => {
        // Suppress console.error in tests to avoid noisy output
        jest.spyOn(console, 'error').mockImplementation(() => { });
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should render children when there is no error', () => {
        render(
            <Ad402ErrorBoundary>
                <div>Healthy Child</div>
            </Ad402ErrorBoundary>
        );

        expect(screen.getByText('Healthy Child')).toBeInTheDocument();
    });

    it('should render default fallback UI when an error is thrown', () => {
        render(
            <Ad402ErrorBoundary>
                <ThrowingComponent message="Test Error" />
            </Ad402ErrorBoundary>
        );

        expect(screen.getByText("We're having trouble loading this component.")).toBeInTheDocument();
    });

    it('should render custom fallback UI when provided', () => {
        render(
            <Ad402ErrorBoundary fallback={<div>Custom Error UI</div>}>
                <ThrowingComponent message="Test Error" />
            </Ad402ErrorBoundary>
        );

        expect(screen.getByText('Custom Error UI')).toBeInTheDocument();
    });

    it('should call onError callback when an error is thrown', () => {
        const onErrorMock = jest.fn();

        render(
            <Ad402ErrorBoundary onError={onErrorMock}>
                <ThrowingComponent message="Test Error" />
            </Ad402ErrorBoundary>
        );

        expect(onErrorMock).toHaveBeenCalledTimes(1);
        expect(onErrorMock).toHaveBeenCalledWith(
            expect.any(Error),
            expect.objectContaining({ componentStack: expect.any(String) })
        );
    });

    it('should show debug info in debug mode', () => {
        render(
            <Ad402ErrorBoundary debug={true}>
                <ThrowingComponent message="Super Secret Test Error" />
            </Ad402ErrorBoundary>
        );

        expect(screen.getByText('Debug Details (Hidden in Production)')).toBeInTheDocument();
        expect(screen.getByText(/Super Secret Test Error/)).toBeInTheDocument();
    });
});
