const { openAuthBox } = require('@/redux/actions/auth-box-action');

async function AuthFunctionWrap(isAuthenticated, fn, dispatch) {
    if (!isAuthenticated) {
        dispatch(openAuthBox());
        return;
    }

    fn();
}

export default AuthFunctionWrap;
