import React, { Component } from "react";
import { Field, reduxForm } from "redux-form";
import moment from "moment";
import { connect } from "react-redux";
import Modal from "../../../UI/Modal/Modal";
import DatePicker from "../../../UI/Datepicker";
import { toggleModal } from "../../../../actions/uiActions";
import {
  createLongTermGoal,
  loadGoals,
  loadUserGoalsCategories,
  createNewCategory,
  deleteNewCategory
} from "../../../../actions/goalsActions";
import {
  searchUsers,
  inviteLongTermGoalMember
} from "../../../../actions/projectActions";

import Loading from "../../../UI/Loading/Loading";
import { CategorySelector } from "./CategorySelector";
import Tags from "../../../UI/forms/Tags";
import FormHelper from "../../../../classes/FormHelper";

class AddLongTermGoalModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentSelectableValue: {
        id: 0,
        label: ""
      },
      tags: []
    };
  }

  updateTags = tags => {
    this.setState({
      tags
    });
  };

  componentDidMount() {
    this.onLoadBoardCategories();

    console.log("loaded categories");
  }

  onLoadBoardCategories() {
    //load user categories from db
    return this.props
      .loadUserGoalsCategories(this.props.currentProjectId)
      .then(() => {
        //set first category option as selected
        this.props.change("board_id", this.props.boardCategories[0].id);
      });
  }

  onClose() {
    this.props.toggleModal("longTermGoal");
  }

  renderInput({ input, label, meta, optional, type, textarea, placeholder }) {
    return (
      <div className="field">
        <label>{label}</label>
        {textarea ? (
          <textarea {...input} rows="3" placeholder={placeholder} />
        ) : (
          <input {...input} type={type} placeholder={placeholder} />
        )}
        {optional ? (
          <>
            <div className="ui pointing label">Optional Field</div>
          </>
        ) : null}
      </div>
    );
  }

  renderInputTextArea({ input, label, meta, optional, placeholder }) {
    return (
      <div className="field">
        <label>{label}</label>
        <textarea {...input} rows="3" placeholder={placeholder} />
        {optional ? (
          <>
            <div className="ui pointing label">Optional Field</div>
          </>
        ) : null}
      </div>
    );
  }

  renderInputCheckbox({ input, meta, optional, label }) {
    return (
      <div className="field">
        <div className="ui toggle checkbox">
          <input {...input} type="checkbox" />
          <label>{label}</label>
        </div>
      </div>
    );
  }

  onRenderBoardOptions() {
    // return this.props.boardCategories.map((category) => <option key={category.id}
    //                                                             value={category.id}>{category.name}</option>);

    return this.props.boardCategories.map(category => ({
      value: "" + category.id,
      label: "" + category.name
    }));
  }

  renderInputSelectBoards({ input, meta, optional, label, children }) {
    return (
      <div className="field">
        <label>{label}</label>
        <select {...input}>{children}</select>
      </div>
    );
  }

  createCategory(data) {
    const { value, label } = data;
    let board_id = parseInt(value);

    switch (data.action) {
      case "clear":
        //delete category
        this.setState({
          currentSelectableValue: null
        });

        break;

      case "select-option":
        //set current selected option on state
        this.setState(
          {
            currentSelectableValue: {
              id: board_id,
              label: label
            }
          },
          () => {
            console.log(this.state);
          }
        );

        break;

      case "create-option":
        this.props.createNewCategory(value).then(response => {
          // let {currentSelectableValue} = this.state;
          console.log(response);

          this.onLoadBoardCategories().then(() => {
            //refresh board categories, with new one

            //find the recently added category
            let newCategory = this.props.boardCategories.find(
              category => category.name === label
            );

            //set category on component level state (it will be used on submit - formValues)
            this.setState({
              currentSelectableValue: {
                id: newCategory.id,
                label: newCategory.name
              }
            });
          });
        });
        break;

      default:
        break;
    }
  }

  renderInputInviteMember(props) {
    return (
      <div className="field">
        <label>{props.label}</label>
        <Tags {...props} />
      </div>
    );
  }

  render() {
    const title = "Add your Long Term goal!";

    const content = (
      <React.Fragment>
        <p className="modal-subtitle">
          A long-term goal is something you want to do in the future, for
          example, in the next 3 months.
        </p>

        <form
          onSubmit={this.props.handleSubmit(this.onSubmit)}
          className="ui form"
        >
          <Field
            name="name"
            component={this.renderInput}
            label="Enter a long term goal title"
            placeholder="A summary about what's your goal about"
          />

          <Field
            name="description"
            textarea={true}
            component={this.renderInputTextArea}
            label="Enter your long term goal description"
            placeholder="Describe what you have to do in details, to accomplish it"
          />

          {this.props.boardCategories ? (
            <Field
              name="board_id"
              component={CategorySelector}
              label="Category"
              options={this.onRenderBoardOptions()}
              onChange={(data, actions) => {
                console.log("CategorySelector:");
                console.log(data);
                if (data) {
                  //make sure its not null
                  this.createCategory(data, actions);
                }
                // this.onLoadBoardCategories(); //refresh board categories
              }}
            />
          ) : (
            <Loading />
          )}

          <Field
            name="name"
            tags={[]}
            component={this.renderInputInviteMember}
            isLoading={this.props.isLoading}
            searchUsers={this.props.searchUsers}
            users={this.props.users}
            updateTags={this.updateTags}
            label="Add member to your long term goal"
            placeholder="Email address or name"
          />

          <Field
            name="deadline"
            label="Deadline"
            inputValueFormat="YYYY-MM-DD"
            // dateFormat="L"
            dateFormatCalendar="dddd"
            placeholderText="Select deadline"
            fixedHeight
            showMonthDropdown
            showYearDropdown
            minDate={new Date()}
            // maxDate={new Date(this.props.deadline)}
            dropdownMode="select"
            normalize={value =>
              value ? moment(value).format("YYYY-MM-DD") : null
            }
            component={DatePicker}
          />
        </form>
      </React.Fragment>
    );

    const actions = (
      <React.Fragment>
        <button
          className="ui button positive"
          onClick={this.props.handleSubmit(this.onSubmit)}
        >
          New Goal
        </button>
        <button className="ui button negative" onClick={() => this.onClose()}>
          Cancel
        </button>
      </React.Fragment>
    );

    return (
      <Modal
        name="longTermGoal"
        title={title}
        content={content}
        actions={actions}
      />
    );
  }

  onSubmit = formValues => {
    let formOutput = FormHelper.cleanFormOutput({
      ...formValues,
      project_id: this.props.currentProjectId
    });

    let members = [];
    this.state.tags.map(member => members.push({ id: member.id }));
    formOutput.board_id = this.state.currentSelectableValue.id; //get category id
    this.props.createLongTermGoal(formOutput).then(response => {
      const { status } = response.data;
      if (status === "success") {
        const invitePayload = {
          member: members
        };

        if (invitePayload.member.members) {
          //if there are some members to add to this long term goal, add it.  If not, just skip

          this.props
            .inviteLongTermGoalMember(response.data.response.id, invitePayload)
            .then(response => {
              this.props.loadGoals(
                this.props.currentProjectId,
                this.props.boardShowGoals
              ); //refresh goals (to display new one)

              setTimeout(() => {
                this.props.toggleModal("longTermGoal"); //close modal once goal is created
              }, 500);
            });
        } else {
          setTimeout(() => {
            this.props.loadGoals(
              this.props.currentProjectId,
              this.props.boardShowGoals
            ); //refresh goals (to display new one)

            setTimeout(() => {
              this.props.toggleModal("longTermGoal"); //close modal once goal is created
            }, 500);
          }, 500);
        }
      }
    });
  };
}

const mapStateToProps = (state, ownProps) => {
  const { modals, boardCategories, boardShowGoals } = state.ui;

  return {
    myProps: ownProps,
    modals: modals,
    boardCategories: boardCategories,
    boardShowGoals: boardShowGoals,
    currentProjectId: state.projects.currentProjectId,
    users: state.projects.users,
    isLoading: state.projects.isLoading,
    initialValues: {
      name: "",
      description: "",
      deadline: "",
      board_id: null
    }
  };
};

const formWrapped = reduxForm({
  form: "AddLongTermGoalModal",
  enableReinitialize: true
})(AddLongTermGoalModal);

export default connect(
  mapStateToProps,
  {
    //some actions here
    toggleModal,
    createLongTermGoal,
    loadGoals,
    loadUserGoalsCategories,
    createNewCategory, // This is for creating new category
    deleteNewCategory,
    searchUsers,
    inviteLongTermGoalMember
  }
)(formWrapped);
