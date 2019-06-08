import React, {Component} from 'react';
import {Field, reduxForm} from 'redux-form';
import {connect} from 'react-redux';
import {userLogin} from "../../../../actions/authActions";
import Alert from "../../../UI/Alert/Alert";
import {Mixpanel as mixpanel} from "../../../../mixpanel";
import cogoToast from 'cogo-toast';
import {clearAlert} from '../../../../actions/uiActions'

class Login extends Component {

    componentDidMount() {
        mixpanel.track('login_visit')
    }

    componentWillReceiveProps(newProps) {
       if(newProps.alert.type && newProps.alert.type==="positive"){
           cogoToast.success(newProps.alert.content);
           this.props.clearAlert()
        }
    }

    renderInput({placeholder, input, label, meta, type}) {


        return (
            <div className="field">
                <label>{label}</label>
                <input {...input} placeholder={placeholder} type={type}/>
            </div>
        )
    }

    onSubmit = (formValues) => {
        this.props.userLogin(formValues); //login our user with credentials
    };

    onRenderAlert() {
        return (this.props.alert.type && this.props.alert.type==='negative' ? <Alert type={this.props.alert.type} title={this.props.alert.title}
                                               content={this.props.alert.content}/> : null)
    }


    render() {

        return (
            <main>

                <div className="ui text container">

                    <h1>Login</h1>

                    <div className="ui divider"></div>

                    {this.onRenderAlert()}

                    <form onSubmit={this.props.handleSubmit(this.onSubmit)} className="ui form">

                        <Field name="email" type="email" placeholder="E-mail" component={this.renderInput}
                               label="Email"/>
                        <Field name="password" type="password" placeholder="Password" component={this.renderInput}
                               label="Your password"/>

                        <button className="ui button" type="submit">Login</button>

                    </form>


                </div>


            </main>


        );
    }
}

const formWrapped = reduxForm({
    form: 'Login',
})(Login);


const mapStateToProps = (state) => {
    return {alert: state.alert.message};
};

export default connect(mapStateToProps, {
    userLogin,
    clearAlert
})(formWrapped)
