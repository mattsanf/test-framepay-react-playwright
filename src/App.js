import React, { Component } from 'react';

import { FramePayProvider, withFramePayCardComponent } from '@rebilly/framepay-react';

const params = {
    publishableKey: 'pk_sandbox_qwnvXQ1rmdhSYKpL3u4_-YMXNdfg0_VBaHKZ7jr',
    riskMetadata: {
        browserData: {
            colorDepth: '48',
            isJavaEnabled: 'true',
            language: 'en',
            screenHeight: '100',
            screenWidth: '100',
            timeZoneOffset: '0',
        },
        extraData: {
            kountFraudSessionId: null,
        },
        fingerprint: 'fingerprint123',
    },
};

const deepMerge = (target, source) => {
    for (const key of Object.keys(source)) {
        if (source[key] instanceof Object) {
            source[key] = source[key] || {};
            target[key] = target[key] || {};
            Object.assign(source[key], deepMerge(target[key], source[key]));
        }
    }

    return Object.assign(target || {}, source);
}

class CardElementComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            token: {
                error: null,
                data: null,
            },
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();
        this.props.Framepay.createToken(this.formNode)
            .then((data) => {
                this.setState((prevState) => ({
                    ...deepMerge(prevState, { token: { error: false, data } })
                }));
            })
            .catch((err) => {
                this.setState((prevState) => ({
                    ...deepMerge(prevState, { token: { error: true, data: err } })
                }));
            });
    }

    render() {
        return (
            <form
                id="form"
                ref={(node) => (this.formNode = node)}
                method="post"
                onSubmit={this.handleSubmit}
            >
                <div>
                    <input
                        type="text"
                        name="firstName"
                        placeholder="First name"
                        data-rebilly="firstName"
                    />
                    <input
                        type="text"
                        name="lastName"
                        placeholder="Last name"
                        data-rebilly="lastName"
                    />
                </div>
                <div>
                    <this.props.CardElement />
                </div>
                <button id="submit">Make Payment</button>
                <pre>{JSON.stringify(this.state, null, 2)}</pre>
            </form>
        );
    }
}

const CardElement = withFramePayCardComponent(CardElementComponent);

class FramePay extends Component {
    deepUpdateState(data) {
        this.setState((prevState) => {
            return deepMerge(prevState, data);
        });
    }

    render() {
        return (
            <FramePayProvider
                injectStyle
                {...params}
                onTokenReady={(token) =>
                    this.deepUpdateState({ error: false, data: token })
                }
            >
                <CardElement />
            </FramePayProvider>
        );
    }
}


function App() {
    return (
        <div className="App">
            <header className="App-header">
                <FramePay/>
            </header>
        </div>
    );
}

export default App;
