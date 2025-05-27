import { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { closeAuthBox, openAuthBox } from '@/redux/actions/auth-box-action';

const withAuth = (WrappedComponent) => {
    const ComponentWithAuth = (props) => {
        const { isAuthenticated } = useSelector((state) => state.auth);

        const dispatch = useDispatch();

        useEffect(() => {
            if (!isAuthenticated) {
                dispatch(openAuthBox());
            } else {
                dispatch(closeAuthBox());
            }
        }, [isAuthenticated, dispatch]);

        if (!isAuthenticated) {
            return null; // hoặc return <LoadingSpinner />
        }

        return <WrappedComponent {...props} />;
    };

    ComponentWithAuth.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;
    return ComponentWithAuth;
};

export default withAuth;
