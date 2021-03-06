import React, { Component } from "react";
import { connect } from "react-redux";
import Moment from "react-moment";
import moment from "moment";
import ShortTermGoal from "../ShortTermGoal/ShortTermGoal";
import {
  deleteGoal,
  deleteLongTermGoal,
  loadGoals
} from "../../../../actions/goalsActions";
import { toggleModal } from "../../../../actions/uiActions";
import Dropdown from "../../../UI/Dropdown/Dropdown";
import AddShortTermGoalModal from "../ShortTermGoal/AddShortTermGoalModal";
import AddLongTermGoalModal from "./AddLongTermGoalModal";
import EditLongTermGoalModal from "./EditLongTermGoalModal";
import { Droppable } from "react-beautiful-dnd";
import QuickAddShortTermGoal from "./QuickAddShortTermGoal";

class LongTermGoal extends Component {
  state = {
    showQuickAddShortTermGoal: false
  };

  onConvertBoardNameClass(boardName) {
    if (boardName.indexOf(" ") > -1) {
      return boardName
        .split(" ")
        .join("-")
        .toLowerCase();
    } else {
      return boardName.toLowerCase();
    }
  }

  onRenderShortTermGoalModal() {
    if (
      this.props.modals.shortTermGoal.status === true &&
      this.props.modals.shortTermGoal.id === this.props.myProps.id
    ) {
      return (
        <AddShortTermGoalModal
          longTermGoalId={this.props.myProps.id}
          deadline={this.props.myProps.deadline}
        />
      );
    } else {
      return null;
    }
  }

  onRenderLongTermGoalModal() {
    if (
      this.props.modals.longTermGoal.status === true &&
      this.props.modals.longTermGoal.id === this.props.myProps.id
    ) {
      //make sure we are opening the modal corresponding to this component

      return <AddLongTermGoalModal />;
    } else {
      return null;
    }
  }

  onDeleteLongTermGoal() {
    this.props.deleteLongTermGoal(this.props.myProps.id).then(() => {
      console.log("deleting long term goal");
      this.props.loadGoals(
        this.props.currentProjectId,
        this.props.boardShowGoals
      );
    });
  }

  onOpenShortTermGoalModal(longTermGoalId) {
    this.props.toggleModal("shortTermGoal", longTermGoalId); //toggle a specific modal by triggering this action.
  }

  onOpenLongTermGoalModal() {
    this.props.toggleModal("longTermGoal", this.props.myProps.id);
  }

  onEditLongTermGoalModal() {
    this.props.toggleModal("editLongTermGoal", this.props.myProps.id);
  }

  onRenderShortTermGoals() {
    if (this.props.shortTermGoals !== undefined) {
      return this.props.shortTermGoals.map((shortTermGoal, index) => {
        return (
          <ShortTermGoal
            index={index}
            onOpenModal={() =>
              this.onOpenShortTermGoalModal(this.props.myProps.id)
            }
            key={shortTermGoal.id}
            longTermBoardName={this.onConvertBoardNameClass(
              this.props.myProps.boardName
            )}
            shortTermGoal={shortTermGoal}
            deadline={this.props.myProps.deadline}
          />
        );
      });
    } else {
      return null;
    }
  }

  onRenderEditLongTermGoals() {
    if (
      this.props.modals.editLongTermGoal.status &&
      this.props.modals.editLongTermGoal.id === this.props.myProps.id
    ) {
      // console.log(`longtermgoal passing props=`);
      // console.log(this.props);

      return <EditLongTermGoalModal longTermGoal={this.props.myProps} />;
    } else {
      return null;
    }
  }

  onOpenQuickAddShortTermGoal() {
    //toggle quick add short term goal

    this.setState({
      showQuickAddShortTermGoal: !this.state.showQuickAddShortTermGoal
    });
  }

  render() {
    return (
      <React.Fragment>
        <div
          className={`board-column column-other column-${this.onConvertBoardNameClass(
            this.props.myProps.boardName
          )}`}
        >
          <div className="column-header">
            <div className="column-info">
              <div
                className={`column-icon other-icon ${this.onConvertBoardNameClass(
                  this.props.myProps.boardName
                )}-icon truncate`}
              ></div>
              <div
                className={`column-board color-other color-${this.onConvertBoardNameClass(
                  this.props.myProps.boardName
                )} truncate`}
              >
                {this.props.myProps.boardName}
              </div>
            </div>

            <div
              className="column-title truncate"
              onClick={() =>
                this.onEditLongTermGoalModal(this.props.myProps.id)
              }
            >
              {this.props.myProps.title}
            </div>
            <div className="member-icons">
              <ul>
                {this.props.member.map(user=>
                <li key={user.id}>
                  <span className="member">{user.first_name.charAt(0).toUpperCase()}</span>
                </li>)}
              </ul>
            </div>
            <Dropdown
              triggerParentDelete={() => this.onDeleteLongTermGoal()}
              triggerParentOpenModal={() =>
                this.onOpenLongTermGoalModal(this.props.myProps.id)
              }
              triggerParentEditModal={() =>
                this.onEditLongTermGoalModal(this.props.myProps.id)
              }
            />
          </div>

          <div className="column-status">
            <div className="column-status-completed">
              <div className="column-status-completed-icon"></div>
              <div className="column-status-completed-text">
                {this.props.myProps.completedGoalsProportion} COMPLETED
              </div>
            </div>

            <div className="column-status-deadline">
              <div className="column-status-deadline-icon"></div>
              <div className="column-status-deadline-text">
                <Moment format="D MMMM, YY">
                  {this.props.myProps.deadline}
                </Moment>
              </div>
            </div>

            <div
              className="hackachieve-progress-bar w3-light-grey w3-round"
              id="goal-progress"
            >
              <div
                className="w3-container w3-round hackachieve-bar"
                style={{
                  width: this.props.myProps.percentageComplete * 100 + "%"
                }}
              >
                {" "}
                &nbsp;
              </div>
            </div>
          </div>

          <Droppable droppableId={this.props.myProps.id}>
            {provided => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="column-body"
              >
                {this.onRenderShortTermGoals()}
                {provided.placeholder}
              </div>
            )}
          </Droppable>

          <div className="column-footer">
            <QuickAddShortTermGoal
              column={this.props.myProps.id}
              showQuickAddShortTermGoal={this.state.showQuickAddShortTermGoal}
              onOpenQuickAddShortTermGoal={() =>
                this.onOpenQuickAddShortTermGoal()
              }
            />

            <div
              className="column-add-short-term-goal"
              // onClick={() => {
              //   this.onOpenShortTermGoalModal(this.props.myProps.id);
              // }}
              onClick={() => {
                this.onOpenQuickAddShortTermGoal();
              }}
            >
              <div className="column-add-short-term-goal-btn"></div>
              <div className="column-add-short-term-goal-text">
                Add Short Term Goal
              </div>
            </div>
          </div>
        </div>

        {this.onRenderShortTermGoalModal()}

        {this.onRenderLongTermGoalModal()}

        {this.onRenderEditLongTermGoals()}
      </React.Fragment>
    );
  }
}

const filteredGoals = (goals, filter) => {
  // console.log(moment('2019-06-06T07:00:00Z', "YYYYMMDD").isSame(new Date(),"week"))
  // eslint-disable-next-line
  return filter === "week"
    ? goals.filter(goal =>
        goal && moment(goal.deadline, "YYYYMMDD").isSame(new Date(), "week")
          ? goal
          : null
      )
    : goals;
};

const mapStateToProps = (state, ownProps) => {
  const { boardShowGoals, modals } = state.ui;
  return {
    myProps: ownProps,
    shortTermGoals: filteredGoals(ownProps.shortTermGoals, ownProps.filter),
    modals: modals,
    boardShowGoals: boardShowGoals,
    currentProjectId: state.projects.currentProjectId
  };
};

export default connect(
  mapStateToProps,
  {
    //actions here
    deleteGoal,
    loadGoals,
    toggleModal,
    deleteLongTermGoal
  }
)(LongTermGoal);
