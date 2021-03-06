import {
    all,
    call,
    put,
    takeLatest
} from "redux-saga/effects";

import {
    CHECK_USER_SESSION,
    EMAIL_SIGN_IN_START,
    GOOGLE_SIGN_IN_START,
    SIGN_OUT_START,
    SIGN_UP_START,
    SIGN_UP_SUCCESS
} from "./auth.types";

import {
    auth,
    createUserProfileDocument,
    getCurrentUser,
    googleProvider
} from "utils/firebase/firebase";

import {
    signInFailure,
    signInSuccess,
    signOutFailure,
    signOutSuccess,
    signUpFailure,
    signUpSuccess
} from "./auth.actions";

export function * getSnapshotFromUserAuth (userAuth, additionalData) {
    try {
        const userRef = yield call(
            createUserProfileDocument,
            userAuth,
            additionalData
        );

        const userSnapshot = yield userRef.get();

        yield put(signInSuccess({
            id: userSnapshot.id,
            ...userSnapshot.data()
        }));
    } catch (error) {
        yield put(signInFailure(error));
    }
}

export function * isUserAuthenticated () {
    try {
        const userAuth = yield getCurrentUser();

        if (userAuth) {
            yield getSnapshotFromUserAuth(userAuth);
        }
    } catch (error) {
        yield put(signInFailure(error));
    }
}

export function * onCheckSession () {
    yield takeLatest(CHECK_USER_SESSION, isUserAuthenticated);
}

export function * signInWithEmail ({ payload = {} }) {
    const { email, password } = payload;

    try {
        const { user } = yield auth.signInWithEmailAndPassword(email, password);
        yield getSnapshotFromUserAuth(user);
    } catch (error) {
        yield put(signInFailure(error));
    }
}

export function * onEmailSignInStart () {
    yield takeLatest(EMAIL_SIGN_IN_START, signInWithEmail);
}

export function * signInWithGoogle () {
    try {
        const { user } = yield auth.signInWithPopup(googleProvider);
        yield getSnapshotFromUserAuth(user);
    } catch (error) {
        yield put(signInFailure(error));
    }
}

export function * onGoogleSignInStart () {
    yield takeLatest(GOOGLE_SIGN_IN_START, signInWithGoogle);
}

export function * signOut () {
    try {
        yield auth.signOut();
        yield put(signOutSuccess());
    } catch (error) {
        yield put(signOutFailure(error));
    }
}

export function * onSignOutStart () {
    yield takeLatest(SIGN_OUT_START, signOut);
}

export function * signUp ({ payload = {} }) {
    const { displayName, email, password } = payload;

    try {
        const { user } = yield auth.createUserWithEmailAndPassword(email, password);
        const additionalData = { displayName };
        yield put(signUpSuccess({ user, additionalData }));
    } catch (error) {
        yield put(signUpFailure(error));
    }
}

export function * onSignUpStart () {
    yield takeLatest(SIGN_UP_START, signUp);
}

export function * signInAfterSignUp ({ payload = {} }) {
    const { user, additionalData } = payload;
    yield getSnapshotFromUserAuth(user, additionalData);
}

export function * onSignUpSuccess () {
    yield takeLatest(SIGN_UP_SUCCESS, signInAfterSignUp);
}

export function * authSagas () {
    yield all([
        call(isUserAuthenticated),
        call(onEmailSignInStart),
        call(onGoogleSignInStart),
        call(onSignOutStart),
        call(onSignUpStart),
        call(onSignUpSuccess)
    ]);
}
