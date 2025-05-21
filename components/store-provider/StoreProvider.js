'use client';

import PropTypes from 'prop-types';

import { Provider } from 'react-redux';

import store from '@/redux/store';

function StoreProvider({ children }) {
    return <Provider store={store}>{children}</Provider>;
}

StoreProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export default StoreProvider;
