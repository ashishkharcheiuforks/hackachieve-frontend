import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import ReactTags from 'react-tag-autocomplete';
import Modal from "../../UI/InviteModal/InviteModal";
import { toggleModal } from "../../../actions/uiActions";

import {
    searchUsers
} from "../../../actions/projectActions";

class Tags extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            tags: [
            ]
        }
    }

    handleInputChange(input) {
        if (!this.props.customProps.isLoading) {
            this.props.customProps.searchUsers(input);
        }
    }

    handleDelete(i) {
        const tags = this.state.tags.slice(0)
        tags.splice(i, 1)
        this.setState({ tags })
    }

    handleAddition(tag) {
        const tags = [].concat(this.state.tags, tag)
        this.setState({ tags })
    }

    render() {
        const suggestions = [];
        const { users } = this.props.customProps;
        users.map((user) =>
            suggestions.push({
                id: user.id,
                name: `${user.first_name} ${user.last_name}`
            })
        )
        return (
            <div className="field">
                <ReactTags
                    placeholder="Email address or name"
                    minQueryLength={1}
                    tags={this.state.tags}
                    suggestions={suggestions}
                    handleInputChange={this.handleInputChange.bind(this)}
                    handleDelete={this.handleDelete.bind(this)}
                    handleAddition={this.handleAddition.bind(this)} />
            </div>
        )
    }
}

class InviteMemberModal extends Component {

    renderInputTextArea({ input, label, meta, optional, placeholder }) {
        return (
            <div className="field">
                <textarea {...input} rows="3" placeholder={placeholder} />
            </div>
        )
    }

    render() {
        const title = 'Invite To Board';

        const content = <React.Fragment>
            <form onSubmit={this.props.handleSubmit(this.onSubmit)} className="ui form">

                <Field name="name" component={Tags} customProps={this.props} label="Email or name"
                    placeholder="Email address or name" />

                <Field name="description" textarea={true} component={this.renderInputTextArea}
                    label="description"
                    placeholder="Sharing is caring, let your collaborators know what you're working on" />
            </form>
        </React.Fragment>;


        const actions = <React.Fragment>
            <button className="ui large button positive" onClick={this.props.handleSubmit(this.onSubmit)}>Send invitation</button>
        </React.Fragment>;

        const footer = <React.Fragment>

            <div className="footer-header-section">
                <p><span></span>Invite with Link</p>
                <a href="#/">Create Link</a>
            </div>
            <p>anyone with link can join as board member</p>

        </React.Fragment>;

        return (
            <Modal name='addProject' footer={footer} title={title} content={content} actions={actions} />
        );
    }

    onSubmit = (formValues) => {

    };

}

const mapStateToProps = (state, ownProps) => {
    return {
        users: state.projects.users,
        isLoading: state.projects.isLoading,
        initialValues: {
            name: '',
            description: ''
        }
    };
};

const formWrapped = reduxForm({
    form: 'InviteMemberModal',
    enableReinitialize: true
})(InviteMemberModal);

export default connect(mapStateToProps, {
    //some actions here
    toggleModal,
    searchUsers
})(formWrapped)